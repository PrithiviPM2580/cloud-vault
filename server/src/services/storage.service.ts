import type { File, Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma-client.lib";
import { deleteFileFromS3, deleteMultipleFilesFromS3 } from "@/utils/s3.util";

export const getFolderHierarchyIds = async (
  folderId: string,
  ownerId: string,
): Promise<string[]> => {
  const descendents = await prisma.folder.findMany({
    where: {
      ownerId,
      path: {
        has: folderId,
      },
    },
    select: {
      id: true,
    },
  });

  return [folderId, ...descendents.map((descendent) => descendent.id)];
};

export const cleanupShareLinks = async (
  tx: Prisma.TransactionClient,
  fileIds: string[],
  folderIds: string[],
) => {
  if (fileIds.length === 0 && folderIds.length === 0) {
    return;
  }

  const allIds = [...fileIds, ...folderIds];

  await tx.shareLink.deleteMany({
    where: {
      resourceId: {
        in: allIds,
      },
    },
  });
};

export const softDeleteFolderHierarchy = async (
  folderId: string,
  ownerId: string,
): Promise<void> => {
  const allFolderIds = await getFolderHierarchyIds(folderId, ownerId);

  const now = new Date();

  return prisma.$transaction(async (tx) => {
    const files = await tx.file.findMany({
      where: {
        folderId: {
          in: allFolderIds,
        },
        ownerId,
        isTrashed: false,
      },
      select: {
        id: true,
      },
    });

    const fileIds = files.map((file) => file.id);

    await tx.folder.updateMany({
      where: {
        id: {
          in: allFolderIds,
        },
        ownerId,
      },
      data: {
        isTrashed: true,
        trashedAt: now,
        updatedAt: now,
      },
    });

    if (fileIds.length > 0) {
      await tx.file.updateMany({
        where: {
          id: {
            in: fileIds,
          },
          ownerId,
        },
        data: {
          isTrashed: true,
          trashedAt: now,
          updatedAt: now,
        },
      });
    }

    await cleanupShareLinks(tx, fileIds, allFolderIds);
  });
};

export const restoreFolderHierarchy = async (
  folderId: string,
  ownerId: string,
): Promise<void> => {
  const allFolderIds = await getFolderHierarchyIds(folderId, ownerId);

  return prisma.$transaction(async (tx) => {
    await tx.folder.updateMany({
      where: {
        id: {
          in: allFolderIds,
        },
        ownerId,
      },
      data: {
        isTrashed: false,
        trashedAt: null,
        updatedAt: new Date(),
      },
    });

    await tx.file.updateMany({
      where: {
        folderId: {
          in: allFolderIds,
        },
        ownerId,
      },
      data: {
        isTrashed: false,
        trashedAt: null,
        updatedAt: new Date(),
      },
    });
  });
};

export const adjustUserStorageUsage = async (
  userId: string,
  sizeChange: number,
): Promise<number> => {
  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      storageUsed: {
        increment: sizeChange,
      },
      updatedAt: new Date(),
    },
    select: {
      storageUsed: true,
    },
  });
  return Number(user.storageUsed);
};

export const permanentlyDeleteFolderHierarchy = async (
  folderId: string,
  ownerId: string,
): Promise<void> => {
  const allFolderIds = await getFolderHierarchyIds(folderId, ownerId);

  const files = await prisma.file.findMany({
    where: {
      folderId: {
        in: allFolderIds,
      },
      ownerId,
    },
    select: {
      id: true,
      s3Key: true,
      size: true,
    },
  });

  const s3Keys = files.map((file) => file.s3Key);
  const fileIds = files.map((file) => file.id);

  const totalFreedSpace = files.reduce(
    (acc, file) => acc + Number(file.size),
    0,
  );

  await prisma.$transaction(async (tx) => {
    await cleanupShareLinks(tx, fileIds, allFolderIds);

    if (fileIds.length > 0) {
      await tx.file.deleteMany({
        where: {
          id: {
            in: fileIds,
          },
          ownerId,
        },
      });
    }

    await tx.folder.deleteMany({
      where: {
        id: {
          in: allFolderIds,
        },
        ownerId,
      },
    });

    if (s3Keys.length > 0) {
      await deleteMultipleFilesFromS3(s3Keys);
    }

    if (totalFreedSpace > 0) {
      await adjustUserStorageUsage(ownerId, -totalFreedSpace);
    }
  });
};

export const permanentDeleteFile = async (
  file: File,
  ownerId: string,
): Promise<void> => {
  await deleteFileFromS3(file.s3Key);

  await prisma.$transaction(async (tx) => {
    await cleanupShareLinks(tx, [file.id], []);

    await tx.file.delete({
      where: {
        id: file.id,
      },
    });
  });
  await adjustUserStorageUsage(ownerId, -Number(file.size));
};

export const emptyTrashHierarchy = async (ownerId: string): Promise<void> => {
  const [trashedFiles, trashedFolders] = await Promise.all([
    prisma.file.findMany({
      where: {
        ownerId,
        isTrashed: true,
      },
      select: {
        id: true,
        s3Key: true,
        size: true,
      },
    }),

    prisma.folder.findMany({
      where: {
        ownerId,
        isTrashed: true,
      },
      select: {
        id: true,
      },
    }),
  ]);

  const s3Keys = trashedFiles.map((file) => file.s3Key);
  const fileIds = trashedFiles.map((file) => file.id);
  const folderIds = trashedFolders.map((folder) => folder.id);

  const totalFreedSpace = trashedFiles.reduce(
    (acc, file) => acc + Number(file.size),
    0,
  );

  if (s3Keys.length > 0) {
    await deleteMultipleFilesFromS3(s3Keys);
  }

  await prisma.$transaction(async (tx) => {
    await cleanupShareLinks(tx, fileIds, folderIds);

    if (fileIds.length > 0) {
      await tx.file.deleteMany({
        where: {
          id: {
            in: fileIds,
          },
          ownerId,
        },
      });
    }

    if (folderIds.length > 0) {
      await tx.folder.deleteMany({
        where: {
          id: {
            in: folderIds,
          },
          ownerId,
        },
      });
    }
  });

  if (totalFreedSpace > 0) {
    await adjustUserStorageUsage(ownerId, -totalFreedSpace);
  }
};

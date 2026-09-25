import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma-client.lib";

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

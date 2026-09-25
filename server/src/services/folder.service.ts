import type { Folder } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma-client.lib";
import type {
  Breadcrumb,
  CreateFolderInput,
  GetFolderDetailsInput,
  GetFoldersInput,
  MoveFolderInput,
  RenameFolderInput,
  SoftDeleteFolderInput,
} from "@/schema/folder.schema";
import { AppError } from "@/utils/app-error.util";
import * as storageService from "@/services/storage.service";

export const createFolder = async (
  data: CreateFolderInput["body"],
  ownerId: string,
): Promise<Folder> => {
  const { name, parentId } = data;

  let folderPath: string[] = [];

  if (parentId) {
    const parentFolder = await prisma.folder.findFirst({
      where: {
        id: parentId,
        ownerId: ownerId,
        isTrashed: false,
      },
    });

    if (!parentFolder) {
      throw AppError.notFound("Parent folder not found");
    }

    folderPath = [...parentFolder.path, parentFolder.id];
  }

  const existingFolder = await prisma.folder.findFirst({
    where: {
      name: name,
      parentId: parentId ?? null,
      ownerId: ownerId,
      isTrashed: false,
    },
  });

  if (existingFolder) {
    throw AppError.conflict("Folder with the same name already exists");
  }

  const newFolder = await prisma.folder.create({
    data: {
      name,
      parentId: parentId ?? null,
      ownerId: ownerId,
      path: folderPath,
    },
  });

  return newFolder;
};

export const getFolders = async (
  query: GetFoldersInput["query"],
  ownerId: string,
): Promise<Folder[]> => {
  const { parentId } = query;

  const folders = await prisma.folder.findMany({
    where: {
      ownerId: ownerId,
      parentId: parentId ?? null,
      isTrashed: false,
    },
    orderBy: {
      name: "asc",
    },
  });

  return folders;
};

export const getFolderDetails = async (
  params: GetFolderDetailsInput["params"],
  ownerId: string,
): Promise<{ folder: Folder; breadcrumbs: Breadcrumb[] }> => {
  const { id } = params;

  const folder = await prisma.folder.findFirst({
    where: {
      id,
      ownerId,
      isTrashed: false,
    },
  });

  if (!folder) {
    throw AppError.notFound("Folder not found");
  }

  const anchestorsIds = folder.path || [];

  let anchestors: Breadcrumb[] = [];

  if (anchestorsIds.length > 0) {
    anchestors = await prisma.folder.findMany({
      where: {
        id: {
          in: anchestorsIds,
        },
      },
      select: {
        id: true,
        name: true,
      },
    });
  }

  const anchestorsMap = new Map(
    anchestors.map((anchestor) => [anchestor.id, anchestor.name]),
  );

  const breadcrumbs: Breadcrumb[] = [
    {
      id: null,
      name: "My Drive",
    },
    ...anchestorsIds.map((anchestorId) => ({
      id: anchestorId,
      name: anchestorsMap.get(anchestorId) || "Unknown",
    })),
    {
      id: folder.id,
      name: folder.name,
    },
  ];

  return {
    folder,
    breadcrumbs,
  };
};

export const renameFolder = async (
  params: RenameFolderInput["params"],
  body: RenameFolderInput["body"],
  ownerId: string,
): Promise<Folder> => {
  const { id } = params;
  const { name } = body;

  const folder = await prisma.folder.findFirst({
    where: {
      id,
      ownerId,
      isTrashed: false,
    },
  });

  if (!folder) {
    throw AppError.notFound("Folder not found");
  }

  const updatedFolder = await prisma.folder.update({
    where: {
      id: folder.id,
    },
    data: {
      name,
    },
  });

  return updatedFolder;
};

export const moveFolder = async (
  params: MoveFolderInput["params"],
  body: MoveFolderInput["body"],
  ownerId: string,
): Promise<Folder> => {
  const { id } = params;
  const { parentId } = body;

  if (parentId === id) {
    throw AppError.badRequest("Cannot move folder to itself");
  }

  const folder = await prisma.folder.findFirst({
    where: {
      id,
      ownerId,
      isTrashed: false,
    },
  });

  if (!folder) {
    throw AppError.notFound("Folder not found");
  }

  let newPath: string[] = [];

  if (parentId) {
    const parentFolder = await prisma.folder.findFirst({
      where: {
        id: parentId,
        ownerId,
        isTrashed: false,
      },
    });

    if (!parentFolder) {
      throw AppError.notFound("Parent folder not found");
    }

    if (parentFolder.path.includes(id)) {
      throw AppError.badRequest("Cannot move folder to its own subfolder");
    }

    newPath = [...parentFolder.path, parentFolder.id];
  }

  await prisma.folder.update({
    where: {
      id: folder.id,
    },
    data: {
      parentId: parentId ?? null,
      path: newPath,
    },
  });

  const descendants = await prisma.folder.findMany({
    where: {
      ownerId,
      isTrashed: false,
      path: {
        has: folder.id,
      },
    },
    select: {
      id: true,
      path: true,
    },
  });

  await Promise.all(
    descendants.map(async (descendant) => {
      const folderIndex = descendant.path.findIndex(
        (folderId) => folderId === folder.id,
      );
      const subPath =
        folderIndex !== -1 ? descendant.path.slice(folderIndex + 1) : [];
      const updatedPath = [...newPath, folder.id, ...subPath];

      await prisma.folder.update({
        where: {
          id: descendant.id,
        },
        data: {
          path: updatedPath,
        },
      });
    }),
  );

  const updatedFolder = await prisma.folder.findUnique({
    where: {
      id: folder.id,
    },
  });

  if (!updatedFolder) {
    throw AppError.internalServerError("Failed to retrieve updated folder");
  }

  return updatedFolder;
};

export const softDeleteFolder = async (
  params: SoftDeleteFolderInput["params"],
  ownerId: string,
): Promise<void> => {
  const { id } = params;

  const folder = await prisma.folder.findFirst({
    where: {
      id,
      ownerId,
      isTrashed: false,
    },
  });

  if (!folder) {
    throw AppError.notFound("Folder not found");
  }

  await storageService.softDeleteFolderHierarchy(folder.id, ownerId);
};

export const restoreFolder = async (
  params: SoftDeleteFolderInput["params"],
  ownerId: string,
): Promise<void> => {
  const { id } = params;

  const folder = await prisma.folder.findFirst({
    where: {
      id,
      ownerId,
      isTrashed: true,
    },
  });

  if (!folder) {
    throw AppError.notFound("Folder not found");
  }

  await storageService.restoreFolderHierarchy(folder.id, ownerId);
};

export const permanentDeleteFolder = async (
  params: SoftDeleteFolderInput["params"],
  ownerId: string,
): Promise<void> => {
  const { id } = params;

  const folder = await prisma.folder.findFirst({
    where: {
      id,
      ownerId,
      isTrashed: true,
    },
  });

  if (!folder) {
    throw AppError.notFound("Folder not found");
  }

  await storageService.permanentlyDeleteFolderHierarchy(folder.id, ownerId);
};

import type { Folder } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma-client.lib";
import type {
  Breadcrumb,
  CreateFolderInput,
  GetFolderDetailsInput,
  GetFoldersInput,
} from "@/schema/folder.schema";
import { AppError } from "@/utils/app-error.utils";

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

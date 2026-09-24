import type { Folder } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma-client.lib";
import type { CreateFolderInput } from "@/schema/folder.schema";
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

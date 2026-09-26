import type { File, Folder } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma-client.lib";
import * as storageService from "@/services/storage.service";

export const getTrashItems = async (
  ownerId: string,
): Promise<{ files: File[]; folders: Folder[] }> => {
  const [files, folders] = await Promise.all([
    prisma.file.findMany({
      where: {
        ownerId,
        isTrashed: true,
      },
      orderBy: {
        trashedAt: "desc",
      },
    }),
    prisma.folder.findMany({
      where: {
        ownerId,
        isTrashed: true,
      },
      orderBy: {
        trashedAt: "desc",
      },
    }),
  ]);

  return { files, folders };
};

export const emptyTrash = async (ownerId: string): Promise<void> => {
  await storageService.emptyTrashHierarchy(ownerId);
};

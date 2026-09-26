import type { File, Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma-client.lib";
import type {
  GetFilePreviewUrlInput,
  GetFilesQuery,
  MoveFileInput,
  Pagination,
  PermanentlyDeleteFileInput,
  RenameFileInput,
  RestoreFileInput,
  SoftDeleteFileInput,
  UploadFilesInput,
} from "@/schema/file.schema";
import { AppError } from "@/utils/app-error.util";
import {
  deleteFileFromS3,
  getSignedUrlForS3Upload,
  uploadFileToS3,
} from "@/utils/s3.util";
import * as storageService from "@/services/storage.service";
import { sortMap } from "@/utils/constant.util";
import { file } from "bun";

export const uploadFiles = async (
  files: Express.Multer.File[],
  userId: string,
  body: UploadFilesInput["body"],
): Promise<File[]> => {
  const { folderId } = body;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      storageLimit: true,
      storageUsed: true,
    },
  });

  if (!user) {
    throw AppError.notFound("User not found");
  }

  let targetFolderId: string | null = null;

  if (folderId) {
    const folder = await prisma.folder.findFirst({
      where: {
        id: folderId,
        ownerId: user.id,
        isTrashed: false,
      },
      select: {
        id: true,
      },
    });

    if (!folder) {
      throw AppError.notFound("Folder not found");
    }

    targetFolderId = folder.id;
  }

  const totalNewBytes = files.reduce((acc, file) => acc + file.size, 0);

  if (Number(user.storageUsed) + totalNewBytes > Number(user.storageLimit)) {
    const limitGB = (Number(user.storageLimit) / (1024 * 1024 * 1024)).toFixed(
      1,
    );

    throw AppError.forbidden(
      `Storage limit exceeded. Your storage limit is ${limitGB} GB.`,
    );
  }

  const uploadedFiles = await Promise.all(
    files.map(async (file) => {
      const fileExtension = file.originalname.split(".").pop();

      const randomString = Math.random().toString(36).substring(7);
      const s3Key = `${Date.now()}_${randomString}.${fileExtension}`;

      await uploadFileToS3(file.buffer, s3Key, file.mimetype);

      return {
        file,
        s3Key,
      };
    }),
  );

  const createdFiles = await prisma.$transaction(
    uploadedFiles.map(({ file, s3Key }) =>
      prisma.file.create({
        data: {
          name: file.originalname,
          originalName: file.originalname,
          s3Key,
          folderId: targetFolderId,
          ownerId: user.id,
          size: file.size,
          mimeType: file.mimetype,
        },
      }),
    ),
  );
  await storageService.adjustUserStorageUsage(user.id, totalNewBytes);

  return createdFiles;
};

export const getFiles = async (
  query: GetFilesQuery["query"],
  ownerId: string,
): Promise<{ files: File[]; pagination: Pagination }> => {
  const { folderId, search, sort, page, limit } = query;

  const skip = (page - 1) * limit;
  const targetFolderId = folderId ?? null;

  const orderBy = sortMap[sort];

  const where: Prisma.FileWhereInput = {
    ownerId: ownerId,
    isTrashed: false,
    folderId: targetFolderId,
    ...(search
      ? {
          name: {
            contains: search,
            mode: "insensitive",
          },
        }
      : {}),
  };

  const [files, totalFiles] = await Promise.all([
    prisma.file.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    }),
    prisma.file.count({
      where,
    }),
  ]);

  return {
    files,
    pagination: {
      page,
      limit,
      totalFiles,
      totalPages: Math.ceil(totalFiles / limit),
    },
  };
};

export const getFilePreviewUrl = async (
  params: GetFilePreviewUrlInput["params"],
  ownerId: string,
): Promise<{ file: File; url: string }> => {
  const { id } = params;

  const file = await prisma.file.findFirst({
    where: {
      id,
      ownerId,
    },
  });

  if (!file) {
    throw AppError.notFound("File not found");
  }

  const url = await getSignedUrlForS3Upload(file.s3Key);

  return { file, url };
};

export const renameFile = async (
  params: RenameFileInput["params"],
  body: RenameFileInput["body"],
  ownerId: string,
): Promise<File[]> => {
  const { id } = params;
  const { name } = body;

  const files = await prisma.file.updateManyAndReturn({
    where: {
      id,
      ownerId,
      isTrashed: false,
    },
    data: {
      name,
    },
  });

  if (files.length === 0) {
    throw AppError.notFound("File not found");
  }

  return files;
};

export const moveFile = async (
  params: MoveFileInput["params"],
  body: MoveFileInput["body"],
  ownerId: string,
): Promise<File[]> => {
  const { id } = params;
  const { folderId } = body;

  const targetFolderId = folderId ?? null;

  if (targetFolderId) {
    const destinationFolder = await prisma.folder.findFirst({
      where: {
        id: targetFolderId,
        ownerId,
        isTrashed: false,
      },
      select: {
        id: true,
      },
    });

    if (!destinationFolder) {
      throw AppError.notFound("Destination folder not found");
    }
  }
  const files = await prisma.file.updateManyAndReturn({
    where: {
      id,
      ownerId,
      isTrashed: false,
    },
    data: {
      folderId: targetFolderId,
    },
  });

  if (files.length === 0) {
    throw AppError.notFound("File not found");
  }

  return files;
};

export const softDeleteFile = async (
  params: SoftDeleteFileInput["params"],
  ownerId: string,
): Promise<void> => {
  const { id } = params;

  await prisma.$transaction(async (tx) => {
    const files = await tx.file.updateManyAndReturn({
      where: {
        id,
        ownerId,
        isTrashed: false,
      },
      data: {
        isTrashed: true,
        trashedAt: new Date(),
      },
    });

    if (files.length === 0) {
      throw AppError.notFound("File not found");
    }

    await storageService.cleanupShareLinks(tx, [id], []);
  });
};

export const restoreFile = async (
  params: RestoreFileInput["params"],
  ownerId: string,
): Promise<void> => {
  const { id } = params;

  const files = await prisma.file.updateManyAndReturn({
    where: {
      id,
      ownerId,
      isTrashed: true,
    },
    data: {
      isTrashed: false,
      trashedAt: null,
    },
    select: {
      id: true,
    },
  });

  if (files.length === 0) {
    throw AppError.notFound("File not found");
  }
};

export const permanentlyDeleteFile = async (
  params: PermanentlyDeleteFileInput["params"],
  ownerId: string,
): Promise<void> => {
  const { id } = params;

  const file = await prisma.file.findFirst({
    where: {
      id,
      ownerId,
    },
  });

  if (!file) {
    throw AppError.notFound("File not found");
  }

  await deleteFileFromS3(file.s3Key);

  await prisma.$transaction(async (tx) => {
    await storageService.cleanupShareLinks(tx, [file.id], []);

    await tx.file.delete({
      where: {
        id: file.id,
      },
    });
  });

  await storageService.adjustUserStorageUsage(ownerId, -Number(file.size));
};

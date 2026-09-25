import type { File, Prisma,User} from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma-client.lib";
import type {
  GetFilesQuery,
  Pagination,
  UploadFilesInput,
} from "@/schema/file.schema";
import { AppError } from "@/utils/app-error.util";
import { uploadFileToS3 } from "@/utils/s3.util";
import * as storageService from "@/services/storage.service";
import { sortMap } from "@/utils/constant.util";

export const uploadFiles = async (
  files: Express.Multer.File[],
  user: User,
  body: UploadFilesInput["body"],
): Promise<File[]> => {
  const { folderId } = body;

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

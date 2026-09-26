import type { ShareLink } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma-client.lib";
import type {
  AccessShareLinkParams,
  AccessShareLinkResult,
  CreateShareLinkInput,
} from "@/schema/share-link.schema";
import { AppError } from "@/utils/app-error.util";
import { getSignedUrlForS3Upload } from "@/utils/s3.util";
import crypto from "node:crypto";

export const createShareLink = async (
  body: CreateShareLinkInput,
  ownerId: string,
): Promise<{ shareLink: ShareLink; isExisting: boolean }> => {
  const { permission, resourceId, resourceType, expiresAt } = body;

  let resource;

  if (resourceType === "file") {
    resource = await prisma.file.findFirst({
      where: {
        id: resourceId,
        ownerId,
      },
    });
  } else {
    resource = await prisma.folder.findFirst({
      where: {
        id: resourceId,
        ownerId,
      },
    });
  }

  if (!resource) {
    throw AppError.notFound(`${resourceType} not found`);
  }

  const existingShareLink = await prisma.shareLink.findFirst({
    where: {
      resourceId,
      resourceType,
      ownerId,
    },
  });

  if (
    existingShareLink &&
    existingShareLink.expiresAt &&
    existingShareLink.expiresAt > new Date()
  ) {
    return {
      shareLink: existingShareLink,
      isExisting: true,
    };
  }

  const token = crypto.randomBytes(32).toString("hex");

  const shareLink = await prisma.shareLink.create({
    data: {
      token,
      resourceId,
      resourceType,
      ownerId,
      permission,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    },
  });

  return {
    shareLink,
    isExisting: false,
  };
};

export const getShareLinks = async (ownerId: string): Promise<ShareLink[]> => {
  const shareLinks = await prisma.shareLink.findMany({
    where: {
      ownerId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const shareLinksWithResource = await Promise.all(
    shareLinks.map(async (shareLink) => {
      let resource;

      if (shareLink.resourceType === "file") {
        resource = await prisma.file.findUnique({
          where: {
            id: shareLink.resourceId,
          },
          select: {
            id: true,
            name: true,
          },
        });
      }

      if (shareLink.resourceType === "folder") {
        resource = await prisma.folder.findUnique({
          where: {
            id: shareLink.resourceId,
          },
          select: {
            id: true,
            name: true,
          },
        });
      }

      return {
        ...shareLink,
        resource,
      };
    }),
  );

  return shareLinksWithResource;
};

export const accessShareLink = async (
  params: AccessShareLinkParams,
): Promise<AccessShareLinkResult> => {
  const { token } = params;

  const shareLink = await prisma.shareLink.findUnique({
    where: {
      token,
    },
    include: {
      owner: true,
    },
  });

  if (!shareLink) {
    throw AppError.notFound("Share link not found");
  }

  if (shareLink.expiresAt && shareLink.expiresAt < new Date()) {
    throw AppError.forbidden("Share link has expired");
  }

  await prisma.shareLink.update({
    where: {
      id: shareLink.id,
    },
    data: {
      accessCount: {
        increment: 1,
      },
    },
  });

  const owner = await prisma.user.findUnique({
    where: {
      id: shareLink.ownerId,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  if (shareLink.resourceType === "file") {
    const file = await prisma.file.findUnique({
      where: {
        id: shareLink.resourceId,
      },
    });

    if (!file || file.isTrashed) {
      throw AppError.notFound("File not found");
    }

    const downloadUrl = await getSignedUrlForS3Upload(file.s3Key);

    return {
      resourceType: "file",
      file,
      url: downloadUrl,
      permission: shareLink.permission,
      owner,
    };
  }

  if (shareLink.resourceType === "folder") {
    const folder = await prisma.folder.findUnique({
      where: {
        id: shareLink.resourceId,
      },
    });

    if (!folder) {
      throw AppError.notFound("Folder not found");
    }

    return {
      resourceType: "folder",
      folder,
      permission: shareLink.permission,
      owner,
    };
  }

  throw AppError.badRequest("Invalid resource type");
};

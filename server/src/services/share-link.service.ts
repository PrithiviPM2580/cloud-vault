import type { ShareLink } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma-client.lib";
import type { CreateShareLinkInput } from "@/schema/share-link.schema";
import { AppError } from "@/utils/app-error.util";
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

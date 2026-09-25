import { BUCKET_NAME, s3Client } from "@/config/s3.config";
import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  ListObjectVersionsCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const uploadFileToS3 = async (
  fileBuffer: Buffer,
  s3Key: string,
  mimeType: string,
): Promise<{ s3Key: string }> => {
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: s3Key,
      Body: fileBuffer,
      ContentType: mimeType,
    });

    await s3Client.send(command);
    return {
      s3Key,
    };
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw new Error("Failed to upload file to S3.");
  }
};

export const getSignedUrlForS3Upload = async (
  s3Key: string,
): Promise<string> => {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: s3Key,
    });

    return await getSignedUrl(s3Client, command, { expiresIn: 36000 });
  } catch (error) {
    console.error("Error generating signed URL for S3 upload:", error);
    throw new Error("Failed to generate signed URL for S3 upload.");
  }
};

export const deleteFileFromS3 = async (s3Key: string): Promise<void> => {
  if (!s3Key) {
    throw new Error("S3 key is required for deletion.");
  }

  try {
    const { Versions = [], DeleteMarkers = [] } = await s3Client.send(
      new ListObjectVersionsCommand({
        Bucket: BUCKET_NAME,
        Prefix: s3Key,
      }),
    );

    const objects = [...Versions, ...DeleteMarkers]
      .filter((v) => v.Key === s3Key)
      .map((v) => ({ Key: v.Key!, VersionId: v.VersionId! }));

    if (objects.length > 0) {
      await s3Client.send(
        new DeleteObjectsCommand({
          Bucket: BUCKET_NAME,
          Delete: {
            Objects: objects,
          },
        }),
      );
    } else {
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: BUCKET_NAME,
          Key: s3Key,
        }),
      );
    }
  } catch (error) {
    try {
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: BUCKET_NAME,
          Key: s3Key,
        }),
      );
    } catch (error) {
      console.error("Error deleting file from S3:", error);
      throw new Error("Failed to delete file from S3.");
    }
  }
};

export const deleteMultipleFilesFromS3 = async (
  s3Keys: string[],
): Promise<void> => {
  if (!s3Keys || s3Keys.length === 0) return;

  await Promise.all(s3Keys.map(deleteFileFromS3));
};

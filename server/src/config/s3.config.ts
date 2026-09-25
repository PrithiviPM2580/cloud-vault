import { S3Client } from "@aws-sdk/client-s3";
import { appConfig } from "./app.config";

export const BUCKET_NAME = appConfig.AWS_BUCKET_NAME;

export const s3Client = new S3Client({
  region: appConfig.AWS_REGION,
  endpoint: appConfig.AWS_ENDPOINT_URL_S3,
  credentials: {
    accessKeyId: appConfig.AWS_ACCESS_KEY_ID!,
    secretAccessKey: appConfig.AWS_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
});

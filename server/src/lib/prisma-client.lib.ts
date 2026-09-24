import { PrismaClient } from "@/generated/prisma/client";
import { appConfig } from "@/config/app.config";
import { PrismaNeon } from "@prisma/adapter-neon";

const connectionString = appConfig.DATABASE_URL;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const adapter = new PrismaNeon({
  connectionString,
});

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (appConfig.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

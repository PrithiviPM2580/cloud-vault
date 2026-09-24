import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma-client.lib";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  user: {
    // Tell Better Auth about your custom fields
    additionalFields: {
      storageUsed: {
        type: "number",
        required: false,
        defaultValue: 0,
        input: false,
        returned: true,
      },
      storageLimit: {
        type: "number",
        required: false,
        defaultValue: 1073741824, // 1GB in bytes
        input: false,
        returned: true,
      },
    },
  },
  advanced: {
    database: {
      joins: true,
      generateId: false,
    },
  },
});

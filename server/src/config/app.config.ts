import { appConfigSchema } from "@/schema/app.schema";
import { formatError } from "@/utils/index.util";

const parsedConfig = appConfigSchema.safeParse(process.env);

if (!parsedConfig.success) {
  const formattedErrors = formatError(parsedConfig.error.issues);
  console.error("Invalid environment variables:", formattedErrors);
  throw new Error(
    "Invalid environment variables. Please check the configuration.",
  );
}

export const appConfig = parsedConfig.data;

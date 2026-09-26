import { validateRquest } from "@/middlewares/request-validate.middleware";
import { createShareLinkSchema } from "@/schema/share-link.schema";

export const createShareLinkValidator = validateRquest(createShareLinkSchema);

export type CreateShareLinkValidator = typeof createShareLinkSchema;

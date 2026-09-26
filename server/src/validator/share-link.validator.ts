import { validateRquest } from "@/middlewares/request-validate.middleware";
import {
  createShareLinkSchema,
  getShareLinksSchema,
} from "@/schema/share-link.schema";

export const createShareLinkValidator = validateRquest(createShareLinkSchema);
export const getShareLinksValidator = validateRquest(getShareLinksSchema);

export type CreateShareLinkValidator = typeof createShareLinkSchema;
export type GetShareLinksValidator = typeof getShareLinksSchema;

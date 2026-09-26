import { validateRquest } from "@/middlewares/request-validate.middleware";
import {
  accessShareLinkSchema,
  createShareLinkSchema,
  getShareLinksSchema,
} from "@/schema/share-link.schema";

export const createShareLinkValidator = validateRquest(createShareLinkSchema);
export const getShareLinksValidator = validateRquest(getShareLinksSchema);
export const accessShareLinkValidator = validateRquest(accessShareLinkSchema);

export type CreateShareLinkValidator = typeof createShareLinkSchema;
export type GetShareLinksValidator = typeof getShareLinksSchema;
export type AccessShareLinkValidator = typeof accessShareLinkSchema;

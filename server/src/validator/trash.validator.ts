import { validateRquest } from "@/middlewares/request-validate.middleware";
import { getTrashItemsSchema } from "@/schema/trash.schema";

export const getTrashItemsValidator = validateRquest(getTrashItemsSchema);

export type GetTrashItemsValidator = typeof getTrashItemsSchema;

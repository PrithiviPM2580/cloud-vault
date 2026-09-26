import { validateRquest } from "@/middlewares/request-validate.middleware";
import { emptyTrashSchema, getTrashItemsSchema } from "@/schema/trash.schema";

export const getTrashItemsValidator = validateRquest(getTrashItemsSchema);
export const emptyTrashValidator = validateRquest(emptyTrashSchema);

export type GetTrashItemsValidator = typeof getTrashItemsSchema;
export type EmptyTrashValidator = typeof emptyTrashSchema;

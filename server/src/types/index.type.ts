import type { Schemas, TypedRequest, TypedRequestHandler } from "zod-express-validator";
import { ERROR_CODE } from "@/utils/constant.util";

export type Controller<T> = TypedRequestHandler<T>;
export type ErrorCode = (typeof ERROR_CODE)[keyof typeof ERROR_CODE];

import { formatError } from "@/utils/index.util";
import { validate, type Schemas } from "zod-express-validator";
import status from "http-status";

export const validateRquest = <T extends Schemas>(schemas: T) => {
  return validate(schemas, ({ bodyError, queryError, paramsError }, res) => {
    const error = bodyError ?? queryError ?? paramsError;

    if (error) {
      const issues = formatError(error.issues);
      return res.status(status.BAD_REQUEST).json({
        message: "Validation Error",
        errors: issues,
      });
    }

    return res.status(status.INTERNAL_SERVER_ERROR).json({
      message: "Internal Server Error",
    });
  });
};

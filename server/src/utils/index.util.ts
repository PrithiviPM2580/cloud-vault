import { z } from "zod";

export const formatError = (issues: z.core.$ZodIssue[]) => {
  issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
    code: issue.code,
  }));
};

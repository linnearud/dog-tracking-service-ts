import { safeAsync } from "../utils/safeAsync";
import { AnyZodObject, z } from "zod";
import { Logger } from "../utils/logger";
import { Request, Response } from "express";
import { v4 as uuid } from "uuid";

export type RequestContext = {
  userId: string;
  logger: Logger;
};

export const handleRequest = async <T extends AnyZodObject>({
  inputSchema,
  requestHandler,
  permissionHandler,
  req,
  res,
}: {
  inputSchema: T;
  requestHandler: (payload: {
    data: z.infer<T>;
    context: RequestContext;
  }) => Promise<any>;
  permissionHandler: (payload: {
    data: z.infer<T>;
    context: RequestContext;
  }) => Promise<boolean>;
  req: Request;
  res: Response;
}) => {
  const [parsedRequestParameters, validationError] = await safeAsync(
    inputSchema.parseAsync({ ...req.params, ...req.body }),
  );

  console.log(req.body)

  if (validationError) {
    return res
      .status(400)
      .send(`Invalid request parameters, ${validationError.message}`);
  }

  const logger = new Logger({
    attributes: {
      body: req.body,
      ip: req.ip,
      method: req.method,
      base: req.baseUrl,
      path: req.path,
      params: req.params,
      userId: "userId",
      trace: uuid(),
    },
  });

  if (!req.auth?.payload?.sub) {
    return res.status(401).send("Missing or invalid authorization header");
  }

  const context = { logger, userId: req.auth.payload.sub };

  const [isAllowedToPerformAction] = await safeAsync(
    permissionHandler({ data: parsedRequestParameters, context }),
  );

  if (!isAllowedToPerformAction) {
    return res.status(403).send("User not allowed to perform this action");
  }

  const startTime = Date.now();

  const [result, error] = await safeAsync(
    requestHandler({
      data: parsedRequestParameters,
      context,
    }),
  );

  const logLevel = error === null ? "info" : "error";
  logger[logLevel](`Request completed`, {
    duration: Date.now() - startTime,
    parameters: parsedRequestParameters,
    error,
  });

  if (error) {
    const statusFromError =
      "status" in error && typeof error.status === "number"
        ? error.status
        : undefined;

    return res.status(statusFromError || 500).send(error.message || error);
  }

  return res.status(200).send(result);
};

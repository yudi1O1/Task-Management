import { NextFunction, Request, Response } from "express";

export function errorHandler(
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction,
) {
  console.error(error);

  response.status(500).json({
    message: "Something went wrong on the server.",
  });
}

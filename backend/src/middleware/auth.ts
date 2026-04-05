import { NextFunction, Request, Response } from "express";
import { sendError } from "../utils/http";
import { verifyAccessToken } from "../utils/token";

export function requireAuth(request: Request, response: Response, next: NextFunction) {
  const authorizationHeader = request.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return sendError(response, 401, "Access token is missing.");
  }

  const token = authorizationHeader.split(" ")[1];

  try {
    const decodedUser = verifyAccessToken(token);
    request.user = decodedUser;
    next();
  } catch (error) {
    return sendError(response, 401, "Access token is invalid or expired.");
  }
}

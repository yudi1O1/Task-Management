import jwt from "jsonwebtoken";
import { env } from "../config/env";

export type UserPayload = {
  userId: number;
  email: string;
};

const accessTokenExpiresIn = env.accessTokenExpiresIn as jwt.SignOptions["expiresIn"];
const refreshTokenExpiresIn = env.refreshTokenExpiresIn as jwt.SignOptions["expiresIn"];

export function createAccessToken(payload: UserPayload) {
  return jwt.sign(payload, env.accessTokenSecret, {
    expiresIn: accessTokenExpiresIn,
  });
}

export function createRefreshToken(payload: UserPayload) {
  return jwt.sign(payload, env.refreshTokenSecret, {
    expiresIn: refreshTokenExpiresIn,
  });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.accessTokenSecret) as UserPayload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, env.refreshTokenSecret) as UserPayload;
}

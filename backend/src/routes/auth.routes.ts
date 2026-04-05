import { CookieOptions, Response, Router } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";
import { createAccessToken, createRefreshToken, verifyRefreshToken } from "../utils/token";
import { sendError } from "../utils/http";
import { validateLoginBody, validateRegisterBody } from "../validators/auth";

const authRouter = Router();

function getRefreshCookieOptions(): CookieOptions {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}

function setRefreshTokenCookie(response: Response, token: string) {
  response.cookie("refreshToken", token, getRefreshCookieOptions());
}

authRouter.post("/register", async (request, response, next) => {
  try {
    const validatedBody = validateRegisterBody(request.body);

    if (!validatedBody) {
      return sendError(
        response,
        400,
        "Name, email, and password are required. Password must be at least 6 characters.",
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: validatedBody.email },
    });

    if (existingUser) {
      return sendError(response, 400, "An account with this email already exists.");
    }

    const hashedPassword = await bcrypt.hash(validatedBody.password, 10);

    const user = await prisma.user.create({
      data: {
        name: validatedBody.name,
        email: validatedBody.email,
        passwordHash: hashedPassword,
      },
    });

    const payload = {
      userId: user.id,
      email: user.email,
    };

    const accessToken = createAccessToken(payload);
    const refreshToken = createRefreshToken(payload);

    await prisma.refreshToken.upsert({
      where: { userId: user.id },
      update: { token: refreshToken },
      create: {
        userId: user.id,
        token: refreshToken,
      },
    });

    setRefreshTokenCookie(response, refreshToken);

    response.status(201).json({
      message: "Registration successful.",
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/login", async (request, response, next) => {
  try {
    const validatedBody = validateLoginBody(request.body);

    if (!validatedBody) {
      return sendError(response, 400, "Email and password are required.");
    }

    const user = await prisma.user.findUnique({
      where: { email: validatedBody.email },
    });

    if (!user) {
      return sendError(response, 401, "Invalid email or password.");
    }

    const isPasswordCorrect = await bcrypt.compare(validatedBody.password, user.passwordHash);

    if (!isPasswordCorrect) {
      return sendError(response, 401, "Invalid email or password.");
    }

    const payload = {
      userId: user.id,
      email: user.email,
    };

    const accessToken = createAccessToken(payload);
    const refreshToken = createRefreshToken(payload);

    await prisma.refreshToken.upsert({
      where: { userId: user.id },
      update: { token: refreshToken },
      create: {
        userId: user.id,
        token: refreshToken,
      },
    });

    setRefreshTokenCookie(response, refreshToken);

    response.json({
      message: "Login successful.",
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/refresh", async (request, response) => {
  try {
    const refreshToken = request.cookies.refreshToken;

    if (!refreshToken) {
      return sendError(response, 401, "Refresh token is missing.");
    }

    const savedToken = await prisma.refreshToken.findFirst({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!savedToken) {
      return sendError(response, 401, "Refresh token is invalid.");
    }

    const decoded = verifyRefreshToken(refreshToken);
    const accessToken = createAccessToken({
      userId: decoded.userId,
      email: decoded.email,
    });

    response.json({
      message: "New access token created.",
      accessToken,
      user: {
        id: savedToken.user.id,
        name: savedToken.user.name,
        email: savedToken.user.email,
      },
    });
  } catch (error) {
    return sendError(response, 401, "Refresh token is invalid or expired.");
  }
});

authRouter.post("/logout", async (request, response, next) => {
  try {
    const refreshToken = request.cookies.refreshToken;

    if (refreshToken) {
      await prisma.refreshToken.deleteMany({
        where: { token: refreshToken },
      });
    }

    response.clearCookie("refreshToken", getRefreshCookieOptions());
    response.json({
      message: "Logout successful.",
    });
  } catch (error) {
    next(error);
  }
});

export { authRouter };

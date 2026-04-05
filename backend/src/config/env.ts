import "dotenv/config";

function getEnvValue(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

function getAllowedOrigins() {
  const configuredOrigins = process.env.CLIENT_URLS || process.env.CLIENT_URL || "http://localhost:3000";

  return configuredOrigins
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export const env = {
  port: Number(process.env.PORT || 4000),
  databaseUrl: getEnvValue("DATABASE_URL"),
  accessTokenSecret: getEnvValue("ACCESS_TOKEN_SECRET"),
  refreshTokenSecret: getEnvValue("REFRESH_TOKEN_SECRET"),
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m",
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
  allowedOrigins: getAllowedOrigins(),
};

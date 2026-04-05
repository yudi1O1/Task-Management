export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

function capitalizeName(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

export function validateRegisterBody(body: unknown): RegisterInput | null {
  if (!body || typeof body !== "object") {
    return null;
  }

  const { name, email, password } = body as Record<string, unknown>;

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return null;
  }

  if (name.trim().length < 2 || !email.includes("@") || password.length < 6) {
    return null;
  }

  return {
    name: capitalizeName(name),
    email: email.trim().toLowerCase(),
    password,
  };
}

export function validateLoginBody(body: unknown): LoginInput | null {
  if (!body || typeof body !== "object") {
    return null;
  }

  const { email, password } = body as Record<string, unknown>;

  if (typeof email !== "string" || typeof password !== "string") {
    return null;
  }

  if (!email.includes("@") || password.length < 6) {
    return null;
  }

  return {
    email: email.trim().toLowerCase(),
    password,
  };
}

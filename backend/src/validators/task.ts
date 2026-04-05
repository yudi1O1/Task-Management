import { TaskStatus } from "@prisma/client";

export type CreateTaskInput = {
  title: string;
  description?: string;
};

export type UpdateTaskInput = {
  title?: string;
  description?: string;
  status?: TaskStatus;
};

export function validateCreateTaskBody(body: unknown): CreateTaskInput | null {
  if (!body || typeof body !== "object") {
    return null;
  }

  const { title, description } = body as Record<string, unknown>;

  if (typeof title !== "string" || title.trim().length === 0) {
    return null;
  }

  if (description !== undefined && typeof description !== "string") {
    return null;
  }

  return {
    title: title.trim(),
    description: typeof description === "string" ? description.trim() : undefined,
  };
}

export function validateUpdateTaskBody(body: unknown): UpdateTaskInput | null {
  if (!body || typeof body !== "object") {
    return null;
  }

  const { title, description, status } = body as Record<string, unknown>;
  const result: UpdateTaskInput = {};

  if (title !== undefined) {
    if (typeof title !== "string" || title.trim().length === 0) {
      return null;
    }

    result.title = title.trim();
  }

  if (description !== undefined) {
    if (typeof description !== "string") {
      return null;
    }

    result.description = description.trim();
  }

  if (status !== undefined) {
    if (status !== TaskStatus.PENDING && status !== TaskStatus.COMPLETED) {
      return null;
    }

    result.status = status;
  }

  if (Object.keys(result).length === 0) {
    return null;
  }

  return result;
}

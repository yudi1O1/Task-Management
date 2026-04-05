"use client";

import { Task, TaskListResponse, User } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type JsonBody = Record<string, unknown> | undefined;

async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  accessToken?: string | null,
): Promise<T> {
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }

  return data as T;
}

export async function registerUser(body: {
  name: string;
  email: string;
  password: string;
}) {
  return apiRequest<{ accessToken: string; user: User; message: string }>("/auth/register", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function loginUser(body: { email: string; password: string }) {
  return apiRequest<{ accessToken: string; user: User; message: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function refreshAccessToken() {
  return apiRequest<{ accessToken: string; user: User; message: string }>("/auth/refresh", {
    method: "POST",
  });
}

export async function logoutUser() {
  return apiRequest<{ message: string }>("/auth/logout", {
    method: "POST",
  });
}

export async function getTasks(
  query: {
    page: number;
    limit: number;
    status: string;
    search: string;
  },
  accessToken: string,
) {
  const params = new URLSearchParams();
  params.set("page", String(query.page));
  params.set("limit", String(query.limit));

  if (query.status !== "ALL") {
    params.set("status", query.status);
  }

  if (query.search.trim()) {
    params.set("search", query.search.trim());
  }

  return apiRequest<TaskListResponse>(`/tasks?${params.toString()}`, {}, accessToken);
}

export async function createTask(
  body: { title: string; description: string },
  accessToken: string,
) {
  return apiRequest<{ task: Task; message: string }>(
    "/tasks",
    {
      method: "POST",
      body: JSON.stringify(body),
    },
    accessToken,
  );
}

export async function updateTask(taskId: number, body: JsonBody, accessToken: string) {
  return apiRequest<{ task: Task; message: string }>(
    `/tasks/${taskId}`,
    {
      method: "PATCH",
      body: JSON.stringify(body),
    },
    accessToken,
  );
}

export async function toggleTask(taskId: number, accessToken: string) {
  return apiRequest<{ task: Task; message: string }>(
    `/tasks/${taskId}/toggle`,
    {
      method: "PATCH",
    },
    accessToken,
  );
}

export async function deleteTask(taskId: number, accessToken: string) {
  return apiRequest<{ message: string }>(
    `/tasks/${taskId}`,
    {
      method: "DELETE",
    },
    accessToken,
  );
}

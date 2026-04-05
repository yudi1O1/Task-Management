"use client";

import { ReactNode, useEffect, useState } from "react";
import { createTask, deleteTask, getTasks, updateTask } from "../lib/api";
import { Task } from "../lib/types";
import { useAuth } from "../contexts/auth-context";
import { useToast } from "./toast-provider";
import { TaskForm } from "./task-form";

const PAGE_SIZE = 5;

type EditableTaskState = {
  taskId: number | null;
  title: string;
  description: string;
};

function CompleteIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        d="M20 6L9 17l-5-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        d="M4 20h4l10-10-4-4L4 16v4z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M13 7l4 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        d="M5 4h11l3 3v13H5z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M9 4v6h6V4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M9 17h6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        d="M4 7h16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M9 7V4h6v3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M7 7l1 13h8l1-13"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M10 11v5M14 11v5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

type ActionButtonProps = {
  label: string;
  onClick: () => void;
  children: ReactNode;
  background: string;
  color: string;
  disabled?: boolean;
};

function ActionButton({
  label,
  onClick,
  children,
  background,
  color,
  disabled = false,
}: ActionButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 42,
        height: 42,
        borderRadius: 999,
        border: "none",
        display: "grid",
        placeItems: "center",
        background,
        color,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        boxShadow: "inset 0 0 0 1px currentColor",
      }}
    >
      {children}
    </button>
  );
}

function formatDisplayName(name: string | undefined) {
  if (!name) {
    return "User";
  }

  return name
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

export function TaskDashboard() {
  const { accessToken, user, logout, restoreSession } = useAuth();
  const { showToast } = useToast();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [editingTask, setEditingTask] = useState<EditableTaskState>({
    taskId: null,
    title: "",
    description: "",
  });

  async function getWorkingToken() {
    let tokenToUse = accessToken;

    if (!tokenToUse) {
      tokenToUse = await restoreSession();
    }

    return tokenToUse;
  }

  async function loadTasks() {
    const tokenToUse = await getWorkingToken();

    if (!tokenToUse) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const response = await getTasks(
        {
          page,
          limit: PAGE_SIZE,
          status: statusFilter,
          search: searchText,
        },
        tokenToUse,
      );

      setTasks(response.tasks);
      setTotalPages(response.pagination.totalPages || 1);
    } catch (error) {
      const refreshedToken = await restoreSession();

      if (!refreshedToken) {
        await logout();
        return;
      }

      const response = await getTasks(
        {
          page,
          limit: PAGE_SIZE,
          status: statusFilter,
          search: searchText,
        },
        refreshedToken,
      );

      setTasks(response.tasks);
      setTotalPages(response.pagination.totalPages || 1);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadTasks();
  }, [accessToken, page, statusFilter, searchText]);

  async function handleCreateTask(values: { title: string; description: string }) {
    const tokenToUse = await getWorkingToken();

    if (!tokenToUse) {
      throw new Error("Please log in again.");
    }

    await createTask(values, tokenToUse);
    showToast("Task created successfully.");
    await loadTasks();
  }

  function startEditing(task: Task) {
    setEditingTask({
      taskId: task.id,
      title: task.title,
      description: task.description || "",
    });
  }

  async function handleSaveEditedTask(taskId: number) {
    const trimmedTitle = editingTask.title.trim();

    if (!trimmedTitle) {
      showToast("Task title cannot be empty.", "error");
      return;
    }

    const tokenToUse = await getWorkingToken();

    if (!tokenToUse) {
      showToast("Please log in again.", "error");
      return;
    }

    await updateTask(
      taskId,
      {
        title: trimmedTitle,
        description: editingTask.description.trim(),
      },
      tokenToUse,
    );

    setEditingTask({ taskId: null, title: "", description: "" });
    showToast("Task updated successfully.");
    await loadTasks();
  }

  async function handleCompleteTask(task: Task) {
    const tokenToUse = await getWorkingToken();

    if (!tokenToUse) {
      return;
    }

    const nextStatus = task.status === "COMPLETED" ? "PENDING" : "COMPLETED";

    await updateTask(task.id, { status: nextStatus }, tokenToUse);
    showToast(
      nextStatus === "COMPLETED"
        ? "Task marked as completed."
        : "Task moved back to pending.",
    );
    await loadTasks();
  }

  async function handleDeleteTask(taskId: number) {
    const tokenToUse = await getWorkingToken();

    if (!tokenToUse) {
      return;
    }

    await deleteTask(taskId, tokenToUse);
    showToast("Task deleted successfully.");

    if (editingTask.taskId === taskId) {
      setEditingTask({ taskId: null, title: "", description: "" });
    }

    if (tasks.length === 1 && page > 1) {
      setPage((currentPage) => currentPage - 1);
      return;
    }

    await loadTasks();
  }

  function stopEditing() {
    setEditingTask({ taskId: null, title: "", description: "" });
  }

  return (
    <div
      className="page-shell"
      style={{
        maxWidth: 1180,
        margin: "0 auto",
      }}
    >
      <div
        className="card"
        style={{
          padding: 24,
          marginBottom: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div>
          <p className="muted" style={{ margin: 0 }}>
            Signed in as
          </p>
          <h1 style={{ margin: "6px 0 0 0" }}>{formatDisplayName(user?.name)}&apos;s Tasks</h1>
        </div>

        <button className="button button-danger" onClick={() => void logout()}>
          Logout
        </button>
      </div>

      <div className="task-layout">
        <TaskForm onSubmit={handleCreateTask} />

        <div className="card" style={{ padding: 24 }}>
          <div className="filters-grid">
            <input
              className="input"
              placeholder="Search by task title"
              value={searchText}
              onChange={(event) => {
                setPage(1);
                setSearchText(event.target.value);
              }}
            />

            <select
              className="select"
              value={statusFilter}
              onChange={(event) => {
                setPage(1);
                setStatusFilter(event.target.value);
              }}
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          {isLoading ? (
            <p className="muted">Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p className="muted">No tasks found for this filter.</p>
          ) : (
            <div style={{ display: "grid", gap: 14 }}>
              {tasks.map((task) => {
                const isEditing = editingTask.taskId === task.id;

                return (
                  <div
                    key={task.id}
                    style={{
                      border: "1px solid rgba(73, 54, 39, 0.12)",
                      borderRadius: 20,
                      padding: 18,
                      background: "rgba(255,255,255,0.55)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 16,
                        alignItems: "flex-start",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        {isEditing ? (
                          <div className="form-grid">
                            <input
                              className="input"
                              value={editingTask.title}
                              onChange={(event) =>
                                setEditingTask((currentTask) => ({
                                  ...currentTask,
                                  title: event.target.value,
                                }))
                              }
                              placeholder="Task title"
                            />
                            <textarea
                              className="textarea"
                              value={editingTask.description}
                              onChange={(event) =>
                                setEditingTask((currentTask) => ({
                                  ...currentTask,
                                  description: event.target.value,
                                }))
                              }
                              placeholder="Task description"
                            />
                          </div>
                        ) : (
                          <>
                            <h3
                              style={{
                                marginTop: 0,
                                marginBottom: 8,
                                textDecoration:
                                  task.status === "COMPLETED" ? "line-through" : "none",
                              }}
                            >
                              {task.title}
                            </h3>
                            <p className="muted" style={{ marginTop: 0, marginBottom: 0 }}>
                              {task.description || "No description added yet."}
                            </p>
                          </>
                        )}
                      </div>

                      <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
                        <ActionButton
                          label={task.status === "COMPLETED" ? "Mark as pending" : "Mark as completed"}
                          onClick={() => void handleCompleteTask(task)}
                          background={
                            task.status === "COMPLETED"
                              ? "rgba(31, 122, 83, 0.18)"
                              : "transparent"
                          }
                          color={
                            task.status === "COMPLETED"
                              ? "var(--success)"
                              : "rgba(31, 122, 83, 0.8)"
                          }
                        >
                          <CompleteIcon />
                        </ActionButton>

                        <ActionButton
                          label={isEditing ? "Save task" : "Edit task"}
                          onClick={() => {
                            if (isEditing) {
                              void handleSaveEditedTask(task.id);
                              return;
                            }

                            startEditing(task);
                          }}
                          background="transparent"
                          color="#c28a00"
                        >
                          {isEditing ? <SaveIcon /> : <EditIcon />}
                        </ActionButton>

                        <ActionButton
                          label="Delete task"
                          onClick={() => void handleDeleteTask(task.id)}
                          background="transparent"
                          color="var(--danger)"
                        >
                          <DeleteIcon />
                        </ActionButton>
                      </div>
                    </div>

                    <div
                      style={{
                        marginTop: 14,
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          alignSelf: "flex-start",
                          padding: "8px 12px",
                          borderRadius: 999,
                          background:
                            task.status === "COMPLETED"
                              ? "rgba(31, 122, 83, 0.12)"
                              : "rgba(177, 54, 46, 0.12)",
                          color:
                            task.status === "COMPLETED"
                              ? "var(--success)"
                              : "var(--danger)",
                          fontSize: "0.75rem",
                          letterSpacing: "0.04em",
                          fontWeight: 600,
                        }}
                      >
                        {task.status}
                      </span>

                      {isEditing && (
                        <button
                          type="button"
                          className="button button-secondary"
                          onClick={stopEditing}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div
            style={{
              marginTop: 20,
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <button
              className="button button-secondary"
              onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
              disabled={page === 1}
            >
              Previous
            </button>

            <div className="muted">
              Page {page} of {Math.max(totalPages, 1)}
            </div>

            <button
              className="button button-secondary"
              onClick={() =>
                setPage((currentPage) =>
                  currentPage < totalPages ? currentPage + 1 : currentPage,
                )
              }
              disabled={page >= totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export type User = {
  id: number;
  name: string;
  email: string;
};

export type TaskStatus = "PENDING" | "COMPLETED";

export type Task = {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
};

export type TaskListResponse = {
  tasks: Task[];
  pagination: {
    page: number;
    limit: number;
    totalTasks: number;
    totalPages: number;
  };
};

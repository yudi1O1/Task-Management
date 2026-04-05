import { Router } from "express";
import { TaskStatus } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/auth";
import { sendError } from "../utils/http";
import { validateCreateTaskBody, validateUpdateTaskBody } from "../validators/task";

const taskRouter = Router();

taskRouter.use(requireAuth);

taskRouter.get("/", async (request, response, next) => {
  try {
    const userId = request.user!.userId;
    const page = Number(request.query.page || 1);
    const limit = Number(request.query.limit || 5);
    const status = request.query.status as string | undefined;
    const search = String(request.query.search || "").trim();

    const whereClause = {
      userId,
      ...(status === TaskStatus.PENDING || status === TaskStatus.COMPLETED
        ? { status }
        : {}),
      ...(search
        ? {
            title: {
              contains: search,
            },
          }
        : {}),
    };

    const [tasks, totalTasks] = await Promise.all([
      prisma.task.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.task.count({ where: whereClause }),
    ]);

    response.json({
      tasks,
      pagination: {
        page,
        limit,
        totalTasks,
        totalPages: Math.ceil(totalTasks / limit),
      },
    });
  } catch (error) {
    next(error);
  }
});

taskRouter.post("/", async (request, response, next) => {
  try {
    const validatedBody = validateCreateTaskBody(request.body);

    if (!validatedBody) {
      return sendError(response, 400, "Task title is required.");
    }

    const task = await prisma.task.create({
      data: {
        title: validatedBody.title,
        description: validatedBody.description,
        userId: request.user!.userId,
      },
    });

    response.status(201).json({
      message: "Task created successfully.",
      task,
    });
  } catch (error) {
    next(error);
  }
});

taskRouter.get("/:id", async (request, response, next) => {
  try {
    const taskId = Number(request.params.id);

    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId: request.user!.userId,
      },
    });

    if (!task) {
      return sendError(response, 404, "Task not found.");
    }

    response.json({ task });
  } catch (error) {
    next(error);
  }
});

taskRouter.patch("/:id", async (request, response, next) => {
  try {
    const taskId = Number(request.params.id);
    const validatedBody = validateUpdateTaskBody(request.body);

    if (!validatedBody) {
      return sendError(response, 400, "Please send valid task fields to update.");
    }

    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId: request.user!.userId,
      },
    });

    if (!existingTask) {
      return sendError(response, 404, "Task not found.");
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: validatedBody,
    });

    response.json({
      message: "Task updated successfully.",
      task: updatedTask,
    });
  } catch (error) {
    next(error);
  }
});

taskRouter.delete("/:id", async (request, response, next) => {
  try {
    const taskId = Number(request.params.id);

    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId: request.user!.userId,
      },
    });

    if (!existingTask) {
      return sendError(response, 404, "Task not found.");
    }

    await prisma.task.delete({
      where: { id: taskId },
    });

    response.json({
      message: "Task deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
});

taskRouter.patch("/:id/toggle", async (request, response, next) => {
  try {
    const taskId = Number(request.params.id);

    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId: request.user!.userId,
      },
    });

    if (!existingTask) {
      return sendError(response, 404, "Task not found.");
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        status:
          existingTask.status === TaskStatus.PENDING
            ? TaskStatus.COMPLETED
            : TaskStatus.PENDING,
      },
    });

    response.json({
      message: "Task status updated successfully.",
      task: updatedTask,
    });
  } catch (error) {
    next(error);
  }
});

export { taskRouter };

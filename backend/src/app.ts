import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import { env } from "./config/env";
import { authRouter } from "./routes/auth.routes";
import { taskRouter } from "./routes/task.routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

const defaultLocalOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3001",
  "http://localhost:3002",
  "http://127.0.0.1:3002",
];

const allowedOrigins = Array.from(new Set([...defaultLocalOrigins, ...env.allowedOrigins]));

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`Origin ${origin} is not allowed by CORS.`));
  },
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.get("/health", (request, response) => {
  response.json({
    message: "Backend is running.",
  });
});

app.use("/auth", authRouter);
app.use("/tasks", taskRouter);

app.use(errorHandler);

export { app };
export default app;

"use client";

import { useState } from "react";
import type { FormEvent } from "react";

type AuthFormProps = {
  mode: "login" | "register";
  title: string;
  description: string;
  onSubmit: (values: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
};

export function AuthForm({ mode, title, description, onSubmit }: AuthFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await onSubmit({ name, email, password });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="card"
      style={{
        padding: 28,
      }}
    >
      <h1 style={{ marginTop: 0, marginBottom: 8, fontSize: "1.8rem" }}>{title}</h1>
      <p className="muted" style={{ marginTop: 0, marginBottom: 24 }}>
        {description}
      </p>

      <form onSubmit={handleSubmit} className="form-grid">
        {mode === "register" && (
          <label>
            <div style={{ marginBottom: 8 }}>Name</div>
            <input
              className="input"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter your name"
            />
          </label>
        )}

        <label>
          <div style={{ marginBottom: 8 }}>Email</div>
          <input
            className="input"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email"
          />
        </label>

        <label>
          <div style={{ marginBottom: 8 }}>Password</div>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 6 characters"
          />
        </label>

        {errorMessage && (
          <div
            style={{
              background: "#fff5f4",
              color: "#8f2019",
              border: "1px solid #f2d4d1",
              borderRadius: 10,
              padding: 12,
            }}
          >
            {errorMessage}
          </div>
        )}

        <button className="button button-primary" type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Please wait..."
            : mode === "login"
              ? "Login"
              : "Create account"}
        </button>
      </form>
    </div>
  );
}

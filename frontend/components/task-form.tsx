"use client";

import { useState } from "react";
import type { FormEvent } from "react";

type TaskFormProps = {
  onSubmit: (values: { title: string; description: string }) => Promise<void>;
};

export function TaskForm({ onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit({ title, description });
      setTitle("");
      setDescription("");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="card" style={{ padding: 24 }}>
      <h2 style={{ marginTop: 0 }}>Create a New Task</h2>

      <form onSubmit={handleSubmit} className="form-grid">
        <label>
          <div style={{ marginBottom: 8 }}>Title</div>
          <input
            className="input"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="What do you need to do?"
            required
          />
        </label>

        <label>
          <div style={{ marginBottom: 8 }}>Description</div>
          <textarea
            className="textarea"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Add a short description"
          />
        </label>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button className="button button-primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Add Task"}
          </button>
        </div>
      </form>
    </div>
  );
}

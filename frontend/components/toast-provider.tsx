"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useState,
} from "react";

type ToastItem = {
  id: number;
  message: string;
  type: "success" | "error";
};

type ToastContextValue = {
  showToast: (message: string, type?: "success" | "error") => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  function showToast(message: string, type: "success" | "error" = "success") {
    const id = Date.now();

    setToasts((currentToasts) => [...currentToasts, { id, message, type }]);

    window.setTimeout(() => {
      setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
    }, 3000);
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div className="toast-stack">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast ${toast.type === "success" ? "toast-success" : "toast-error"}`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider.");
  }

  return context;
}

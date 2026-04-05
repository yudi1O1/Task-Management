import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "../components/toast-provider";
import { AuthProvider } from "../contexts/auth-context";

export const metadata: Metadata = {
  title: "Task Management System",
  description: "A beginner-friendly task management app with authentication.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

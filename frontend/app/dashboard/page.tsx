"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { TaskDashboard } from "../../components/task-dashboard";
import { useAuth } from "../../contexts/auth-context";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, router, user]);

  if (isLoading || !user) {
    return (
      <main className="page-shell" style={{ display: "grid", placeItems: "center" }}>
        <p className="muted">Loading dashboard...</p>
      </main>
    );
  }

  return <TaskDashboard />;
}

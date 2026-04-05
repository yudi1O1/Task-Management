"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthForm } from "../../components/auth-form";
import { useAuth } from "../../contexts/auth-context";
import { useToast } from "../../components/toast-provider";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { showToast } = useToast();

  return (
    <main className="auth-shell">
      <div className="auth-card">
        <AuthForm
          mode="login"
          title="Login"
          description="Enter your account details to continue."
          onSubmit={async ({ email, password }) => {
            const message = await login(email, password);
            showToast(message);
            router.push("/dashboard");
          }}
        />

        <p style={{ textAlign: "center", marginTop: 16 }}>
          <span className="muted">Don&apos;t have an account? </span>
          <Link href="/register" style={{ color: "var(--text)", fontWeight: 600 }}>
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}

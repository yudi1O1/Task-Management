"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthForm } from "../../components/auth-form";
import { useAuth } from "../../contexts/auth-context";
import { useToast } from "../../components/toast-provider";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { showToast } = useToast();

  return (
    <main className="auth-shell">
      <div className="auth-card">
        <AuthForm
          mode="register"
          title="Create account"
          description="Start managing your personal tasks."
          onSubmit={async ({ name, email, password }) => {
            const message = await register(name, email, password);
            showToast(message);
            router.push("/dashboard");
          }}
        />

        <p style={{ textAlign: "center", marginTop: 16 }}>
          <span className="muted">Already have an account? </span>
          <Link href="/" style={{ color: "var(--text)", fontWeight: 600 }}>
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}

"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

type Tab = "login" | "signup" | "password";

function AuthForms() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const initialTab = (searchParams.get("tab") as Tab) || "login";

  const [tab, setTab] = useState<Tab>(initialTab);

  return (
    <>
      <nav className="flex gap-6 mb-8 font-ui">
        <button
          onClick={() => setTab("login")}
          className={`transition-colors ${
            tab === "login"
              ? "text-neutral-900 dark:text-neutral-100"
              : "text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300"
          }`}
        >
          Sign in
        </button>
        <button
          onClick={() => setTab("signup")}
          className={`transition-colors ${
            tab === "signup"
              ? "text-neutral-900 dark:text-neutral-100"
              : "text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300"
          }`}
        >
          Sign up
        </button>
        <button
          onClick={() => setTab("password")}
          className={`transition-colors ${
            tab === "password"
              ? "text-neutral-900 dark:text-neutral-100"
              : "text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300"
          }`}
        >
          Change password
        </button>
      </nav>

      {tab === "login" && <LoginForm next={next} router={router} />}
      {tab === "signup" && <SignupForm next={next} router={router} />}
      {tab === "password" && <ChangePasswordForm />}
    </>
  );
}

function LoginForm({
  next,
  router,
}: {
  next: string | null;
  router: ReturnType<typeof useRouter>;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        const redirectTo = next || `/@${data.handle}/footnotes`;
        router.push(redirectTo);
        router.refresh();
      } else {
        setError(data.error || "Login failed");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="login-email" className="block font-ui mb-1">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          autoFocus
          disabled={loading}
          className="w-full px-3 py-2 bg-transparent border border-neutral-300 dark:border-neutral-700 rounded focus:outline-none focus:border-neutral-500 dark:focus:border-neutral-500 disabled:opacity-50"
        />
      </div>

      <div>
        <label htmlFor="login-password" className="block font-ui mb-1">
          Password
        </label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          disabled={loading}
          className="w-full px-3 py-2 bg-transparent border border-neutral-300 dark:border-neutral-700 rounded focus:outline-none focus:border-neutral-500 dark:focus:border-neutral-500 disabled:opacity-50"
        />
      </div>

      {error && (
        <p className="font-ui text-red-600 dark:text-red-400">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded hover:bg-neutral-700 dark:hover:bg-neutral-300 transition-colors disabled:opacity-50"
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}

function SignupForm({
  next,
  router,
}: {
  next: string | null;
  router: ReturnType<typeof useRouter>;
}) {
  const [email, setEmail] = useState("");
  const [handle, setHandle] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, handle, displayName, password }),
      });

      const data = await res.json();

      if (res.ok) {
        const redirectTo = next || `/@${data.handle}/write`;
        router.push(redirectTo);
        router.refresh();
      } else {
        setError(data.error || "Sign up failed");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="signup-email" className="block font-ui mb-1">
          Email
        </label>
        <input
          id="signup-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          autoFocus
          disabled={loading}
          className="w-full px-3 py-2 bg-transparent border border-neutral-300 dark:border-neutral-700 rounded focus:outline-none focus:border-neutral-500 dark:focus:border-neutral-500 disabled:opacity-50"
        />
      </div>

      <div>
        <label htmlFor="signup-handle" className="block font-ui mb-1">
          Handle
        </label>
        <div className="flex items-center">
          <span className="text-neutral-400 dark:text-neutral-500 mr-1">@</span>
          <input
            id="signup-handle"
            type="text"
            value={handle}
            onChange={(e) => setHandle(e.target.value.toLowerCase())}
            required
            autoComplete="username"
            disabled={loading}
            placeholder="yourname"
            className="flex-1 px-3 py-2 bg-transparent border border-neutral-300 dark:border-neutral-700 rounded focus:outline-none focus:border-neutral-500 dark:focus:border-neutral-500 disabled:opacity-50"
          />
        </div>
        <p className="font-ui text-neutral-400 dark:text-neutral-500 mt-1">
          Your profile will be at footnotes.at/@{handle || "yourname"}
        </p>
      </div>

      <div>
        <label htmlFor="signup-display" className="block font-ui mb-1">
          Display name
        </label>
        <input
          id="signup-display"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
          autoComplete="name"
          disabled={loading}
          className="w-full px-3 py-2 bg-transparent border border-neutral-300 dark:border-neutral-700 rounded focus:outline-none focus:border-neutral-500 dark:focus:border-neutral-500 disabled:opacity-50"
        />
      </div>

      <div>
        <label htmlFor="signup-password" className="block font-ui mb-1">
          Password
        </label>
        <input
          id="signup-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
          disabled={loading}
          minLength={8}
          className="w-full px-3 py-2 bg-transparent border border-neutral-300 dark:border-neutral-700 rounded focus:outline-none focus:border-neutral-500 dark:focus:border-neutral-500 disabled:opacity-50"
        />
        <p className="font-ui text-neutral-400 dark:text-neutral-500 mt-1">
          At least 8 characters
        </p>
      </div>

      {error && (
        <p className="font-ui text-red-600 dark:text-red-400">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded hover:bg-neutral-700 dark:hover:bg-neutral-300 transition-colors disabled:opacity-50"
      >
        {loading ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}

function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const res = await fetch("/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setCurrentPassword("");
        setNewPassword("");
      } else {
        setError(data.error || "Failed to change password");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="font-ui text-neutral-500 dark:text-neutral-400 mb-4">
        You must be signed in to change your password.
      </p>

      <div>
        <label htmlFor="current-password" className="block font-ui mb-1">
          Current password
        </label>
        <input
          id="current-password"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
          autoComplete="current-password"
          autoFocus
          disabled={loading}
          className="w-full px-3 py-2 bg-transparent border border-neutral-300 dark:border-neutral-700 rounded focus:outline-none focus:border-neutral-500 dark:focus:border-neutral-500 disabled:opacity-50"
        />
      </div>

      <div>
        <label htmlFor="new-password" className="block font-ui mb-1">
          New password
        </label>
        <input
          id="new-password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          autoComplete="new-password"
          minLength={8}
          disabled={loading}
          className="w-full px-3 py-2 bg-transparent border border-neutral-300 dark:border-neutral-700 rounded focus:outline-none focus:border-neutral-500 dark:focus:border-neutral-500 disabled:opacity-50"
        />
        <p className="font-ui text-neutral-400 dark:text-neutral-500 mt-1">
          At least 8 characters
        </p>
      </div>

      {error && (
        <p className="font-ui text-red-600 dark:text-red-400">{error}</p>
      )}

      {success && (
        <p className="font-ui text-green-600 dark:text-green-400">
          Password changed successfully.
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded hover:bg-neutral-700 dark:hover:bg-neutral-300 transition-colors disabled:opacity-50"
      >
        {loading ? "Changing password..." : "Change password"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="font-ui text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
        >
          ← footnotes.at
        </Link>

        <h1 className="font-medium mt-6 mb-8">Account</h1>

        <Suspense fallback={<div className="h-48" />}>
          <AuthForms />
        </Suspense>
      </div>
    </main>
  );
}

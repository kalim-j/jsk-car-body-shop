"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  LogIn,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? "Login failed");
        return;
      }
      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/products");
        router.refresh();
      }, 800);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-background text-foreground min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(225,29,72,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(225,29,72,0.05),transparent_50%)]" />
        {/* Subtle Grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Back to Home */}
      <Link
        href="/"
        className="group absolute top-8 left-8 z-10 inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-white transition-colors"
      >
        <ArrowLeft
          size={18}
          className="transition-transform group-hover:-translate-x-1"
        />
        Home
      </Link>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Card Glow */}
        <div className="absolute -inset-1 rounded-[3.5rem] bg-gradient-to-b from-brand/20 via-transparent to-transparent blur-xl opacity-60" />

        <div className="relative rounded-[3rem] border border-white/[0.06] bg-zinc-900/60 backdrop-blur-2xl p-10 sm:p-12 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/10 text-brand shadow-lg shadow-brand/10">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white">
              Welcome Back
            </h1>
            <p className="mt-3 text-sm text-zinc-500">
              Sign in to access the JSK showroom dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-500">
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute left-5 top-1/2 flex -translate-y-1/2 text-zinc-600">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className="w-full rounded-2xl border border-white/[0.06] bg-white/[0.03] py-4 pl-14 pr-5 text-sm text-white placeholder-zinc-600 outline-none transition-all focus:border-brand/50 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(225,29,72,0.1)]"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-500">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute left-5 top-1/2 flex -translate-y-1/2 text-zinc-600">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  minLength={6}
                  className="w-full rounded-2xl border border-white/[0.06] bg-white/[0.03] py-4 pl-14 pr-14 text-sm text-white placeholder-zinc-600 outline-none transition-all focus:border-brand/50 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(225,29,72,0.1)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-5 top-1/2 flex -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-3.5 text-sm text-red-300">
                <Lock size={16} className="shrink-0" />
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="flex items-center gap-3 rounded-2xl border border-green-500/20 bg-green-500/10 px-5 py-3.5 text-sm text-green-300">
                <Sparkles size={16} className="shrink-0" />
                Login successful! Redirecting...
              </div>
            )}

            {/* Submit Button */}
            <button
              disabled={loading || success}
              type="submit"
              className="group relative mt-2 flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-brand py-4 text-sm font-black text-white transition-all hover:bg-brand-light hover:shadow-[0_0_30px_rgba(225,29,72,0.3)] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <svg
                    className="h-5 w-5 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Authenticating...
                </>
              ) : success ? (
                <>
                  <Sparkles size={18} />
                  Welcome!
                </>
              ) : (
                <>
                  Sign In
                  <LogIn
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/[0.06]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">
              Secure Access
            </span>
            <div className="h-px flex-1 bg-white/[0.06]" />
          </div>

          {/* Footer Info */}
          <div className="mt-6 text-center">
            <p className="text-xs text-zinc-600 leading-relaxed">
              Admin access is restricted to authorized email addresses.
              <br />
              New users are automatically registered on first login.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


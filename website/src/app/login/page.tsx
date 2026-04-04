"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
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

  const [activeInput, setActiveInput] = useState<"email" | "password" | null>(null);

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
        const errorMsg = data?.error ?? "Login failed";
        setError(errorMsg);
        toast.error(errorMsg, { icon: "❌" });
        return;
      }
      setSuccess(true);
      toast.success("Welcome Back! Redirecting to dashboard...", { icon: "🏎️" });
      setTimeout(() => {
        router.push("/admin/products");
        router.refresh();
      }, 800);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-background min-h-screen flex text-foreground overflow-hidden">
      
      {/* Left Side: Split-screen Graphic */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-black border-r border-brand/20">
        <motion.div
           initial={{ scale: 1.1 }}
           animate={{ scale: 1 }}
           transition={{ duration: 15, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
           className="w-full h-full"
        >
          {/* We use our generated login_bg_car image here */}
          <div 
            className="w-full h-full bg-cover bg-center brightness-75 mix-blend-lighten"
            style={{ backgroundImage: 'url("/login-bg.png")' }}
          />
        </motion.div>
        
        {/* Glow overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(225,29,72,0.15),transparent_60%)]" />

        <div className="absolute bottom-12 left-12 max-w-md">
          <Link href="/" className="inline-flex items-center gap-2 mb-8 text-sm font-bold text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft size={16} /> Return to Showroom
          </Link>
          <h2 className="text-4xl font-black text-white leading-tight mb-4 text-gradient">
            Engineering Precision. <br /> Redefining Excellence.
          </h2>
          <p className="text-zinc-400">
            Secure admin portal for JSK Car Body Shop operators.
          </p>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center relative px-6 py-12 lg:px-16">
        
        {/* Mobile floating Back Button */}
        <Link href="/" className="lg:hidden absolute top-8 left-6 inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-white transition-colors">
          <ArrowLeft size={18} /> Home
        </Link>
        
        <motion.div 
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Header */}
          <div className="text-center lg:text-left mb-10">
            <div className="mx-auto lg:mx-0 mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 text-brand shadow-[0_0_20px_rgba(225,29,72,0.2)]">
              <ShieldCheck size={28} />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">
              Sign In
            </h1>
            <p className="mt-2 text-sm text-zinc-500">
              Access the exclusive JSK Dealership terminal
            </p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-6">
            
            {/* Email Field with Floating Label */}
            <div className="relative group/email">
              <motion.label 
                animate={{ 
                  y: email || activeInput === "email" ? -28 : 12,
                  scale: email || activeInput === "email" ? 0.8 : 1,
                  x: email || activeInput === "email" ? -10 : 36,
                }}
                className="absolute left-0 top-0 text-sm font-bold text-zinc-500 pointer-events-none transition-colors"
                style={{ originX: 0 }}
              >
                Email Address
              </motion.label>
              <div className="relative">
                <div className="pointer-events-none absolute left-4 top-1/2 flex -translate-y-1/2 text-zinc-500 group-hover/email:text-brand transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onFocus={() => setActiveInput("email")}
                  onBlur={() => setActiveInput(null)}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  className="w-full rounded-xl border border-border/50 bg-black/5 dark:bg-white/5 py-4 pl-12 pr-4 text-sm text-foreground outline-none transition-all focus:border-brand/50 focus:bg-background focus:ring-4 focus:ring-brand/10"
                />
              </div>
            </div>

            {/* Password Field with Floating Label */}
            <div className="relative group/pass mt-8">
              <motion.label 
                animate={{ 
                  y: password || activeInput === "password" ? -28 : 12,
                  scale: password || activeInput === "password" ? 0.8 : 1,
                  x: password || activeInput === "password" ? -10 : 36,
                }}
                className="absolute left-0 top-0 text-sm font-bold text-zinc-500 pointer-events-none transition-colors"
                style={{ originX: 0 }}
              >
                Password
              </motion.label>
              <div className="relative">
                <div className="pointer-events-none absolute left-4 top-1/2 flex -translate-y-1/2 text-zinc-500 group-hover/pass:text-brand transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onFocus={() => setActiveInput("password")}
                  onBlur={() => setActiveInput(null)}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  minLength={6}
                  className="w-full rounded-xl border border-border/50 bg-black/5 dark:bg-white/5 py-4 pl-12 pr-12 text-sm text-foreground outline-none transition-all focus:border-brand/50 focus:bg-background focus:ring-4 focus:ring-brand/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 flex -translate-y-1/2 text-zinc-500 hover:text-brand transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                    <Lock size={16} className="shrink-0" />
                    {error}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              whileHover={!loading && !success ? { scale: 1.02 } : {}}
              whileTap={!loading && !success ? { scale: 0.98 } : {}}
              disabled={loading || success}
              type="submit"
              className="group relative mt-4 flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-brand py-4 text-sm font-black text-white transition-all hover:bg-brand-light neon-glow disabled:opacity-70 disabled:cursor-wait"
            >
              {loading ? (
                <>
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Authenticating...
                </>
              ) : success ? (
                <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="flex items-center gap-2">
                  <Sparkles size={18} />
                  Connected!
                </motion.div>
              ) : (
                <>
                  Sign In
                  <LogIn size={18} className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </motion.button>
          </form>

          {/* Footer Info */}
          <div className="mt-8 pt-8 border-t border-border/50 text-center lg:text-left">
            <p className="text-xs text-zinc-500 dark:text-zinc-600 leading-relaxed">
              Admin access is restricted to authorized operators.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}


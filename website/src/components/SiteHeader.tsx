"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import { BrandLogo } from "./BrandLogo";
import { Menu, X, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

import { useAuth } from "../context/AuthContext";

const NAV_ITEMS: Array<{ href: string; label: string }> = [
  { href: "/", label: "Home" },
  { href: "/cars", label: "Buy Cars" },
  { href: "/sell", label: "Sell Car" },
  { href: "/our-work", label: "Our Work" },
  { href: "/services", label: "Services" },
  { href: "/dealers", label: "Dealers" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => setMounted(true), []);

  const activeHref = useMemo(() => {
    const match = NAV_ITEMS.find((item) =>
      item.href === "/"
        ? pathname === "/"
        : pathname === item.href || pathname.startsWith(`${item.href}/`)
    );
    return match?.href ?? "/";
  }, [pathname]);

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="sticky top-0 z-50 border-b border-brand/10 bg-white/70 dark:bg-black/70 shadow-sm backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2">
        <BrandLogo size={140} />

        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = item.href === activeHref;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "rounded-full px-5 py-2 text-sm font-bold transition-all duration-300 relative uppercase tracking-widest font-arabic-heading",
                  isActive
                    ? "text-brand"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-brand dark:hover:text-brand",
                ].join(" ")}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav-pill"
                    className="absolute inset-0 bg-brand/5 dark:bg-brand/10 rounded-full border border-brand/20 gold-glow"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {mounted && (
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-brand/20 bg-brand/5 text-brand hover:bg-brand/10 transition-colors"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle Dark Mode"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}

          {mounted && (
            user ? (
              <div className="flex items-center gap-2">
                {user.role === "ADMIN" && (
                  <Link
                    href="/admin/upload-repair"
                    className="hidden sm:inline-flex h-10 px-4 items-center justify-center rounded-full bg-zinc-900 border border-brand/40 text-[10px] font-black uppercase tracking-widest text-brand hover:bg-brand hover:text-black transition-all gold-glow mr-2"
                  >
                    Upload Repair
                  </Link>
                )}
                <div className="hidden sm:flex flex-col items-end mr-1 text-[10px] font-black uppercase tracking-tighter">
                  <span className="text-foreground leading-none">{user.name}</span>
                  <span className="text-brand/80 leading-none">{user.role}</span>
                </div>
                <button
                  onClick={logout}
                  className="inline-flex h-10 px-4 items-center justify-center rounded-full border border-brand/30 bg-brand/10 text-[10px] font-black uppercase tracking-widest text-brand hover:bg-brand hover:text-black transition-all"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex h-10 px-6 items-center justify-center rounded-full bg-brand text-[10px] font-black uppercase tracking-widest text-black hover:bg-brand-light transition-all gold-glow"
              >
                Login
              </Link>
            )
          )}

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-foreground md:hidden hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <motion.nav 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "100vh" }}
          exit={{ opacity: 0, height: 0 }}
          className="fixed inset-0 top-[73px] z-40 bg-white/95 dark:bg-black/95 backdrop-blur-2xl md:hidden"
        >
          <div className="flex flex-col gap-4 p-8">
            {NAV_ITEMS.map((item, i) => {
               const isActive = item.href === activeHref;
               return (
                <motion.div
                  key={item.href}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={[
                      "text-3xl font-black transition-colors block",
                      isActive ? "text-brand" : "text-zinc-600 dark:text-white/60 hover:text-black dark:hover:text-white",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.nav>
      )}
    </motion.header>
  );
}


import Link from "next/link";
import { CheckCircle2, Award, Users, Shield, ArrowRight } from "lucide-react";

const bullets = [
  "Professional body repair",
  "Smooth paint finish",
  "Polishing & detailing",
  "Clear communication",
];

export default function AboutPage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="container mx-auto px-6 py-24">
        {/* Header Section */}
        <div className="mb-20 text-center lg:text-left">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-4 py-1.5 text-xs font-bold tracking-widest text-brand uppercase">
            <Award size={14} />
            Our Legacy
          </div>
          <h1 className="text-gradient text-5xl font-black tracking-tight sm:text-7xl">About JSK</h1>
          <p className="mt-6 max-w-2xl text-lg text-zinc-500 lg:mx-0 mx-auto">
            Driven by passion and defined by precision. At JSK, we don't just repair cars; we restore the pride of ownership.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Mission/Promise Card */}
          <div className="group relative overflow-hidden rounded-[3rem] border border-white/5 bg-zinc-900/40 p-10 transition-all hover:border-brand/40 hover:bg-zinc-900/60 showroom-glow">
            <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-white">
              <Shield size={32} />
            </div>
            <h3 className="text-3xl font-black text-white">Our Promise</h3>
            <p className="mt-6 text-lg leading-relaxed text-zinc-400">
              We focus on clean prep, accurate color matching, and careful attention to detail so your car looks great and feels like new.
            </p>
            <p className="mt-4 text-base leading-relaxed text-zinc-500">
              Every detail matters. From the initial inspection to the final polish, our team ensures that every vehicle meets our rigorous showroom standards.
            </p>
          </div>

          {/* Why Choose Us Card */}
          <div className="group relative overflow-hidden rounded-[3rem] border border-white/5 bg-zinc-900/40 p-10 transition-all hover:border-brand/40 hover:bg-zinc-900/60 showroom-glow">
            <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-white">
              <Users size={32} />
            </div>
            <h3 className="text-3xl font-black text-white">Why JSK?</h3>
            <ul className="mt-8 space-y-4">
              {bullets.map((b) => (
                <li key={b} className="flex items-center gap-4 text-lg font-medium text-zinc-300">
                  <CheckCircle2 size={24} className="text-brand shrink-0" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <div className="mt-12">
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand px-10 py-4 text-sm font-bold text-white transition-all hover:bg-brand-light hover:shadow-[0_0_20px_rgba(225,29,72,0.3)]"
              >
                Connect With Us
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* Stats/Showcase Section */}
        <div className="mt-32 border-t border-white/5 pt-20 text-center">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-3">
            <div>
              <p className="text-4xl font-black text-white">100%</p>
              <p className="mt-2 text-sm font-bold tracking-widest text-zinc-500 uppercase">Attention to Detail</p>
            </div>
            <div>
              <p className="text-4xl font-black text-white">Showroom</p>
              <p className="mt-2 text-sm font-bold tracking-widest text-zinc-500 uppercase">Finish Standards</p>
            </div>
            <div>
              <p className="text-4xl font-black text-white">Quality</p>
              <p className="mt-2 text-sm font-bold tracking-widest text-zinc-500 uppercase">Guaranteed Results</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


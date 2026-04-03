import Link from "next/link";
import { business } from "../../config/business";
import { Wrench, Paintbrush, Shield, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";

export default function ServicesPage() {
  const serviceIcons = {
    "Body Repairs": Wrench,
    "Painting & Color Match": Paintbrush,
    "Dent Removal": Shield,
    "Polishing & Detailing": Sparkles,
  };

  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="container mx-auto px-6 py-24">
        {/* Header */}
        <div className="mb-20 text-center lg:text-left">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-4 py-1 text-xs font-bold tracking-widest text-brand uppercase">
            Our Expertise
          </div>
          <h1 className="text-gradient text-5xl font-black tracking-tight sm:text-7xl">Services</h1>
          <p className="mt-6 max-w-2xl text-lg text-zinc-500 lg:mx-0 mx-auto">
            From minor dents to full-body transformations, our showroom-quality services ensure your vehicle returns to its pristine state.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid gap-8 md:grid-cols-2">
          {business.services.map((s) => {
            const Icon = serviceIcons[s.title as keyof typeof serviceIcons] ?? Sparkles;
            return (
              <div
                key={s.title}
                className="group relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-zinc-900/40 p-10 transition-all hover:border-brand/40 hover:bg-zinc-900/60 showroom-glow transform hover:-translate-y-1"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                    <Icon size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{s.title}</h3>
                    <p className="mt-4 text-base leading-relaxed text-zinc-500 group-hover:text-zinc-400">
                      {s.description}
                    </p>
                    <ul className="mt-6 space-y-3">
                      <li className="flex items-center gap-3 text-sm text-zinc-600">
                        <CheckCircle2 size={16} className="text-brand" />
                        Premium Materials
                      </li>
                      <li className="flex items-center gap-3 text-sm text-zinc-600">
                        <CheckCircle2 size={16} className="text-brand" />
                        Expert Craftsmanship
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Closing CTA */}
        <div className="mt-24 rounded-[3rem] border border-brand/20 bg-gradient-to-br from-brand/10 to-transparent p-12 lg:p-20 text-center lg:text-left">
          <div className="flex flex-col items-center justify-between gap-10 lg:flex-row">
            <div>
              <p className="text-sm font-bold tracking-widest text-brand uppercase">Fast quotes</p>
              <h2 className="mt-2 text-3xl font-black text-white sm:text-4xl">Experience the showroom finish yourself.</h2>
              <p className="mt-4 text-lg text-zinc-500">Tell us what needs fixing and we’ll guide you through the process.</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand px-10 py-5 text-sm font-black text-white transition-all hover:bg-brand-light hover:shadow-[0_0_20px_rgba(225,29,72,0.4)]"
              >
                Request a Quote
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/gallery"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-10 py-5 text-sm font-bold text-white transition-colors hover:bg-white/10"
              >
                View Our Portfolio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


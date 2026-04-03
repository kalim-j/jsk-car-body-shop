import Link from "next/link";
import { GalleryGrid } from "../components/GalleryGrid";
import { business } from "../config/business";
import { ArrowRight, Phone, MessageSquare, Shield, Paintbrush, Wrench, Sparkles } from "lucide-react";

export default function Home() {
  const serviceIcons = {
    "Body Repairs": Wrench,
    "Painting & Color Match": Paintbrush,
    "Dent Removal": Shield,
    "Polishing & Detailing": Sparkles,
  };

  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative flex min-h-[85vh] items-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(225,29,72,0.1),transparent_70%)]" />
          <div className="absolute bottom-0 h-px w-full bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
        </div>

        <div className="container relative z-10 mx-auto px-6 py-20 text-center lg:text-left">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-4 py-1.5 text-xs font-bold tracking-widest text-brand uppercase">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand"></span>
              </span>
              Premium Automotive Care
            </div>
            <h1 className="text-gradient text-5xl font-black leading-[1.1] tracking-tight sm:text-7xl lg:text-8xl">
              JSK Car Body Shop <br />
              <span className="text-white/60">Showroom Quality.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-zinc-400 lg:mx-0 mx-auto">
              Master-class repairs, precision color matching, and meticulous detailing for the most discerning car owners. Experience excellence at JSK.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand px-8 py-4 text-sm font-bold text-white transition-all hover:bg-brand-light hover:shadow-[0_0_20px_rgba(225,29,72,0.4)]"
              >
                Get a Quote
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href={`tel:${business.phoneTelLink}`}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-sm font-bold text-white transition-colors hover:bg-white/10"
              >
                <Phone size={18} />
                Call Showroom
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="container mx-auto px-6 py-24">
        <div className="mb-16 flex flex-col items-center justify-between gap-6 lg:flex-row lg:items-end">
          <div className="text-center lg:text-left">
            <h2 className="text-gradient text-4xl font-black tracking-tight sm:text-5xl">Our Excellence</h2>
            <p className="mt-4 max-w-xl text-zinc-500">
              Every vehicle is handled with precision and care, ensuring a showroom finish that lasts.
            </p>
          </div>
          <Link href="/services" className="group flex items-center gap-2 text-sm font-bold text-brand hover:text-brand-light transition-colors">
            View All Services
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {business.services.map((s) => {
            const Icon = serviceIcons[s.title as keyof typeof serviceIcons] ?? Sparkles;
            return (
              <div
                key={s.title}
                className="group relative rounded-3xl border border-white/5 bg-zinc-900/40 p-8 transition-all hover:border-brand/40 hover:bg-zinc-900/60 showroom-glow"
              >
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                  <Icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-white">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-500 group-hover:text-zinc-400">
                  {s.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Gallery Highlight */}
      <section className="bg-zinc-900/20 py-24">
        <div className="container mx-auto px-6">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h2 className="text-gradient text-4xl font-black tracking-tight">Portfolio</h2>
              <p className="mt-2 text-zinc-500">Recent transformations from our workshop.</p>
            </div>
            <Link href="/gallery" className="text-sm font-bold text-brand hover:underline">
              Full Gallery →
            </Link>
          </div>

          <GalleryGrid
            count={business.galleryCount}
            placeholderCount={business.galleryPlaceholderCount}
            imageHeightClassName="h-64"
            itemHref="/gallery"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-32 text-center">
        <div className="rounded-[3rem] border border-brand/20 bg-gradient-to-b from-brand/10 to-transparent p-12 lg:p-24">
          <h2 className="text-gradient text-5xl font-black tracking-tight sm:text-6xl">Ready for a showroom finish?</h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-zinc-400">
            Contact JSK today for a personalized estimate on your vehicle.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="rounded-full bg-white px-10 py-5 text-sm font-black text-black transition-transform hover:scale-105 active:scale-95"
            >
              Get Started Now
            </Link>
            <a
              href={`https://wa.me/${business.phoneTelLink.replace(/\+/g, "")}`}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-10 py-5 text-sm font-bold text-white transition-colors hover:bg-white/10"
            >
              <MessageSquare size={18} />
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

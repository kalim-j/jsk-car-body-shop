"use client";

import Link from "next/link";
import { GalleryGrid } from "../components/GalleryGrid";
import { FeaturedDealer } from "../components/FeaturedDealer";
import { business } from "../config/business";
import { ArrowRight, Phone, MessageSquare, Shield, Paintbrush, Wrench, Sparkles } from "lucide-react";
import { motion, useScroll, useTransform, Variants } from "framer-motion";

export default function Home() {
  const serviceIcons = {
    "Body Repairs": Wrench,
    "Painting & Color Match": Paintbrush,
    "Dent Removal": Shield,
    "Polishing & Detailing": Sparkles,
  };

  const { scrollY } = useScroll();
  const yHeroBg = useTransform(scrollY, [0, 500], [0, 150]);
  const opacityHeroText = useTransform(scrollY, [0, 300], [1, 0]);

  const fadeUpVariant: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const textTypingVariant = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative flex min-h-[85vh] items-center overflow-hidden">
        {/* Background Effects with Parallax */}
        <motion.div style={{ y: yHeroBg }} className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(225,29,72,0.15),transparent_70%)]" />
          <div className="absolute bottom-0 h-px w-full bg-gradient-to-r from-transparent via-brand/40 to-transparent shadow-[0_0_20px_rgba(225,29,72,0.5)]" />
        </motion.div>

        <motion.div 
          style={{ opacity: opacityHeroText }}
          className="container relative z-10 mx-auto px-6 py-20 text-center lg:text-left"
        >
          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-5 py-2 text-xs font-bold tracking-widest text-brand uppercase"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand"></span>
              </span>
              Premium Automotive Care
            </motion.div>
            
            <motion.h1 
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="text-gradient text-5xl font-black leading-[1.1] tracking-tight sm:text-7xl lg:text-8xl"
            >
              {Array.from("JSK Car Body Shop").map((letter, i) => (
                <motion.span key={i} variants={textTypingVariant} inline-block>
                  {letter === " " ? "\u00A0" : letter}
                </motion.span>
              ))}
              <br />
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="text-white/60"
              >
                Showroom Quality.
              </motion.span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="mt-8 max-w-2xl text-lg leading-relaxed text-zinc-400 lg:mx-0 mx-auto"
            >
              Master-class repairs, precision color matching, and meticulous detailing for the most discerning car owners. Experience excellence at JSK.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.5 }}
              className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/contact"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand px-8 py-4 text-sm font-bold text-white transition-all hover:bg-brand-light neon-glow"
                >
                  Get a Quote
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <a
                  href={`tel:${business.phoneTelLink}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-sm font-bold text-foreground transition-colors hover:bg-white/10"
                >
                  <Phone size={18} />
                  Call Showroom
                </a>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Featured Dealer */}
      <FeaturedDealer />

      {/* Services Grid */}
      <section className="container mx-auto px-6 py-24">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
          className="mb-16 flex flex-col items-center justify-between gap-6 lg:flex-row lg:items-end"
        >
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
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {business.services.map((s) => {
            const Icon = serviceIcons[s.title as keyof typeof serviceIcons] ?? Sparkles;
            return (
              <motion.div
                variants={fadeUpVariant}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                key={s.title}
                className="group relative rounded-3xl border border-white/5 bg-zinc-900/40 dark:bg-card/40 p-8 transition-all hover:border-brand/40 glass hover:showroom-glow"
              >
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                  <Icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-foreground">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-400">
                  {s.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Gallery Highlight */}
      <section className="bg-zinc-900/10 dark:bg-zinc-900/20 py-24 border-y border-white/5">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUpVariant}
          className="container mx-auto px-6"
        >
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
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-32 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-[3rem] border border-brand/20 bg-gradient-to-b from-brand/10 to-transparent p-12 lg:p-24 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand/20 blur-[100px] rounded-full pointer-events-none" />
          <h2 className="text-gradient text-5xl font-black tracking-tight sm:text-6xl relative z-10">Ready for a showroom finish?</h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-zinc-500 dark:text-zinc-400 relative z-10">
            Contact JSK today for a personalized estimate on your vehicle.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4 relative z-10">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/contact"
                className="rounded-full bg-brand px-10 py-5 text-sm font-black text-white hover:bg-brand-light transition-colors neon-glow"
              >
                Get Started Now
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <a
                href={`https://wa.me/${business.phoneTelLink.replace(/\+/g, "")}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 backdrop-blur-sm px-10 py-5 text-sm font-bold text-foreground transition-colors hover:bg-white/10"
              >
                <MessageSquare size={18} />
                WhatsApp Us
              </a>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

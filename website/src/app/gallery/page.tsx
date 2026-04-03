import Link from "next/link";
import { GalleryGrid } from "../../components/GalleryGrid";
import { business } from "../../config/business";
import { ArrowLeft, Sparkles, Image as ImageIcon } from "lucide-react";

export default function GalleryPage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="container mx-auto px-6 py-24">
        {/* Header */}
        <div className="mb-20 flex flex-col items-center justify-between gap-8 lg:flex-row lg:items-end">
          <div className="text-center lg:text-left">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-4 py-1.5 text-xs font-bold tracking-widest text-brand uppercase">
              <ImageIcon size={14} />
              Our Portfolio
            </div>
            <h1 className="text-gradient text-5xl font-black tracking-tight sm:text-7xl">Gallery</h1>
            <p className="mt-6 max-w-2xl text-lg text-zinc-500 lg:mx-0 mx-auto">
              A curated look at the precision and care we bring to every vehicle. Experience the JSK standard of excellence.
            </p>
          </div>
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-white/10"
          >
            <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>
        </div>

        {/* Gallery Grid Section */}
        <div className="relative">
          {/* Accent Glow */}
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-brand/5 blur-3xl" />
          
          <div className="relative rounded-[3rem] border border-white/5 bg-zinc-900/20 p-8 lg:p-12">
            <GalleryGrid
              count={business.galleryCount}
              placeholderCount={business.galleryPlaceholderCount}
              imageHeightClassName="h-64 sm:h-72 lg:h-80"
              itemHref="/gallery"
            />
          </div>
        </div>

        {/* Closing Quote/CTA */}
        <div className="mt-20 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand mb-6">
            <Sparkles size={24} />
          </div>
          <h2 className="text-2xl font-bold text-white">Your vehicle deserves this perfection.</h2>
          <p className="mt-4 text-zinc-500 max-w-lg mx-auto">
            Each photo represents hours of meticulous work and a commitment to restoring every car to its showroom glory.
          </p>
          <div className="mt-10">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-brand px-10 py-4 text-sm font-bold text-white transition-all hover:bg-brand-light hover:shadow-[0_0_20px_rgba(225,29,72,0.3)]"
            >
              Start Your Transformation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


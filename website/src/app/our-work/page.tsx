"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wrench, Truck, Car, AlertCircle, Sparkles, Filter, LayoutGrid } from "lucide-react";

interface RepairJob {
  id: string;
  title: string;
  description: string;
  vehicleType: "Car" | "Tipper" | "Truck";
  beforeImage: string;
  afterImage: string;
  createdAt: string;
}

export default function OurWorkPage() {
  const [repairs, setRepairs] = useState<RepairJob[]>([]);
  const [filter, setFilter] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRepairs() {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
        const res = await fetch(`${backendUrl}/repairs${filter !== "All" ? `?vehicleType=${filter}` : ""}`);
        if (!res.ok) throw new Error("Failed to load showcase");
        const data = await res.json();
        setRepairs(data.repairs);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchRepairs();
  }, [filter]);

  const categories = ["All", "Car", "Truck", "Tipper"];

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Hero Header */}
      <section className="relative py-24 md:py-32 overflow-hidden border-b border-brand/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.05),transparent_70%)]" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/5 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-brand mb-6 transition-all gold-glow">
              <Sparkles size={12} /> Master-Class Restoration
            </div>
            <h1 className="text-gradient text-5xl font-black tracking-tight sm:text-7xl font-arabic-heading leading-[1.1]">
              Our Repair Expertise
            </h1>
            <p className="mt-6 text-lg text-zinc-500 max-w-xl">
              From minor dent removals to complete heavy vehicle engine overhauls. We transform vehicles into like-new condition with precision.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-6 mt-12">
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4 bg-zinc-900/40 p-2 rounded-2xl border border-white/5 backdrop-blur-sm">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  filter === cat 
                    ? "bg-brand text-black shadow-lg shadow-brand/20" 
                    : "text-zinc-500 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-widest">
            <LayoutGrid size={16} /> Showcase: {repairs.length} Entries
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid gap-12 sm:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse space-y-6">
                <div className="aspect-[16/9] bg-zinc-900 rounded-[2rem]" />
                <div className="h-8 w-1/3 bg-zinc-900 rounded-lg" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="mb-6 rounded-full bg-red-500/10 p-6 text-red-500">
              <AlertCircle size={48} />
            </div>
            <h3 className="text-2xl font-black text-white italic">Showroom Offline</h3>
            <p className="mt-2 text-zinc-500">{error}</p>
          </div>
        ) : repairs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center opacity-50">
             <div className="mb-6 rounded-full bg-white/5 p-6">
                <LayoutGrid size={48} />
             </div>
             <h3 className="text-xl font-bold italic">No {filter !== "All" ? filter : ""} entries found</h3>
          </div>
        ) : (
          <div className="grid gap-12 sm:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {repairs.map((job) => (
                <motion.div
                  key={job.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group"
                >
                  <BeforeAfterCard job={job} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

function BeforeAfterCard({ job }: { job: RepairJob }) {
  const [sliderPos, setSliderPos] = useState(50);
  const [isHovered, setIsHovered] = useState(false);

  const icons = {
     Car: <Car size={16} />,
     Truck: <Truck size={16} />,
     Tipper: <Wrench size={16} />,
  };

  return (
    <div className="space-y-6">
      <div 
        className="relative aspect-[16/10] overflow-hidden rounded-[2.5rem] border border-white/5 bg-zinc-900 shadow-2xl transition-all group-hover:border-brand/30"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Images Container */}
        <div className="absolute inset-0 select-none">
          {/* AFTER IMAGE (Bottom Layer) */}
          <img 
            src={job.afterImage} 
            alt="After restoration" 
            className="absolute inset-0 h-full w-full object-cover"
          />
          
          {/* BEFORE IMAGE (Clipped Layer) */}
          <div 
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${sliderPos}%` }}
          >
            <img 
              src={job.beforeImage} 
              alt="Before restoration" 
              className="absolute h-full w-full max-w-none object-cover"
              style={{ width: "200%" }}
            />
          </div>

          {/* Slider UI */}
          <div 
            className="absolute top-0 bottom-0 w-1 bg-brand cursor-ew-resize z-20 group-hover:bg-white transition-colors"
            style={{ left: `${sliderPos}%` }}
          >
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-brand text-black rounded-full flex items-center justify-center shadow-2xl ring-4 ring-black/20 gold-glow transition-transform group-hover:scale-110">
                <Filter size={18} className="rotate-90" />
             </div>
          </div>

          <input 
            type="range"
            min="0"
            max="100"
            value={sliderPos}
            onChange={(e) => setSliderPos(parseInt(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
          />
        </div>

        {/* Labels */}
        <div className="absolute bottom-6 left-6 z-10 pointer-events-none">
            <span className="bg-black/80 backdrop-blur-md text-[10px] font-black tracking-widest text-white px-3 py-1 rounded-full border border-white/10 uppercase">Before</span>
        </div>
        <div className="absolute bottom-6 right-6 z-10 pointer-events-none">
            <span className="bg-brand text-[10px] font-black tracking-widest text-black px-3 py-1 rounded-full shadow-lg uppercase">After</span>
        </div>

        <div className="absolute top-6 left-6 z-10 pointer-events-none">
           <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 text-white/90">
              {icons[job.vehicleType]}
              <span className="text-[10px] font-black uppercase tracking-widest">{job.vehicleType}</span>
           </div>
        </div>
      </div>

      <div className="px-2">
        <h3 className="text-2xl font-black text-white italic group-hover:text-brand transition-colors">
          {job.title}
        </h3>
        <p className="mt-2 text-zinc-500 leading-relaxed max-w-lg">
          {job.description}
        </p>
      </div>
    </div>
  );
}

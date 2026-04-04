"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wrench, Sparkles, Filter, ArrowRight } from "lucide-react";
import { BeforeAfterSlider } from "./BeforeAfterSlider";
import Link from "next/link";

export function RepairShowcase() {
  const [repairs, setRepairs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("All");

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

  useEffect(() => {
    async function fetchRepairs() {
      try {
        const res = await fetch(`${backendUrl}/repairs`);
        if (res.ok) {
          const data = await res.json();
          setRepairs(data.repairs);
        }
      } catch (err) {
        console.error("Failed to fetch repairs", err);
      } finally {
        setLoading(false);
      }
    }
    fetchRepairs();
  }, [backendUrl]);

  const filteredRepairs = filter === "All" ? repairs : repairs.filter(r => r.vehicleType === filter);

  return (
    <section className="container mx-auto px-6 py-24">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
        <div className="max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-4 py-1.5 text-xs font-bold tracking-widest text-brand uppercase">
            <Sparkles size={14} />
            Our Repair Expertise
          </div>
          <h2 className="text-gradient text-5xl lg:text-6xl font-black tracking-tight leading-none mb-6">
            We transform vehicles into like-new condition
          </h2>
          <p className="text-lg text-zinc-500 font-medium">
            Take a look at our professional restoration work. From minor body repairs to major engine overhauls for Cars, Tippers, and Trucks.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2 lg:mb-1">
          {["All", "Car", "Tipper", "Truck"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                filter === cat 
                  ? "bg-brand text-white shadow-xl shadow-brand/20 border-brand" 
                  : "bg-card/50 border border-white/5 text-zinc-500 hover:text-white hover:border-white/20"
              }`}
            >
              {cat === "All" ? "All Work" : `${cat}s`}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="loading" 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
            className="grid grid-cols-1 md:grid-cols-2 gap-12"
          >
            {[1, 2].map(i => <div key={i} className="aspect-video bg-zinc-800/50 rounded-3xl animate-pulse" />)}
          </motion.div>
        ) : filteredRepairs.length === 0 ? (
          <motion.div 
            key="empty" 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 border border-white/5 rounded-[3rem] bg-card/10 glass"
          >
             <Wrench size={48} className="mx-auto text-zinc-700 mb-4" />
             <h3 className="text-xl font-bold text-zinc-500 italic">No restoration cases found in this category.</h3>
          </motion.div>
        ) : (
          <motion.div 
            key="grid"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          >
            {filteredRepairs.map((repair, idx) => (
              <motion.div 
                key={repair.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group"
              >
                <div className="relative mb-6">
                   <BeforeAfterSlider beforeImage={repair.beforeImage} afterImage={repair.afterImage} />
                   <div className="absolute -bottom-6 -right-6 h-20 w-20 bg-brand rounded-full items-center justify-center hidden lg:flex shadow-2xl transition-transform group-hover:scale-110 group-hover:rotate-12">
                      <Sparkles className="text-white bg-brand shadow-2xl rounded-full p-1" size={40} />
                   </div>
                </div>
                
                <div className="flex justify-between items-start">
                   <div className="max-w-xl">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white transition-colors group-hover:text-brand">{repair.title}</h3>
                        <span className="text-[10px] font-black bg-white/5 border border-white/10 px-2 py-0.5 rounded text-zinc-500 uppercase tracking-widest">{repair.vehicleType} Restoration</span>
                      </div>
                      <p className="text-zinc-500 font-medium line-clamp-2 leading-relaxed">{repair.description}</p>
                   </div>
                   <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                      <ArrowRight size={20} className="text-brand -rotate-45" />
                   </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-24 text-center">
         <div className="bg-brand/10 border border-brand/20 p-12 rounded-[3.5rem] glass relative overflow-hidden group">
            <div className="absolute top-0 left-0 p-8 opacity-5 -rotate-12 transition-transform group-hover:rotate-0 duration-700"><Wrench size={120} /></div>
            <h3 className="text-3xl lg:text-4xl font-black mb-6 relative z-10 italic uppercase tracking-tighter">Ready to Restore Your Vehicle?</h3>
            <p className="text-zinc-400 font-bold mb-8 relative z-10 max-w-xl mx-auto">Contact our professional workshop team for a custom quote on body repair, engine overhaul, or general maintenance.</p>
            <div className="flex flex-wrap justify-center gap-4 relative z-10">
               <button className="bg-brand text-white px-10 py-4 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-brand-light transition-all shadow-xl shadow-brand/20 neon-glow">
                  Get Your Vehicle Repaired
               </button>
               <Link href="/contact" className="px-10 py-4 rounded-2xl border border-white/10 font-black uppercase text-sm tracking-widest hover:bg-white/5 transition-all text-white">
                  Speak to Expert
               </Link>
            </div>
         </div>
      </div>
    </section>
  );
}

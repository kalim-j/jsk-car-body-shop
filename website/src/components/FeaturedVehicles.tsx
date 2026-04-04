"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CarCard, Car, CarCardSkeleton } from "./CarCard";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function FeaturedVehicles() {
  const [vehicles, setVehicles] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch(`${backendUrl}/cars?limit=4`);
        if (res.ok) {
          const data = await res.json();
          // We show the latest 4 approved vehicles as "Featured"
          setVehicles(data.cars.slice(0, 4));
        }
      } catch (err) {
        console.error("Failed to fetch featured vehicles", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, [backendUrl]);

  if (!loading && vehicles.length === 0) return null;

  return (
    <section className="container mx-auto px-6 py-24 bg-zinc-900/10 dark:bg-zinc-900/20 border-y border-white/5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12 flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={18} className="text-brand" />
            <span className="text-xs font-bold text-brand uppercase tracking-widest">Premium Inventory</span>
          </div>
          <h2 className="text-gradient text-4xl font-black tracking-tight sm:text-5xl">Featured Vehicles</h2>
          <p className="mt-4 max-w-xl text-zinc-500">
            Hand-picked, high-quality vehicles including local used cars, tippers, and trucks from JSK dealers.
          </p>
        </div>
        <Link 
          href="/cars" 
          className="group flex items-center gap-2 text-sm font-bold text-brand hover:text-brand-light transition-colors bg-brand/5 px-6 py-3 rounded-full border border-brand/20"
        >
          Explore All Vehicles
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          [...Array(4)].map((_, i) => <CarCardSkeleton key={i} />)
        ) : (
          vehicles.map((v) => <CarCard key={v.id} car={v} />)
        )}
      </div>
    </section>
  );
}

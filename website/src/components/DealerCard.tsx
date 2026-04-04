"use client";

import React from "react";
import { Phone, MapPin, CheckCircle2, BadgeCheck, Star, Navigation } from "lucide-react";
import { motion } from "framer-motion";

export interface Dealer {
  id: string;
  name: string;
  state: string;
  district: string;
  phone: string;
  email: string;
  brands: string[];
  dealerType: "New" | "Used" | "Both" | "Luxury";
  imageUrl?: string | null;
  rating: number;
  verified: boolean;
}

export function DealerCard({ dealer }: { dealer: Dealer }) {
  const mapSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${dealer.name} ${dealer.district} ${dealer.state}`)}`;

  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden hover:border-brand/50 transition-colors duration-300 group shadow-lg shadow-black/20 hover:showroom-glow flex flex-col h-full"
    >
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-foreground group-hover:text-brand transition-colors line-clamp-1">
              {dealer.name}
            </h3>
            {dealer.verified && (
              <BadgeCheck size={18} className="text-blue-400 shrink-0" fill="currentColor" stroke="black" />
            )}
          </div>
          <span className="inline-flex items-center rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-semibold text-brand ring-1 ring-inset ring-brand/20 shrink-0 ml-2">
            {dealer.dealerType}
          </span>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex bg-black/20 px-2 py-0.5 rounded gap-0.5 items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star 
                key={i} 
                size={12} 
                className={i < Math.floor(dealer.rating) ? "text-yellow-400 fill-yellow-400" : "text-zinc-600"} 
              />
            ))}
            <span className="text-xs font-bold text-white ml-1">{dealer.rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1 text-zinc-500">
            <MapPin size={12} className="shrink-0" />
            <span className="text-xs">{dealer.district}, {dealer.state}</span>
          </div>
        </div>

        <div className="mb-6 flex-1">
          <div className="flex flex-wrap gap-1.5 mt-2">
            {dealer.brands.map((brand) => (
              <span
                key={brand}
                className="inline-flex items-center gap-1 rounded bg-black/10 dark:bg-white/5 px-2 py-1 text-xs font-medium text-zinc-400 border border-white/5"
              >
                <CheckCircle2 size={10} className="text-brand hidden sm:block" />
                {brand}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mt-auto pt-6 border-t border-white/5">
          <a
            href={mapSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-black/20 dark:bg-white/5 text-foreground px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-black/40 dark:hover:bg-white/10 transition-colors"
          >
            <Navigation size={16} className="text-blue-400" />
            Map
          </a>
          <a
            href={`tel:${dealer.phone}`}
            className="flex-[2] flex items-center justify-center gap-2 bg-brand text-white px-4 py-2.5 rounded-xl text-sm font-black hover:bg-brand-light transition-all shadow-[0_0_15px_rgba(225,29,72,0.2)] hover:shadow-[0_0_25px_rgba(225,29,72,0.4)]"
          >
            <Phone size={16} />
            Call Now
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export function DealerCardSkeleton() {
  return (
    <div className="bg-card/30 border border-border/30 rounded-2xl overflow-hidden shadow-lg animate-pulse flex flex-col h-full h-[240px]">
      <div className="p-6 flex flex-col h-full">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <div className="h-6 w-40 bg-zinc-800 rounded"></div>
            <div className="h-4 w-4 bg-zinc-800 rounded-full"></div>
          </div>
          <div className="h-5 w-16 bg-zinc-800 rounded-full"></div>
        </div>
        
        <div className="flex gap-2 mb-6">
          <div className="h-4 w-16 bg-zinc-800 rounded"></div>
          <div className="h-4 w-24 bg-zinc-800 rounded"></div>
        </div>

        <div className="flex gap-2 mb-8">
          <div className="h-5 w-14 bg-zinc-800 rounded"></div>
          <div className="h-5 w-16 bg-zinc-800 rounded"></div>
        </div>

        <div className="flex gap-3 mt-auto pt-6 border-t border-white/5">
          <div className="flex-1 h-10 bg-zinc-800 rounded-xl"></div>
          <div className="flex-[2] h-10 bg-zinc-800 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
}

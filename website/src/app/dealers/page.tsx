"use client";

import React, { useState, useEffect } from "react";
import { DealerCard, Dealer, DealerCardSkeleton } from "../../components/DealerCard";
import { INDIAN_STATES, ALL_STATES } from "../../lib/indianStates";
import { Search, MapPin, Building2, Store, Star, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const POPULAR_BRANDS = [
  "Maruti Suzuki", "Tata Motors", "Mahindra", "Hyundai", "Kia", "Toyota", "Honda"
];

export default function DealersPage() {
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [dealerType, setDealerType] = useState("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

  useEffect(() => {
    // Reset district if state changes
    if (state === "") setDistrict("");
  }, [state]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  useEffect(() => {
    async function fetchDealers() {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (search) query.append("search", search);
        if (state) query.append("state", state);
        if (district) query.append("district", district);
        if (dealerType) query.append("dealerType", dealerType);
        if (selectedBrands.length > 0) query.append("brand", selectedBrands.join(','));

        const res = await fetch(`${backendUrl}/dealers?${query.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setDealers(data.dealers);
        }
      } catch (err) {
        console.error("Failed to fetch dealers", err);
      } finally {
        setLoading(false);
      }
    }
    
    const debounceTimeout = setTimeout(fetchDealers, 300);
    return () => clearTimeout(debounceTimeout);
  }, [search, state, district, dealerType, selectedBrands, backendUrl]);

  const topRated = dealers.filter(d => d.rating >= 4.5);
  const otherDealers = dealers.filter(d => d.rating < 4.5);

  const renderGrid = (items: Dealer[]) => (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
      }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {items.map((dealer) => (
        <motion.div 
          key={dealer.id}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
        >
          <DealerCard dealer={dealer} />
        </motion.div>
      ))}
    </motion.div>
  );

  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="container mx-auto px-6 py-24">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-4 py-1.5 text-xs font-bold tracking-widest text-brand uppercase">
            <Building2 size={14} />
            Verified Network
          </div>
          <h1 className="text-gradient text-5xl font-black tracking-tight sm:text-6xl">Find Verified Car Dealers</h1>
          <p className="mt-4 max-w-2xl text-lg text-zinc-500 hidden sm:block">
            Locate top-rated and strictly verified JSK automotive partners across the country for sales, exchanges, and restorations.
          </p>
        </motion.div>

        {/* Filters Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card/30 border border-border/50 p-6 rounded-2xl mb-12 shadow-xl glass"
        >
          <div className="flex items-center gap-2 mb-4">
            <Filter size={16} className="text-zinc-400" />
            <h3 className="text-sm font-bold text-foreground">Advanced Filters</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-zinc-500 group-focus-within:text-brand transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 bg-black/20 dark:bg-black/50 border border-border/50 rounded-xl text-foreground placeholder-zinc-500 outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand/50 transition-all sm:text-sm"
                placeholder="Search dealers by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-zinc-500 group-focus-within:text-brand transition-colors" />
              </div>
              <select
                className="block w-full pl-10 pr-3 py-3 bg-black/20 dark:bg-black/50 border border-border/50 rounded-xl text-foreground outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand/50 transition-all sm:text-sm appearance-none"
                value={state}
                onChange={(e) => setState(e.target.value)}
              >
                <option value="">All States</option>
                {ALL_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-zinc-500 group-focus-within:text-brand transition-colors" />
              </div>
              <select
                className="block w-full pl-10 pr-3 py-3 bg-black/20 dark:bg-black/50 border border-border/50 rounded-xl text-foreground outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand/50 transition-all sm:text-sm appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                disabled={!state}
              >
                <option value="">All Districts</option>
                {state && INDIAN_STATES[state]?.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Store className="h-5 w-5 text-zinc-500 group-focus-within:text-brand transition-colors" />
              </div>
              <select
                className="block w-full pl-10 pr-3 py-3 bg-black/20 dark:bg-black/50 border border-border/50 rounded-xl text-foreground outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand/50 transition-all sm:text-sm appearance-none"
                value={dealerType}
                onChange={(e) => setDealerType(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="New">New</option>
                <option value="Luxury">Luxury</option>
                <option value="Used">Used</option>
                <option value="Both">Both</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
            <span className="text-sm text-zinc-500 mr-2 self-center">Brands: </span>
            {POPULAR_BRANDS.map(brand => (
              <button
                key={brand}
                onClick={() => toggleBrand(brand)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors border ${
                  selectedBrands.includes(brand)
                    ? 'bg-brand text-white border-brand shadow-[0_0_10px_rgba(225,29,72,0.3)]'
                    : 'bg-black/20 text-zinc-400 border-border/50 hover:border-brand/50 hover:text-white'
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {[...Array(8)].map((_, i) => (
                <DealerCardSkeleton key={i} />
              ))}
            </motion.div>
          ) : dealers.length === 0 ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-24 border border-border/50 rounded-3xl bg-card/10 glass"
            >
              <Store className="mx-auto h-16 w-16 text-zinc-600 mb-6" />
              <h3 className="text-2xl font-black text-foreground mb-2">No Verified Dealers Found</h3>
              <p className="text-zinc-500 max-w-md mx-auto">
                We're constantly expanding our network. Try adjusting your search criteria or modifying your brand filters.
              </p>
              <button onClick={() => { setSearch(''); setState(''); setDistrict(''); setDealerType(''); setSelectedBrands([]); }} className="mt-8 px-6 py-2 rounded-full border border-brand text-brand hover:bg-brand hover:text-white transition-colors text-sm font-bold">
                Clear All Filters
              </button>
            </motion.div>
          ) : (
            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Top Rated Section */}
              {topRated.length > 0 && (
                <div className="mb-16">
                  <div className="flex items-center gap-3 mb-6 border-b border-border/50 pb-4">
                    <div className="bg-yellow-400/10 p-2 rounded-lg">
                      <Star size={20} className="text-yellow-400 fill-yellow-400" />
                    </div>
                    <h2 className="text-2xl font-black text-foreground">Top Rated Dealers</h2>
                  </div>
                  {renderGrid(topRated)}
                </div>
              )}

              {/* Standard List */}
              {otherDealers.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-6 border-b border-border/50 pb-4">
                     <h2 className="text-xl font-bold text-zinc-400">Available Dealers</h2>
                     <span className="text-sm font-medium text-zinc-600 bg-black/20 px-2 py-0.5 rounded-full">{otherDealers.length} locations</span>
                  </div>
                  {renderGrid(otherDealers)}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

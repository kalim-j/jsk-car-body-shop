"use client";

import React, { useState, useEffect } from "react";
import { CarCard, Car, CarCardSkeleton } from "../../components/CarCard";
import { INDIAN_STATES, ALL_STATES } from "../../lib/indianStates";
import { MapPin, Search, Filter, CarFront, Contact, Truck, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const POPULAR_BRANDS = [
  "Maruti Suzuki", "Tata Motors", "Mahindra", "Hyundai", "Kia", "Toyota", "Honda", "Ashok Leyland"
];

const VEHICLE_TYPES = ["All", "Car", "Tipper", "Truck"];

export default function MarketplacePage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [condition, setCondition] = useState("");
  const [vehicleType, setVehicleType] = useState("All");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

  useEffect(() => {
    if (state === "") setDistrict("");
  }, [state]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  useEffect(() => {
    async function fetchCars() {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (state) query.append("state", state);
        if (district) query.append("district", district);
        if (condition) query.append("condition", condition);
        if (vehicleType !== "All") query.append("vehicleType", vehicleType);
        if (minPrice) query.append("minPrice", minPrice);
        if (maxPrice) query.append("maxPrice", maxPrice);
        if (selectedBrands.length > 0) query.append("brand", selectedBrands.join(','));

        const res = await fetch(`${backendUrl}/cars?${query.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setCars(data.cars);
        }
      } catch (err) {
        console.error("Failed to fetch cars", err);
      } finally {
        setLoading(false);
      }
    }
    
    const debounceTimeout = setTimeout(fetchCars, 500);
    return () => clearTimeout(debounceTimeout);
  }, [state, district, condition, vehicleType, minPrice, maxPrice, selectedBrands, backendUrl]);

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
            <CarFront size={14} />
            Global Marketplace
          </div>
          <h1 className="text-gradient text-5xl font-black tracking-tight sm:text-6xl">
            {vehicleType === "All" ? "Vehicles for Sale" : `${vehicleType}s for Sale`}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-zinc-500 hidden sm:block">
            Browse through rigorously approved {vehicleType.toLowerCase()} listings from independent owners and verified JSK dealership partners.
          </p>
        </motion.div>

        {/* Category Tabs */}
        <div className="flex gap-2 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-2xl mb-8 w-fit border border-white/5">
          {VEHICLE_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setVehicleType(type)}
              className={`px-6 py-2.5 text-sm font-bold rounded-xl transition-all ${
                vehicleType === type 
                ? "bg-brand text-white shadow-lg shadow-brand/20" 
                : "text-zinc-500 hover:text-foreground"
              }`}
            >
              {type === "All" ? "All Vehicles" : `${type}s`}
            </button>
          ))}
        </div>

        {/* Filters Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card/30 border border-border/50 p-6 rounded-2xl mb-12 shadow-xl glass"
        >
          <div className="flex items-center gap-2 mb-4">
            <Filter size={16} className="text-zinc-400" />
            <h3 className="text-sm font-bold text-foreground">Advanced Search</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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

            <div className="flex gap-2">
              <div className="relative group w-1/2">
                <input
                  type="number"
                  className="block w-full px-3 py-3 bg-black/20 dark:bg-black/50 border border-border/50 rounded-xl text-foreground placeholder-zinc-500 outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand/50 transition-all sm:text-sm"
                  placeholder="Min ₹"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
              </div>
              <div className="relative group w-1/2">
                <input
                  type="number"
                  className="block w-full px-3 py-3 bg-black/20 dark:bg-black/50 border border-border/50 rounded-xl text-foreground placeholder-zinc-500 outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand/50 transition-all sm:text-sm"
                  placeholder="Max ₹"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>

            <div className="relative group">
              <select
                className="block w-full px-3 py-3 bg-black/20 dark:bg-black/50 border border-border/50 rounded-xl text-foreground outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand/50 transition-all sm:text-sm appearance-none"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
              >
                <option value="">Any Condition</option>
                <option value="New">New</option>
                <option value="Used">Used</option>
                <option value="Repaired">Repaired / Refurbished</option>
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

        {/* Results Grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {[...Array(8)].map((_, i) => <CarCardSkeleton key={i} />)}
            </motion.div>
          ) : cars.length === 0 ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-24 border border-border/50 rounded-3xl bg-card/10 glass"
            >
              <CarFront className="mx-auto h-16 w-16 text-zinc-600 mb-6" />
              <h3 className="text-2xl font-black text-foreground mb-2">No Cars Found</h3>
              <p className="text-zinc-500 max-w-md mx-auto">
                We couldn't find any listings matching your search criteria. Try modifying or clearing your filters.
              </p>
              <button onClick={() => { setState(''); setDistrict(''); setCondition(''); setSelectedBrands([]); setMinPrice(''); setMaxPrice(''); }} className="mt-8 px-6 py-2 rounded-full border border-brand text-brand hover:bg-brand hover:text-white transition-colors text-sm font-bold">
                Clear All Filters
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="results" 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {cars.map((car) => (
                <motion.div 
                  key={car.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  <CarCard car={car} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

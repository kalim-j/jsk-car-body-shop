"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { INDIAN_STATES, ALL_STATES } from "../../lib/indianStates";
import { ImagePlus, MapPin, IndianRupee, Car as CarIcon, LayoutDashboard, Asterisk, Info, LogIn, Phone, Calendar, Truck, Navigation } from "lucide-react";
import Link from "next/link";

const POPULAR_BRANDS = [
  "Maruti Suzuki", "Tata Motors", "Mahindra", "Hyundai", "Kia", "Toyota", "Honda", "Ashok Leyland", "Other"
];

const VEHICLE_TYPES = ["Car", "Tipper", "Truck"];

export default function SellPage() {
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("Maruti Suzuki");
  const [vehicleType, setVehicleType] = useState("Car");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [price, setPrice] = useState("");
  const [phone, setPhone] = useState("");
  const [condition, setCondition] = useState("Used");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [locationLink, setLocationLink] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = document.cookie.split('; ').find(row => row.startsWith('jsk_token='))?.split('=')[1];
        if (token) setIsLoggedIn(true);
        else setIsLoggedIn(false);
      } catch (e) {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (state === "") setDistrict("");
  }, [state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('jsk_token='))?.split('=')[1];
      
      const res = await fetch(`${backendUrl}/cars/sell`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({
          name,
          brand,
          vehicleType,
          year: parseInt(year, 10),
          price: parseInt(price, 10),
          phone,
          condition,
          state,
          district,
          locationLink: locationLink || undefined,
          images: imageUrl ? [imageUrl] : []
        })
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        toast.error("Failed to submit listing", { description: error.error });
        return;
      }

      toast.success("Submission Received!", { 
        description: "Your vehicle has been submitted to JSK Admin for approval.", 
        icon: "✨" 
      });
      router.push("/cars");

    } catch (err) {
      toast.error("Network Error", { description: "Could not connect to the backend server." });
    } finally {
      setLoading(false);
    }
  };

  if (isLoggedIn === false) {
    return (
      <div className="bg-background text-foreground min-h-screen flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-card/50 border border-border/50 rounded-3xl p-8 text-center glass shadow-xl"
        >
          <div className="mx-auto w-16 h-16 bg-brand/10 text-brand rounded-2xl flex items-center justify-center mb-6">
            <LogIn size={32} />
          </div>
          <h2 className="text-3xl font-black mb-4">Authentication Required</h2>
          <p className="text-zinc-400 mb-8">
            Please sign in to list your vehicle on the JSK global marketplace terminal.
          </p>
          <Link href="/login" className="flex items-center justify-center gap-2 bg-brand text-white font-bold py-4 rounded-xl hover:bg-brand-light transition-all neon-glow">
            Access Terminal
          </Link>
        </motion.div>
      </div>
    );
  }

  if (isLoggedIn === null) return <div className="bg-background min-h-screen" />;

  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="container mx-auto px-6 py-24 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-4 py-1.5 text-xs font-bold tracking-widest text-brand uppercase">
            <LayoutDashboard size={14} />
            Seller Terminal v2.0
          </div>
          <h1 className="text-gradient text-5xl font-black tracking-tight sm:text-6xl mb-4">Sell Your Vehicle</h1>
          <p className="text-zinc-500 text-lg max-w-2xl">
            List your Car, Tipper, or Truck to our verified dealer network. Reach thousands of buyers across India.
          </p>
        </motion.div>

        <motion.form 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="bg-card/30 border border-white/5 p-8 lg:p-12 rounded-[2.5rem] shadow-2xl glass space-y-12"
        >
          
          {/* Section: Vehicle Identity */}
          <div>
            <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand text-sm shadow-sm ring-1 ring-brand/20">1</span>
              Vehicle Specifications
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="relative group">
                <label className="absolute -top-2.5 left-3 bg-card px-2 text-[10px] font-black uppercase tracking-wider text-brand z-10">Vehicle Name</label>
                <div className="relative">
                  <CarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-brand transition-colors" size={18} />
                  <input
                    type="text" required value={name} onChange={e => setName(e.target.value)}
                    placeholder="e.g. Mahindra Blazo X 28"
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-foreground outline-none focus:border-brand/50 focus:ring-4 focus:ring-brand/10 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="relative group">
                <label className="absolute -top-2.5 left-3 bg-card px-2 text-[10px] font-black uppercase tracking-wider text-brand z-10">Vehicle Type</label>
                <select 
                  value={vehicleType} onChange={e => setVehicleType(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-4 text-foreground outline-none focus:border-brand/50 focus:ring-4 focus:ring-brand/10 transition-all appearance-none font-medium"
                >
                  {VEHICLE_TYPES.map(t => <option key={t} value={t}>{t}s</option>)}
                </select>
              </div>

              <div className="relative group">
                <label className="absolute -top-2.5 left-3 bg-card px-2 text-[10px] font-black uppercase tracking-wider text-brand z-10">Brand</label>
                <select 
                  value={brand} onChange={e => setBrand(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-4 text-foreground outline-none focus:border-brand/50 focus:ring-4 focus:ring-brand/10 transition-all appearance-none font-medium"
                >
                  {POPULAR_BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              <div className="relative group">
                <label className="absolute -top-2.5 left-3 bg-card px-2 text-[10px] font-black uppercase tracking-wider text-brand z-10">Manufacturing Year</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                  <input
                    type="number" required min="1980" max="2026"
                    value={year} onChange={e => setYear(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-foreground outline-none focus:border-brand/50 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="relative group">
                <label className="absolute -top-2.5 left-3 bg-card px-2 text-[10px] font-black uppercase tracking-wider text-brand z-10">Condition</label>
                <select 
                  value={condition} onChange={e => setCondition(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-4 text-foreground outline-none focus:border-brand/50 transition-all appearance-none font-medium"
                >
                  <option value="New">Brand New</option>
                  <option value="Used">Used / Second Hand</option>
                  <option value="Repaired">Repaired / Reconditioned</option>
                </select>
              </div>

              <div className="relative group">
                <label className="absolute -top-2.5 left-3 bg-card px-2 text-[10px] font-black uppercase tracking-wider text-brand z-10">Price (₹)</label>
                <div className="relative">
                  <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                  <input
                    type="number" required min="0" value={price} onChange={e => setPrice(e.target.value)}
                    placeholder="Asking Price"
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-foreground outline-none focus:border-brand/50 transition-all font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Contact & Location */}
          <div>
            <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand text-sm shadow-sm ring-1 ring-brand/20">2</span>
              Contact & Location
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="relative group">
                <label className="absolute -top-2.5 left-3 bg-card px-2 text-[10px] font-black uppercase tracking-wider text-brand z-10">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                  <input
                    type="tel" required value={phone} onChange={e => setPhone(e.target.value)}
                    placeholder="Primary Contact"
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-foreground outline-none focus:border-brand/50 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="relative group">
                <label className="absolute -top-2.5 left-3 bg-card px-2 text-[10px] font-black uppercase tracking-wider text-brand z-10">State</label>
                <select 
                  required value={state} onChange={e => setState(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-4 text-foreground outline-none focus:border-brand/50 transition-all appearance-none font-medium"
                >
                  <option value="" disabled>Select State</option>
                  {ALL_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="relative group">
                <label className="absolute -top-2.5 left-3 bg-card px-2 text-[10px] font-black uppercase tracking-wider text-brand z-10">District</label>
                <select 
                  required disabled={!state} value={district} onChange={e => setDistrict(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-4 text-foreground outline-none focus:border-brand/50 transition-all appearance-none font-medium disabled:opacity-50"
                >
                  <option value="" disabled>Select District</option>
                  {state && INDIAN_STATES[state]?.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div className="relative group lg:col-span-2">
                <label className="absolute -top-2.5 left-3 bg-card px-2 text-[10px] font-black uppercase tracking-wider text-brand z-10">Google Maps Link</label>
                <div className="relative">
                  <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                  <input
                    type="url" value={locationLink} onChange={e => setLocationLink(e.target.value)}
                    placeholder="https://maps.app.goo.gl/..."
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-foreground outline-none focus:border-brand/50 transition-all font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Media */}
          <div>
            <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand text-sm shadow-sm ring-1 ring-brand/20">3</span>
              Media Upload
            </h3>
            
            <div className="relative group">
              <label className="absolute -top-2.5 left-3 bg-card px-2 text-[10px] font-black uppercase tracking-wider text-brand z-10">Image URL</label>
              <div className="relative">
                <ImagePlus className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input
                  type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)}
                  placeholder="Paste direct link to vehicle image (jpg/png)"
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-foreground outline-none focus:border-brand/50 transition-all font-medium"
                />
              </div>
              <p className="text-[10px] text-zinc-500 mt-3 flex items-center gap-2">
                <Info size={12} className="text-brand"/> 
                Hosting tip: Use Cloudinary or PostImage to get a direct URL.
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3 text-zinc-500 text-xs font-bold">
              <Asterisk size={14} className="text-brand" />
              Manual review typically takes 2-4 hours.
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              type="submit"
              className="w-full sm:w-auto px-12 py-4 bg-brand text-white font-black rounded-2xl hover:bg-brand-light transition-all neon-glow flex items-center justify-center shadow-[0_10px_30px_rgba(225,29,72,0.3)] disabled:opacity-50"
            >
              {loading ? "Transmitting..." : "Submit Listing Now"}
            </motion.button>
          </div>

        </motion.form>
      </div>
    </div>
  );
}

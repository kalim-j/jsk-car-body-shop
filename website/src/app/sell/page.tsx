"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { INDIAN_STATES, ALL_STATES } from "../../lib/indianStates";
import { ImagePlus, MapPin, IndianRupee, Car, LayoutDashboard, Asterisk, Info, LogIn } from "lucide-react";
import Link from "next/link";

const POPULAR_BRANDS = [
  "Maruti Suzuki", "Tata Motors", "Mahindra", "Hyundai", "Kia", "Toyota", "Honda", "Other"
];

export default function SellPage() {
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("Maruti Suzuki");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("Used");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const token = document.cookie.split('; ').find(row => row.startsWith('jsk_token='))?.split('=')[1];
        if (token) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
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
          price: parseInt(price, 10),
          condition,
          state,
          district,
          images: imageUrl ? [imageUrl] : []
        })
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        toast.error("Failed to submit listing", { description: error.error });
        return;
      }

      const data = await res.json();
      if (data.car?.status === "Approved") {
        toast.success("Listing Activated!", { description: "Since you are an admin, the listing is live immediately.", icon: "🔥" });
        router.push("/cars");
      } else {
        toast.success("Listing Submitted!", { description: "Your car has been submitted to the admin moderation team for review.", icon: "✅" });
        router.push("/cars");
      }

    } catch (err) {
      toast.error("Network Error", { description: "Could not connect to the backend server." });
    } finally {
      setLoading(false);
    }
  };

  // Give a slick auth warning if not logged in
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
            You must be signed in to access the seller terminal and post a new vehicle listing to the global marketplace.
          </p>
          <Link href="/login" className="flex items-center justify-center gap-2 bg-brand text-white font-bold py-4 rounded-xl hover:bg-brand-light transition-all neon-glow">
            Sign In or Create Account
          </Link>
        </motion.div>
      </div>
    );
  }

  // Pre-load while checking auth
  if (isLoggedIn === null) {
    return <div className="bg-background min-h-screen" />;
  }

  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="container mx-auto px-6 py-24 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-4 py-1.5 text-xs font-bold tracking-widest text-brand uppercase">
            <LayoutDashboard size={14} />
            Seller Terminal
          </div>
          <h1 className="text-gradient text-5xl font-black tracking-tight sm:text-6xl mb-4">List Your Car</h1>
          <p className="text-zinc-500 text-lg">
            Maximize your reach. Submit your vehicle details to be featured on JSK's verified global network. All standard user listings require admin approval.
          </p>
        </motion.div>

        <motion.form 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="bg-card/30 border border-border/50 p-8 rounded-3xl shadow-xl glass space-y-8"
        >
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="group">
                <label className="text-sm font-bold text-zinc-400 mb-2 flex items-center gap-1"><Asterisk size={12} className="text-brand"/> Listing Title</label>
                <div className="relative">
                  <Car className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                  <input
                    type="text"
                    required
                    value={name} onChange={e => setName(e.target.value)}
                    placeholder="e.g. 2023 Kia Seltos GT Line"
                    className="w-full bg-black/20 border border-border/50 rounded-xl py-3 pl-12 pr-4 text-foreground outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/50 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="group">
                  <label className="text-sm font-bold text-zinc-400 mb-2 block">Brand</label>
                  <select 
                    value={brand} onChange={e => setBrand(e.target.value)}
                    className="w-full bg-black/20 border border-border/50 rounded-xl py-3 px-4 text-foreground outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/50 transition-all appearance-none font-medium"
                  >
                    {POPULAR_BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div className="group">
                  <label className="text-sm font-bold text-zinc-400 mb-2 block">Condition</label>
                  <select 
                    value={condition} onChange={e => setCondition(e.target.value)}
                    className="w-full bg-black/20 border border-border/50 rounded-xl py-3 px-4 text-foreground outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/50 transition-all appearance-none font-medium"
                  >
                    <option value="New">New</option>
                    <option value="Used">Used</option>
                    <option value="Repaired">Repaired</option>
                  </select>
                </div>
              </div>

              <div className="group">
                <label className="text-sm font-bold text-zinc-400 mb-2 flex items-center gap-1"><Asterisk size={12} className="text-brand"/> Price Asking (₹)</label>
                <div className="relative">
                  <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                  <input
                    type="number"
                    required
                    min="0"
                    value={price} onChange={e => setPrice(e.target.value)}
                    placeholder="e.g. 1500000"
                    className="w-full bg-black/20 border border-border/50 rounded-xl py-3 pl-12 pr-4 text-foreground outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/50 transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="group">
                <label className="text-sm font-bold text-zinc-400 mb-2 flex items-center gap-1"><Asterisk size={12} className="text-brand"/> Location State</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                  <select 
                    required
                    value={state} onChange={e => setState(e.target.value)}
                    className="w-full bg-black/20 border border-border/50 rounded-xl py-3 pl-12 pr-4 text-foreground outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/50 transition-all appearance-none font-medium"
                  >
                    <option value="" disabled>Select State</option>
                    {ALL_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="group">
                <label className="text-sm font-bold text-zinc-400 mb-2 flex items-center gap-1"><Asterisk size={12} className="text-brand"/> District</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                  <select 
                    required
                    disabled={!state}
                    value={district} onChange={e => setDistrict(e.target.value)}
                    className="w-full bg-black/20 border border-border/50 rounded-xl py-3 pl-12 pr-4 text-foreground outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/50 transition-all appearance-none font-medium disabled:opacity-50"
                  >
                    <option value="" disabled>Select District</option>
                    {state && INDIAN_STATES[state]?.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div className="group">
                <label className="text-sm font-bold text-zinc-400 mb-2 block">Cover Image URL</label>
                <div className="relative">
                  <ImagePlus className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                  <input
                    type="url"
                    value={imageUrl} onChange={e => setImageUrl(e.target.value)}
                    placeholder="https://example.com/car-image.jpg"
                    className="w-full bg-black/20 border border-border/50 rounded-xl py-3 pl-12 pr-4 text-foreground outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/50 transition-all font-medium"
                  />
                </div>
                <p className="text-xs text-zinc-500 mt-2 flex items-center gap-1"><Info size={12}/> Paste a direct link to an image. (Optional)</p>
              </div>

            </div>
          </div>

          <div className="border-t border-border/50 pt-8 mt-4 flex items-center justify-between">
            <p className="text-xs text-zinc-500 hidden sm:block">By submitting, you agree to our terms of service.</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              type="submit"
              className="w-full sm:w-auto px-8 py-3 bg-brand text-white font-bold rounded-xl hover:bg-brand-light transition-all neon-glow flex items-center justify-center shadow-lg disabled:opacity-50"
            >
              {loading ? "Transmitting..." : "Submit Listing Now"}
            </motion.button>
          </div>

        </motion.form>
      </div>
    </div>
  );
}

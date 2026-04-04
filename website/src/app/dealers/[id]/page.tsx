"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Phone, Mail, MapPin, BadgeCheck, Star, 
  Clock, Award, Wrench, Building2, ArrowLeft, 
  Navigation, Share2, ShieldCheck, Heart
} from "lucide-react";
import Link from "next/link";

interface Dealer {
  id: string;
  name: string;
  state: string;
  district: string;
  phone: string;
  email: string;
  brands: string[];
  dealerType: string;
  imageUrl?: string | null;
  rating: number;
  verified: boolean;
  experience?: string;
  speciality?: string;
  openingHours?: string;
  services?: string[];
  locationLink?: string;
}

export default function DealerDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [dealer, setDealer] = useState<Dealer | null>(null);
  const [loading, setLoading] = useState(true);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

  useEffect(() => {
    async function fetchDealer() {
      try {
        const res = await fetch(`${backendUrl}/dealers/${id}`);
        if (res.ok) {
          const data = await res.json();
          setDealer(data.dealer);
        }
      } catch (err) {
        console.error("Failed to fetch dealer", err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchDealer();
  }, [id, backendUrl]);

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="h-12 w-12 border-4 border-brand border-t-transparent rounded-full animate-spin" /></div>;
  if (!dealer) return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Dealer not found</div>;

  // Extract ID from Google Maps link for embedding if possible, or use a generic embed
  // Example link: https://maps.app.goo.gl/CGbPJodN1Qn8ovXc8
  // For simplicity, we'll suggest using a standard iframe embed if we had the lat/long, 
  // but since we only have the link, we'll provide a high-quality "View on Map" button
  // and a fallback static-like map UI.
  
  return (
    <div className="bg-background text-foreground min-h-screen pb-24">
      {/* Hero Section */}
      <div className="relative h-[40vh] w-full overflow-hidden">
        <img 
          src={dealer.imageUrl || "https://images.unsplash.com/photo-1562141961-b5d1852de29a?auto=format&fit=crop&w=1600&q=80"} 
          className="w-full h-full object-cover opacity-40 blur-sm scale-110"
          alt="Background"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-6 pb-12">
            <motion.div 
               initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
               className="flex flex-col md:flex-row md:items-end justify-between gap-8"
            >
              <div className="flex items-center gap-6">
                <div className="h-24 w-24 md:h-32 md:w-32 rounded-3xl bg-card border-4 border-background shadow-2xl flex items-center justify-center overflow-hidden shrink-0">
                  <Building2 size={48} className="text-brand" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight">{dealer.name}</h1>
                    {dealer.verified && <BadgeCheck size={28} className="text-blue-400" fill="currentColor" stroke="black" />}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-zinc-400">
                    <div className="flex items-center gap-1.5"><MapPin size={16} className="text-brand" /> {dealer.district}, {dealer.state}</div>
                    <div className="flex items-center gap-1.5"><Star size={16} className="text-yellow-400 fill-yellow-400" /> {dealer.rating.toFixed(1)} Rating</div>
                    <div className="bg-brand text-white px-3 py-1 rounded-full text-[10px] uppercase tracking-widest">{dealer.dealerType} Dealer</div>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <Share2 size={20} />
                </button>
                <button className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <Heart size={20} />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Stats / Badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Award, label: "Experience", value: dealer.experience || "10+ Years" },
                { icon: Wrench, label: "Speciality", value: dealer.speciality || "Maintenance" },
                { icon: Clock, label: "Status", value: "Open Now" },
                { icon: ShieldCheck, label: "Trust Score", value: "98% Positive" },
              ].map((stat, i) => (
                <div key={i} className="bg-card/50 border border-white/5 p-4 rounded-2xl">
                  <stat.icon size={20} className="text-brand mb-2" />
                  <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{stat.label}</div>
                  <div className="text-sm font-black text-foreground">{stat.value}</div>
                </div>
              ))}
            </div>

            {/* About / Brands */}
            <section className="bg-card/30 border border-white/5 p-8 rounded-3xl glass">
              <h3 className="text-xl font-bold mb-6">Authorized Brands</h3>
              <div className="flex flex-wrap gap-3">
                {dealer.brands.map(brand => (
                  <div key={brand} className="px-6 py-3 rounded-2xl bg-black/20 border border-white/5 text-sm font-bold shadow-sm">
                    {brand}
                  </div>
                ))}
              </div>
            </section>

            {/* Services */}
            <section>
              <h3 className="text-xl font-bold mb-6">Offered Services</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(dealer.services || ["Sales", "Service", "Modifications", "Insurance"]).map(service => (
                  <div key={service} className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-white/5 hover:border-brand/30 transition-colors group">
                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-brand/10 text-brand group-hover:bg-brand group-hover:text-white transition-all">
                      <Wrench size={18} />
                    </div>
                    <span className="font-bold text-foreground">{service}</span>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Sidebar / Map */}
          <div className="space-y-8">
            {/* Contact Card */}
            <div className="bg-brand p-8 rounded-[2rem] text-white shadow-2xl shadow-brand/20 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-20"><Building2 size={120} /></div>
               <h3 className="text-2xl font-black mb-6 relative z-10">Contact Business</h3>
               <div className="space-y-4 relative z-10">
                 <a href={`tel:${dealer.phone}`} className="flex items-center gap-4 bg-white/20 hover:bg-white/30 p-4 rounded-2xl transition-colors backdrop-blur-md border border-white/10">
                    <Phone size={20} />
                    <span className="font-bold">{dealer.phone}</span>
                 </a>
                 <div className="flex items-center gap-4 bg-white/20 p-4 rounded-2xl backdrop-blur-md border border-white/10">
                    <Mail size={20} />
                    <span className="font-bold truncate">{dealer.email}</span>
                 </div>
                 <div className="flex items-center gap-4 bg-white/20 p-4 rounded-2xl backdrop-blur-md border border-white/10">
                    <Clock size={20} />
                    <span className="font-bold">{dealer.openingHours || "9 AM - 8 PM"}</span>
                 </div>
               </div>
               <button className="w-full mt-8 bg-zinc-900 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-colors shadow-xl">
                 Request Callback
               </button>
            </div>

            {/* Location Map Preview */}
            <div className="bg-card border border-white/5 rounded-[2rem] overflow-hidden">
              <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <h3 className="font-bold">Business Location</h3>
                <Navigation size={18} className="text-blue-400" />
              </div>
              <div className="h-64 bg-zinc-800 relative group">
                <img 
                  src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80" 
                  className="w-full h-full object-cover opacity-50 transition-transform duration-700 group-hover:scale-110" 
                  alt="Static Map"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-brand text-white p-4 rounded-full shadow-2xl"
                  >
                    <MapPin size={32} />
                  </motion.div>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <button 
                    onClick={() => window.open(dealer.locationLink || "#", "_blank")}
                    className="w-full bg-white text-black py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-zinc-100 transition-all shadow-lg"
                  >
                    Open Google Maps
                  </button>
                </div>
              </div>
              <div className="p-6 text-xs text-zinc-500 text-center">
                Verified Address: {dealer.district}, {dealer.state}, India
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

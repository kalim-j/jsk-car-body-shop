"use client";

import { motion } from "framer-motion";
import { Star, MapPin, Phone, Map, ShieldCheck, Clock, Award, CheckCircle } from "lucide-react";
import Link from "next/link";

export function FeaturedDealer() {
  const dealer = {
    name: "JSK CAR BODY SHOP",
    state: "Tamil Nadu",
    district: "Dharmapuri",
    type: "Dealer + Repair Service",
    services: ["Car Repair", "Second-hand Cars", "Tipper Vehicles"],
    brands: ["Mahindra", "Tata", "Ashok Leyland"],
    phone: ["7010587940", "9092704777"],
    location_link: "https://maps.app.goo.gl/CGbPJodN1Qn8ovXc8",
    verified: true,
    rating: 4.8,
    experience: "10+ years",
    speciality: "Body repair & heavy vehicles",
    opening_hours: "9 AM - 8 PM"
  };

  return (
    <section className="container mx-auto px-6 py-20">
      <div className="mb-12 text-center lg:text-left">
        <h2 className="text-gradient text-3xl font-black tracking-tight sm:text-5xl">Featured Local Dealer</h2>
        <p className="mt-4 max-w-2xl text-zinc-500 lg:mx-0 mx-auto">
          Trusted car repair and second-hand vehicle dealer with {dealer.experience} of experience.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="group relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-zinc-900/40 p-1 glass transition-all duration-500 hover:border-brand/40 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(225,29,72,0.3)]"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-brand/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        
        <div className="relative flex flex-col lg:flex-row gap-8 lg:gap-12 p-6 lg:p-10 z-10">
          
          {/* Image Placeholder */}
          <div className="w-full lg:w-2/5 overflow-hidden rounded-3xl relative min-h-[300px]">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1625049583151-5aa6da3e5eb5?q=80&w=1400')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                <Star size={14} className="fill-brand text-brand" />
                {dealer.rating} Rating
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-brand/90 backdrop-blur-md px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                <ShieldCheck size={14} />
                Verified
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col justify-center">
            
            <div className="mb-2 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-zinc-800 px-3 py-1 text-xs font-bold text-zinc-300">
                <Award size={12} className="text-amber-400" />
                Trusted Local Business
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-brand/10 border border-brand/20 px-3 py-1 text-xs font-bold text-brand">
                {dealer.type}
              </span>
            </div>

            <h3 className="text-3xl lg:text-4xl font-black text-white mb-2">{dealer.name}</h3>
            
            <div className="flex items-center gap-2 text-zinc-400 text-sm mb-6 pb-6 border-b border-white/10">
              <MapPin size={16} />
              {dealer.district}, {dealer.state}
              <span className="mx-2">•</span>
              <Clock size={16} />
              {dealer.opening_hours}
            </div>

            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              <div>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Core Services</p>
                <div className="flex flex-col gap-2">
                  {dealer.services.map((service, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-zinc-300">
                      <CheckCircle size={14} className="text-brand" />
                      {service}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Brands Covered</p>
                <div className="flex flex-wrap gap-2">
                  {dealer.brands.map((brand, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-bold text-zinc-300">
                      {brand}
                    </span>
                  ))}
                </div>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mt-4 mb-2">Speciality</p>
                <p className="text-sm font-bold text-zinc-300">{dealer.speciality}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 mt-auto">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={`tel:${dealer.phone[0]}`}
                className="inline-flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white transition-all hover:bg-brand-light neon-glow shadow-lg shadow-brand/20"
              >
                <Phone size={16} />
                Call Now
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={dealer.location_link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-white/10"
              >
                <Map size={16} />
                View Location
              </motion.a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 text-sm font-bold text-zinc-400 hover:text-brand transition-colors px-4 py-3 ml-auto"
              >
                Contact Dealer →
              </Link>
            </div>

          </div>
        </div>
      </motion.div>
    </section>
  );
}

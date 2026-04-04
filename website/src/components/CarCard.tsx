import React from "react";
import { motion } from "framer-motion";
import { MapPin, IndianRupee, Tag, ShieldCheck, Contact } from "lucide-react";

export interface Car {
  id: string;
  name: string;
  brand: string;
  price: number;
  condition: string;
  images: string;
  state: string;
  district: string;
  sellerType: string;
  vehicleType: string;
  year: number;
  phone: string;
  locationLink?: string;
  seller: {
    name: string;
    email: string;
  };
}

export function CarCard({ car }: { car: Car }) {
  let imagesArr: string[] = [];
  try {
    imagesArr = JSON.parse(car.images);
  } catch (e) {
    imagesArr = [];
  }
  const coverImage = imagesArr.length > 0 ? imagesArr[0] : "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80";

  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-card border border-border/50 shadow-lg transition-all hover:shadow-brand/20 hover:border-brand/40 geometric-bg lg:bg-card/40 backdrop-blur-sm"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-900">
        <img 
          src={coverImage}
          alt={car.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <div className="flex gap-2">
            <span className="rounded-full bg-brand px-3 py-1 text-[10px] font-black tracking-[0.15em] text-black shadow-lg backdrop-blur-sm uppercase italic">
              {car.vehicleType}
            </span>
            <span className="rounded-full bg-black/60 px-3 py-1 text-[10px] font-bold text-white border border-white/10 backdrop-blur-md">
              {car.year}
            </span>
          </div>
          <span className="self-start rounded-full bg-black/60 px-3 py-1 text-[10px] font-bold text-brand border border-brand/20 backdrop-blur-md uppercase tracking-tighter">
            {car.brand}
          </span>
        </div>

        {car.locationLink && (
          <button 
            onClick={(e) => { e.stopPropagation(); window.open(car.locationLink, '_blank'); }}
            className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 text-[10px] font-bold text-white border border-white/10 backdrop-blur-md hover:bg-brand transition-colors"
          >
            <MapPin size={12} />
            View on Map
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex justify-between items-start mb-1">
          <h3 className="line-clamp-1 text-lg font-black tracking-tight text-foreground group-hover:text-brand transition-colors">
            {car.name}
          </h3>
        </div>
        
        <div className="text-xl font-black flex items-center mb-4 metallic-gold font-arabic-heading">
          <IndianRupee size={18} className="mr-0.5 opacity-80" />
          {car.price.toLocaleString("en-IN")}
        </div>

        <div className="space-y-2 mb-6">
          <div className="flex items-center text-xs font-medium text-zinc-400">
            <MapPin size={14} className="mr-2 text-brand/70" />
            <span className="line-clamp-1">{car.district}, {car.state}</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-zinc-500 font-medium bg-black/20 p-2 rounded-lg border border-white/5">
            <div className="flex items-center">
              <ShieldCheck size={14} className="mr-2 text-blue-400" />
              <span>{car.sellerType} Listing</span>
            </div>
            <span className="text-zinc-600 font-bold">{car.condition}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-auto">
          <button 
            onClick={() => window.location.href = `tel:${car.phone}`}
            className="flex items-center justify-center gap-2 rounded-xl bg-brand py-3 text-xs font-black uppercase tracking-widest text-black transition-all hover:bg-brand-light shadow-lg gold-glow"
          >
            <Contact size={16} />
            Connect
          </button>
          <button 
            onClick={() => window.location.href = `mailto:${car.seller.email}`}
            className="flex items-center justify-center gap-2 rounded-xl border border-brand/20 bg-brand/5 py-3 text-xs font-black uppercase tracking-widest text-brand transition-colors hover:bg-brand/10"
          >
            Inquiry
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export function CarCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-card border border-border/50 animate-pulse">
      <div className="aspect-[4/3] w-full bg-zinc-800" />
      <div className="p-5 flex-1 flex flex-col space-y-4">
        <div className="h-6 w-3/4 bg-zinc-800 rounded-lg" />
        <div className="h-8 w-1/2 bg-zinc-800 rounded-lg" />
        <div className="space-y-2">
          <div className="h-4 w-full bg-zinc-800 rounded" />
          <div className="h-4 w-2/3 bg-zinc-800 rounded" />
        </div>
        <div className="mt-auto h-12 w-full bg-zinc-800 rounded-xl" />
      </div>
    </div>
  );
}

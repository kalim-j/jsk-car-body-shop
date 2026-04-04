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
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-card border border-border/50 shadow-lg transition-all hover:shadow-brand/20 hover:border-brand/40"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-900">
        <img 
          src={coverImage}
          alt={car.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="rounded-full bg-brand/90 px-3 py-1 text-xs font-black tracking-wider text-white shadow-lg backdrop-blur-sm">
            {car.brand}
          </span>
          <span className="rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-white border border-white/10 backdrop-blur-md">
            {car.condition}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="line-clamp-1 text-xl font-black tracking-tight text-foreground group-hover:text-brand transition-colors">
            {car.name}
          </h3>
        </div>
        
        <div className="text-2xl font-black text-white flex items-center mb-4 text-gradient">
          <IndianRupee size={22} className="mr-1 opacity-80" />
          {car.price.toLocaleString("en-IN")}
        </div>

        <div className="space-y-2 mb-6">
          <div className="flex items-center text-sm font-medium text-zinc-400">
            <MapPin size={16} className="mr-2 text-brand/70" />
            <span className="line-clamp-1">{car.district}, {car.state}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-zinc-500 font-medium bg-black/20 p-2 rounded-lg border border-white/5">
            <div className="flex items-center">
              <ShieldCheck size={16} className="mr-2 text-blue-400" />
              <span>{car.sellerType} Listing</span>
            </div>
          </div>
        </div>

        <button 
          onClick={() => window.location.href = `mailto:${car.seller.email}`}
          className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 py-3 text-sm font-bold text-foreground transition-colors hover:bg-brand hover:text-white"
        >
          <Contact size={18} />
          Contact Seller
        </button>
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

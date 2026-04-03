"use client";

import { MessageSquare, Phone, MapPin } from "lucide-react";
import { business } from "../config/business";

export function QuickActions() {
  return (
    <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-black/80 p-2 shadow-2xl backdrop-blur-xl md:hidden">
      <a
        href={`tel:${business.phoneTelLink}`}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 text-white transition-transform active:scale-95"
        aria-label="Call Us"
      >
        <Phone size={20} />
      </a>
      <a
        href={`https://wa.me/${business.phoneTelLink.replace(/\+/g, "")}`}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white transition-transform active:scale-95"
        aria-label="WhatsApp"
      >
        <MessageSquare size={20} />
      </a>
      <a
        href={business.mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 rounded-full bg-brand px-6 py-3 font-bold text-white transition-transform active:scale-95"
      >
        <MapPin size={18} />
        <span className="text-sm">Visit Showroom</span>
      </a>
    </div>
  );
}

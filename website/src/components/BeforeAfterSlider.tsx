"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { MoveLeft, MoveRight } from "lucide-react";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
}

export function BeforeAfterSlider({ beforeImage, afterImage }: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  };

  const onMouseMove = (e: React.MouseEvent) => handleMove(e.clientX);
  const onTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].clientX);

  return (
    <div 
      ref={containerRef}
      className="relative aspect-video w-full overflow-hidden rounded-2xl cursor-ew-resize select-none border border-white/5 shadow-2xl"
      onMouseMove={onMouseMove}
      onTouchMove={onTouchMove}
    >
      {/* After Image (Background) */}
      <img 
        src={afterImage} 
        alt="After" 
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />

      {/* Before Image (Overlay) */}
      <div 
        className="absolute inset-0 h-full overflow-hidden border-r-2 border-brand/50 shadow-[4px_0_15px_rgba(225,29,72,0.3)] z-10"
        style={{ width: `${sliderPosition}%` }}
      >
        <img 
          src={beforeImage} 
          alt="Before" 
          className="absolute inset-0 h-full w-full object-cover"
          style={{ width: `${100 * (100 / sliderPosition)}%` }}
          draggable={false}
        />
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-widest border border-white/10">Before</div>
      </div>

      <div className="absolute top-4 right-4 bg-brand px-3 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-widest shadow-lg z-20">After</div>

      {/* Slider Handle */}
      <div 
        className="absolute inset-y-0 z-30 flex items-center justify-center pointer-events-none"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        <div className="h-full w-0.5 bg-brand/50 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white shadow-2xl flex items-center justify-center border-2 border-brand">
            <div className="flex gap-0.5 text-brand">
              <MoveLeft size={14} />
              <MoveRight size={14} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

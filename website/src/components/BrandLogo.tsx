"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface BrandLogoProps {
  className?: string;
  showText?: boolean;
  size?: number;
}

export function BrandLogo({ className = "", showText = true, size = 180 }: BrandLogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-3 transition-all hover:opacity-90 ${className}`}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative"
        style={{ width: size, height: size / 2 }}
      >
        <Image 
          src="/logo.png" 
          alt="JSK Motors" 
          fill
          className="object-contain filter drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]"
          priority
        />
      </motion.div>
      {showText && (
        <span className="sr-only">JSK Motors</span>
      )}
    </Link>
  );
}

"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface QRCodeProps {
  data: string;
  size?: number;
}

export function QRCode({ data, size = 200 }: QRCodeProps) {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}`;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white p-4 rounded-[2.5rem] shadow-[inset_0_2px_10px_rgba(0,0,0,0.05),0_20px_40px_rgba(0,0,0,0.05)] inline-block border border-gray-100"
    >
      <div className="relative group">
         <Image 
           src={qrUrl} 
           alt="Asombro QR Access" 
           width={size} 
           height={size} 
           className="rounded-[1.5rem] grayscale group-hover:grayscale-0 transition-all duration-700"
         />
         {/* Subtle corner decor */}
         <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[var(--color-brand-orange)] rounded-tl-lg" />
         <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[var(--color-brand-orange)] rounded-br-lg" />
      </div>
    </motion.div>
  );
}

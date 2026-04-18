"use client";

import { useAuth } from "../../store/useAuth";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ShieldCheck, User as UserIcon } from "lucide-react";

export function UserBadge() {
  const { user, isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !user) return null;

  return (
    <Link href="/account">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        className="flex items-center gap-4 bg-black/90 backdrop-blur-3xl border border-white/10 pr-6 pl-2 py-1.5 rounded-full shadow-2xl hover:bg-black transition-all group overflow-hidden relative"
      >
        {/* Decorative Internal Glow */}
        <div className="absolute top-0 right-0 w-8 h-8 bg-[var(--color-brand-orange)] blur-xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        
        {/* Avatar / Shield Container */}
        <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[var(--color-brand-orange)]/30 group-hover:border-[var(--color-brand-orange)] transition-all flex-shrink-0 shadow-lg">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-[var(--color-brand-orange)] transition-colors">
               <UserIcon size={20} />
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
        
        {/* Text Area */}
        <div className="flex flex-col">
           <div className="flex items-center gap-1.5 opacity-60">
              <ShieldCheck size={10} className="text-[var(--color-brand-orange)]" />
              <span className="text-[8px] font-black text-white uppercase tracking-[0.2em] whitespace-nowrap">
                Miembro Squad VIP
              </span>
           </div>
           <span className="font-black italic text-[14px] text-white tracking-tight group-hover:text-[var(--color-brand-orange)] transition-colors leading-tight">
             {user.name}
           </span>
        </div>

        {/* Status Dot */}
        <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse ml-1"></div>
      </motion.div>
    </Link>
  );
}

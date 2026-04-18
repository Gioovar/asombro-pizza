"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bike, Wallet, User, Bell, Home } from "lucide-react";
import { motion } from "framer-motion";

export default function DriverLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/driver/login";

  if (isLoginPage) return <>{children}</>;

  const navItems = [
    { href: "/driver/home", icon: Home, label: "Misión" },
    { href: "/driver/earnings", icon: Wallet, label: "Ganancias" },
    { href: "/driver/active-order", icon: Bike, label: "Orden", hide: pathname !== "/driver/active-order" },
    { href: "/driver/profile", icon: User, label: "Perfil" },
  ];

  return (
    <div className="flex flex-col h-screen bg-black font-poppins selection:bg-[var(--color-brand-orange)] selection:text-white">
      <main className="flex-1 overflow-y-auto custom-scrollbar">
        {children}
      </main>

      {/* Premium Bottom Navigation with Glassmorphism */}
      <nav className="fixed bottom-6 inset-x-6 h-20 bg-neutral-900/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] flex items-center justify-around px-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50">
        {navItems.filter(item => !item.hide).map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href} className="relative py-2 px-4 group">
              <div className="flex flex-col items-center gap-1">
                <Icon 
                  size={24} 
                  className={`transition-all duration-300 ${isActive ? 'text-[var(--color-brand-orange)] scale-110 shadow-[0_0_15px_rgba(255,90,0,0.3)]' : 'text-gray-500 group-hover:text-gray-300'}`} 
                />
                <span className={`text-[9px] font-black uppercase tracking-widest transition-colors ${isActive ? 'text-white' : 'text-gray-600'}`}>
                  {item.label}
                </span>
                
                {/* Active Indicator Pill */}
                {isActive && (
                  <motion.div 
                    layoutId="activeNav"
                    className="absolute -bottom-3 inset-x-0 h-1 bg-[var(--color-brand-orange)] rounded-full shadow-[0_0_10px_rgba(255,90,0,0.5)] mx-auto w-8"
                  />
                )}
              </div>
            </Link>
          );
        })}
        
        {/* Notification Badge Button (Static for now) */}
        <button className="relative py-2 px-4 group">
          <div className="flex flex-col items-center gap-1">
            <div className="relative">
              <Bell size={24} className="text-gray-500 group-hover:text-gray-300 transition-colors" />
              <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-neutral-900 rounded-full"></div>
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-gray-600">Avisos</span>
          </div>
        </button>
      </nav>
      
      {/* Safe area padding for bottom nav */}
      <div className="h-10 shrink-0 bg-black"></div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDriverStore } from "@/store/useDriverStore";
import { Bike, Navigation, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function DriverLogin() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setDriverId } = useDriverStore();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) return;
    
    setLoading(true);
    setTimeout(() => {
       setDriverId("simulated-driver-1"); 
       router.push("/driver/home");
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-black text-white relative overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(255,90,0,0.15),transparent_70%)]"></div>
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[var(--color-brand-orange)] blur-[120px] opacity-10 rounded-full"></div>
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-white blur-[120px] opacity-5 rounded-full"></div>

      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-sm relative z-10"
      >
        <div className="flex flex-col items-center mb-12">
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="w-24 h-24 bg-gradient-to-br from-[var(--color-brand-orange)] to-orange-600 rounded-[2.5rem] flex items-center justify-center mb-6 shadow-[0_20px_50px_rgba(255,90,0,0.3)] border border-white/20"
            >
               <Zap size={44} className="text-white fill-white" />
            </motion.div>
            
            <h1 className="text-4xl font-black font-poppins tracking-tighter italic uppercase text-center">
              Asombro <span className="text-[var(--color-brand-orange)]">Driver</span>
            </h1>
            <p className="text-gray-500 text-center mt-3 text-xs font-black uppercase tracking-[0.3em]">Misiones de entrega premium</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative group">
            <label className="absolute -top-2 left-4 bg-black px-2 text-[10px] font-black text-[var(--color-brand-orange)] uppercase tracking-widest z-10 transition-colors group-focus-within:text-white">
              Teléfono Celular
            </label>
            <input 
              type="tel" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="55 0000 0000"
              required
              className="w-full bg-neutral-900 border-2 border-neutral-800 text-white px-6 py-5 rounded-2xl outline-none focus:border-[var(--color-brand-orange)] transition-all text-xl font-black italic tracking-widest placeholder:text-neutral-700 shadow-inner"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading || phone.length < 5}
            className="group relative w-full bg-white text-black font-black py-5 rounded-2xl flex items-center justify-center gap-3 mt-10 hover:bg-[var(--color-brand-orange)] hover:text-white transition-all transform active:scale-95 disabled:opacity-30 disabled:grayscale shadow-[0_20px_40px_rgba(0,0,0,0.4)] overflow-hidden"
          >
            <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            {loading ? (
              <span className="w-6 h-6 border-3 border-black border-t-transparent rounded-full animate-spin relative z-10"></span>
            ) : (
              <>
                <span className="relative z-10 text-sm uppercase tracking-widest italic">INICIAR SESIÓN</span>
                <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-16 flex items-center justify-center gap-2 text-gray-600">
           <ShieldCheck size={16} />
           <span className="text-[10px] font-black uppercase tracking-widest leading-none">Conectado de forma segura</span>
        </div>
      </motion.div>
      
      {/* Decorative Brand Text */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-5 pointer-events-none">
         <p className="text-6xl font-black italic uppercase whitespace-nowrap tracking-tighter">ASOMBRO PIZZA SQUAD</p>
      </div>
    </div>
  );
}

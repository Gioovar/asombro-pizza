"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDriverStore } from "@/store/useDriverStore";
import { Bike, Navigation, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function DriverLogin() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setDriverId } = useDriverStore();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulating OTP/Login API call
    setTimeout(() => {
       // Since we seeded driver 1: Carlos López or similar, we'll just mock ID
       setDriverId("simulated-driver-1"); 
       router.push("/driver/home");
    }, 1200);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-black text-white relative">
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-blue-900/40 to-transparent"></div>
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-sm relative z-10"
      >
        <div className="w-20 h-20 bg-blue-600 rounded-3xl mx-auto flex items-center justify-center mb-8 shadow-[0_10px_30px_rgba(37,99,235,0.4)]">
           <Bike size={40} className="text-white" />
        </div>
        
        <h1 className="text-3xl font-black font-poppins text-center mb-2">Asombro Driver</h1>
        <p className="text-gray-400 text-center mb-10 text-sm">Ingresa con tu número registrado para comenzar a repartir.</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">Teléfono Celular</label>
            <input 
              type="tel" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ej: 55 1234 5678"
              required
              className="w-full mt-2 bg-gray-900 border border-gray-800 text-white px-5 py-4 rounded-2xl focus:outline-none focus:border-blue-500 transition-colors text-lg font-medium"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading || phone.length < 5}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 mt-8 hover:bg-blue-500 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>Continuar <ArrowRight size={20} /></>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

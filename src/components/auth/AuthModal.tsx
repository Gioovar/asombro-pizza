"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, Phone, ArrowRight, Loader2, AlertCircle, ShieldCheck, Eye, EyeOff, Sparkles } from "lucide-react";
import { useAuth } from "../../store/useAuth";
import Image from "next/image";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  intentMessage?: string;
}

export function AuthModal({ isOpen, onClose, onSuccess, intentMessage }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [formData, setFormData] = useState({ name: "", email: "", password: "", phone: "" });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { setAuth } = useAuth();

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (mode === "register" && formData.password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setIsLoading(true);

    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Algo salió mal");

      setAuth(data.user, data.token);
      setFormData({ name: "", email: "", password: "", phone: "" });

      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = (m: "login" | "register") => {
    setMode(m);
    setError("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirm(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center sm:p-4 bg-black/80 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.9 }}
          transition={{ type: "spring", damping: 32, stiffness: 280 }}
          className="bg-white/95 backdrop-blur-3xl w-full sm:max-w-md rounded-t-[3.5rem] sm:rounded-[3.5rem] overflow-hidden shadow-2xl relative border border-white/20"
        >
          {/* Decorative Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-brand-orange)] blur-[80px] rounded-full opacity-10 -translate-y-1/2 translate-x-1/2" />
          
          {/* Handle bar for mobile */}
          <div className="flex justify-center pt-5 sm:hidden">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-11 h-11 flex items-center justify-center bg-gray-100 hover:bg-black hover:text-white rounded-2xl transition-all active:scale-95 group z-10"
          >
            <X size={20} className="group-hover:rotate-90 transition-transform" />
          </button>

          <div className="px-10 pb-10 pt-8">
            {/* Brand header */}
            <div className="flex flex-col items-center mb-10">
              <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-6 shadow-xl relative overflow-hidden"
              >
                 <Image src="/images/logo.svg" alt="Asombro" width={44} height={44} className="brightness-0 invert object-contain p-2" />
                 <div className="absolute top-0 right-0 p-1">
                    <Sparkles size={10} className="text-[var(--color-brand-orange)]" />
                 </div>
              </motion.div>
              <h2 className="text-4xl font-black font-poppins tracking-tighter italic uppercase leading-none text-center">
                {mode === "login" ? "Bienvenido" : "El Squad"}
              </h2>
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] mt-3 opacity-60">
                {mode === "register" ? "Únete a la elite de la masa madre" : "Accede a tu cuenta de curaduría"}
              </p>
            </div>

            {/* Intent banner */}
            {intentMessage && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-4 bg-[var(--color-brand-orange)]/5 border border-[var(--color-brand-orange)]/20 rounded-2xl px-5 py-4 mb-8"
              >
                <ShieldCheck size={20} className="text-[var(--color-brand-orange)] flex-shrink-0" />
                <p className="text-xs font-black uppercase tracking-widest text-[var(--color-brand-orange)] leading-tight">{intentMessage}</p>
              </motion.div>
            )}

            {/* Mode tabs */}
            <div className="flex bg-gray-100/50 p-1.5 rounded-[1.5rem] mb-8 border border-gray-100">
              {(["login", "register"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                    mode === m ? "bg-white shadow-xl text-black border border-gray-100" : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {m === "login" ? "Ingresar" : "Registrarse"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "register" && (
                <div className="relative group">
                  <User size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--color-brand-orange)] transition-colors" />
                  <input
                    type="text"
                    required
                    placeholder="Nombre completo"
                    className="w-full bg-white border-2 border-gray-50 rounded-2xl pl-12 pr-5 py-4 text-sm font-bold text-black outline-none focus:border-[var(--color-brand-orange)]/30 transition-all placeholder:text-gray-300"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              )}

              <div className="relative group">
                <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--color-brand-orange)] transition-colors" />
                <input
                  type="email"
                  required
                  placeholder="aliens@brooklyn.com"
                  className="w-full bg-white border-2 border-gray-50 rounded-2xl pl-12 pr-5 py-4 text-sm font-bold text-black outline-none focus:border-[var(--color-brand-orange)]/30 transition-all placeholder:text-gray-300"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              {mode === "register" && (
                <div className="relative group">
                  <Phone size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--color-brand-orange)] transition-colors" />
                  <input
                    type="tel"
                    placeholder="Teléfono (opcional)"
                    className="w-full bg-white border-2 border-gray-50 rounded-2xl pl-12 pr-5 py-4 text-sm font-bold text-black outline-none focus:border-[var(--color-brand-orange)]/30 transition-all placeholder:text-gray-300"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              )}

              <div className="relative group">
                <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--color-brand-orange)] transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Contraseña"
                  className="w-full bg-white border-2 border-gray-50 rounded-2xl pl-12 pr-12 py-4 text-sm font-bold text-black outline-none focus:border-[var(--color-brand-orange)]/30 transition-all placeholder:text-gray-300"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {mode === "register" && (
                <div className="relative group">
                  <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--color-brand-orange)] transition-colors" />
                  <input
                    type={showConfirm ? "text" : "password"}
                    required
                    placeholder="Repetir Contraseña"
                    className={`w-full bg-white border-2 rounded-2xl pl-12 pr-12 py-4 text-sm font-bold text-black outline-none transition-all placeholder:text-gray-300 ${
                      confirmPassword && confirmPassword !== formData.password
                        ? "border-red-100 bg-red-50/30"
                        : "border-gray-50 focus:border-[var(--color-brand-orange)]/30"
                    }`}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(v => !v)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              )}

              {error && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 text-[10px] font-black uppercase tracking-widest italic"
                >
                  <AlertCircle size={16} className="flex-shrink-0" />
                  <p>{error}</p>
                </motion.div>
              )}

              <button
                disabled={isLoading}
                type="submit"
                className="w-full bg-black hover:bg-[var(--color-brand-orange)] text-white py-5 rounded-[2rem] font-black italic text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_rgba(255,90,0,0.2)] disabled:opacity-30 mt-6 active:scale-95 group"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    {mode === "login" ? "Ingresar a VIP" : "Unirme a la Flota"}
                    <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 flex justify-center gap-6 text-[9px] text-gray-400 font-black uppercase tracking-[0.2em] opacity-40">
              <span>🔒 Cifrado</span>
              <span>🚀 Cero Spam</span>
              <span>🎁 Beneficios Squad</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

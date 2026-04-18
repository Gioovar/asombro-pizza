"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, Phone, ArrowRight, Loader2, AlertCircle, ShieldCheck } from "lucide-react";
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { setAuth } = useAuth();

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

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

      // Execute pending action (e.g. "add to cart", "open reservation")
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
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center sm:p-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 60, scale: 0.95 }}
          transition={{ type: "spring", damping: 28, stiffness: 280 }}
          className="bg-white w-full sm:max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl relative"
        >
          {/* Handle bar for mobile */}
          <div className="flex justify-center pt-4 sm:hidden">
            <div className="w-10 h-1 bg-gray-200 rounded-full" />
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X size={18} />
          </button>

          <div className="px-8 pb-8 pt-6">
            {/* Brand header */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-14 h-14 bg-[var(--color-brand-marble)] rounded-2xl flex items-center justify-center mb-3 shadow-inner">
                <Image src="/images/logo.svg" alt="Asombro" width={40} height={40} className="object-contain" />
              </div>
              <h2 className="text-2xl font-black font-poppins tracking-tighter italic text-center">
                {mode === "login" ? "¡Hola de nuevo!" : "Únete a la Familia"}
              </h2>
              <p className="text-gray-400 text-xs mt-1 text-center">
                {mode === "register" ? "Registro rápido • menos de 30 segundos" : "Accede a tus pedidos y reservas"}
              </p>
            </div>

            {/* Intent banner — shown when triggered by a protected action */}
            {intentMessage && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 bg-orange-50 border border-orange-200 rounded-2xl px-4 py-3 mb-5"
              >
                <ShieldCheck size={18} className="text-[var(--color-brand-orange)] flex-shrink-0 mt-0.5" />
                <p className="text-sm font-semibold text-orange-800">{intentMessage}</p>
              </motion.div>
            )}

            {/* Mode tabs */}
            <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
              {(["login", "register"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-black transition-all duration-200 ${
                    mode === m ? "bg-white shadow text-black" : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {m === "login" ? "Ingresar" : "Registrarse"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {mode === "register" && (
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="Nombre completo"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-11 pr-4 py-3.5 text-sm font-medium text-black focus:ring-2 focus:ring-[var(--color-brand-orange)] focus:border-transparent outline-none transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              )}

              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  placeholder="Correo electrónico"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-11 pr-4 py-3.5 text-sm font-medium text-black focus:ring-2 focus:ring-[var(--color-brand-orange)] focus:border-transparent outline-none transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              {mode === "register" && (
                <div className="relative">
                  <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    placeholder="Teléfono (opcional)"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-11 pr-4 py-3.5 text-sm font-medium text-black focus:ring-2 focus:ring-[var(--color-brand-orange)] focus:border-transparent outline-none transition-all"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              )}

              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  required
                  placeholder="Contraseña"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-11 pr-4 py-3.5 text-sm font-medium text-black focus:ring-2 focus:ring-[var(--color-brand-orange)] focus:border-transparent outline-none transition-all"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 p-3.5 rounded-2xl flex items-center gap-3 text-red-600 text-sm">
                  <AlertCircle size={16} className="flex-shrink-0" />
                  <p className="font-bold">{error}</p>
                </div>
              )}

              <button
                disabled={isLoading}
                type="submit"
                className="w-full bg-[var(--color-brand-orange)] hover:bg-[#e65100] text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-200 disabled:opacity-50 mt-2"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    {mode === "login" ? "Ingresar a mi cuenta" : "Crear cuenta gratis"}
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Benefits row */}
            <div className="mt-5 flex justify-center gap-6 text-[11px] text-gray-400 font-medium">
              <span>🔒 Datos seguros</span>
              <span>🚀 Sin spam</span>
              <span>🎁 Acceso a promos</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

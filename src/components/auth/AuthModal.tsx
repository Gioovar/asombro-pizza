"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, Phone, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "../../store/useAuth";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { setAuth } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Algo salió mal");
      }

      setAuth(data.user, data.token);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl relative"
        >
          {/* Close */}
          <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors">
            <X size={24} />
          </button>

          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black font-poppins tracking-tighter italic">
                {mode === "login" ? "¡Hola de nuevo!" : "Únete a la Familia"}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {mode === "login" ? "Ingresa para gestionar tus reservaciones" : "Crea tu cuenta y vive la experiencia Asombro"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "register" && (
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    required 
                    placeholder="Nombre Completo"
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-medium focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              )}

              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="email" 
                  required 
                  placeholder="Tu e-mail"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-medium focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              {mode === "register" && (
                <div className="relative">
                  <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="tel" 
                    placeholder="Teléfono (opcional)"
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-medium focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              )}

              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="password" 
                  required 
                  placeholder="Contraseña"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-medium focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 text-sm">
                  <AlertCircle size={18} />
                  <p className="font-bold">{error}</p>
                </div>
              )}

              <button 
                disabled={isLoading}
                type="submit" 
                className="w-full bg-black text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all shadow-xl shadow-black/10 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
                  <> {mode === "login" ? "Ingresar" : "Crear Cuenta"} <ArrowRight size={18} /> </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-gray-500">
              {mode === "login" ? (
                <p>¿No tienes cuenta? <button onClick={() => setMode("register")} className="text-indigo-600 font-bold hover:underline">Regístrate gratis</button></p>
              ) : (
                <p>¿Ya eres parte? <button onClick={() => setMode("login")} className="text-indigo-600 font-bold hover:underline">Inicia sesión</button></p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

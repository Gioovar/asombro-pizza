"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Mic, Sparkles, Bot, User, CheckCircle2, Zap } from "lucide-react";
import { useCartStore } from "../store/useCartStore";
import { useAuth } from "../store/useAuth";
import { useAuthGuardStore } from "../store/useAuthGuardStore";

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  isAudio?: boolean;
}

export function AiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: "init", sender: "bot", text: "¡Hey! Soy AsombroBot 🍕. Tu conserje personal de pizzas de masa madre. ¿Hambre de algo espectacular?"
  }]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const { addItem, toggleCart } = useCartStore();
  const { isAuthenticated } = useAuth();
  const { openModal } = useAuthGuardStore();
  
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  
  // Voice Recognition Web API
  const SpeechRecognition = typeof window !== 'undefined' ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition : null;
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "es-MX";
      
      rec.onresult = (event: any) => {
         const transcript = event.results[0][0].transcript;
         setInput(transcript);
         setIsListening(false);
         handleSend(transcript);
      };
      
      rec.onerror = () => setIsListening(false);
      rec.onend = () => setIsListening(false);
      recognitionRef.current = rec;
    }
  }, []);

  const toggleMic = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  const handleSend = async (overrideText?: string) => {
    const textToSend = overrideText || input;
    if (!textToSend.trim()) return;
    
    setInput("");
    const newMessages: ChatMessage[] = [...messages, { id: Date.now().toString(), sender: "user", text: textToSend }];
    setMessages(newMessages);
    setIsTyping(true);

    try {
      const response = await fetch("/api/bot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, userId: "browser" })
      });
      const data = await response.json();
      setIsTyping(false);
      const replyBody = data.reply || data.error || "Lo siento, mi conexión está un poco lenta. ¿Podrías intentar de nuevo?";
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: "bot", text: replyBody }]);
      
      // Auto-speech (premium feature)
      if ('speechSynthesis' in window && replyBody) {
         const utterance = new SpeechSynthesisUtterance(replyBody);
         utterance.lang = 'es-MX';
         window.speechSynthesis.speak(utterance);
      }

      // Handle Function Calling
      if (data.system_action) {
        const authed = isAuthenticated();
        if (data.system_action.type === "ADD_TO_CART") {
          const doAdd = () => data.system_action.items.forEach((item: any) => addItem(item, 1));
          if (authed) doAdd();
          else { setIsOpen(false); openModal(doAdd, "Inicia sesión para agregar productos a tu carrito."); }
        } else if (data.system_action.type === "OPEN_CHECKOUT") {
          if (authed) {
            setTimeout(() => { setIsOpen(false); toggleCart(); }, 2000);
          } else {
            setIsOpen(false);
            openModal(() => toggleCart(), "Inicia sesión para finalizar tu orden premium.");
          }
        } else if (data.system_action.type === "OPEN_EVENT_MODAL") {
          setTimeout(() => { setIsOpen(false); window.location.hash = "#events"; }, 1000);
        } else if (data.system_action.type === "OPEN_RESERVATION") {
          if (authed) {
            setTimeout(() => { setIsOpen(false); window.dispatchEvent(new CustomEvent("open-reservation")); }, 1000);
          } else {
            setIsOpen(false);
            openModal(
              () => window.dispatchEvent(new CustomEvent("open-reservation")),
              "Necesitas una cuenta para reservar en Asombro."
            );
          }
        }
      }
    } catch(e) {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Bot Launcher / Trigger */}
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-black rounded-full flex items-center justify-center text-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-50 border border-white/10 group overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-brand-orange)] to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        {isOpen ? <X size={28} className="relative z-10" /> : <MessageSquare size={28} className="relative z-10" />}
        {!isOpen && <span className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--color-brand-orange)] rounded-full border-2 border-black animate-pulse flex items-center justify-center text-[10px] font-black italic">1</span>}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9, filter: "blur(20px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 50, scale: 0.9, filter: "blur(20px)" }}
            className="fixed bottom-28 right-8 w-[380px] h-[640px] bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden z-50 border border-white/20"
          >
            {/* Header Glassmorphism */}
            <div className="bg-black/90 text-white p-7 flex items-center justify-between border-b border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-brand-orange)] rounded-full blur-[60px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="flex items-center gap-4 relative z-10">
                 <div className="w-12 h-12 bg-neutral-800 rounded-2xl flex items-center justify-center relative shadow-2xl border border-white/10">
                    <Zap size={24} className="text-[var(--color-brand-orange)]" fill="currentColor"/>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-4 border-black"></div>
                 </div>
                 <div>
                    <h3 className="font-black text-lg italic tracking-tighter leading-none font-poppins">AsombroBot 🤖</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-brand-orange)] mt-1 opacity-80">Concierge Inteligente</p>
                 </div>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-white/30">
               {messages.map((msg) => (
                 <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    key={msg.id} 
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                 >
                    <div className={`max-w-[85%] rounded-[1.8rem] px-5 py-4 shadow-[0_5px_15px_rgba(0,0,0,0.03)] border transition-all ${
                       msg.sender === "user" 
                       ? "bg-black text-white rounded-tr-none border-white/10" 
                       : "bg-white border-gray-100 text-gray-800 rounded-tl-none"
                    }`}>
                       <p className="text-[14px] font-medium leading-relaxed font-poppins">{msg.text}</p>
                       <div className={`flex items-center justify-end gap-1 mt-2 ${msg.sender === "user" ? "text-white/40" : "text-gray-300"}`}>
                          <span className="text-[9px] font-black uppercase tracking-widest italic">12:00 PM</span>
                          {msg.sender === "user" && <CheckCircle2 size={10} />}
                       </div>
                    </div>
                 </motion.div>
               ))}
               
               {isTyping && (
                  <div className="flex justify-start">
                     <div className="bg-white border border-gray-100 rounded-[1.5rem] rounded-tl-none px-5 py-4 flex gap-1.5 shadow-sm">
                        <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                        <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
                     </div>
                  </div>
               )}
               <div ref={endOfMessagesRef} />
            </div>

            {/* Suggestions Overlay */}
            {messages.length < 5 && (
               <div className="bg-white/50 backdrop-blur-md py-3 px-6 flex gap-3 overflow-x-auto hide-scrollbar border-t border-gray-50">
                  <button onClick={() => handleSend("¿Me puedes reservar una mesa?")} className="shrink-0 text-[10px] font-black italic uppercase tracking-widest text-black bg-white border border-gray-200 px-4 py-2.5 rounded-full hover:bg-black hover:text-white transition-all shadow-sm">🎟️ Reserva</button>
                  <button onClick={() => handleSend("¿Qué promociones hay hoy?")} className="shrink-0 text-[10px] font-black italic uppercase tracking-widest text-black bg-white border border-gray-200 px-4 py-2.5 rounded-full hover:bg-black hover:text-white transition-all shadow-sm">🔥 Promos</button>
                  <button onClick={() => handleSend("Muestra el menú")} className="shrink-0 text-[10px] font-black italic uppercase tracking-widest text-black bg-white border border-gray-200 px-4 py-2.5 rounded-full hover:bg-black hover:text-white transition-all shadow-sm">🍕 Menú</button>
               </div>
            )}

            {/* Input Form Premium */}
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="p-5 pb-8 bg-white border-t border-gray-100 flex items-center gap-3"
            >
              <button 
                type="button" 
                onClick={toggleMic}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
              >
                 <Mic size={20} />
              </button>
              
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isListening ? "Habla ahora..." : "Pregunta lo que quieras..."}
                  className="w-full bg-gray-50 rounded-2xl px-5 py-3.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-brand-orange)]/20 transition-all font-bold placeholder:text-gray-300"
                />
              </div>
              
              <button 
                type="submit" 
                disabled={!input.trim()}
                className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center disabled:opacity-30 hover:bg-[var(--color-brand-orange)] transition-all shadow-xl shadow-black/10 active:scale-90"
              >
                 <Send size={18} className="translate-x-[2px] translate-y-[-1px]" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

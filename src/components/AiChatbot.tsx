"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Mic, Sparkles, Bot, User, CheckCircle2 } from "lucide-react";
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
    id: "init", sender: "bot", text: "¡Hola! Soy AsombroBot 🍕🤖. ¿Tienes hambre? Puedo mostrarte el menú, ofertas o tomar tu pedido por vos."
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
         // Auto-send if desired, for now just populate input
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
      
      // Auto-speech
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
            openModal(() => toggleCart(), "Inicia sesión para continuar con tu pedido.");
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
              "Necesitas iniciar sesión para reservar una mesa."
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
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-[0_10px_30px_rgba(79,70,229,0.4)] hover:scale-110 transition-transform z-50 group"
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
        {!isOpen && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-28 right-6 w-[360px] h-[600px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden z-50 border border-gray-100"
          >
            {/* Header */}
            <div className="bg-indigo-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center relative shadow-inner">
                    <Sparkles size={18} className="text-indigo-100"/>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-indigo-600"></div>
                 </div>
                 <div>
                    <h3 className="font-bold text-sm tracking-wide">AsombroBot IA</h3>
                    <p className="text-xs text-indigo-300">Asistente Virtual en línea</p>
                 </div>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-gray-50 overflow-y-auto p-4 space-y-4">
               {messages.map((msg) => (
                 <motion.div 
                    initial={{ opacity: 0, x: msg.sender==='bot' ? -10 : 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={msg.id} 
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                 >
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                       msg.sender === "user" 
                       ? "bg-indigo-600 text-white rounded-tr-none" 
                       : "bg-white border border-gray-100 text-gray-800 rounded-tl-none relative"
                    }`}>
                       {msg.sender==='bot' && <span className="absolute -left-2 top-0 w-4 h-4 bg-white border-l border-t border-gray-100 transform -rotate-45"></span>}
                       <p className="text-sm font-medium leading-snug">{msg.text}</p>
                       <p className={`text-[10px] mt-1 text-right ${msg.sender === "user" ? "text-indigo-200" : "text-gray-400"}`}>
                          12:00 PM {msg.sender === "user" && <CheckCircle2 size={10} className="inline ml-1"/>}
                       </p>
                    </div>
                 </motion.div>
               ))}
               
               {isTyping && (
                  <div className="flex justify-start">
                     <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none px-4 py-3 flex gap-1 shadow-sm">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
                     </div>
                  </div>
               )}
               <div ref={endOfMessagesRef} />
            </div>

            {/* Suggestions */}
            {messages.length < 3 && (
               <div className="bg-white py-2 px-4 flex gap-2 overflow-x-auto hide-scrollbar">
                  <button onClick={() => handleSend("¿Me puedes reservar una mesa?")} className="shrink-0 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100 border border-indigo-100">🎟️ Reservar Mesa</button>
                  <button onClick={() => handleSend("¿Qué promociones hay hoy?")} className="shrink-0 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100 border border-indigo-100">🔥 Promociones</button>
                  <button onClick={() => handleSend("Quiero pedir una Hawaiana grande")} className="shrink-0 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100 border border-indigo-100">🍕 Pedir Hawaiana</button>
               </div>
            )}

            {/* Input Form */}
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="p-3 bg-white border-t border-gray-100 flex items-center gap-2"
            >
              <button 
                type="button" 
                onClick={toggleMic}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
              >
                 <Mic size={18} />
              </button>
              
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isListening ? "Escuchando..." : "Escribe un mensaje..."}
                className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
              />
              
              <button 
                type="submit" 
                disabled={!input.trim()}
                className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white disabled:opacity-50 hover:bg-indigo-700 hover:scale-105 transition-all shadow-md shadow-indigo-600/30"
              >
                 <Send size={16} className="ml-1" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

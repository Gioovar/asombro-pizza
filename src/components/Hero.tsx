"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { menuData as pizzasData, MenuItem } from "../data/menuData";
import Image from "next/image";
import { ShoppingCart, User as UserIcon } from "lucide-react";
import { useCartStore } from "../store/useCartStore";
import { ReservationModal } from "./ReservationModal";
import { AuthModal } from "./auth/AuthModal";
import { useAuth } from "../store/useAuth";
import { useAuthGuardStore } from "../store/useAuthGuardStore";
import Link from "next/link";
import { ProductOptionsSelector } from "./menu/ProductOptionsSelector";

// Register ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const pizzasRef = useRef<HTMLDivElement>(null);
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  
  const { isAuthenticated } = useAuth();
  const { addItem } = useCartStore();
  const { openModal } = useAuthGuardStore();
  const [selectingProduct, setSelectingProduct] = useState<MenuItem | null>(null);

  const handleReservar = () => {
    if (isAuthenticated()) {
      setIsReservationOpen(true);
    } else {
      openModal(() => setIsReservationOpen(true), "Para reservar tu mesa necesitas iniciar sesión.");
    }
  };

  const handleOrderPizza = (pizza: MenuItem) => {
    const doAdd = () => {
      if (pizza.config) setSelectingProduct(pizza);
      else addItem(pizza);
    };
    if (isAuthenticated()) {
      doAdd();
    } else {
      openModal(doAdd, "Inicia sesión para agregar productos a tu carrito.");
    }
  };

  useEffect(() => {
    const trigger = triggerRef.current;
    const pizzas = pizzasRef.current;

    if (!trigger || !pizzas) return;

    // We have 5 pizzas. We want to scroll horizontally by -80% (4 screens)
    const amountToScroll = 100 * (pizzasData.length - 1);

    const pin = gsap.to(pizzas, {
      x: `-${amountToScroll}vw`,
      ease: "none",
      scrollTrigger: {
        trigger: trigger,
        pin: true,
        scrub: 1, // Smooth scrubbing
        start: "top top",
        end: `+=${pizzasData.length * 1000}`, // Scroll length (5000px roughly)
        onUpdate: (self) => {
          // Calculate active index based on scroll progress
          const currentProgress = self.progress;
          const index = Math.round(currentProgress * (pizzasData.length - 1));
          setActiveIndex(index);
        }
      }
    });
    const handleOpenRes = () => setIsReservationOpen(true);
    window.addEventListener("open-reservation", handleOpenRes);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    return () => {
      pin.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
      window.removeEventListener("open-reservation", handleOpenRes);
    };
  }, []);

  const activePizza = pizzasData[activeIndex];

  return (
    <section ref={triggerRef} className="relative w-full overflow-hidden bg-[var(--color-brand-marble)]" style={{ height: "100vh" }}>
      
      {/* Background Parallax Floating Ingredients could go here */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-multiply transition-opacity duration-1000"></div>

      {/* STICKY UI LAYER (Text, Buttons, Indicator) */}
      <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-8 md:p-16 lg:px-24 py-12">
        
        {/* Header Area */}
        <header className="flex justify-center items-center w-full pointer-events-auto">
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="hidden md:flex items-center gap-2 font-medium text-sm text-gray-600 bg-white/40 backdrop-blur-xl border border-white/50 px-3 py-2 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.05)]"
          >
            <Image src="/images/logo.svg" alt="Asombro Pizza" width={110} height={36} priority className="mr-2" />
            <div className="w-px h-6 bg-gray-200 mx-1" />
            <a href="#menu" className="hover:text-black hover:bg-white/80 px-6 py-2 rounded-full transition-all duration-300">Menú</a>
            <a href="#promos" className="hover:text-[var(--color-brand-orange)] hover:bg-white/80 px-6 py-2 rounded-full transition-all duration-300 font-bold bg-white/60 shadow-sm">Promociones 🔥</a>
            <a href="#events" className="hover:text-[var(--color-purple-600)] text-purple-600 hover:bg-white/80 px-6 py-2 rounded-full transition-all duration-300 font-bold">Eventos 🎟️</a>
            <button
              onClick={handleReservar}
              className="hover:text-black hover:bg-white/80 px-6 py-2 rounded-full transition-all duration-300"
            >
              Reserva 🍽️
            </button>
            <a href="#nosotros" className="hover:text-black hover:bg-white/80 px-6 py-2 rounded-full transition-all duration-300">Nuestra Masa</a>
            
            {isAuthenticated() ? (
              <Link href="/account" className="flex items-center gap-2 bg-black text-white px-5 py-2 rounded-full hover:bg-indigo-600 transition-all font-bold shadow-lg">
                <UserIcon size={16} /> Mi Cuenta
              </Link>
            ) : (
              <button 
                onClick={() => setIsAuthOpen(true)}
                className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-full hover:bg-indigo-700 transition-all font-bold shadow-lg shadow-indigo-200"
              >
                <UserIcon size={16} /> Ingresar
              </button>
            )}
          </motion.nav>
        </header>

        {/* Dynamic Text Content */}
        <div className="flex flex-col md:flex-row justify-between items-end pb-8 w-full bg-gradient-to-t from-[var(--color-brand-marble)] via-[rgba(242,239,233,0.95)] to-transparent pt-32 md:pt-0 -mx-8 md:mx-0 px-8 md:px-0 md:bg-none pointer-events-none">
          <div className="max-w-lg relative z-30">
             <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -30, filter: "blur(8px)" }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  <p className="text-[var(--color-brand-orange)] font-bold tracking-widest text-sm uppercase mb-2">
                    {activePizza.shortDescription}
                  </p>
                  <h1 className="text-5xl md:text-7xl font-black font-poppins mb-4 tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-black to-gray-700">
                    {activePizza.name}
                  </h1>
                  <p className="text-gray-600 text-base md:text-lg mb-8 leading-relaxed line-clamp-3 md:line-clamp-none">
                    {activePizza.description}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4 md:gap-6 pointer-events-auto">
                    <span className="text-3xl font-bold font-poppins">${activePizza.price}</span>
                    <button
                      onClick={() => handleOrderPizza(activePizza)}
                      className="bg-black text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold hover:bg-[var(--color-brand-orange)] hover:scale-105 transition-all flex items-center gap-2 shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_10px_20px_rgba(255,90,0,0.3)]"
                    >
                      <ShoppingCart size={20} />
                      {activePizza.config ? "Elegir opciones" : "Ordenar ahora"}
                    </button>
                  </div>
                </motion.div>
             </AnimatePresence>
          </div>

          {/* Indicator ● ○ ○ ○ ○ */}
          <div className="hidden md:flex gap-3 mt-12 md:mt-0 pointer-events-auto">
            {pizzasData.map((_, i) => (
              <button 
                key={i}
                onClick={() => {
                  // In a real scenario, this would scrollTo the exact pixel of that index.
                  // For simplicity in this demo, just let users scroll.
                  window.scrollTo({
                    top: i * 1000,
                    behavior: "smooth"
                  })
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  i === activeIndex 
                  ? "bg-[var(--color-brand-orange)] scale-125" 
                  : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* HORIZONTAL ANIMATING CONTAINER */}
      <div 
        ref={containerRef} 
        className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible flex items-center"
      >
        <div ref={pizzasRef} className="flex h-full" style={{ width: `${pizzasData.length * 100}vw` }}>
          {pizzasData.map((pizza, idx) => {
            const isCenter = activeIndex === idx;
            return (
              <div 
                key={pizza.id} 
                className="relative w-[100vw] h-full flex items-start pt-[12vh] md:pt-0 md:items-center justify-center lg:justify-end lg:pr-[10vw]"
              >
                <motion.div
                  animate={{
                    scale: isCenter ? 1 : 0.6,
                    rotate: isCenter ? 0 : 45 * (idx - activeIndex),
                    opacity: isCenter ? 1 : 0.3
                  }}
                  transition={{ type: "spring", damping: 20, stiffness: 100 }}
                  className="relative w-[280px] h-[280px] md:w-[500px] md:h-[500px] lg:w-[700px] lg:h-[700px] 2xl:w-[800px] 2xl:h-[800px] z-10 lg:right-[-5vw] mix-blend-multiply"
                >
                  {/* Using object-contain and mix-blend-multiply to cut out the white bg generated by AI */}
                  <Image
                    src={pizza.image}
                    alt={pizza.name}
                    fill
                    priority={idx === 0}
                    className="object-contain transform perspective-[1000px] rotateX-12"
                  />
                  
                  {/* Fake shadow underneath */}
                  {isCenter && (
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-2/3 h-10 bg-black/20 blur-2xl rounded-full"></div>
                  )}
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      <ReservationModal 
        isOpen={isReservationOpen} 
        onClose={() => setIsReservationOpen(false)} 
      />

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
      />

      {selectingProduct && (
        <ProductOptionsSelector 
          product={selectingProduct}
          isOpen={!!selectingProduct}
          onClose={() => setSelectingProduct(null)}
        />
      )}
    </section>
  );
}

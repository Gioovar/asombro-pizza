import { Hero } from "@/components/Hero";
import { Menu } from "@/components/Menu";
import { FloatingCart } from "@/components/FloatingCart";
import { AiChatbot } from "@/components/AiChatbot";
import { CheckoutModal } from "@/components/CheckoutModal";
import { PromotionSlider } from "@/components/promos/PromotionSlider";
import { EventSlider } from "@/components/events/EventSlider";
import { AboutSection } from "@/components/AboutSection";
import Image from "next/image";
import { Camera, Globe, Share2, MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[var(--color-brand-marble)] text-black selection:bg-[var(--color-brand-orange)] selection:text-white">
      {/* 1. Interactive Pinned Hero */}
      <Hero />
      
      {/* 1.5 Promos Dynamic Banners */}
      <div id="promos" className="relative z-10 bg-[var(--color-brand-marble)] pt-12">
         <PromotionSlider />
      </div>

      {/* 1.8 Events Ticketing Carousel */}
      <EventSlider />
      
      {/* 2. Menu Listing */}
      <Menu />

      {/* 2.5 About Us Section */}
      <AboutSection />

      {/* 3. Global Floating UI */}
      <FloatingCart />
      <AiChatbot />
      <CheckoutModal />
      
      {/* Premium Footer Hub */}
      <footer className="bg-black text-white pt-24 pb-12 relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
            
            {/* Brand Identity */}
            <div className="space-y-8">
              <Image src="/images/logo.svg" alt="Asombro Pizza" width={180} height={60} className="brightness-0 invert h-auto" />
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs font-medium">
                Elevando el estándar de la pizza artesanal. Masa madre 72h, ingredientes de curaduría y el espíritu de Brooklyn en cada entrega.
              </p>
              <div className="flex gap-4">
                 {[Camera, Globe, Share2].map((Icon, i) => (
                    <a key={i} href="#" className="w-10 h-10 border border-white/10 rounded-xl flex items-center justify-center hover:bg-[var(--color-brand-orange)] hover:border-[var(--color-brand-orange)] transition-all group">
                       <Icon size={18} className="text-gray-400 group-hover:text-white" />
                    </a>
                 ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h4 className="font-black italic uppercase tracking-widest text-xs text-white">Navegación Squad</h4>
              <ul className="space-y-4 text-sm font-bold text-gray-500">
                <li><a href="#menu" className="hover:text-white transition-colors">Nuestro Menú</a></li>
                <li><a href="#promos" className="hover:text-white transition-colors">Promociones</a></li>
                <li><a href="#nosotros" className="hover:text-white transition-colors">Nuestra Masa</a></li>
                <li><a href="#events" className="hover:text-white transition-colors">Eventos VIP</a></li>
              </ul>
            </div>

            {/* Contact Hub */}
            <div className="space-y-6">
              <h4 className="font-black italic uppercase tracking-widest text-xs text-white">Ubicación & Contacto</h4>
              <ul className="space-y-4 text-sm font-bold text-gray-500">
                <li className="flex items-start gap-3">
                   <MapPin size={18} className="text-[var(--color-brand-orange)] shrink-0" />
                   <span>Av. Reforma 123, Ciudad de México <br/><span className="text-[10px] font-black uppercase text-gray-700">Flagship Store</span></span>
                </li>
                <li className="flex items-center gap-3">
                   <Phone size={18} className="text-[var(--color-brand-orange)] shrink-0" />
                   <span>+52 55 1234 5678</span>
                </li>
                <li className="flex items-center gap-3">
                   <Mail size={18} className="text-[var(--color-brand-orange)] shrink-0" />
                   <span>hello@asombropizza.com</span>
                </li>
              </ul>
            </div>

            {/* VIP Hours */}
            <div className="space-y-6">
              <h4 className="font-black italic uppercase tracking-widest text-xs text-white">Horarios Asombro</h4>
              <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 space-y-4">
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500 font-bold uppercase">Lun — Jue</span>
                    <span className="font-black italic">13:00 - 22:30</span>
                 </div>
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-[var(--color-brand-orange)] font-black uppercase">Vie — Sáb</span>
                    <span className="font-black italic">13:00 - 00:00</span>
                 </div>
                 <div className="flex justify-between items-center text-xs text-red-500/50">
                    <span className="font-bold uppercase">Domingo</span>
                    <span className="font-black italic uppercase">Squad Off</span>
                 </div>
              </div>
            </div>

          </div>

          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.2em]">
              © {new Date().getFullYear()} ASOMBRO PIZZA SQUAD. ALL RIGHTS RESERVED.
            </p>
            <div className="flex gap-8 text-gray-600 text-[9px] font-black uppercase tracking-widest">
               <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
               <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

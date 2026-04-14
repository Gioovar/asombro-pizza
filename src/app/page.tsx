import { Hero } from "@/components/Hero";
import { Menu } from "@/components/Menu";
import { FloatingCart } from "@/components/FloatingCart";
import { AiChatbot } from "@/components/AiChatbot";
import { CheckoutModal } from "@/components/CheckoutModal";
import { PromotionSlider } from "@/components/promos/PromotionSlider";
import { EventSlider } from "@/components/events/EventSlider";

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

      {/* 3. Global Floating UI */}
      <FloatingCart />
      <AiChatbot />
      <CheckoutModal />
      
      {/* Footer */}
      <footer className="bg-black text-white py-12 text-center mt-20 relative z-10 border-t border-gray-900">
        <p className="font-poppins font-black text-2xl tracking-tighter mb-4 text-[var(--color-brand-orange)]">
          ASOMBRO.
        </p>
        <p className="text-gray-400 text-sm">
          © {new Date().getFullYear()} Asombro Pizza. Todos los derechos reservados.
        </p>
      </footer>
    </main>
  );
}

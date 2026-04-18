import { Hero } from "@/components/Hero";
import { Menu } from "@/components/Menu";
import { FloatingCart } from "@/components/FloatingCart";
import { AiChatbot } from "@/components/AiChatbot";
import { CheckoutModal } from "@/components/CheckoutModal";
import { PromotionSlider } from "@/components/promos/PromotionSlider";
import { EventSlider } from "@/components/events/EventSlider";
import Image from "next/image";

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
        <div className="flex justify-center mb-4">
          <Image src="/images/logo.svg" alt="Asombro Pizza" width={160} height={52} className="brightness-0 invert" />
        </div>
        <p className="text-gray-400 text-sm">
          © {new Date().getFullYear()} Asombro Pizza. Todos los derechos reservados.
        </p>
      </footer>
    </main>
  );
}

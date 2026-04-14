import { BottomTabs } from "@/components/driver/BottomTabs";

export default function DriverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-black text-white overflow-hidden selection:bg-[var(--color-brand-orange)] selection:text-white font-sans sm:justify-center sm:bg-gray-900">
      {/* Mobile Constraints - Forces max width on desktop to simulate mobile */}
      <div className="w-full relative shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col sm:max-w-[400px] bg-black sm:h-[850px] sm:my-auto sm:rounded-[40px] sm:border-8 sm:border-gray-800 overflow-hidden sm:ring-4 sm:ring-gray-900 mx-auto">
        
        {/* Dynamic Island Faux (Only visible if viewing on desktop simulation) */}
        <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-gray-800 rounded-b-3xl z-50"></div>

        {/* Scrollable Page Viewport */}
        <main className="flex-1 overflow-auto bg-gray-50 text-black overscroll-y-none relative z-10 w-full h-full pb-20">
             {children}
        </main>
        
        <BottomTabs />
      </div>
    </div>
  );
}

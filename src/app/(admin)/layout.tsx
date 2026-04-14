import { Sidebar } from "@/components/admin/Sidebar";
import { Header } from "@/components/admin/Header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50/50 text-black overflow-hidden selection:bg-[var(--color-brand-orange)] selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        
        {/* Scrollable Page Viewport */}
        <main className="flex-1 overflow-auto p-6 md:p-8">
          <div className="max-w-[1600px] mx-auto w-full h-full">
             {children}
          </div>
        </main>
      </div>
    </div>
  );
}

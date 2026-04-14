"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../store/useAuth";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Calendar, Ticket, User, MapPin, CreditCard, LogOut, ChevronRight, QrCode, ShoppingBag } from "lucide-react";
import { QRCode } from "../../components/common/QRCode";

export default function AccountPage() {
  const { user, token, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"reservations" | "tickets" | "profile" | "orders">("reservations");

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setUserData(data.user);
        }
      } catch (err) {
        console.error("Error fetching user data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token, isAuthenticated, router]);

  if (loading) return (
    <div className="min-h-screen bg-[var(--color-brand-marble)] flex items-center justify-center">
       <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent animate-spin rounded-full"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--color-brand-marble)] pb-20 pt-32">
       <div className="max-w-6xl mx-auto px-6">
          
          <div className="flex flex-col md:flex-row gap-10">
             
             {/* Sidebar */}
             <aside className="w-full md:w-80">
                <div className="bg-white rounded-[2.5rem] p-8 border border-white/50 shadow-[0_10px_40px_rgba(0,0,0,0.03)] sticky top-32">
                   <div className="flex flex-col items-center text-center mb-8">
                      <div className="w-24 h-24 bg-gradient-to-tr from-indigo-600 to-purple-500 rounded-3xl flex items-center justify-center text-white text-3xl font-black mb-4 shadow-xl">
                         {userData?.name?.charAt(0)}
                      </div>
                      <h2 className="text-xl font-black font-poppins">{userData?.name}</h2>
                      <p className="text-gray-400 text-sm">{userData?.email}</p>
                   </div>

                   <div className="space-y-2">
                      <button 
                        onClick={() => setActiveTab("reservations")}
                        className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === "reservations" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "text-gray-500 hover:bg-gray-50"}`}
                      >
                         <Calendar size={18} /> Mis Mesas
                      </button>
                      <button 
                        onClick={() => setActiveTab("orders")}
                        className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === "orders" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "text-gray-500 hover:bg-gray-50"}`}
                      >
                         <ShoppingBag size={18} /> Historial Pedidos
                      </button>
                      <button 
                        onClick={() => setActiveTab("tickets")}
                        className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === "tickets" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "text-gray-500 hover:bg-gray-50"}`}
                      >
                         <Ticket size={18} /> Mis Boletos
                      </button>
                      <button 
                         onClick={logout}
                         className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-red-400 hover:bg-red-50 transition-all mt-8"
                      >
                         <LogOut size={18} /> Cerrar Sesión
                      </button>
                   </div>
                </div>
             </aside>

             {/* Main Content */}
             <main className="flex-1">
                <motion.div 
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                   {activeTab === "reservations" && (
                      <div className="space-y-6">
                         <h3 className="text-3xl font-black font-poppins">Mis Reservaciones</h3>
                         {userData?.reservations?.length === 0 ? (
                            <div className="bg-white/50 border-2 border-dashed border-gray-200 rounded-[2.5rem] p-12 text-center">
                               <p className="text-gray-400 font-bold">Aún no tienes mesas reservadas.</p>
                               <button onClick={() => router.push("/")} className="mt-4 text-indigo-600 font-bold">Reserva una ahora</button>
                            </div>
                         ) : (
                            <div className="grid grid-cols-1 gap-6">
                               {userData?.reservations?.map((res: any) => (
                                  <div key={res.id} className="bg-white rounded-[2.5rem] p-8 border border-white/50 shadow-sm flex flex-col lg:flex-row gap-8 items-center">
                                     <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-4">
                                           <span className="bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">CONFIRMADA</span>
                                           <span className="text-gray-300">•</span>
                                           <span className="text-gray-500 text-xs font-bold">ID: {res.id.slice(-8)}</span>
                                        </div>
                                        <h4 className="text-2xl font-black mb-2">Reserva de Mesa</h4>
                                        <div className="grid grid-cols-2 gap-4 text-sm font-bold">
                                           <div className="text-gray-500">Fecha: <span className="text-black">{new Date(res.date).toLocaleDateString()}</span></div>
                                           <div className="text-gray-500">Hora: <span className="text-black">{res.time}</span></div>
                                           <div className="text-gray-500">Personas: <span className="text-black">{res.partySize}</span></div>
                                        </div>
                                     </div>
                                     <div className="text-center">
                                        <QRCode data={`RES|${res.id}|${res.date}`} size={120} />
                                        <p className="text-[10px] font-black uppercase tracking-tighter text-gray-400 mt-2">Muestra este QR al llegar</p>
                                     </div>
                                  </div>
                               ))}
                            </div>
                         )}
                      </div>
                   )}

                   {activeTab === "orders" && (
                      <div className="space-y-6">
                         <h3 className="text-3xl font-black font-poppins">Mis Pedidos 🍕</h3>
                         {userData?.orders?.length === 0 ? (
                            <div className="bg-white/50 border-2 border-dashed border-gray-200 rounded-[2.5rem] p-12 text-center">
                               <p className="text-gray-400 font-bold">Aún no has pedido ninguna pizza.</p>
                               <button onClick={() => router.push("/#menu")} className="mt-4 text-indigo-600 font-bold">Ver el Menú</button>
                            </div>
                         ) : (
                            <div className="grid grid-cols-1 gap-4">
                               {userData?.orders?.map((order: any) => (
                                  <div key={order.id} className="bg-white rounded-3xl p-6 border border-white/50 shadow-sm">
                                     <div className="flex justify-between items-start mb-4">
                                        <div>
                                           <p className="text-[10px] font-black uppercase text-gray-400">Orden #{order.id.slice(-6)}</p>
                                           <p className="font-bold text-sm text-gray-600">{new Date(order.createdAt).toLocaleString()}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                           order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : 
                                           order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                                        }`}>
                                           {order.status}
                                        </span>
                                     </div>
                                     <div className="space-y-2 mb-4 border-t border-gray-50 pt-4">
                                        {order.items.map((item: any) => (
                                           <div key={item.id} className="flex justify-between text-sm">
                                              <span className="text-gray-500"><span className="font-bold text-black">{item.quantity}x</span> {item.product.name}</span>
                                              <span className="font-bold">${item.price * item.quantity}</span>
                                           </div>
                                        ))}
                                     </div>
                                     <div className="flex justify-between items-center border-t border-gray-50 pt-4 font-black">
                                        <span>Total</span>
                                        <span className="text-xl text-indigo-600">${order.total} MXN</span>
                                     </div>
                                  </div>
                               ))}
                            </div>
                         )}
                      </div>
                   )}

                   {activeTab === "tickets" && (
                      <div className="space-y-6">
                         <h3 className="text-3xl font-black font-poppins">Mis Boletos</h3>
                         {userData?.tickets?.length === 0 ? (
                            <div className="bg-white/50 border-2 border-dashed border-gray-200 rounded-[2.5rem] p-12 text-center">
                               <p className="text-gray-400 font-bold">No tienes boletos para eventos.</p>
                               <button onClick={() => router.push("/#events")} className="mt-4 text-indigo-600 font-bold">Ver próximos eventos</button>
                            </div>
                         ) : (
                            <div className="grid grid-cols-1 gap-6">
                               {userData?.tickets?.map((ticket: any) => (
                                  <div key={ticket.id} className="bg-white rounded-[2.5rem] p-8 border border-white/50 shadow-sm flex flex-col lg:flex-row gap-8 items-center overflow-hidden relative">
                                     {/* Side Decorative Ticket Cutout */}
                                     <div className="absolute left-[-15px] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[var(--color-brand-marble)] border border-white/50 shadow-inner"></div>
                                     
                                     <div className="flex-1 ml-4">
                                        <div className="flex items-center gap-2 mb-2">
                                           <span className="bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">{ticket.type}</span>
                                        </div>
                                        <h4 className="text-2xl font-black mb-1 italic">{ticket.event.title}</h4>
                                        <p className="text-gray-400 text-sm mb-4 font-medium">{new Date(ticket.event.date).toLocaleString()}</p>
                                        <div className="text-sm font-bold bg-indigo-50 p-3 rounded-xl inline-block text-indigo-700">
                                           Precio: ${ticket.price} MXN
                                        </div>
                                     </div>
                                     <div className="text-center">
                                        <QRCode data={`TICKET|${ticket.id}|${ticket.eventId}`} size={120} />
                                        <p className="text-[10px] font-black uppercase tracking-tighter text-gray-400 mt-2">Boleto Digital</p>
                                     </div>
                                  </div>
                               ))}
                            </div>
                         )}
                      </div>
                   )}
                </motion.div>
             </main>
          </div>
       </div>
    </div>
  );
}

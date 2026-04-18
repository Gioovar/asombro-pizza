"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../store/useAuth";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, Ticket, ShoppingBag, LogOut, Camera, MapPin, Plus,
  Trash2, Star, Check, X, Pencil, Lock, Phone, User as UserIcon,
  ChevronLeft, MessageCircle, Zap, ShieldCheck, CreditCard, Sparkles,
  ArrowRight
} from "lucide-react";
import { QRCode } from "../../components/common/QRCode";
import { AddressAutocomplete } from "../../components/common/AddressAutocomplete";

type Tab = "profile" | "reservations" | "orders" | "tickets";

const STATUS_LABEL: Record<string, string> = {
  NEW: "Received", PREPARING: "In Prep", READY: "Ready",
  ON_WAY: "On Way", DELIVERED: "Delivered", CANCELLED: "Cancelled",
};

const STATUS_COLOR: Record<string, string> = {
  NEW: "bg-black text-white border-white/10", 
  PREPARING: "bg-[var(--color-brand-orange)] text-white border-orange-400/20",
  READY: "bg-green-500 text-white border-green-400/20", 
  ON_WAY: "bg-blue-500 text-white border-blue-400/20",
  DELIVERED: "bg-neutral-800 text-gray-400 border-white/5", 
  CANCELLED: "bg-red-500 text-white border-red-400/20",
};

export default function AccountPage() {
  const { token, logout, isAuthenticated, setAuth, user: authUser } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  const [editName, setEditName] = useState(authUser?.name || "");
  const [editPhone, setEditPhone] = useState(authUser?.phone || "");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(authUser?.avatar || null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showPwForm, setShowPwForm] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [pwMsg, setPwMsg] = useState("");

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAlias, setNewAlias] = useState("Casa");
  const [newAddr, setNewAddr] = useState("");
  const [newLat, setNewLat] = useState<number | null>(null);
  const [newLng, setNewLng] = useState<number | null>(null);
  const [newRef, setNewRef] = useState("");
  const [savingAddr, setSavingAddr] = useState(false);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok) {
        setUserData(data.user);
        setEditName(data.user.name || "");
        setEditPhone(data.user.phone || "");
        setAvatarPreview(data.user.avatar || null);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated()) { router.push("/"); return; }
    fetchUser();
  }, [token]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    setProfileMsg("");
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: editName, phone: editPhone, avatar: avatarPreview }),
      });
      const data = await res.json();
      if (res.ok) {
        setAuth(data.user, token!);
        setUserData((prev: any) => ({ ...prev, ...data.user }));
        setProfileMsg("✓ VIP Credentials Updated");
      }
    } finally {
      setSavingProfile(false);
      setTimeout(() => setProfileMsg(""), 3000);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const res = await fetch(`/api/client/addresses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ isDefault: true }),
      });
      if (res.ok) fetchUser();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm("¿Deseas eliminar este Hub Operativo?")) return;
    try {
      const res = await fetch(`/api/client/addresses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchUser();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[var(--color-brand-marble)] flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-[var(--color-brand-orange)] border-t-transparent animate-spin rounded-full shadow-2xl" />
    </div>
  );

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: "profile",      label: "Intelligence",   icon: UserIcon },
    { id: "reservations", label: "Squad Tables",   icon: Calendar },
    { id: "orders",       label: "Mission Log", icon: ShoppingBag },
    { id: "tickets",      label: "Access Passes", icon: Ticket },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-brand-marble)] pb-24 pt-10 md:pt-40">
      
      {/* Background Decor */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-[var(--color-brand-orange)]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-black/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-8 md:px-12 relative z-10">
        
        <header className="mb-16 flex flex-col md:flex-row justify-between items-end gap-6">
           <div>
              <div className="flex items-center gap-2 mb-3">
                 <Zap size={14} className="text-[var(--color-brand-orange)] fill-[var(--color-brand-orange)]" />
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Authenticated Member</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black font-poppins italic tracking-tighter uppercase leading-none">
                 Squad <span className="text-[var(--color-brand-orange)]">HQ</span>
              </h1>
           </div>
           
           <div className="flex items-center gap-4 bg-white/80 backdrop-blur-xl p-2 pr-8 rounded-[2rem] border border-white/50 shadow-xl">
              <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center text-[var(--color-brand-orange)] shadow-2xl">
                 <ShieldCheck size={28} />
              </div>
              <div>
                 <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Membership Level</p>
                 <p className="text-lg font-black italic tracking-tighter uppercase">Asombro VIP Member</p>
              </div>
           </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-16">

          {/* Premium Dock Sidebar */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-black text-white rounded-[3.5rem] p-10 shadow-3xl sticky top-40 border border-white/10 overflow-hidden relative group">
              
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                 <Sparkles size={100} />
              </div>

              {/* Identity Hub */}
              <div className="flex flex-col items-center text-center mb-12 relative z-10">
                <div className="relative mb-6">
                  <div className="w-28 h-28 rounded-[2.5rem] overflow-hidden bg-neutral-900 border-2 border-[var(--color-brand-orange)]/50 p-1 group-hover:border-[var(--color-brand-orange)] transition-all">
                    {avatarPreview ? (
                       <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover rounded-[2rem]" />
                    ) : (
                       <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-white text-4xl font-black italic">
                          {userData?.name?.charAt(0).toUpperCase()}
                       </div>
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 w-10 h-10 bg-[var(--color-brand-orange)] text-white rounded-2xl flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all"
                  >
                    <Camera size={18} />
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </div>
                <div>
                   <h2 className="text-2xl font-black font-poppins italic tracking-tighter uppercase">{userData?.name}</h2>
                   <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-1 opacity-60">Verified Member Since {new Date(userData?.createdAt || Date.now()).getFullYear()}</p>
                </div>
              </div>

              {/* Dock Navigation */}
              <div className="space-y-3 relative z-10">
                {tabs.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all group/btn ${
                      activeTab === t.id
                        ? "bg-[var(--color-brand-orange)] text-white shadow-2xl shadow-orange-500/20"
                        : "text-white/40 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                       <t.icon size={16} /> {t.label}
                    </div>
                    <ChevronLeft size={14} className={`transition-transform ${activeTab === t.id ? 'rotate-180' : 'opacity-0 group-hover/btn:opacity-100 group-hover/btn:rotate-180'}`} />
                  </button>
                ))}
                
                <div className="pt-8 mt-8 border-t border-white/5">
                   <button
                    onClick={logout}
                    className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-red-500/60 hover:bg-red-500/10 hover:text-red-50 transition-all"
                  >
                    <LogOut size={16} /> Self-Destruct Session
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Content Engine */}
          <main className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-12"
              >

                {/* ── INTELLIGENCE (PROFILE) ── */}
                {activeTab === "profile" && (
                  <div className="space-y-10">
                    <div>
                       <h3 className="text-3xl font-black font-poppins italic tracking-tighter uppercase mb-2">Member Intelligence</h3>
                       <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Post-Purchase Encryption & Logistics</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       {/* Identity Card */}
                       <div className="bg-white rounded-[3.5rem] p-10 shadow-2xl border border-gray-100 relative group">
                          <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 mb-8 ml-2">Personal Credentials</label>
                          <div className="space-y-6">
                            <div className="space-y-2">
                               <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest ml-1">Full Name</p>
                               <input
                                 value={editName}
                                 onChange={e => setEditName(e.target.value)}
                                 className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-black italic tracking-tight focus:border-[var(--color-brand-orange)] outline-none transition-all"
                               />
                            </div>
                            <div className="space-y-2">
                               <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest ml-1">Secure Email</p>
                               <input
                                 value={userData?.email || ""}
                                 disabled
                                 className="w-full bg-gray-100 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-black italic tracking-tight text-gray-400 cursor-not-allowed"
                               />
                            </div>
                            <div className="space-y-2">
                               <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest ml-1">Squad Comms (Tel)</p>
                               <input
                                 value={editPhone}
                                 onChange={e => setEditPhone(e.target.value)}
                                 className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-black italic tracking-tight focus:border-[var(--color-brand-orange)] outline-none transition-all"
                               />
                            </div>
                            <button
                              onClick={handleSaveProfile}
                              disabled={savingProfile}
                              className="w-full bg-black text-white py-5 rounded-[1.5rem] font-black italic uppercase tracking-widest text-[10px] hover:bg-[var(--color-brand-orange)] transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 mt-4 group"
                            >
                               {savingProfile ? "Syncing..." : "Sync Credentials"}
                               <Check size={16} className="group-hover:scale-110 transition-transform" />
                            </button>
                            {profileMsg && <p className="text-center text-[10px] font-black text-green-600 uppercase tracking-widest animate-fade-in">{profileMsg}</p>}
                          </div>
                       </div>

                       {/* Logistics Wing */}
                       <div className="space-y-8">
                          <div className="bg-neutral-900 rounded-[3.5rem] p-10 text-white shadow-3xl border border-white/5 relative overflow-hidden h-full">
                             <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                                <MapPin size={120} />
                             </div>
                             <div className="relative z-10 flex flex-col h-full justify-between">
                                <div>
                                   <div className="flex justify-between items-center mb-10">
                                      <h4 className="font-black italic uppercase tracking-tighter text-xl">Operational Hubs</h4>
                                      <button onClick={() => setShowAddressForm(!showAddressForm)} className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-[var(--color-brand-orange)] transition-all border border-white/10">
                                         <Plus size={18} />
                                      </button>
                                   </div>
                                   
                                   <div className="space-y-4 max-h-[250px] overflow-y-auto custom-scrollbar pr-2">
                                      {userData?.addresses?.length === 0 ? (
                                        <p className="text-white/30 text-[10px] font-black uppercase tracking-widest text-center py-10">No hubs registered</p>
                                      ) : (
                                        userData?.addresses?.map((addr: any) => (
                                          <div key={addr.id} className={`p-5 rounded-2xl border transition-all ${addr.isDefault ? 'bg-white/10 border-[var(--color-brand-orange)]' : 'bg-white/5 border-white/5'}`}>
                                             <div className="flex justify-between items-start">
                                                <div>
                                                   <p className="font-black italic text-sm tracking-tight mb-1">{addr.alias}</p>
                                                   <p className="text-[10px] text-white/40 font-bold leading-tight break-all line-clamp-2">{addr.fullPath}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                   {!addr.isDefault && <button onClick={() => handleSetDefault(addr.id)} className="text-white/20 hover:text-[var(--color-brand-orange)] transition-colors"><Star size={14}/></button>}
                                                   <button onClick={() => handleDeleteAddress(addr.id)} className="text-white/20 hover:text-red-500 transition-colors"><Trash2 size={14}/></button>
                                                </div>
                                             </div>
                                          </div>
                                        ))
                                      )}
                                   </div>
                                </div>
                                
                                <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                                   <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center shadow-lg shadow-green-500/20">
                                         <Activity size={16} className="text-white" />
                                      </div>
                                      <p className="text-[9px] font-black uppercase text-white/40">Secure Delivery Active</p>
                                   </div>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>
                )}

                {/* ── SQUAD TABLES (RESERVATIONS) ── */}
                {activeTab === "reservations" && (
                  <div className="space-y-10">
                    <div>
                       <h3 className="text-3xl font-black font-poppins italic tracking-tighter uppercase mb-2">Hospitality Access</h3>
                       <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Real-World Dining Experiences & Masterclasses</p>
                    </div>

                    {!userData?.reservations?.length ? (
                      <EmptyState label="Request a table for the ultimate experience." cta="Book Strategic Table" onClick={() => router.push("/")} />
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {userData.reservations.map((res: any) => (
                          <div key={res.id} className="bg-white rounded-[4rem] p-10 shadow-2xl border border-gray-100 flex flex-col gap-10 relative group overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5 text-black">
                               <Calendar size={120} />
                            </div>
                            <div className="relative z-10 flex-1">
                               <div className="flex items-center gap-3 mb-6">
                                  <div className="bg-black text-white px-5 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest italic border border-white/10">SQUAD_VERIFIED</div>
                                  <span className="text-gray-300 font-extrabold text-[10px]">AUTH_{res.id.slice(-6).toUpperCase()}</span>
                               </div>
                               <h4 className="text-3xl font-black italic tracking-tighter uppercase mb-8">Executive Dining</h4>
                               <div className="grid grid-cols-1 gap-4">
                                  <div className="flex justify-between items-end border-b border-gray-50 pb-4">
                                     <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Strategic Date</span>
                                     <span className="font-black italic text-lg leading-none">{new Date(res.date).toLocaleDateString("en-US", { month: 'short', day: '2-digit', year: 'numeric' })}</span>
                                  </div>
                                  <div className="flex justify-between items-end border-b border-gray-50 pb-4">
                                     <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Arrival Window</span>
                                     <span className="font-black italic text-lg leading-none">{res.time} PST</span>
                                  </div>
                                  <div className="flex justify-between items-end">
                                     <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Asset Party Size</span>
                                     <span className="font-black italic text-lg leading-none">{res.partySize} PAX</span>
                                  </div>
                               </div>
                            </div>
                            <div className="relative z-10 flex flex-col items-center border-t border-gray-50 pt-10">
                               <QRCode data={`RES|${res.id}|${res.date}`} size={160} />
                               <p className="text-[9px] font-black uppercase tracking-widest text-gray-300 mt-6 text-center">Scan at Flagship Entrance for Biometric Validation</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ── MISSION LOG (ORDERS) ── */}
                {activeTab === "orders" && (
                  <div className="space-y-10">
                    <div>
                       <h3 className="text-3xl font-black font-poppins italic tracking-tighter uppercase mb-2">Mission Log</h3>
                       <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Post-Mission Delivery & Asset Tracking</p>
                    </div>

                    {!userData?.orders?.length ? (
                      <EmptyState label="No missions recorded. Start your gastronomical journey." cta="Initiate Mission" onClick={() => router.push("/#menu")} />
                    ) : (
                      <div className="space-y-10">
                        {userData.orders.map((order: any) => (
                          <div key={order.id} className="bg-white rounded-[4rem] p-12 shadow-2xl border border-gray-100 group transition-all hover:border-[var(--color-brand-orange)]/30">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                              <div>
                                <div className="flex items-center gap-3 mb-2">
                                   <div className={`px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${STATUS_COLOR[order.status]}`}>
                                      {STATUS_LABEL[order.status]}
                                   </div>
                                   <span className="text-xs font-black text-gray-300 italic">LOG_{order.id.slice(-8).toUpperCase()}</span>
                                </div>
                                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">{new Date(order.createdAt).toLocaleString("en-US", { month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</p>
                              </div>
                              <div className="text-right">
                                 <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Total Payload</p>
                                 <h3 className="font-black italic text-4xl tracking-tighter text-black">${order.total} <span className="text-xs not-italic text-gray-400">USD</span></h3>
                              </div>
                            </div>
                            
                            <div className="space-y-4 mb-12 p-8 bg-gray-50/50 rounded-[2.5rem] border border-gray-100">
                              {order.items.map((item: any) => (
                                <div key={item.id} className="flex justify-between items-center group/item">
                                  <div className="flex items-center gap-4">
                                     <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center font-black italic shadow-lg group-hover/item:scale-110 transition-transform">
                                        {item.quantity}
                                     </div>
                                     <span className="font-black italic uppercase tracking-tight text-lg text-gray-800">{item.product.name}</span>
                                  </div>
                                  <span className="font-black italic text-gray-400">${(item.price * item.quantity).toFixed(0)}</span>
                                </div>
                              ))}
                            </div>

                            <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-50">
                               <a
                                 href={`https://wa.me/525500000000?text=SQUAD_AUTH%20Mission%20Query%20%23${order.id.slice(-8).toUpperCase()}`}
                                 target="_blank"
                                 className="flex-1 min-w-[140px] flex items-center justify-center gap-3 bg-neutral-900 hover:bg-black text-white h-16 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all shadow-xl"
                               >
                                 <MessageCircle size={18} /> Direct Tactical Comms
                               </a>
                               <a
                                 href="tel:+525500000000"
                                 className="w-16 h-16 bg-[var(--color-brand-orange)] text-white flex items-center justify-center rounded-[1.5rem] hover:scale-105 transition-all shadow-xl shadow-orange-500/20"
                               >
                                 <Phone size={24} />
                               </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ── ACCESS PASSES (TICKETS) ── */}
                {activeTab === "tickets" && (
                  <div className="space-y-10">
                    <div>
                       <h3 className="text-3xl font-black font-poppins italic tracking-tighter uppercase mb-2">Access Passes</h3>
                       <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Vinyl Nights, Masterclasses & Underground Access</p>
                    </div>

                    {!userData?.tickets?.length ? (
                      <EmptyState label="No upcoming events secured." cta="Secure Spot" onClick={() => router.push("/#events")} />
                    ) : (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {userData.tickets.map((ticket: any) => (
                          <div key={ticket.id} className="bg-neutral-900 rounded-[4rem] p-10 text-white shadow-3xl flex flex-col items-center relative overflow-hidden group hover:scale-[1.02] transition-all border border-white/5">
                            {/* Cinematic Background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-brand-orange)]/10 to-transparent opacity-40" />
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-brand-orange)] blur-[80px] rounded-full opacity-20 -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute -left-10 top-20 w-1 h-32 bg-[var(--color-brand-orange)] opacity-50 blur-md" />
                            
                            <div className="relative z-10 w-full text-center border-b border-white/10 pb-10 mb-10">
                               <div className="inline-flex items-center gap-2 bg-[var(--color-brand-orange)] text-white px-5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest mb-8 animate-pulse">
                                  <Sparkles size={12} /> {ticket.type} ACCESS PASS
                               </div>
                               <h4 className="text-4xl font-black italic tracking-tighter uppercase mb-3 text-white leading-none whitespace-normal break-words">{ticket.event.title}</h4>
                               <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">{new Date(ticket.event.date).toLocaleString("en-US", { month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                            
                            <div className="relative z-10 flex flex-col items-center w-full">
                               <div className="bg-white p-6 rounded-[3rem] shadow-2xl transform group-hover:scale-110 transition-transform">
                                  <QRCode data={`TICKET|${ticket.id}|${ticket.eventId}`} size={140} />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mt-10">Scan for VIP Squad Validation</p>
                                <div className="mt-8 flex items-center gap-2 text-[var(--color-brand-orange)]">
                                   <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-orange)] shadow-[0_0_10px_rgba(255,90,0,1)] animate-pulse" />
                                   <span className="text-[9px] font-black uppercase tracking-widest">Authentic NFT-Grade Pass</span>
                                </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </main>

        </div>
      </div>
    </div>
  );
}

function EmptyState({ label, cta, onClick }: { label: string; cta: string; onClick: () => void }) {
  return (
    <div className="bg-white/40 backdrop-blur-sm border-4 border-dashed border-gray-100 rounded-[4rem] p-24 text-center group hover:border-[var(--color-brand-orange)]/20 transition-all">
      <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-gray-100 group-hover:scale-110 transition-transform">
         <Sparkles size={32} className="text-gray-300 group-hover:text-[var(--color-brand-orange)] transition-colors" />
      </div>
      <p className="text-gray-400 font-extrabold text-sm uppercase tracking-widest mb-6 leading-relaxed max-w-xs mx-auto">{label}</p>
      <button 
        onClick={onClick} 
        className="text-[var(--color-brand-orange)] font-black italic text-lg uppercase tracking-tighter hover:scale-105 active:scale-95 transition-all flex items-center gap-2 mx-auto"
      >
        {cta} <ArrowRight size={20} />
      </button>
    </div>
  );
}

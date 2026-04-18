"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../store/useAuth";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, Ticket, ShoppingBag, LogOut, Camera, MapPin, Plus,
  Trash2, Star, Check, X, Pencil, Lock, Phone, User as UserIcon,
  ChevronLeft, MessageCircle,
} from "lucide-react";
import { QRCode } from "../../components/common/QRCode";

type Tab = "profile" | "reservations" | "orders" | "tickets";

const STATUS_LABEL: Record<string, string> = {
  NEW: "Recibido", PREPARING: "Preparando", READY: "Listo",
  ON_WAY: "En camino", DELIVERED: "Entregado", CANCELLED: "Cancelado",
};
const STATUS_COLOR: Record<string, string> = {
  NEW: "bg-yellow-100 text-yellow-700", PREPARING: "bg-orange-100 text-orange-700",
  READY: "bg-blue-100 text-blue-700", ON_WAY: "bg-indigo-100 text-indigo-700",
  DELIVERED: "bg-green-100 text-green-700", CANCELLED: "bg-red-100 text-red-700",
};

export default function AccountPage() {
  const { token, logout, isAuthenticated, setAuth } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  // Profile edit state
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Password change
  const [showPwForm, setShowPwForm] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [pwMsg, setPwMsg] = useState("");

  // Address
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAlias, setNewAlias] = useState("Casa");
  const [newAddr, setNewAddr] = useState("");
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

  // Avatar file → base64
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
        setProfileMsg("✓ Perfil actualizado");
      } else {
        setProfileMsg(data.error || "Error al guardar");
      }
    } finally {
      setSavingProfile(false);
      setTimeout(() => setProfileMsg(""), 3000);
    }
  };

  const handleChangePassword = async () => {
    setPwMsg("");
    const res = await fetch("/api/auth/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
    });
    const data = await res.json();
    if (res.ok) {
      setPwMsg("✓ Contraseña actualizada");
      setCurrentPw(""); setNewPw(""); setShowPwForm(false);
    } else {
      setPwMsg(data.error || "Error");
    }
    setTimeout(() => setPwMsg(""), 3000);
  };

  const handleAddAddress = async () => {
    if (!newAddr.trim()) return;
    setSavingAddr(true);
    const isFirst = (userData?.addresses?.length ?? 0) === 0;
    const res = await fetch("/api/client/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ alias: newAlias, fullPath: newAddr, ref: newRef, isDefault: isFirst }),
    });
    if (res.ok) {
      setNewAlias("Casa"); setNewAddr(""); setNewRef("");
      setShowAddressForm(false);
      fetchUser();
    }
    setSavingAddr(false);
  };

  const handleDeleteAddress = async (id: string) => {
    await fetch(`/api/client/addresses/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    fetchUser();
  };

  const handleSetDefault = async (id: string) => {
    await fetch(`/api/client/addresses/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ isDefault: true }),
    });
    fetchUser();
  };

  if (loading) return (
    <div className="min-h-screen bg-[var(--color-brand-marble)] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-[var(--color-brand-orange)] border-t-transparent animate-spin rounded-full" />
    </div>
  );

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "profile",      label: "Mi Perfil",   icon: <UserIcon size={18} /> },
    { id: "reservations", label: "Mis Mesas",   icon: <Calendar size={18} /> },
    { id: "orders",       label: "Mis Pedidos", icon: <ShoppingBag size={18} /> },
    { id: "tickets",      label: "Mis Boletos", icon: <Ticket size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-brand-marble)] pb-20 pt-10 md:pt-32">
      {/* Mobile back button */}
      <div className="md:hidden flex items-center gap-3 px-4 mb-4">
        <button onClick={() => router.push("/")} className="flex items-center gap-2 text-gray-600 font-bold text-sm">
          <ChevronLeft size={20} /> Inicio
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row gap-8">

          {/* Sidebar */}
          <aside className="w-full md:w-72 flex-shrink-0">
            <div className="bg-white rounded-[2.5rem] p-6 shadow-sm sticky top-32">
              {/* Avatar */}
              <div className="flex flex-col items-center text-center mb-6">
                <div className="relative mb-3">
                  <div className="w-24 h-24 rounded-3xl overflow-hidden bg-gradient-to-tr from-[var(--color-brand-orange)] to-amber-400 flex items-center justify-center text-white text-3xl font-black shadow-lg">
                    {avatarPreview
                      ? <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                      : <span>{userData?.name?.charAt(0)?.toUpperCase()}</span>
                    }
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[var(--color-brand-orange)] transition-colors"
                  >
                    <Camera size={14} />
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </div>
                <h2 className="text-lg font-black font-poppins">{userData?.name}</h2>
                <p className="text-gray-400 text-xs">{userData?.email}</p>
              </div>

              {/* Nav tabs */}
              <div className="space-y-1">
                {tabs.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl font-bold text-sm transition-all ${
                      activeTab === t.id
                        ? "bg-[var(--color-brand-orange)] text-white shadow-lg shadow-orange-200"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {t.icon} {t.label}
                  </button>
                ))}
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl font-bold text-sm text-red-400 hover:bg-red-50 transition-all mt-4"
                >
                  <LogOut size={18} /> Cerrar Sesión
                </button>
              </div>
            </div>
          </aside>

          {/* Main */}
          <main className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >

                {/* ── PERFIL ── */}
                {activeTab === "profile" && (
                  <div className="space-y-5">
                    <h3 className="text-2xl font-black font-poppins">Mi Perfil</h3>

                    {/* Personal data card */}
                    <div className="bg-white rounded-[2rem] p-6 shadow-sm">
                      <h4 className="font-black text-sm uppercase tracking-widest text-gray-400 mb-5 flex items-center gap-2">
                        <UserIcon size={14} /> Datos Personales
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs font-bold text-gray-400 mb-1 block">Nombre completo</label>
                          <input
                            value={editName}
                            onChange={e => setEditName(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-[var(--color-brand-orange)] focus:border-transparent outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-400 mb-1 block">Email</label>
                          <input
                            value={userData?.email || ""}
                            disabled
                            className="w-full bg-gray-100 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-medium text-gray-400 cursor-not-allowed"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-400 mb-1 block flex items-center gap-1">
                            <Phone size={11} /> Teléfono
                          </label>
                          <input
                            value={editPhone}
                            onChange={e => setEditPhone(e.target.value)}
                            placeholder="55 1234 5678"
                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-[var(--color-brand-orange)] focus:border-transparent outline-none"
                          />
                        </div>

                        {/* Avatar preview + change */}
                        <div>
                          <label className="text-xs font-bold text-gray-400 mb-2 block flex items-center gap-1">
                            <Camera size={11} /> Foto de perfil
                          </label>
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                              {avatarPreview
                                ? <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                                : <div className="w-full h-full bg-gradient-to-tr from-[var(--color-brand-orange)] to-amber-400 flex items-center justify-center text-white font-black text-lg">{userData?.name?.charAt(0)}</div>
                              }
                            </div>
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              className="text-sm font-bold text-[var(--color-brand-orange)] border border-orange-200 px-4 py-2 rounded-xl hover:bg-orange-50 transition-colors"
                            >
                              Cambiar foto
                            </button>
                            {avatarPreview && userData?.avatar !== avatarPreview && (
                              <button onClick={() => setAvatarPreview(userData?.avatar || null)} className="text-xs text-gray-400 hover:text-gray-600">
                                <X size={16} />
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                          <button
                            onClick={handleSaveProfile}
                            disabled={savingProfile}
                            className="bg-[var(--color-brand-orange)] text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-[#e65100] transition-colors disabled:opacity-50 flex items-center gap-2"
                          >
                            {savingProfile ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Check size={16} />}
                            Guardar cambios
                          </button>
                          {profileMsg && (
                            <span className={`text-sm font-bold ${profileMsg.startsWith("✓") ? "text-green-600" : "text-red-500"}`}>
                              {profileMsg}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Password card */}
                    <div className="bg-white rounded-[2rem] p-6 shadow-sm">
                      <div className="flex items-center justify-between">
                        <h4 className="font-black text-sm uppercase tracking-widest text-gray-400 flex items-center gap-2">
                          <Lock size={14} /> Contraseña
                        </h4>
                        <button
                          onClick={() => setShowPwForm(v => !v)}
                          className="text-sm font-bold text-[var(--color-brand-orange)] flex items-center gap-1"
                        >
                          <Pencil size={13} /> Cambiar
                        </button>
                      </div>
                      <AnimatePresence>
                        {showPwForm && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="space-y-3 mt-4">
                              <input
                                type="password" placeholder="Contraseña actual"
                                value={currentPw} onChange={e => setCurrentPw(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-[var(--color-brand-orange)] outline-none"
                              />
                              <input
                                type="password" placeholder="Nueva contraseña"
                                value={newPw} onChange={e => setNewPw(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-[var(--color-brand-orange)] outline-none"
                              />
                              <div className="flex gap-3 items-center">
                                <button
                                  onClick={handleChangePassword}
                                  disabled={!currentPw || !newPw}
                                  className="bg-black text-white px-5 py-2.5 rounded-xl font-black text-sm disabled:opacity-40"
                                >
                                  Actualizar
                                </button>
                                {pwMsg && <span className={`text-sm font-bold ${pwMsg.startsWith("✓") ? "text-green-600" : "text-red-500"}`}>{pwMsg}</span>}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Addresses card */}
                    <div className="bg-white rounded-[2rem] p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-5">
                        <h4 className="font-black text-sm uppercase tracking-widest text-gray-400 flex items-center gap-2">
                          <MapPin size={14} /> Direcciones de Entrega
                        </h4>
                        <button
                          onClick={() => setShowAddressForm(v => !v)}
                          className="text-sm font-bold text-[var(--color-brand-orange)] flex items-center gap-1"
                        >
                          <Plus size={14} /> Agregar
                        </button>
                      </div>

                      {/* Add address form */}
                      <AnimatePresence>
                        {showAddressForm && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden mb-4"
                          >
                            <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                              <div className="flex gap-2">
                                {["Casa", "Trabajo", "Otro"].map(a => (
                                  <button
                                    key={a}
                                    onClick={() => setNewAlias(a)}
                                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${newAlias === a ? "bg-black text-white" : "bg-white border border-gray-200 text-gray-500"}`}
                                  >
                                    {a}
                                  </button>
                                ))}
                              </div>
                              <input
                                placeholder="Calle, número, colonia, ciudad"
                                value={newAddr}
                                onChange={e => setNewAddr(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[var(--color-brand-orange)] outline-none"
                              />
                              <input
                                placeholder="Referencias (entre qué calles, color de fachada...)"
                                value={newRef}
                                onChange={e => setNewRef(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[var(--color-brand-orange)] outline-none"
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={handleAddAddress}
                                  disabled={savingAddr || !newAddr.trim()}
                                  className="bg-[var(--color-brand-orange)] text-white px-5 py-2.5 rounded-xl font-black text-sm disabled:opacity-40 flex items-center gap-2"
                                >
                                  {savingAddr ? <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Check size={14} />}
                                  Guardar
                                </button>
                                <button onClick={() => setShowAddressForm(false)} className="px-4 py-2.5 rounded-xl text-sm font-bold text-gray-400 hover:text-gray-600">
                                  Cancelar
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Address list */}
                      {userData?.addresses?.length === 0 ? (
                        <p className="text-sm text-gray-400 font-medium py-4 text-center">
                          Aún no tienes direcciones guardadas.
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {userData?.addresses?.map((addr: any) => (
                            <div key={addr.id} className={`flex items-start gap-3 p-4 rounded-2xl border-2 transition-all ${addr.isDefault ? "border-[var(--color-brand-orange)] bg-orange-50" : "border-gray-100"}`}>
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${addr.isDefault ? "bg-[var(--color-brand-orange)] text-white" : "bg-gray-100 text-gray-500"}`}>
                                <MapPin size={16} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <p className="font-black text-sm">{addr.alias}</p>
                                  {addr.isDefault && <span className="text-[10px] bg-[var(--color-brand-orange)] text-white px-2 py-0.5 rounded-full font-bold">Principal</span>}
                                </div>
                                <p className="text-xs text-gray-500 leading-relaxed truncate">{addr.fullPath}</p>
                                {addr.ref && <p className="text-xs text-gray-400 mt-0.5">{addr.ref}</p>}
                              </div>
                              <div className="flex gap-1 flex-shrink-0">
                                {!addr.isDefault && (
                                  <button onClick={() => handleSetDefault(addr.id)} title="Establecer como principal" className="w-7 h-7 rounded-lg hover:bg-orange-100 text-gray-400 hover:text-[var(--color-brand-orange)] flex items-center justify-center transition-colors">
                                    <Star size={13} />
                                  </button>
                                )}
                                <button onClick={() => handleDeleteAddress(addr.id)} className="w-7 h-7 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-400 flex items-center justify-center transition-colors">
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ── RESERVACIONES ── */}
                {activeTab === "reservations" && (
                  <div className="space-y-5">
                    <h3 className="text-2xl font-black font-poppins">Mis Reservaciones</h3>
                    {!userData?.reservations?.length ? (
                      <EmptyState label="Aún no tienes mesas reservadas." cta="Reservar mesa" onClick={() => router.push("/")} />
                    ) : (
                      <div className="space-y-4">
                        {userData.reservations.map((res: any) => (
                          <div key={res.id} className="bg-white rounded-[2rem] p-6 shadow-sm flex flex-col lg:flex-row gap-6 items-center">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-3">
                                <span className="bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">CONFIRMADA</span>
                                <span className="text-gray-300 text-xs">#{res.id.slice(-8)}</span>
                              </div>
                              <h4 className="text-xl font-black mb-3">Reserva de Mesa</h4>
                              <div className="grid grid-cols-3 gap-3 text-sm">
                                <div className="bg-gray-50 rounded-xl p-3"><p className="text-[10px] font-black text-gray-400 uppercase mb-1">Fecha</p><p className="font-bold">{new Date(res.date).toLocaleDateString("es-MX")}</p></div>
                                <div className="bg-gray-50 rounded-xl p-3"><p className="text-[10px] font-black text-gray-400 uppercase mb-1">Hora</p><p className="font-bold">{res.time}</p></div>
                                <div className="bg-gray-50 rounded-xl p-3"><p className="text-[10px] font-black text-gray-400 uppercase mb-1">Personas</p><p className="font-bold">{res.partySize}</p></div>
                              </div>
                            </div>
                            <div className="text-center">
                              <QRCode data={`RES|${res.id}|${res.date}`} size={110} />
                              <p className="text-[10px] font-black uppercase tracking-tighter text-gray-400 mt-2">Muestra este QR al llegar</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ── PEDIDOS ── */}
                {activeTab === "orders" && (
                  <div className="space-y-5">
                    <h3 className="text-2xl font-black font-poppins">Mis Pedidos</h3>
                    {!userData?.orders?.length ? (
                      <EmptyState label="Aún no has hecho ningún pedido." cta="Ver el menú" onClick={() => router.push("/#menu")} />
                    ) : (
                      <div className="space-y-4">
                        {userData.orders.map((order: any) => (
                          <div key={order.id} className="bg-white rounded-[2rem] p-6 shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <p className="text-[10px] font-black uppercase text-gray-400">Orden #{order.id.slice(-6).toUpperCase()}</p>
                                <p className="text-sm text-gray-500 font-medium mt-0.5">{new Date(order.createdAt).toLocaleString("es-MX")}</p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${STATUS_COLOR[order.status] || "bg-gray-100 text-gray-600"}`}>
                                {STATUS_LABEL[order.status] || order.status}
                              </span>
                            </div>
                            <div className="space-y-2 pb-4 border-b border-gray-50">
                              {order.items.map((item: any) => (
                                <div key={item.id} className="flex justify-between text-sm">
                                  <span className="text-gray-500"><span className="font-bold text-black">{item.quantity}×</span> {item.product.name}</span>
                                  <span className="font-bold">${(item.price * item.quantity).toFixed(0)}</span>
                                </div>
                              ))}
                            </div>
                            <div className="flex justify-between items-center pt-4">
                              <span className="font-black text-xl text-[var(--color-brand-orange)]">${order.total} MXN</span>
                              <div className="flex gap-2">
                                <a
                                  href={`https://wa.me/525500000000?text=Hola,%20tengo%20una%20pregunta%20sobre%20mi%20pedido%20%23${order.id.slice(-6).toUpperCase()}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1.5 bg-green-100 hover:bg-green-200 text-green-700 px-3 py-2 rounded-xl text-xs font-black transition-colors"
                                >
                                  <MessageCircle size={13} /> WhatsApp
                                </a>
                                <a
                                  href="tel:+525500000000"
                                  className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-xl text-xs font-black transition-colors"
                                >
                                  <Phone size={13} /> Llamar
                                </a>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ── BOLETOS ── */}
                {activeTab === "tickets" && (
                  <div className="space-y-5">
                    <h3 className="text-2xl font-black font-poppins">Mis Boletos</h3>
                    {!userData?.tickets?.length ? (
                      <EmptyState label="No tienes boletos para eventos." cta="Ver próximos eventos" onClick={() => router.push("/#events")} />
                    ) : (
                      <div className="space-y-4">
                        {userData.tickets.map((ticket: any) => (
                          <div key={ticket.id} className="bg-white rounded-[2rem] p-6 shadow-sm flex flex-col lg:flex-row gap-6 items-center relative overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[var(--color-brand-orange)]" />
                            <div className="flex-1 pl-3">
                              <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${ticket.type === "VIP" ? "bg-purple-100 text-purple-700" : "bg-indigo-100 text-indigo-700"}`}>
                                {ticket.type}
                              </span>
                              <h4 className="text-xl font-black mt-2 mb-1 italic">{ticket.event.title}</h4>
                              <p className="text-gray-400 text-sm font-medium">{new Date(ticket.event.date).toLocaleString("es-MX")}</p>
                              <p className="text-[var(--color-brand-orange)] font-black text-lg mt-2">${ticket.price} MXN</p>
                            </div>
                            <div className="text-center">
                              <QRCode data={`TICKET|${ticket.id}|${ticket.eventId}`} size={110} />
                              <p className="text-[10px] font-black uppercase tracking-tighter text-gray-400 mt-2">Boleto Digital</p>
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
    <div className="bg-white/60 border-2 border-dashed border-gray-200 rounded-[2rem] p-12 text-center">
      <p className="text-gray-400 font-bold mb-3">{label}</p>
      <button onClick={onClick} className="text-[var(--color-brand-orange)] font-black text-sm hover:underline">{cta} →</button>
    </div>
  );
}

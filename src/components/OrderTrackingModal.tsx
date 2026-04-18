"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, ChefHat, Bike, PackageCheck, Clock, MapPin } from "lucide-react";
import { useAuth } from "../store/useAuth";

interface OrderTrackingModalProps {
  orderId: string;
  onClose: () => void;
}

type OrderStatus = "NEW" | "PREPARING" | "READY" | "ON_WAY" | "DELIVERED" | "CANCELLED";

interface TrackingOrder {
  id: string;
  status: OrderStatus;
  total: number;
  tip: number;
  driverLat: number | null;
  driverLng: number | null;
  driver: { name: string; phone: string } | null;
  createdAt: string;
  items: { quantity: number; price: number; product: { name: string } }[];
}

const STEPS: { status: OrderStatus; label: string; sublabel: string; icon: React.ReactNode }[] = [
  {
    status: "NEW",
    label: "Pedido recibido",
    sublabel: "El restaurante confirmó tu orden",
    icon: <PackageCheck size={20} />,
  },
  {
    status: "PREPARING",
    label: "Preparando tu pedido",
    sublabel: "Nuestros cocineros están en ello",
    icon: <ChefHat size={20} />,
  },
  {
    status: "ON_WAY",
    label: "En camino",
    sublabel: "Tu repartidor ya va hacia ti",
    icon: <Bike size={20} />,
  },
  {
    status: "DELIVERED",
    label: "¡Entregado!",
    sublabel: "Disfruta tu pedido 🍕",
    icon: <CheckCircle2 size={20} />,
  },
];

const STATUS_ORDER: OrderStatus[] = ["NEW", "PREPARING", "READY", "ON_WAY", "DELIVERED"];

function getStepIndex(status: OrderStatus): number {
  // READY maps to the same visual step as PREPARING (waiting for driver)
  if (status === "READY") return 1;
  const map: Record<OrderStatus, number> = {
    NEW: 0,
    PREPARING: 1,
    READY: 1,
    ON_WAY: 2,
    DELIVERED: 3,
    CANCELLED: -1,
  };
  return map[status] ?? 0;
}

const ETA: Record<OrderStatus, string> = {
  NEW: "~35 min",
  PREPARING: "~25 min",
  READY: "~15 min",
  ON_WAY: "~10 min",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
};

export function OrderTrackingModal({ orderId, onClose }: OrderTrackingModalProps) {
  const { token } = useAuth();
  const [order, setOrder] = useState<TrackingOrder | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`/api/client/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.order) setOrder(data.order);
    } finally {
      setLoading(false);
    }
  }, [orderId, token]);

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 5000);
    return () => clearInterval(interval);
  }, [fetchOrder]);

  const currentStep = order ? getStepIndex(order.status) : 0;
  const isOnWay = order?.status === "ON_WAY" || order?.status === "DELIVERED";
  const isDelivered = order?.status === "DELIVERED";

  return (
    <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center sm:p-4 bg-black/70 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 80 }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        className="bg-white w-full sm:max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-black font-poppins">Tu Pedido</h2>
            <p className="text-xs text-gray-400 font-mono">#{orderId.slice(-8).toUpperCase()}</p>
          </div>
          <div className="flex items-center gap-3">
            {order && (
              <div className="flex items-center gap-1.5 bg-orange-50 text-[var(--color-brand-orange)] px-3 py-1.5 rounded-full">
                <Clock size={13} />
                <span className="text-xs font-black">{ETA[order.status]}</span>
              </div>
            )}
            {isDelivered && (
              <button onClick={onClose} className="w-9 h-9 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        <div className="overflow-y-auto flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-4 border-[var(--color-brand-orange)] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : order ? (
            <>
              {/* Map — shown when driver is on the way */}
              <AnimatePresence>
                {isOnWay && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 180, opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden relative"
                  >
                    {order.driverLat && order.driverLng ? (
                      <iframe
                        key={`${order.driverLat?.toFixed(4)},${order.driverLng?.toFixed(4)}`}
                        width="100%"
                        height="180"
                        src={`https://maps.google.com/maps?q=${order.driverLat},${order.driverLng}&z=16&output=embed`}
                        style={{ border: 0 }}
                        className="grayscale-[30%]"
                      />
                    ) : (
                      <div className="w-full h-[180px] bg-gray-100 flex flex-col items-center justify-center gap-2">
                        <Bike size={32} className="text-[var(--color-brand-orange)] animate-bounce" />
                        <p className="text-xs text-gray-500 font-bold">Conectando con el repartidor...</p>
                      </div>
                    )}
                    {/* Driver badge overlay */}
                    {order.driver && (
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="bg-black/80 backdrop-blur-sm text-white px-4 py-2.5 rounded-2xl flex items-center gap-3">
                          <div className="w-8 h-8 bg-[var(--color-brand-orange)] rounded-full flex items-center justify-center font-black text-sm flex-shrink-0">
                            {order.driver.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm truncate">{order.driver.name}</p>
                            <p className="text-[10px] text-gray-400">Tu repartidor</p>
                          </div>
                          <MapPin size={16} className="text-[var(--color-brand-orange)] flex-shrink-0 animate-bounce" />
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Timeline */}
              <div className="px-6 py-6">
                <div className="space-y-0">
                  {STEPS.map((step, idx) => {
                    const isDone = idx < currentStep;
                    const isActive = idx === currentStep;
                    const isPending = idx > currentStep;
                    const isLast = idx === STEPS.length - 1;

                    return (
                      <div key={step.status} className="flex gap-4">
                        {/* Line + dot column */}
                        <div className="flex flex-col items-center">
                          <motion.div
                            initial={false}
                            animate={{
                              backgroundColor: isDone || isActive ? "#FF5A00" : "#E5E7EB",
                              scale: isActive ? 1.15 : 1,
                            }}
                            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"
                          >
                            <span className={isDone || isActive ? "text-white" : "text-gray-400"}>
                              {isDone ? <CheckCircle2 size={18} /> : step.icon}
                            </span>
                          </motion.div>
                          {!isLast && (
                            <div className="relative w-0.5 flex-1 my-1 bg-gray-100 overflow-hidden" style={{ minHeight: 28 }}>
                              <motion.div
                                initial={{ height: "0%" }}
                                animate={{ height: isDone ? "100%" : "0%" }}
                                transition={{ duration: 0.6, ease: "easeInOut" }}
                                className="absolute top-0 left-0 w-full bg-[var(--color-brand-orange)]"
                              />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className={`pb-6 flex-1 ${isLast ? "pb-0" : ""}`}>
                          <div className="flex items-center gap-2 mt-2">
                            <p className={`font-black text-sm ${isPending ? "text-gray-300" : "text-gray-900"}`}>
                              {step.label}
                            </p>
                            {isActive && (
                              <span className="flex gap-1">
                                {[0, 1, 2].map(i => (
                                  <motion.span
                                    key={i}
                                    animate={{ opacity: [1, 0.2, 1] }}
                                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                                    className="w-1.5 h-1.5 bg-[var(--color-brand-orange)] rounded-full inline-block"
                                  />
                                ))}
                              </span>
                            )}
                          </div>
                          <p className={`text-xs mt-0.5 ${isPending ? "text-gray-200" : "text-gray-400"}`}>
                            {step.sublabel}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order summary */}
              <div className="px-6 pb-6">
                <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Resumen</p>
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.quantity}× {item.product.name}</span>
                      <span className="font-bold">${(item.price * item.quantity).toFixed(0)}</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-200 pt-2 flex justify-between font-black text-base">
                    <span>Total</span>
                    <span>${order.total}</span>
                  </div>
                  {order.tip > 0 && (
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Propina incluida</span>
                      <span>+${order.tip}</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-400 py-16 text-sm">No se encontró el pedido.</p>
          )}
        </div>

        {/* Bottom CTA — only when delivered */}
        {isDelivered && (
          <div className="p-6 border-t border-gray-100">
            <button
              onClick={onClose}
              className="w-full py-4 bg-black text-white rounded-2xl font-black hover:bg-gray-900 transition-colors"
            >
              ¡Gracias! Volver al inicio
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

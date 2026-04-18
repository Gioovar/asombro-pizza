"use client";

import { useState, useEffect, useRef } from "react";
import { Search, MapPin, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Suggestion {
  name: string;
  city?: string;
  state?: string;
  country?: string;
  fullPath: string;
  lat: number;
  lng: number;
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (val: string) => void;
  onSelect: (addr: Suggestion) => void;
  placeholder?: string;
  className?: string;
}

export function AddressAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = "Escribe tu dirección...",
  className = "",
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounce logic
  useEffect(() => {
    if (!value || value.length < 3 || !showDropdown) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        // Using Photon (OpenStreetMap based) for free, no-key predictions
        // It's fast and very accurate for many regions.
        const res = await fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(value)}&limit=5&lang=es`
        );
        const data = await res.json();

        const formatted: Suggestion[] = data.features.map((f: any) => {
          const p = f.properties;
          const parts = [p.name, p.street, p.district, p.city, p.state]
            .filter(Boolean)
            .filter((v, i, a) => a.indexOf(v) === i); // Deduplicate

          return {
            name: p.name || p.street || "Ubicación",
            city: p.city,
            state: p.state,
            country: p.country,
            fullPath: parts.join(", "),
            lat: f.geometry.coordinates[1],
            lng: f.geometry.coordinates[0],
          };
        });

        setSuggestions(formatted);
      } catch (error) {
        console.error("Autocomplete error:", error);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [value, showDropdown]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative group">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          placeholder={placeholder}
          className="w-full pl-11 pr-11 py-3.5 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-[var(--color-brand-orange)] focus:border-transparent outline-none font-medium transition-all"
        />
        <MapPin
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--color-brand-orange)] transition-colors"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {loading && <Loader2 size={16} className="text-orange-500 animate-spin" />}
          {value && (
            <button
              onClick={() => {
                onChange("");
                setSuggestions([]);
              }}
              className="p-1 hover:bg-gray-100 rounded-full text-gray-400"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showDropdown && (suggestions.length > 0 || loading) && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 5, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.98 }}
            className="absolute z-[100] w-full bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden mt-1"
          >
            {loading && suggestions.length === 0 && (
              <div className="p-8 text-center">
                <Loader2 size={24} className="mx-auto text-orange-500 animate-spin mb-2" />
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Buscando...</p>
              </div>
            )}

            <div className="max-h-[300px] overflow-y-auto py-2">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => {
                    onSelect(s);
                    setShowDropdown(false);
                  }}
                  className="w-full flex items-start gap-4 px-5 py-4 hover:bg-orange-50/50 text-left transition-colors border-b border-gray-50 last:border-0 group"
                >
                  <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-[var(--color-brand-orange)] group-hover:shadow-sm transition-all flex-shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-[15px] text-gray-900 truncate group-hover:text-[var(--color-brand-orange)] transition-colors">
                      {s.name}
                    </p>
                    <p className="text-xs font-medium text-gray-400 truncate mt-0.5">
                      {s.fullPath.replace(s.name + ", ", "")}
                    </p>
                  </div>
                </button>
              ))}
            </div>
            
            <div className="bg-gray-50 px-5 py-3 border-t border-gray-100">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Search size={10}/> Sugerencias inteligentes
               </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

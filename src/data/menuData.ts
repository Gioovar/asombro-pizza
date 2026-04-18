export interface MenuItem {
  id: string;
  name: string;
  shortDescription?: string;
  description: string;
  price: number; // base price (smallest / default size)
  image: string;
  category: string;
  config?: string; // JSON: ProductConfig
}

// ── Types for parsed config ──────────────────────────────────────
export interface OptionValue {
  label: string;
  price: number; // price delta from base (can be 0, positive, or negative)
}

export interface OptionGroup {
  name: string;
  required: boolean;
  type: "selection" | "multiple";
  values: OptionValue[];
}

export interface ProductConfig {
  options: OptionGroup[];
}

// ── Helpers ──────────────────────────────────────────────────────
const pizzaConfig = (): string =>
  JSON.stringify({
    options: [
      {
        name: "Tamaño",
        required: true,
        type: "selection",
        values: [
          { label: "S",  price: 0  },
          { label: "M",  price: 50 },
          { label: "L",  price: 100 },
          { label: "XL", price: 150 },
        ],
      },
      {
        name: "Extras",
        required: false,
        type: "multiple",
        values: [
          { label: "Extra Queso",       price: 35 },
          { label: "Orilla de Queso",   price: 40 },
          { label: "Doble Ingrediente", price: 50 },
        ],
      },
    ],
  } as ProductConfig);

const alitasConfig = (): string =>
  JSON.stringify({
    options: [
      {
        name: "Tipo",
        required: true,
        type: "selection",
        values: [
          { label: "Alitas",   price: 0  },
          { label: "Boneless", price: 20 },
        ],
      },
      {
        name: "Sabor",
        required: true,
        type: "selection",
        values: [
          { label: "BBQ (Brooklyn Smoke)",   price: 0 },
          { label: "Buffalo (Hell Fire 718)", price: 0 },
          { label: "Mango Habanero",          price: 0 },
          { label: "Tamarindo",               price: 0 },
          { label: "Parmesano",               price: 15 },
        ],
      },
    ],
  } as ProductConfig);

// ── Menu Data ────────────────────────────────────────────────────
export const menuData: MenuItem[] = [
  // PIZZAS — ESPECIALIDADES
  {
    id: "brooklyn-double-meat",
    name: "Brooklyn Double Meat",
    shortDescription: "La favorita de Brooklyn",
    description: "Pepperoni crujiente + salchicha italiana + mozzarella + salsa de tomate",
    price: 280,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591",
    category: "Pizzas — Especialidades",
    config: pizzaConfig(),
  },
  {
    id: "meat-lovers",
    name: "Meat Lovers",
    shortDescription: "Para los amantes de la carne",
    description: "Pepperoni + chorizo italiano + jamón ahumado + tocino + mozzarella",
    price: 260,
    image: "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c",
    category: "Pizzas — Especialidades",
    config: pizzaConfig(),
  },
  {
    id: "bbq-chicken",
    name: "BBQ Chicken",
    shortDescription: "Pollo + BBQ irresistible",
    description: "Pollo + salsa BBQ + tocino + mozzarella + cebolla",
    price: 290,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
    category: "Pizzas — Especialidades",
    config: pizzaConfig(),
  },
  {
    id: "lasagna-pizza",
    name: "Lasagna Pizza",
    shortDescription: "Lo mejor de dos mundos",
    description: "Carne molida + mozzarella + ricotta + salsa de tomate",
    price: 290,
    image: "https://images.unsplash.com/photo-1574129810554-7291008d440c",
    category: "Pizzas — Especialidades",
    config: pizzaConfig(),
  },
  {
    id: "mortazza",
    name: "Mortazza",
    shortDescription: "Pistache + stracciatella",
    description: "Mortadela de pistache + stracciatella + pistache + pesto",
    price: 320,
    image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e",
    category: "Pizzas — Especialidades",
    config: pizzaConfig(),
  },

  // ALITAS & BONELESS
  {
    id: "alitas-new",
    name: "Alitas",
    description: "Alitas con hueso crujientes — elige tu sabor",
    price: 190,
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec",
    category: "Alitas & Boneless",
    config: alitasConfig(),
  },
  {
    id: "boneless-new",
    name: "Boneless",
    description: "Pechuga de pollo sin hueso — elige tu sabor",
    price: 210,
    image: "https://images.unsplash.com/photo-1569058242253-92a9c71f986d",
    category: "Alitas & Boneless",
    config: alitasConfig(),
  },

  // BEBIDAS
  {
    id: "refresco-clasico",
    name: "Refresco 355ml",
    description: "Selecciona tu sabor favorito",
    price: 60,
    image: "https://images.unsplash.com/photo-1622483767028-3f66f361ef56",
    category: "Bebidas",
    config: JSON.stringify({
      options: [
        {
          name: "Sabor",
          required: true,
          type: "selection",
          values: [
            { label: "Coca Cola",        price: 0 },
            { label: "Coca Zero",        price: 0 },
            { label: "Coca Light",       price: 0 },
            { label: "Fanta",            price: 0 },
            { label: "Sprite",           price: 0 },
            { label: "Fresca",           price: 0 },
            { label: "Sidral Mundet",    price: 0 },
            { label: "Delaware Punch",   price: 0 },
            { label: "Jugo Valle Mango", price: 0 },
            { label: "Jugo Valle Guayaba", price: 0 },
            { label: "Agua Ciel",        price: 0 },
            { label: "Agua Mineral",     price: 0 },
          ],
        },
      ],
    } as ProductConfig),
  },
];

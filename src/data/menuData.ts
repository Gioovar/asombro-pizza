export interface MenuItem {
  id: string;
  name: string;
  shortDescription?: string;
  description: string;
  price: number; 
  image: string;
  category: string;
  config?: string; 
}

export interface OptionValue {
  label: string;
  price: number; 
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

const pizzaConfig = (): string =>
  JSON.stringify({
    options: [
      {
        name: "Dimensión",
        required: true,
        type: "selection",
        values: [
          { label: "Personal (10\")",  price: 0  },
          { label: "Medium (12\")",  price: 60 },
          { label: "Grande (14\")",  price: 120 },
          { label: "Squad XL (16\")", price: 180 },
        ],
      },
      {
        name: "Curaduría Adicional",
        required: false,
        type: "multiple",
        values: [
          { label: "Extra Mozzarella de Búfala", price: 45 },
          { label: "Orilla de Queso Provolone", price: 50 },
          { label: "Doble Ingrediente Artesanal", price: 65 },
        ],
      },
    ],
  } as ProductConfig);

const alitasConfig = (): string =>
  JSON.stringify({
    options: [
      {
        name: "Presentación",
        required: true,
        type: "selection",
        values: [
          { label: "Alitas Classic",   price: 0  },
          { label: "Boneless Premium", price: 30 },
        ],
      },
      {
        name: "Signature Glaze",
        required: true,
        type: "selection",
        values: [
          { label: "Brooklyn Smoke (BBQ)", price: 0 },
          { label: "Hell Fire 718 (Buffalo)", price: 0 },
          { label: "Mango Habanero Fusion", price: 0 },
          { label: "Tamarindo Glaze", price: 0 },
          { label: "Parmesano & Trufa", price: 45 },
        ],
      },
    ],
  } as ProductConfig);

export const menuData: MenuItem[] = [
  {
    id: "brooklyn-double-meat",
    name: "Brooklyn Double Meat",
    shortDescription: "La insignia del Squad",
    description: "Masa madre 72h + pepperoni artesanal curado + salchicha italiana receta secreta + mozzarella de búfala + salsa 'Old School' de tomate San Marzano.",
    price: 320,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591",
    category: "Pizzas — Especialidades",
    config: pizzaConfig(),
  },
  {
    id: "meat-lovers",
    name: "Meat Lovers",
    shortDescription: "Curaduría Carnívora",
    description: "Una explosión de proteínas: pepperoni de corte grueso + chorizo italiano + jamón ahumado a la leña + tocino crujiente + mozzarella premium.",
    price: 310,
    image: "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c",
    category: "Pizzas — Especialidades",
    config: pizzaConfig(),
  },
  {
    id: "bbq-chicken",
    name: "BBQ Chicken",
    shortDescription: "Ahuma y Seduce",
    description: "Pollo premium marinado + salsa BBQ artesanal con toque de bourbon + tocino ahumado + mozzarella + cebolla morada caramelizada.",
    price: 295,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
    category: "Pizzas — Especialidades",
    config: pizzaConfig(),
  },
  {
    id: "lasagna-pizza",
    name: "Lasagna Pizza",
    shortDescription: "Herencia Italiana",
    description: "Carne molida seleccionada + base de mozzarella + nubes de ricotta fresca + salsa de tomate San Marzano + especias de la nonna.",
    price: 315,
    image: "https://images.unsplash.com/photo-1574129810554-7291008d440c",
    category: "Pizzas — Especialidades",
    config: pizzaConfig(),
  },
  {
    id: "mortazza",
    name: "Mortazza",
    shortDescription: "La Joya Gourmet",
    description: "Masa madre infusionada + mortadela de Bolonia con pistache + stracciatella fresca + lluvia de pistache tostado + pesto de albahaca real.",
    price: 380,
    image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e",
    category: "Pizzas — Especialidades",
    config: pizzaConfig(),
  },

  {
    id: "alitas-new",
    name: "Signature Wings",
    description: "Alitas de pollo seleccionadas, cocción lenta y terminado al fuego para un crunch perfecto. Elige tu Signature Glaze.",
    price: 220,
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec",
    category: "Alitas & Boneless",
    config: alitasConfig(),
  },
  {
    id: "boneless-new",
    name: "Boneless Premium",
    description: "Pechuga de pollo seleccionada a mano, empanizado artesanal y bañada en tu técnica de sabor preferida.",
    price: 240,
    image: "https://images.unsplash.com/photo-1569058242253-92a9c71f986d",
    category: "Alitas & Boneless",
    config: alitasConfig(),
  },

  {
    id: "refresco-clasico",
    name: "Bebidas Curadas",
    description: "Selección de bebidas para acompañar tu experiencia gastronómica.",
    price: 65,
    image: "https://images.unsplash.com/photo-1622483767028-3f66f361ef56",
    category: "Bebidas",
    config: JSON.stringify({
      options: [
        {
          name: "Sabor",
          required: true,
          type: "selection",
          values: [
            { label: "Coca Cola original", price: 0 },
            { label: "Coca Zero Pure", price: 0 },
            { label: "Coca Light Sensation", price: 0 },
            { label: "Agua Mineral de Manantial", price: 0 },
            { label: "Sidral Mundet Heritage", price: 0 },
          ],
        },
      ],
    } as ProductConfig),
  },
];

export interface MenuItem {
  id: string;
  name: string;
  shortDescription?: string;
  description: string;
  price: number;
  image: string;
  category: string;
  config?: string; // JSON configuration
}

export const menuData: MenuItem[] = [
  // 1. PIZZAS — ESPECIALIDADES
  {
    id: "brooklyn-double-meat",
    name: "Brooklyn Double Meat",
    description: "Pepperoni crujiente + salchicha italiana + mozzarella + salsa de tomate",
    price: 280,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591",
    category: "Pizzas — Especialidades",
    config: JSON.stringify({
      options: [
        { name: "Tamaño", required: true, type: "selection", values: ["S", "M", "L", "XL"] },
        { name: "Extras", required: false, type: "multiple", values: ["Extra Queso", "Orilla de Queso", "Doble Ingrediente"] }
      ]
    })
  },
  {
    id: "meat-lovers",
    name: "Meat Lovers",
    description: "Pepperoni + chorizo italiano + jamón ahumado + tocino + mozzarella",
    price: 260,
    image: "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c",
    category: "Pizzas — Especialidades",
    config: JSON.stringify({
      options: [
        { name: "Tamaño", required: true, type: "selection", values: ["S", "M", "L", "XL"] },
        { name: "Extras", required: false, type: "multiple", values: ["Extra Queso", "Orilla de Queso", "Doble Ingrediente"] }
      ]
    })
  },
  {
    id: "bbq-chicken",
    name: "BBQ Chicken",
    description: "Pollo + salsa BBQ + tocino + mozzarella + cebolla",
    price: 290,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
    category: "Pizzas — Especialidades",
    config: JSON.stringify({
      options: [
        { name: "Tamaño", required: true, type: "selection", values: ["S", "M", "L", "XL"] },
        { name: "Extras", required: false, type: "multiple", values: ["Extra Queso", "Orilla de Queso", "Doble Ingrediente"] }
      ]
    })
  },
  {
    id: "lasagna-pizza",
    name: "Lasagna Pizza",
    description: "Carne molida + mozzarella + ricotta + salsa de tomate",
    price: 290,
    image: "https://images.unsplash.com/photo-1574129810554-7291008d440c",
    category: "Pizzas — Especialidades",
    config: JSON.stringify({
      options: [
        { name: "Tamaño", required: true, type: "selection", values: ["S", "M", "L", "XL"] },
        { name: "Extras", required: false, type: "multiple", values: ["Extra Queso", "Orilla de Queso", "Doble Ingrediente"] }
      ]
    })
  },
  {
    id: "mortazza",
    name: "Mortazza",
    description: "Mortadela de pistache + stracciatella + pistache + pesto",
    price: 390,
    image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e",
    category: "Pizzas — Especialidades",
    config: JSON.stringify({
      options: [
        { name: "Tamaño", required: true, type: "selection", values: ["S", "M", "L", "XL"] },
        { name: "Extras", required: false, type: "multiple", values: ["Extra Queso", "Orilla de Queso", "Doble Ingrediente"] }
      ]
    })
  },
  
  // 4. ALITAS & BONELESS
  {
    id: "alitas-new",
    name: "Alitas",
    description: "Alitas con hueso crujientes",
    price: 200,
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec",
    category: "Alitas & Boneless",
    config: JSON.stringify({
      options: [
        { name: "Tipo", required: true, type: "selection", values: ["Alitas", "Boneless"] },
        { name: "Sabor", required: true, type: "selection", values: ["BBQ (Brooklyn Smoke)", "Buffalo (Hell Fire 718)", "Mango Habanero", "Tamarindo", "Parmesano"] }
      ]
    })
  },
  {
    id: "boneless-new",
    name: "Boneless",
    description: "Pechuga de pollo sin hueso",
    price: 200,
    image: "https://images.unsplash.com/photo-1569058242253-92a9c71f986d",
    category: "Alitas & Boneless",
    config: JSON.stringify({
      options: [
        { name: "Tipo", required: true, type: "selection", values: ["Alitas", "Boneless"] },
        { name: "Sabor", required: true, type: "selection", values: ["BBQ (Brooklyn Smoke)", "Buffalo (Hell Fire 718)", "Mango Habanero", "Tamarindo", "Parmesano"] }
      ]
    })
  },

  // 6. BEBIDAS
  {
    id: "refresco-clásico",
    name: "Refresco 355ml",
    description: "Selecciona tu sabor favorito",
    price: 60,
    image: "https://images.unsplash.com/photo-1622483767028-3f66f361ef56",
    category: "Bebidas",
    config: JSON.stringify({
      options: [
        { name: "Sabor", required: true, type: "selection", values: ["Coca Cola", "Coca Zero", "Coca Light", "Fanta", "Sprite", "Fresca", "Sidral Mundet", "Delaware Punch", "Jugo Valle Mango", "Jugo Valle Guayaba", "Agua Ciel", "Agua Mineral"] }
      ]
    })
  }
];

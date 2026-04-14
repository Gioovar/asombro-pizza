export interface Pizza {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  image: string;
}

export const pizzasData: Pizza[] = [
  {
    id: "pepperoni-explosion",
    name: "Pepperoni Explosion",
    shortDescription: "Clásica con extra pepperoni",
    description: "Nuestra clásica base de masa madre napolitana, coronada con doble porción de pepperoni crujiente y mozzarella fresca.",
    price: 240,
    image: "/images/pepperoni.png",
  },
  {
    id: "hawaiana-deluxe",
    name: "Hawaiana Deluxe",
    shortDescription: "Dulce, salada y tropical",
    description: "Jamón glaseado al horno, piña asada lentamente y un toque secreto de especias que cambia todo lo que sabes sobre la hawaiana.",
    price: 260,
    image: "/images/hawaiana.png",
  },
  {
    id: "bbq-madness",
    name: "BBQ Madness",
    shortDescription: "Festival de carne y BBQ",
    description: "Trozos de pollo bañados en nuestra salsa BBQ artesanal, cebolla morada caramelizada y mezcla de quesos ahumados.",
    price: 290,
    image: "/images/bbq.png",
  },
  {
    id: "veggie-supreme",
    name: "Veggie Supreme",
    shortDescription: "Frescura del huerto al horno",
    description: "Corazones de alcachofa, pimientos asados, aceitunas negras, cebolla morada y champiñones frescos sobre salsa de tomate premium.",
    price: 230,
    image: "/images/veggie.png",
  },
  {
    id: "cuatro-quesos",
    name: "Cuatro Quesos",
    shortDescription: "Una bomba de sabor fundido",
    description: "Mozzarella, Gorgonzola, Parmesano Reggiano y Provolone fundidos a la perfección con un toque de pimienta negra.",
    price: 280,
    image: "/images/cuatro-quesos.png",
  },
];

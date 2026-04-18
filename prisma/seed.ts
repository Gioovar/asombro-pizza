import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔥 Arrancando el Algoritmo Sembrador de Alta Densidad Asombro Pizza...");

  // 1. Limpieza total de Tablas (Truncate)
  console.log("Limpiando DB...");
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.event.deleteMany();
  await prisma.promo.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.driver.deleteMany();
  await prisma.user.deleteMany();

  // 2. Creando Categorías
  console.log("Inyectando Categorías...");
  const catPizzasEsp = await prisma.category.create({ data: { name: "Pizzas — Especialidades", order: 1 } });
  const catPizzasClas = await prisma.category.create({ data: { name: "Pizzas — Clásicas", order: 2 } });
  const catBurgers = await prisma.category.create({ data: { name: "Burgers", order: 3 } });
  const catAlitas = await prisma.category.create({ data: { name: "Alitas & Boneless", order: 4 } });
  const catSnacks = await prisma.category.create({ data: { name: "Entradas / Snacks", order: 5 } });
  const catBebidas = await prisma.category.create({ data: { name: "Bebidas", order: 6 } });
  const catCerveza = await prisma.category.create({ data: { name: "Cerveza", order: 7 } });

  // 3. Inyectando Productos
  console.log("Cocinando el Menú Mágico...");

  const pizzaSizesConfig = JSON.stringify({
    options: [
      { name: "Tamaño", required: true, type: "selection", values: ["S", "M", "L", "XL"] },
      { name: "Extras", required: false, type: "multiple", values: ["Extra Queso", "Orilla de Queso", "Doble Ingrediente"] }
    ]
  });

  const wingsConfig = JSON.stringify({
    options: [
      { name: "Tipo", required: true, type: "selection", values: ["Alitas", "Boneless"] },
      { name: "Sabor", required: true, type: "selection", values: ["BBQ (Brooklyn Smoke)", "Buffalo (Hell Fire 718)", "Mango Habanero", "Tamarindo", "Parmesano"] }
    ]
  });

  const beerConfig = JSON.stringify({
    options: [
      { name: "Tipo", required: true, type: "selection", values: ["Clara", "Oscura"] },
      { name: "Escarchado", required: false, type: "selection", values: ["Ninguno", "Tajín", "Piquín", "Sal"] },
      { name: "Complementos", required: false, type: "multiple", values: ["Clamato", "Cubana"] }
    ]
  });

  await prisma.product.createMany({
    data: [
      // 1. PIZZAS — ESPECIALIDADES
      { name: "Brooklyn Double Meat", description: "Pepperoni crujiente + salchicha italiana + mozzarella + salsa de tomate", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591", cost: 120, price: 280, categoryId: catPizzasEsp.id, config: pizzaSizesConfig },
      { name: "Meat Lovers", description: "Pepperoni + chorizo italiano + jamón ahumado + tocino + mozzarella", image: "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c", cost: 110, price: 260, categoryId: catPizzasEsp.id, config: pizzaSizesConfig },
      { name: "BBQ Chicken", description: "Pollo + salsa BBQ + tocino + mozzarella + cebolla", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38", cost: 125, price: 290, categoryId: catPizzasEsp.id, config: pizzaSizesConfig },
      { name: "Lasagna Pizza", description: "Carne molida + mozzarella + ricotta + salsa de tomate", image: "https://images.unsplash.com/photo-1574129810554-7291008d440c", cost: 125, price: 290, categoryId: catPizzasEsp.id, config: pizzaSizesConfig },
      { name: "Mortazza", description: "Mortadela de pistache + stracciatella + pistache + pesto", image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e", cost: 180, price: 390, categoryId: catPizzasEsp.id, config: pizzaSizesConfig },
      { name: "Proshutina", description: "Prosciutto + arúgula + parmesano + reducción balsámica", image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee", cost: 180, price: 390, categoryId: catPizzasEsp.id, config: pizzaSizesConfig },

      // 2. PIZZAS — CLÁSICAS
      { name: "Brooklyn Classic", description: "Salchicha italiana + pimientos + cebolla + mozzarella", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591", cost: 100, price: 240, categoryId: catPizzasClas.id, config: pizzaSizesConfig },
      { name: "Buffalo Chicken", description: "Pollo estilo buffalo + cebolla + apio + mozzarella", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38", cost: 120, price: 290, categoryId: catPizzasClas.id, config: pizzaSizesConfig },
      { name: "Suprema", description: "Pepperoni + chorizo + salchicha + champiñones + aceituna + pimientos", image: "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c", cost: 100, price: 230, categoryId: catPizzasClas.id, config: pizzaSizesConfig },
      { name: "Hawaiana", description: "Jamón + piña + mozzarella", image: "https://images.unsplash.com/photo-1565299543923-37dd3b875ff0", cost: 100, price: 240, categoryId: catPizzasClas.id, config: pizzaSizesConfig },
      { name: "4 Quesos", description: "Mozzarella + ricotta + queso de cabra + parmesano", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591", cost: 90, price: 220, categoryId: catPizzasClas.id, config: pizzaSizesConfig },
      { name: "Bianca", description: "Crema + mozzarella + parmesano + perejil", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591", cost: 100, price: 240, categoryId: catPizzasClas.id, config: pizzaSizesConfig },
      { name: "Vegetariana", description: "Champiñones + aceituna + pimiento + cebolla + jitomate", image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47", cost: 95, price: 230, categoryId: catPizzasClas.id, config: pizzaSizesConfig },
      { name: "Pepperoni", description: "Pepperoni + mozzarella", image: "https://images.unsplash.com/photo-1628840042765-356cda07504e", cost: 70, price: 180, categoryId: catPizzasClas.id, config: pizzaSizesConfig },
      { name: "Extra Queso", description: "Mozzarella extra", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591", cost: 70, price: 180, categoryId: catPizzasClas.id, config: pizzaSizesConfig },

      // 3. BURGERS
      { name: "Clásica", description: "Carne + queso", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd", cost: 60, price: 150, categoryId: catBurgers.id },
      { name: "Clásica con tocino", description: "Carne + queso + doble tocino", image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b", cost: 80, price: 190, categoryId: catBurgers.id },
      { name: "Doble Carne", description: "Doble carne + queso", image: "https://images.unsplash.com/photo-1586816001966-79b736744398", cost: 75, price: 180, categoryId: catBurgers.id },
      { name: "Hawaiana Burger", description: "Carne + queso + piña", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd", cost: 90, price: 220, categoryId: catBurgers.id },

      // 4. ALITAS & BONELESS
      { name: "Alitas", description: "Alitas con hueso crujientes", image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec", cost: 80, price: 200, categoryId: catAlitas.id, config: wingsConfig },
      { name: "Boneless", description: "Pechuga de pollo sin hueso", image: "https://images.unsplash.com/photo-1569058242253-92a9c71f986d", cost: 80, price: 200, categoryId: catAlitas.id, config: wingsConfig },

      // 5. ENTRADAS / SNACKS
      { name: "Garlic Knots (6 piezas)", description: "Nudos de ajo calientitos", image: "https://images.unsplash.com/photo-1574129810554-7291008d440c", cost: 15, price: 40, categoryId: catSnacks.id },
      { name: "Dedos de Queso (5 piezas)", description: "Mozzarella empanizada", image: "https://images.unsplash.com/photo-1531492746076-1a1bd9b29fc0", cost: 70, price: 180, categoryId: catSnacks.id },
      { name: "Papas a la Francesa", description: "Clásicas papas fritas", image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877", cost: 25, price: 70, categoryId: catSnacks.id },

      // 6. BEBIDAS
      { name: "Refresco 355ml", description: "Selecciona tu sabor favorito de la familia Coca-Cola", image: "https://images.unsplash.com/photo-1622483767028-3f66f361ef56", cost: 20, price: 60, categoryId: catBebidas.id, config: JSON.stringify({ options: [{ name: "Sabor", required: true, type: "selection", values: ["Coca Cola", "Coca Zero", "Coca Light", "Fanta", "Sprite", "Fresca", "Sidral Mundet", "Delaware Punch", "Jugo Valle Mango", "Jugo Valle Guayaba", "Agua Ciel", "Agua Mineral"] }] }) },

      // 7. CERVEZA
      { name: "Cerveza de Barril - Tarro Chico", description: "355 ml de cerveza fresquecita", image: "https://images.unsplash.com/photo-1612528443702-f6741f70a049", cost: 25, price: 60, categoryId: catCerveza.id, config: beerConfig },
      { name: "Cerveza de Barril - Tarro Grande", description: "1 Litro de cerveza de barril", image: "https://images.unsplash.com/photo-1612528443702-f6741f70a049", cost: 45, price: 120, categoryId: catCerveza.id, config: beerConfig },
      { name: "Cerveza Media", description: "355 ml en botella de cristal", image: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2", cost: 25, price: 60, categoryId: catCerveza.id, config: JSON.stringify({ options: [{ name: "Marca", required: true, type: "selection", values: ["Corona", "Victoria", "Negra Modelo", "Modelo Especial"] }] }) },
    ]
  });

  // 4. Creando Promociones
  console.log("Activando Motores FOMO (Promociones)...");
  await prisma.promo.createMany({
     data: [
       { title: "Viernes de Locura", code: "VIERNES20", description: "Lleva un 20% de descuento en todo el carrito.", badgeText: "🔥 Tiempo limitado", type: "PERCENTAGE", discount: 20, imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591" },
       { title: "Combo Oficina", code: "OFICINA", description: "2 pizzas clásicas con envío gratis.", badgeText: "Recomendado", type: "COMBO", discount: 100, imageUrl: "https://images.unsplash.com/photo-1628840042765-356cda07504e" }
     ]
  });

  // 5. Creando Identidades
  console.log("Inyectando Identidades...");
  const guest = await prisma.user.create({
     data: { name: "Invitado Demo", email: "webguest@asombropizza.com", password: "encrypted_123" }
  });

  // 6. Creando Repartidores
  console.log("Contratando Repartidores...");
  await prisma.driver.createMany({
     data: [
       { name: "Carlos Rayo", phone: "555-1212", vehicle: "Moto Italika 150", status: "AVAILABLE" },
       { name: "Diana Turbo", phone: "555-3434", vehicle: "Bicicleta Eléctrica", status: "BUSY" },
     ]
  });

  console.log("🚀 SEMBRADO COMPLETADO AL 100%. EL MENÚ ASOMBRO ESTÁ LISTO. 🦄");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

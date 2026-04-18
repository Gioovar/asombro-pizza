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
  console.log("Inyectando Categorías Premium...");
  const catPizzasEsp = await prisma.category.create({ data: { name: "Pizzas — Especialidades", order: 1 } });
  const catPizzasClas = await prisma.category.create({ data: { name: "Pizzas — Clásicas", order: 2 } });
  const catAlitas = await prisma.category.create({ data: { name: "Alitas & Boneless", order: 3 } });
  const catSnacks = await prisma.category.create({ data: { name: "Entradas Artesanales", order: 4 } });
  const catBebidas = await prisma.category.create({ data: { name: "Mixología & Bebidas", order: 5 } });
  const catCerveza = await prisma.category.create({ data: { name: "Cerveza de Barril", order: 6 } });

  // 3. Inyectando Productos Gourmet
  console.log("Cocinando el Menú Maestro...");

  const pizzaSizesConfig = JSON.stringify({
    options: [
      { 
        name: "Tamaño", 
        required: true, 
        type: "selection", 
        values: [
          { label: "Mediana (6 rebanadas)", price: 0 },
          { label: "Grande (8 rebanadas)", price: 80 },
          { label: "XL Familiar (12 rebanadas)", price: 150 }
        ] 
      },
      { 
        name: "Masa Especial", 
        required: false, 
        type: "selection", 
        values: [
          { label: "Clásica Brooklyn", price: 0 },
          { label: "Integral Multigrano", price: 30 },
          { label: "Orilla Rellena de Mozzarella", price: 50 },
          { label: "Masa Keto (Base de Coliflor)", price: 70 }
        ] 
      }
    ]
  });

    data: [
      // 1. PIZZAS — ESPECIALIDADES (Sync with menuData)
      { 
        id: "brooklyn-double-meat",
        name: "Brooklyn Double Meat", 
        description: "Nuestra insignia. Pepperoni crujiente y salchicha italiana artesanal sobre una base de masa madre fermentada por 72 horas. El alma de Nueva York en cada bocado.", 
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591", 
        cost: 150, price: 340, categoryId: catPizzasEsp.id, config: pizzaSizesConfig 
      },
      { 
        id: "meat-lovers",
        name: "Meat Lovers", 
        description: "Una explosión de proteínas: pepperoni de corte grueso + chorizo italiano + jamón ahumado a la leña + tocino crujiente + mozzarella premium.", 
        image: "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c", 
        cost: 140, price: 310, categoryId: catPizzasEsp.id, config: pizzaSizesConfig 
      },
      { 
        id: "bbq-chicken",
        name: "BBQ Chicken", 
        description: "Pollo premium marinado + salsa BBQ artesanal con toque de bourbon + tocino ahumado + mozzarella + cebolla morada caramelizada.", 
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38", 
        cost: 130, price: 295, categoryId: catPizzasEsp.id, config: pizzaSizesConfig 
      },
      { 
        id: "lasagna-pizza",
        name: "Lasagna Pizza", 
        description: "Carne molida seleccionada + base de mozzarella + nubes de ricotta fresca + salsa de tomate San Marzano + especias de la nonna.", 
        image: "https://images.unsplash.com/photo-1574129810554-7291008d440c", 
        cost: 145, price: 315, categoryId: catPizzasEsp.id, config: pizzaSizesConfig 
      },
      { 
        id: "mortazza",
        name: "Mortazza", 
        description: "Masa madre infusionada + mortadela de Bolonia con pistache + stracciatella fresca + lluvia de pistache tostado + pesto de albahaca real.", 
        image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e", 
        cost: 180, price: 380, categoryId: catPizzasEsp.id, config: pizzaSizesConfig 
      },
      { 
        id: "alitas-new",
        name: "Signature Wings", 
        description: "10 piezas de alitas premium marinadas en nuestra salsa BBQ ahumada con madera de cerezo.", 
        image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec", 
        cost: 120, price: 280, categoryId: catAlitas.id 
      },
      { 
        id: "boneless-new",
        name: "Boneless Premium", 
        description: "Trozo de pechuga artesanal bañada en salsa Buffalo de la casa, nivel de picante: Solo para Squad Members.", 
        image: "https://images.unsplash.com/photo-1569058242253-92a9c71f986d", 
        cost: 120, price: 280, categoryId: catAlitas.id 
      },
      { 
        id: "refresco-clasico",
        name: "Bebidas Curadas", 
        description: "Selección de bebidas para acompañar tu experiencia gastronómica.", 
        image: "https://images.unsplash.com/photo-1622483767028-3f66f361ef56", 
        cost: 30, price: 65, categoryId: catBebidas.id 
      },
    ]
  });

  // 4. Inyectando Eventos Premium
  console.log("Activando Agenda VIP (Eventos)...");
  await prisma.event.createMany({
    data: [
      { 
        title: "Brooklyn Vinyl Night", 
        description: "Una noche de Jazz y Vinilos seleccionados por DJ Asombro. Cata de pizzas de autor incluida.", 
        date: new Date(Date.now() + 86400000 * 5), // +5 days
        capacity: 40,
        price: 250,
        category: "LIVE_MUSIC",
        imageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
        status: "ACTIVE"
      },
      { 
        title: "Masterclass: Masa Madre", 
        description: "Aprende el arte de la fermentación de 72h con nuestro Maestro Pizzero. Cupo ultra limitado.", 
        date: new Date(Date.now() + 86400000 * 12), // +12 days
        capacity: 12,
        price: 850,
        category: "ACADEMY",
        imageUrl: "https://images.unsplash.com/photo-1556910103-1c02745aae4d",
        status: "ACTIVE"
      }
    ]
  });

  // 5. Creando Promociones FOMO
  console.log("Inyectando Promociones de Impacto...");
  await prisma.promo.createMany({
     data: [
       { title: "First Order VIP", code: "SQUAD10", description: "Bonificación exclusiva del 10% en tu primera experiencia Asombro.", badgeText: "SQUAD EXCLUSIVE", type: "PERCENTAGE", discount: 10, active: true, imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591" },
       { title: "Pizza & Vinyl Combo", code: "EXPERIENCE", description: "Lleva un 20% de descuento al reservar para evento + cena.", badgeText: "TOP EXPERIENCE", type: "PERCENTAGE", discount: 20, active: true, imageUrl: "https://images.unsplash.com/photo-1628840042765-356cda07504e" }
     ]
  });

  // 6. Configuración de la Tienda
  console.log("Configurando Core Business...");
  await prisma.storeSettings.create({
     data: {
        deliveryFee: 45,
        minOrderTotal: 250,
        botEnabled: true,
        botPrompt: "Eres un Concierge Gourmet. Tu tono es sofisticado, experto en gastronomía y apasionado por la cultura de Brooklyn. Vende la experiencia de la masa madre de 72h como un lujo necesario."
     }
  });

  // 7. Repartidores (Squad Logistic)
  console.log("Desplegando Flota Logística...");
  await prisma.driver.createMany({
     data: [
       { name: "Carlos 'Flash' Rayo", phone: "555-0101", vehicle: "Moto Italika Custom Black", status: "AVAILABLE" },
       { name: "Diana 'Turbo' Mendez", phone: "555-0202", vehicle: "E-Bike Squad Edition", status: "BUSY" },
     ]
  });

  console.log("🚀 MAESTRÍA DE DATOS COMPLETADA. LA PLATAFORMA ASOMBRO ESTÁ LISTA PARA DOMINAR EL MERCADO. 🦄");
}

main()
  .catch((e) => {
    console.error("Error en el sembrado:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

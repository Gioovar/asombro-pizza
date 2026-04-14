import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔥 Arrancando el Algoritmo Sembrador de Alta Densidad B2C...");

  // 1. Limpieza total de Tablas (Truncate)
  console.log("Limpiando DB...");
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.event.deleteMany();
  await prisma.promo.deleteMany();
  await prisma.product.deleteMany();
  await prisma.driver.deleteMany();
  await prisma.user.deleteMany();

  // 2. Creando Usuario Omnipotente Admin/Guest
  console.log("Inyectando Identidades...");
  const adminHost = await prisma.user.create({
     data: {
        name: "Asombro Master Admin",
        email: "admin@asombropizza.com",
        password: "secret_admin_hash_123"
     }
  });

  const guest = await prisma.user.create({
     data: {
        name: "Invitado Demo",
        email: "webguest@asombropizza.com",
        password: "encrypted_123"
     }
  });

  // 3. Creando Repartidores
  console.log("Contratando Repartidores...");
  await prisma.driver.createMany({
     data: [
       { name: "Carlos Rayo", phone: "555-1212", vehicle: "Moto Italika 150", status: "AVAILABLE" },
       { name: "Diana Turbo", phone: "555-3434", vehicle: "Bicicleta Eléctrica", status: "BUSY" },
       { name: "Beto Corredor", phone: "555-9090", vehicle: "Moto Vento 200", status: "AVAILABLE" },
     ]
  });

  // 4. Creando Productos (Pizzas, Bebidas, Combos)
  console.log("Cocinando el Menú Mágico...");
  await prisma.product.createMany({
     data: [
       { name: "La Famosa Hawaiana", description: "Piña asada, jamón ahumado y queso artesanal.", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38", category: "Pizza", cost: 60, price: 199.00 },
       { name: "Pepperoni Supremo", description: "Doble carne, doble queso, pura felicidad.", image: "https://images.unsplash.com/photo-1628840042765-356cda07504e", category: "Pizza", cost: 70, price: 210.00 },
       { name: "Veggie Lover", description: "Champiñones, morrón, cebolla morada y aceitunas.", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002", category: "Pizza", cost: 50, price: 180.00 },
       { name: "4 Quesos Trufada", description: "Mozzarella, Gorgonzola, Parmesano, Provolone y aceite de trufa.", image: "https://images.unsplash.com/photo-1548369937-47519965c473", category: "Pizza", cost: 90, price: 280.00 },
       { name: "Combo Asombro", description: "Pizza Grande + Refresco de 2L + Cheesy Bread.", image: "https://images.unsplash.com/photo-1555072956-7758afb20e8f", category: "Combos", cost: 120, price: 350.00 },
       { name: "Refresco de Cola 2L", description: "Bien fría.", image: "https://upload.wikimedia.org/wikipedia/commons/e/e8/15-09-26-Ralf-Roletschek-Wien-017.jpg", category: "Bebidas", cost: 20, price: 55.00 },
       { name: "Brownie Volcánico", description: "Con nieve de vainilla.", image: "https://images.unsplash.com/photo-1624353365286-dbf8dd9ffae4", category: "Postres", cost: 30, price: 85.00 }
     ]
  });

  // 5. Creando Promociones
  console.log("Activando Motores FOMO (Promociones)...");
  await prisma.promo.createMany({
     data: [
       { title: "2x1 Pizzeras", code: "DOSXUNO", description: "En la compra de tu pizza favorita llévate la segunda gratis las noches de Martes.", badgeText: "Oferta Estrella", type: "PERCENTAGE", discount: 50, imageUrl: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3" },
       { title: "$100 de Descuento", code: "ASOMBRO100", description: "Ingresa este en tu checkout para 100 pesos de cashback en caja.", badgeText: "Para Nuevos", type: "FLAT", discount: 100, imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38" }
     ]
  });

  // 6. Creando los Eventos Épicos 
  console.log("Organizando Fiestas y Reservas (Fase 5)...");
  const evt1 = await prisma.event.create({
     data: {
       title: "🍕 Neapolitan Night x Boiler Room",
       description: "Una experiencia inmersiva donde la alta gastronomía italiana se une a los ritmos electrónicos. DJ Set sorpresa.",
       imageUrl: "https://images.unsplash.com/photo-1574406280735-351fc1a7c5e0",
       date: new Date(Date.now() + 86400000 * 3), // +3 days
       capacity: 150,
       price: 350.0,
       category: "Fiesta Exclusiva",
       status: "ACTIVE"
     }
  });

  const evt2 = await prisma.event.create({
     data: {
       title: "🎤 Noche de Comedia Asombro",
       description: "Ríete en la terraza. 3 Comediantes locales. Mesas VIP.",
       imageUrl: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca",
       date: new Date(Date.now() + 86400000 * 6), // +6 days
       capacity: 50,
       price: 200.0,
       category: "Stand-Up & Comedia",
       status: "ACTIVE"
     }
  });

  const evt3 = await prisma.event.create({
     data: {
       title: "👨‍🍳 Masterclass: Masa Madre",
       description: "Taller inmersivo privado. Aprende los secretos de nuestra masa.",
       imageUrl: "https://images.unsplash.com/photo-1590947132387-155cc02f3212",
       date: new Date(Date.now() + 86400000 * 12), // +12 days
       capacity: 12,
       price: 850.0,
       category: "Workshop Educativo",
       status: "ACTIVE"
     }
  });

  const evt4 = await prisma.event.create({
    data: {
      title: "🏆 Transmisión Final Champions",
      description: "Vivimos el deporte al máximo. Pantallas gigantes en el jardín. Cover gratuito, asegura mesa rápidamente.",
      imageUrl: "https://images.unsplash.com/photo-1508344928928-7165b67de128",
      date: new Date(Date.now() + 86400000 * 15),
      capacity: 80,
      price: 0.0,
      category: "Sports Bar",
      status: "ACTIVE"
    }
  });

  // 7. Dummy Ticketing & Booking (Sembrado Mágico para el KPI Dashboard)
  console.log("Simulando Compras de Clientes Fantasma...");
  await prisma.ticket.createMany({
     data: [
        { eventId: evt1.id, userId: guest.id, price: 350.0 },
        { eventId: evt1.id, userId: guest.id, price: 350.0 },
        { eventId: evt1.id, userId: guest.id, price: 350.0 },
        { eventId: evt2.id, userId: guest.id, price: 200.0 },
        { eventId: evt3.id, userId: guest.id, price: 850.0 }
     ]
  });

  await prisma.reservation.createMany({
     data: [
        { eventId: evt4.id, userId: guest.id, partySize: 4, time: "20:00" },
        { eventId: evt4.id, userId: guest.id, partySize: 6, time: "20:30" },
        { eventId: evt2.id, userId: guest.id, partySize: 2, time: "19:00" }
     ]
  });

  console.log("Configurando la personalidad de AsombroBot...");
  await prisma.storeSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      deliveryFee: 35.0,
      minOrderTotal: 150.0,
      botEnabled: true,
      botPrompt: "Eres AsombroBot, el asistente virtual de Asombro Pizza. Eres amable, usas emojis y siempre intentas ayudar al cliente a pedir su pizza favorita o reservar para eventos."
    }
  });

  console.log("🚀 SEMBRADO COMPLETADO AL 100%. EL SISTEMA ES AHORA UN UNICORNIO. 🦄");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

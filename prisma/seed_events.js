const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Event 1: Themed Party
  await prisma.event.create({
    data: {
      title: "🍕 Neapolitan Night x Boiler Room",
      description: "Una experiencia inmersiva donde la alta gastronomía italiana se une a los mejores ritmos electrónicos. DJ Set de artistas sorpresa, luces de neón y las mejores pizzas napolitanas ilimitadas hasta media noche.",
      imageUrl: "https://images.unsplash.com/photo-1574406280735-351fc1a7c5e0?",
      date: new Date(Date.now() + 86400000 * 3), // +3 days
      capacity: 150,
      price: 350.0,
      category: "Fiesta Exclusiva",
      status: "ACTIVE"
    }
  });

  // Event 2: Stand Up
  await prisma.event.create({
    data: {
      title: "🎤 Noche de Comedia Asombro",
      description: "Ríete hasta llorar en la terraza principal. 3 Comediantes locales probando material con barra de destilados al 2x1 toda la noche. Un formato íntimo con mesas exclusivas.",
      imageUrl: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?",
      date: new Date(Date.now() + 86400000 * 6), // +6 days
      capacity: 50,
      price: 200.0,
      category: "Stand-Up Comedy",
      status: "ACTIVE"
    }
  });

  // Event 3: Masterclass (Very low capacity = FOMO trigger)
  await prisma.event.create({
    data: {
      title: "👨‍🍳 Masterclass: Masa Madre",
      description: "Taller inmersivo privado. Aprende los secretos de nuestra masa fermentada directamente con los maestros pizzeros. Incluye mandil, cena y degustación.",
      imageUrl: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?",
      date: new Date(Date.now() + 86400000 * 12), // +12 days
      capacity: 12,
      price: 850.0,
      category: "Taller Cultural",
      status: "ACTIVE"
    }
  });

  // Event 4: Sport Final (FREE / Reserve Table trigger)
  await prisma.event.create({
    data: {
      title: "🏆 Transmisión Final Champions",
      description: "Vivimos el deporte al máximo. Pantallas gigantes en el jardín, promociones por cada gol y cerveza artesanal tirada. Cover es completamente gratuito, solo asegura tu mesa a tiempo.",
      imageUrl: "https://images.unsplash.com/photo-1508344928928-7165b67de128?",
      date: new Date(Date.now() + 86400000 * 15),
      capacity: 80,
      price: 0.0,
      category: "Sports Bar",
      status: "ACTIVE"
    }
  });

  console.log("¡Eventos Inyectados en Base de Datos de Prueba!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

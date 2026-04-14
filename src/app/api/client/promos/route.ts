import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const promos = await prisma.promo.findMany({
      where: {
        active: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // If database is empty, return some hardcoded mocks for the MVP wow factor
    if (promos.length === 0) {
      return NextResponse.json([{
         id: "mock1",
         title: "Viernes de Locura",
         code: "VIERNES20",
         description: "Lleva un 20% de descuento en todo el carrito aplicable a reservas nocturnas.",
         imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop",
         badgeText: "🔥 Tiempo limitado",
         discount: 20,
         type: "PERCENTAGE"
      },
      {
         id: "mock2",
         title: "Combo Oficina",
         code: "OFICINA",
         description: "Lleva 2 pizzas clásicas con envío gratis pagando solo $350. Ideal para equipos.",
         imageUrl: "https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=2000&auto=format&fit=crop",
         badgeText: "Recomendado",
         discount: 350,
         type: "COMBO"
      }]);
    }

    return NextResponse.json(promos);
  } catch (error) {
    console.error("Prisma Promos Error:", error);
    return NextResponse.json({ error: "Failed to fetch promotions" }, { status: 500 });
  }
}

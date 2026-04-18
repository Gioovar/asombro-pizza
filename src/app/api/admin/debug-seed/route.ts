import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log("🔥 Emergency Data Synchronization Initiated...");

    // 1. Full Clear
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.reservation.deleteMany();
    await prisma.ticket.deleteMany();
    await prisma.event.deleteMany();
    await prisma.promo.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.driver.deleteMany();
    // we keep users to avoid locking them out

    // 2. Categories
    const catPizzasEsp = await prisma.category.create({ data: { name: "Pizzas — Especialidades", order: 1 } });
    const catPizzasClas = await prisma.category.create({ data: { name: "Pizzas — Clásicas", order: 2 } });
    const catAlitas = await prisma.category.create({ data: { name: "Alitas & Boneless", order: 3 } });
    const catSnacks = await prisma.category.create({ data: { name: "Entradas Artesanales", order: 4 } });
    const catBebidas = await prisma.category.create({ data: { name: "Mixología & Bebidas", order: 5 } });

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

    // 3. Products with Tactical IDs
    await prisma.product.createMany({
      data: [
        { 
          id: "brooklyn-double-meat",
          name: "Brooklyn Double Meat", 
          description: "Masa madre 72h + pepperoni artesanal + salchicha italiana. El alma de NY.", 
          image: "https://images.unsplash.com/photo-1513104890138-7c749659a591", 
          cost: 150, price: 340, categoryId: catPizzasEsp.id, config: pizzaSizesConfig 
        },
        { 
          id: "meat-lovers",
          name: "Meat Lovers", 
          description: "Pepperoni grueso + chorizo italiano + jamón ahumado + tocino + mozzarella.", 
          image: "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c", 
          cost: 140, price: 310, categoryId: catPizzasEsp.id, config: pizzaSizesConfig 
        },
        { 
          id: "bbq-chicken",
          name: "BBQ Chicken", 
          description: "Pollo marinado + salsa BBQ artesanal + tocino + cebolla morada.", 
          image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38", 
          cost: 130, price: 295, categoryId: catPizzasEsp.id, config: pizzaSizesConfig 
        },
        { 
          id: "lasagna-pizza",
          name: "Lasagna Pizza", 
          description: "Carne molida + ricota + salsa San Marzano + especias de la nonna.", 
          image: "https://images.unsplash.com/photo-1574129810554-7291008d440c", 
          cost: 145, price: 315, categoryId: catPizzasEsp.id, config: pizzaSizesConfig 
        },
        { 
          id: "mortazza",
          name: "Mortazza", 
          description: "Mortadela de Bolonia + stracciatella fresca + lluvia de pistache.", 
          image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e", 
          cost: 180, price: 380, categoryId: catPizzasEsp.id, config: pizzaSizesConfig 
        },
        { 
          id: "alitas-new",
          name: "Signature Wings", 
          description: "Alitas premium marinadas en salsa BBQ ahumada.", 
          image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec", 
          cost: 120, price: 280, categoryId: catAlitas.id 
        },
        { 
          id: "boneless-new",
          name: "Boneless Premium", 
          description: "Pechuga artesanal bañada en salsa Buffalo de la casa.", 
          image: "https://images.unsplash.com/photo-1569058242253-92a9c71f986d", 
          cost: 120, price: 280, categoryId: catAlitas.id 
        },
        { 
          id: "refresco-clasico",
          name: "Bebidas Curadas", 
          description: "Selección de bebidas para acompañar tu experiencia.", 
          image: "https://images.unsplash.com/photo-1622483767028-3f66f361ef56", 
          cost: 30, price: 65, categoryId: catBebidas.id 
        },
      ]
    });

    // 4. Promotions
    await prisma.promo.createMany({
       data: [
         { title: "First Order VIP", code: "SQUAD10", description: "10% de descuento en tu primer pedido.", badgeText: "SQUAD10", type: "PERCENTAGE", discount: 10, active: true, imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591" },
       ]
    });

    // 5. App Settings
    await prisma.storeSettings.upsert({
       where: { id: "default_settings" }, // Assuming we have a standard ID
       update: { botEnabled: true, deliveryFee: 45, minOrderTotal: 250 },
       create: { id: "default_settings", botEnabled: true, deliveryFee: 45, minOrderTotal: 250, botPrompt: "Eres Asombro Concierge." }
    });

    return NextResponse.json({ 
       success: true, 
       message: "Database Synchronized with Tactical IDs.",
       productsCount: 8,
       categoriesCount: 5
    });
  } catch (error: any) {
    console.error("Debug Seed Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

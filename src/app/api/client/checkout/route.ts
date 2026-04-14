import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { items, total, userId, address, tip, paymentType } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 });
    }

    // Creating order and connecting order items
    const order = await prisma.order.create({
      data: {
        userId: userId || null,
        customerName: userId ? undefined : "Invitado " + Math.floor(Math.random() * 1000),
        address: address || "Mostrador Web",
        tip: tip || 0.0,
        status: "NEW",
        total: parseFloat(total),
        payment: paymentType || "CASH",
        items: {
          create: items.map((item: any) => ({
            productId: item.id, // Assuming cart item ID is Prisma ID
            quantity: item.quantity,
            price: item.price
          }))
        }
      }
    });

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error("Checkout Error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

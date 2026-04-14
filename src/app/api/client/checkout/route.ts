import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "fallback_super_secret_asombro_key_2026";

export async function POST(req: Request) {
  try {
    const { items, total, address, tip, paymentType } = await req.json();
    
    // 0. User Resolution via JWT
    let finalUserId: string | null = null;
    const authHeader = req.headers.get('authorization');
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        finalUserId = decoded.userId;
      } catch (e) {
        console.warn("Invalid token in checkout attempt");
      }
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 });
    }

    // Creating order and connecting order items
    const order = await prisma.order.create({
      data: {
        userId: finalUserId,
        customerName: finalUserId ? undefined : "Invitado " + Math.floor(Math.random() * 1000),
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

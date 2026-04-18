import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: { 
        items: { include: { product: true } },
        driver: true
      }
    });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener pedidos" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;

    const order = await prisma.order.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar pedido" }, { status: 500 });
  }
}

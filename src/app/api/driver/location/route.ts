import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { orderId, lat, lng } = await req.json();
    if (!orderId || lat === undefined || lng === undefined) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }
    await prisma.order.update({
      where: { id: orderId },
      data: { driverLat: lat, driverLng: lng },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error de servidor" }, { status: 500 });
  }
}

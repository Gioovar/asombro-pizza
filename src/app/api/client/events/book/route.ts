import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "fallback_super_secret_asombro_key_2026";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Debes iniciar sesión para comprar boletos" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    let userId: string;

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      userId = decoded.userId;
    } catch (e) {
      return NextResponse.json({ error: "Sesión inválida" }, { status: 401 });
    }

    const { eventId, type = "GENERAL", partySize = 1 } = await req.json();

    const event = await prisma.event.findUnique({
      where: { id: eventId }
    });

    if (!event) {
      return NextResponse.json({ error: "Evento no encontrado" }, { status: 404 });
    }

    // Check capacity
    const ticketCount = await prisma.ticket.count({
      where: { eventId }
    });

    if (ticketCount >= event.capacity) {
      return NextResponse.json({ error: "Agotado: No hay más boletos disponibles" }, { status: 400 });
    }

    // Create Ticket
    const ticket = await prisma.ticket.create({
      data: {
        eventId,
        userId,
        type,
        price: event.price,
        status: "VALID"
      },
      include: {
          event: true
      }
    });

    // If it's a table reservation, sync with the Reservation model
    if (type === "TABLE_RESERVATION") {
       await prisma.reservation.create({
          data: {
             eventId,
             userId,
             partySize: parseInt(partySize.toString()),
             time: event.date.toLocaleTimeString("es-MX", { hour: '2-digit', minute: '2-digit' }),
             date: event.date,
             status: "CONFIRMED"
          }
       });
    }

    return NextResponse.json({
      success: true,
      message: "¡Boleto adquirido con éxito!",
      ticket
    });

  } catch (error: any) {
    console.error("Booking Error:", error);
    return NextResponse.json({ error: "Error al procesar la compra" }, { status: 500 });
  }
}

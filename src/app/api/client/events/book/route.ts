import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { actionType, eventId, userId, partySize, price, ticketType } = await req.json();

    if (!eventId) {
      return NextResponse.json({ error: "No event ID provided" }, { status: 400 });
    }

    let targetUserId = userId;
    if (!targetUserId) {
        // Find or create fallback guest user instantly to satisfy DB relations
        let guest = await prisma.user.findFirst({ where: { email: "webguest@asombropizza.com" }});
        if (!guest) guest = await prisma.user.create({ data: { name: "Invitado Web", email: "webguest@asombropizza.com", password: "encrypted_123" } });
        targetUserId = guest.id;
    }

    // MODO A: Mesa de Restaurante
    if (actionType === "TABLE") {
       const reservation = await prisma.reservation.create({
          data: {
             eventId,
             userId: targetUserId, // Temporal ID for testing without Auth barrier
             partySize: partySize || 2,
             time: new Date().toLocaleTimeString(),
             status: "CONFIRMED"
          }
       });
       return NextResponse.json({ success: true, reservation });
    }

    // MODO B: Taquilla de Entrada
    if (actionType === "TICKET") {
       const ticket = await prisma.ticket.create({
          data: {
             eventId,
             userId: targetUserId,
             type: ticketType || "GENERAL",
             price: price || 0,
             status: "VALID"
          }
       });
       return NextResponse.json({ success: true, ticket });
    }

  } catch (error) {
    console.error("Booking API Error:", error);
    return NextResponse.json({ error: "Failed to process booking" }, { status: 500 });
  }
}

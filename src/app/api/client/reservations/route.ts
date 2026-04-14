import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { date, time, partySize, userId, name, email } = await req.json();

    if (!date || !time || !partySize) {
      return NextResponse.json({ error: "Faltan datos requeridos" }, { status: 400 });
    }

    // 1. Get Opening Hours
    const settings = await prisma.storeSettings.findFirst();
    const openingHours = settings?.openingHours ? JSON.parse(settings.openingHours) : {
      mon: { open: "13:00", close: "23:00" },
      tue: { open: "13:00", close: "23:00" },
      wed: { open: "13:00", close: "23:00" },
      thu: { open: "13:00", close: "23:00" },
      fri: { open: "13:00", close: "23:00" },
      sat: { open: "13:00", close: "23:00" },
      sun: { open: "13:00", close: "23:00" },
    };

    // 2. Validate Opening Hours
    const reservationDate = new Date(date);
    const dayOfWeek = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][reservationDate.getDay()];
    const dayConfig = openingHours[dayOfWeek];

    if (!dayConfig || dayConfig.closed) {
      return NextResponse.json({ error: "Estamos cerrados este día" }, { status: 400 });
    }

    const [reqHour, reqMin] = time.split(":").map(Number);
    const [openHour, openMin] = dayConfig.open.split(":").map(Number);
    const [closeHour, closeMin] = dayConfig.close.split(":").map(Number);

    const reqTotalMin = reqHour * 60 + reqMin;
    const openTotalMin = openHour * 60 + openMin;
    const closeTotalMin = closeHour * 60 + closeMin;

    if (reqTotalMin < openTotalMin || reqTotalMin > closeTotalMin) {
      return NextResponse.json({ error: `Horario no disponible. Abrimos de ${dayConfig.open} a ${dayConfig.close}` }, { status: 400 });
    }

    // 3. User Resolution (Use provided userId or find/create guest by email)
    let finalUserId = userId;
    if (!finalUserId && email) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (user) {
            finalUserId = user.id;
        } else {
            const newUser = await prisma.user.create({
                data: {
                    email,
                    name: name || "Cliente Reservación",
                    password: "guest_password_placeholder" // In a real app, use a better flow
                }
            });
            finalUserId = newUser.id;
        }
    }

    if (!finalUserId) {
        // Fallback to demo guest from seed if nothing provided
        const demoGuest = await prisma.user.findFirst({ where: { email: "webguest@asombropizza.com" } });
        finalUserId = demoGuest?.id;
    }

    // 4. Create Reservation
    const reservation = await prisma.reservation.create({
      data: {
        userId: finalUserId,
        partySize: parseInt(partySize),
        time: time,
        date: new Date(date),
        status: "CONFIRMED"
      }
    });

    return NextResponse.json({ 
        success: true, 
        message: "¡Mesa reservada con éxito! Te esperamos.",
        reservation 
    });

  } catch (error: any) {
    console.error("Reservation Error:", error);
    return NextResponse.json({ error: "Error interno al procesar la reservación" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: "desc" },
      include: { tickets: true, reservations: true }
    });
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const event = await prisma.event.create({
      data: {
        title: body.title,
        description: body.description,
        imageUrl: body.imageUrl,
        date: new Date(body.date),
        capacity: parseInt(body.capacity),
        price: parseFloat(body.price),
        category: body.category || "Fiesta",
        status: body.status || "ACTIVE",
      },
    });
    return NextResponse.json(event);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    
    if (data.date) data.date = new Date(data.date);
    if (data.capacity) data.capacity = parseInt(data.capacity);
    if (data.price) data.price = parseFloat(data.price);

    const event = await prisma.event.update({
      where: { id },
      data,
    });
    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await prisma.event.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}

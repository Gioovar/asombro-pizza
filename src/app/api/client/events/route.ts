import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      where: { status: "ACTIVE" },
      orderBy: { date: "asc" }
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("Events API Error:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

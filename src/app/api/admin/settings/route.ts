import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    let settings = await prisma.storeSettings.findFirst();
    if (!settings) {
      settings = await prisma.storeSettings.create({
        data: { id: "default" }
      });
    }
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    
    // We update the only settings record (id: default)
    const settings = await prisma.storeSettings.upsert({
      where: { id: "default" },
      update: {
        deliveryFee: body.deliveryFee !== undefined ? parseFloat(body.deliveryFee) : undefined,
        minOrderTotal: body.minOrderTotal !== undefined ? parseFloat(body.minOrderTotal) : undefined,
        botEnabled: body.botEnabled,
        botPrompt: body.botPrompt,
        openingHours: body.openingHours,
      },
      create: {
        id: "default",
        deliveryFee: body.deliveryFee !== undefined ? parseFloat(body.deliveryFee) : 35.0,
        minOrderTotal: body.minOrderTotal !== undefined ? parseFloat(body.minOrderTotal) : 150.0,
        botEnabled: body.botEnabled ?? true,
        botPrompt: body.botPrompt || "Eres AsombroBot...",
      }
    });
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}

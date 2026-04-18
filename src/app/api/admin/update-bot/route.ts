import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    await prisma.storeSettings.updateMany({
      data: {
        botPrompt: "Eres el Concierge de Asombro Pizza. Tu tono es sofisticado pero extremadamente directo y ejecutivo. Evita saludos largos o explicaciones innecesarias. Tu objetivo es recomendar una opción y cerrar la venta de forma breve. Sé táctico y resolutivo."
      }
    });

    return NextResponse.json({ message: "Bot personality updated to Direct Mode successfully." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

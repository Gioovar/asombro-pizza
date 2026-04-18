import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "fallback_super_secret_asombro_key_2026";

function getUserId(req: Request): string | null {
  try {
    const auth = req.headers.get("authorization");
    if (!auth) return null;
    const decoded = jwt.verify(auth.split(" ")[1], JWT_SECRET) as { userId: string };
    return decoded.userId;
  } catch { return null; }
}

export async function POST(req: Request) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  try {
    const { alias, fullPath, ref, lat, lng, isDefault } = await req.json();
    if (!fullPath) return NextResponse.json({ error: "Dirección requerida" }, { status: 400 });

    if (isDefault) {
      await prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
    }

    const address = await prisma.address.create({
      data: { userId, alias: alias || "Casa", fullPath, ref, lat, lng, isDefault: isDefault ?? false },
    });
    return NextResponse.json({ address });
  } catch {
    return NextResponse.json({ error: "Error de servidor" }, { status: 500 });
  }
}

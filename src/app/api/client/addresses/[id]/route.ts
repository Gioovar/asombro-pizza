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

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { id } = await context.params;

  try {
    const body = await req.json();
    if (body.isDefault) {
      await prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
    }
    const address = await prisma.address.update({
      where: { id, userId },
      data: body,
    });
    return NextResponse.json({ address });
  } catch {
    return NextResponse.json({ error: "Error de servidor" }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { id } = await context.params;

  try {
    await prisma.address.delete({ where: { id, userId } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error de servidor" }, { status: 500 });
  }
}

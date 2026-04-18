import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "fallback_super_secret_asombro_key_2026";

function getUserId(req: Request): string | null {
  try {
    const auth = req.headers.get("authorization");
    if (!auth) return null;
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded.userId;
  } catch {
    return null;
  }
}

export async function PATCH(req: Request) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  try {
    const body = await req.json();
    const { name, phone, avatar, currentPassword, newPassword } = body;

    const updateData: Record<string, any> = {};
    if (name)   updateData.name   = name;
    if (phone !== undefined) updateData.phone = phone;
    if (avatar !== undefined) updateData.avatar = avatar;

    if (newPassword) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
      const match = await bcrypt.compare(currentPassword, user.password);
      if (!match) return NextResponse.json({ error: "Contraseña actual incorrecta" }, { status: 400 });
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    const updated = await prisma.user.update({ where: { id: userId }, data: updateData });
    return NextResponse.json({ user: { id: updated.id, name: updated.name, email: updated.email, phone: updated.phone, avatar: updated.avatar } });
  } catch {
    return NextResponse.json({ error: "Error de servidor" }, { status: 500 });
  }
}

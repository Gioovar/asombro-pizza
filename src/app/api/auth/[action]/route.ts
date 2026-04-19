import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "fallback_super_secret_asombro_key_2026";

async function handleMe(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return NextResponse.json({ error: "No token provided" }, { status: 401 });
  
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await prisma.user.findUnique({ 
       where: { id: decoded.userId },
       include: { 
           addresses: true, 
           payments: true,
           reservations: {
               orderBy: { date: 'desc' }
           },
           tickets: {
               include: { event: true },
               orderBy: { createdAt: 'desc' }
           },
           orders: {
               include: { 
                   items: { include: { product: true } } 
               },
               orderBy: { createdAt: 'desc' }
           }
       }
    });
    if (!user) throw new Error("Not found");
    return NextResponse.json({ user });
  } catch(e) {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }
}

export async function GET(req: Request, context: { params: Promise<{ action: string }> }) {
  const { action } = await context.params;
  if (action === "me") return handleMe(req);
  return NextResponse.json({ error: "Ruta desconocida" }, { status: 404 });
}

export async function POST(req: Request, context: { params: Promise<{ action: string }> }) {
  try {
    const { action } = await context.params;
    
    if (action === "me") return handleMe(req);

    const body = await req.json();

    if (action === "register") {
      const { name, email, password, phone } = body;
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) return NextResponse.json({ error: "Email ya registrado." }, { status: 400 });

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { name, email, password: hashedPassword, phone }
      });

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
      return NextResponse.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    }

    if (action === "login") {
      const { email, password } = body;
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return NextResponse.json({ error: "Credenciales inválidas." }, { status: 401 });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return NextResponse.json({ error: "Credenciales inválidas." }, { status: 401 });

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
      return NextResponse.json({ token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone, avatar: user.avatar } });
    }

    return NextResponse.json({ error: "Ruta desconocida" }, { status: 404 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error de Servidor" }, { status: 500 });
  }
}

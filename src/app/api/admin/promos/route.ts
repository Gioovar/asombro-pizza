import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const promos = await prisma.promo.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(promos);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch promos" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const promo = await prisma.promo.create({
      data: {
        title: body.title,
        code: body.code.toUpperCase(),
        description: body.description,
        discount: parseFloat(body.discount),
        type: body.type || "PERCENTAGE",
        imageUrl: body.imageUrl || null,
        badgeText: body.badgeText || null,
        active: body.active ?? true,
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
      },
    });
    return NextResponse.json(promo);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create promo" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    
    if (data.discount) data.discount = parseFloat(data.discount);
    if (data.code) data.code = data.code.toUpperCase();
    if (data.expiresAt) data.expiresAt = new Date(data.expiresAt);

    const promo = await prisma.promo.update({
      where: { id },
      data,
    });
    return NextResponse.json(promo);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update promo" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await prisma.promo.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete promo" }, { status: 500 });
  }
}

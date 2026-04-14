import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // In a real system, we'd query by unassigned orders in specific geo-fencing.
    // Here we query for orders that are "READY" (listos para despacho) and have no driver assigned.
    const pendingOrders = await prisma.order.findMany({
      where: { 
        status: "READY",
        driverId: null
      },
      include: {
         items: { include: { product: true } }
      },
      orderBy: { createdAt: 'asc' },
      take: 1
    });

    if (pendingOrders.length > 0) {
       return NextResponse.json({ pending: true, order: pendingOrders[0] });
    }

    return NextResponse.json({ pending: false });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch ping" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { orderId, action, driverId } = await req.json();
    
    // Accept or reject logic
    if (action === "ACCEPT") {
       const updatedOrder = await prisma.order.update({
         where: { id: orderId },
         data: { 
            status: "ON_WAY", 
            driverId: driverId 
         }
       });
       
       // Update driver status to Busy
       await prisma.driver.update({
         where: { id: driverId },
         data: { status: "BUSY" }
       });
       
       return NextResponse.json({ success: true, order: updatedOrder });
    }

    if (action === "DELIVERED") {
       const updatedOrder = await prisma.order.update({
         where: { id: orderId },
         data: { status: "DELIVERED" }
       });

       await prisma.driver.update({
         where: { id: driverId },
         data: { status: "AVAILABLE" }
       });
       
       return NextResponse.json({ success: true, order: updatedOrder });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to perform action" }, { status: 500 });
  }
}

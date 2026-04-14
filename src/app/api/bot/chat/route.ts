import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// This is the Brain of AsombroBot. 
export async function POST(req: Request) {
  try {
    const { messages, userId } = await req.json();
    const lastMessage = messages[messages.length - 1]?.content.toLowerCase() || "";

    // RAG (Retrieval-Augmented Generation)
    // 1. Fetch available Menu
    const products = await prisma.product.findMany({ select: { id: true, name: true, price: true, category: true }});
    // 2. Fetch Active Promos
    const promos = await prisma.promo.findMany({ where: { active: true }});
    // 3. Fetch specific Bot instructions from settings
    const settings = await prisma.storeSettings.findFirst();

    // RAG Payload Generation (This is what you'd feed to GPT-4 as an initial System Prompt)
    const storeContext = {
      menu: products,
      promos: promos,
      events: await prisma.event.findMany({ where: { status: "ACTIVE" } }),
      persona: settings?.botPrompt || "Eres un cajero amable."
    };

    // --- MOCK OPENAI FUNCTION CALLING RESPONSES ---
    await new Promise(r => setTimeout(r, 1200)); // Simulate LLM Latency

    // NEW LOGIC: Event Routing
    if (lastMessage.includes("evento") || lastMessage.includes("cartelera") || lastMessage.includes("boletos")) {
       const activeEvents = storeContext.events.map(e => `*${e.title}*`).join(", ");
       return NextResponse.json({
          reply: `¡Tenemos eventos increíbles! Próximamente: ${activeEvents || 'Ninguno programado'}. Dime si quieres 'comprar boletos' o 'reservar mesa'.`
       });
    }

    if (lastMessage.includes("reservar") || lastMessage.includes("mesa")) {
       return NextResponse.json({
          reply: `¡Excelente! Te abrí la ventana para que elijas cuántas personas son y apartes tu mesa sin costo.`,
          system_action: { type: "OPEN_EVENT_MODAL" } // We will listen to this in frontend
       });
    }

    if (lastMessage.includes("comprar") && (lastMessage.includes("boleto") || lastMessage.includes("ticket") || lastMessage.includes("entrada"))) {
       return NextResponse.json({
          reply: `¡Perfecto! Te estoy enviando a la terminal de pago de nuestro próximo Evento. Selecciona tu ticket y procede con la tarjeta.`,
          system_action: { type: "OPEN_EVENT_MODAL" }
       });
    }

    // Fake NLP Routing rules based on the injected context
    if (lastMessage.includes("promociones") || lastMessage.includes("ofertas") || lastMessage.includes("descuentos")) {
       const activeTitles = promos.map(p => `*${p.title}* (${p.type === 'PERCENTAGE' ? p.discount+'%' : p.discount})`).join(", ");
       return NextResponse.json({
          reply: `¡Claro! Hoy tenemos estas joyitas: ${activeTitles || 'Por ahora nada'}. ¿Te sirvo algo?`
       });
    }

    if (lastMessage.includes("hawaiana") || lastMessage.includes("piña")) {
       const hawaiana = products.find(p => p.name.toLowerCase().includes("hawaiana"));
       if (!hawaiana) return NextResponse.json({ reply: "¡Ay! Por el momento se nos agotó la Hawaiana. ¿Quisieras la de Pepperoni?" });
       
       if (lastMessage.includes("quiero") || lastMessage.includes("dame") || lastMessage.includes("agrega")) {
          return NextResponse.json({
            reply: `¡Entendido! Una Hawaiana de camino a tu carrito. 🛒 ¿Gustas agregar un refresco o confirmo tu pedido?`,
            system_action: {
               type: "ADD_TO_CART",
               items: [hawaiana]
            }
          });
       } else {
          return NextResponse.json({ reply: `¡La Hawaiana cuesta $${hawaiana.price} MXN y es deliciosa! ¿Te la pongo en el carrito?` });
       }
    }
    
    if (lastMessage.includes("pagar") || lastMessage.includes("confirmar") || lastMessage.includes("listo")) {
       return NextResponse.json({
           reply: "¡Excelente! Procesando tu orden... Ve al botón rojo de 'Proceder al Pago' para finalizar.",
           system_action: { type: "OPEN_CHECKOUT" }
       });
    }

    // Default Fallback Fake LLM
    return NextResponse.json({
       reply: "Entiendo. Sin embargo soy un asistente simulado en esta demo. Pídeme 'promociones', 'quiero una hawaiana', o pregúntame por 'eventos' para ver mis poderes SaaS."
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Brain malfunction" }, { status: 500 });
  }
}

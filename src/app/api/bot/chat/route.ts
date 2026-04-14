import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { askGemini } from "@/lib/gemini";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { messages, userId } = await req.json();

    // 1. Fetch RAG Context
    const products = await prisma.product.findMany({ select: { id: true, name: true, price: true, category: true, description: true }});
    const promos = await prisma.promo.findMany({ where: { active: true }});
    const events = await prisma.event.findMany({ where: { status: "ACTIVE" }});
    const settings = await prisma.storeSettings.findFirst();

    // 2. Format History (Gemini requires alternating roles starting with 'user')
    // We filter the initial bot message if it's the first one to keep sequence pure user -> model -> user
    const history = messages
      .slice(0, -1)
      .filter((m: any, i: number) => !(i === 0 && m.sender === "bot")) 
      .map((m: any) => ({
          role: m.sender === "bot" ? "model" : "user",
          parts: [{ text: m.text }]
      }));
    const lastMessage = messages[messages.length - 1]?.text || "";

    // 3. Build System Prompt
    const systemPrompt = `
Eres AsombroBot, el asistente inteligente y apasionado de "Asombro Pizza".
Tu personalidad: ${settings?.botPrompt || "Amable, experto en pizzas de masa madre, divertido y servicial. Usa emojis."}

MENÚ ACTUAL:
${products.map(p => `- ${p.name} ($${p.price}): ${p.description}`).join("\n")}

PROMOCIONES:
${promos.map(p => `- ${p.title}: ${p.description}`).join("\n")}

EVENTOS PRÓXIMOS:
${events.map(e => `- ${e.title} (${new Date(e.date).toLocaleDateString()}): ${e.description}`).join("\n")}

REGLAS CRÍTICAS:
1. Solo recomienda productos que estén en el menú de arriba.
2. Si el cliente quiere reservar una mesa o ver disponibilidad, responde normalmente pero incluye al final el código exacto: [[ACTION_RESERVE]].
3. Si el cliente quiere pagar, confirmar su carrito o finalizar su pedido, responde normalmente e incluye al final: [[ACTION_CHECKOUT]].
4. Si el cliente pregunta por un evento específico o comprar boletos, incluye: [[ACTION_EVENTS]].
5. Sé breve y conversacional.

MENSAJE DEL USUARIO: ${lastMessage}
`;

    // 3. Get AI Response
    const aiReply = await askGemini(systemPrompt, history);

    // 4. Detect System Actions
    let systemAction = null;
    let cleanReply = aiReply;

    if (aiReply.includes("[[ACTION_RESERVE]]")) {
        systemAction = { type: "OPEN_RESERVATION" };
        cleanReply = cleanReply.replace("[[ACTION_RESERVE]]", "").trim();
    } else if (aiReply.includes("[[ACTION_CHECKOUT]]")) {
        systemAction = { type: "OPEN_CHECKOUT" };
        cleanReply = cleanReply.replace("[[ACTION_CHECKOUT]]", "").trim();
    } else if (aiReply.includes("[[ACTION_EVENTS]]")) {
        systemAction = { type: "OPEN_EVENT_MODAL" };
        cleanReply = cleanReply.replace("[[ACTION_EVENTS]]", "").trim();
    }

    return NextResponse.json({
        reply: cleanReply,
        system_action: systemAction
    });

  } catch (error: any) {
    console.error("Bot Error:", error);
    const isApiKeyError = error.message.includes("GEMINI_API_KEY") || error.message.includes("API key");
    
    return NextResponse.json({ 
        reply: isApiKeyError 
            ? "🔑 ¡Falta mi llave de energía! (Por favor configura GEMINI_API_KEY en Vercel para que pueda hablar)."
            : "¡Ups! Mi cerebro de pizza tuvo un pequeño cortocircuito. ¿Podrías repetirme eso? 🍕🔌",
        error: error.message 
    }, { status: 500 });
  }
}

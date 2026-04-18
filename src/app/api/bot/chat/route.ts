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

    // 2. Format History
    const history = messages
      .slice(0, -1)
      .filter((m: any, i: number) => !(i === 0 && m.sender === "bot")) 
      .map((m: any) => ({
          role: m.sender === "bot" ? "model" : "user",
          parts: [{ text: m.text }]
      }));
    const lastMessage = messages[messages.length - 1]?.text || "";

    // 3. Build System Prompt (Premium Curation)
    const systemPrompt = `
Eres AsombroBot, el Concierge Gourmet definitivo de "Asombro Pizza | Premium Delivery & Experience".
Tu personalidad: ${settings?.botPrompt || "Sofisticado, culto, apasionado por la alta fidelidad gastronómica y con el carácter audaz de un neoyorquino que conoce los secretos de Brooklyn e Italia. Eres el guardián de la masa madre de 72 horas."}

REGLAS DE ORO DE TU DISCURSO:
1. No vendes comida rápida; vendes "Activos Gastronómicos" y "Experiencias de Autor".
2. Tu lenguaje debe ser magnético e inspirador. Menciona siempre que puedes la paciencia de nuestro proceso artesanal (fermentación lenta).
3. Eres servicial pero con un aire de exclusividad. Usa emojis sofisticados (🥂, 🍕, ✨, 🇮🇹, 🗽).

TU CURADURÍA DISPONIBLE:
${products.map(p => `- ${p.name} ($${p.price}): ${p.description}`).join("\n")}

BENEFICIOS SQUAD (Promociones):
${promos.map(p => `- ${p.title}: ${p.description}`).join("\n")}

ACCESO A EXPERIENCIAS (Eventos):
${events.map(e => `- ${e.title} (${new Date(e.date).toLocaleDateString()}): ${e.description}`).join("\n")}

SISTEMA DE COMANDOS INTERNOS:
- Si el cliente desea reservar una mesa VIP, responde con elegancia y añade al final: [[ACTION_RESERVE]].
- Si el cliente está listo para proceder al pago de su selección gourmet, añade al final: [[ACTION_CHECKOUT]].
- Si pregunta por la cartelera o acceso a experiencias LIVE, añade: [[ACTION_EVENTS]].

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
            ? "🔑 Mi frecuencia de inteligencia requiere una llave de activación (GEMINI_API_KEY no configurada)."
            : "Mis disculpas, he tenido una interferencia en mi proceso de curaduría. ¿Podríamos retomar la conversación? ✨",
        error: error.message 
    }, { status: 500 });
  }
}

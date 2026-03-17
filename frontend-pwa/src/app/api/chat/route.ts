import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        const { message, context } = await req.json();
        const userId = session.user.id;

        // 1. Salvar mensagem do usuário
        await prisma.chatMessage.create({
            data: {
                userId,
                role: "user",
                content: message,
            },
        });

        // 2. Chamar Backend IA
        let apiIA = process.env.NEXT_PUBLIC_IA_URL || "http://localhost:8000";
        // Remover barra final se houver para evitar double slash
        if (apiIA.endsWith("/")) apiIA = apiIA.slice(0, -1);
        
        console.log(`[Chat API] Connecting to IA at: ${apiIA}`);
        
        let aiReply = "";
        try {
            const response = await fetch(`${apiIA}/api/chat/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: userId,
                    message,
                    context: context || {}
                }),
                // Aumentando o timeout para 45s para lidar com o "acordar" do Render Free
                signal: AbortSignal.timeout(45000) 
            });

            if (response.ok) {
                const data = await response.json();
                aiReply = data.reply;
            } else {
                const errorText = await response.text();
                console.error(`[Chat API] Erro no Backend IA (${response.status}):`, errorText);
                aiReply = "Estou processando muitas informações no momento. Pode repetir a pergunta em alguns instantes?";
            }
        } catch (fetchError: any) {
            console.error("[Chat API] Falha na requisição ao Backend IA:", fetchError);
            
            if (fetchError.name === 'TimeoutError') {
                aiReply = "O 'cérebro' da IA está acordando (isso leva cerca de 30-50 segundos na primeira vez). Por favor, tente enviar sua mensagem novamente em instantes.";
            } else {
                aiReply = "Desculpe, estou com dificuldades técnicas para me conectar ao meu cérebro principal no momento. Volte logo! (Nota: O servidor de IA pode estar offline ou inacessível)";
            }
        }

        // 3. Salvar resposta da IA (mesmo que seja o fallback)
        await prisma.chatMessage.create({
            data: {
                userId,
                role: "ai",
                content: aiReply,
            },
        });

        return NextResponse.json({ reply: aiReply });

    } catch (error) {
        console.error("Chat API Error:", error);
        return NextResponse.json({ error: "Erro interno no servidor de chat." }, { status: 500 });
    }
}

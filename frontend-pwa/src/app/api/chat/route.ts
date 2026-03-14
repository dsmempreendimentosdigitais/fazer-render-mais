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
        const apiIA = process.env.NEXT_PUBLIC_IA_URL || "http://localhost:8000";
        const response = await fetch(`${apiIA}/api/chat/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id: userId,
                message,
                context: context || {}
            })
        });

        if (!response.ok) {
            throw new Error("Erro de conexão com o Backend IA");
        }

        const data = await response.json();
        const aiReply = data.reply;

        // 3. Salvar resposta da IA
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

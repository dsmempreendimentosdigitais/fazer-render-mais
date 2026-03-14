import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        const userId = session.user.id;

        const messages = await prisma.chatMessage.findMany({
            where: { userId },
            orderBy: { createdAt: "asc" },
        });

        return NextResponse.json(messages);

    } catch (error) {
        console.error("Chat History API Error:", error);
        return NextResponse.json({ error: "Erro ao buscar histórico." }, { status: 500 });
    }
}

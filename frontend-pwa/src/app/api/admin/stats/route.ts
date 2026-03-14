import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.plan !== "ADMIN") {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        const totalUsers = await prisma.user.count();
        const freeUsers = await prisma.user.count({ where: { plan: "FREE" } });
        const plusUsers = await prisma.user.count({ where: { plan: "PLUS" } });
        const premiumUsers = await prisma.user.count({ where: { plan: "PREMIUM" } });

        // Cálculo de faturamento potencial (estimado)
        // PLUS: R$ 19,90 | PREMIUM: R$ 49,90
        const potentialMRR = (plusUsers * 19.90) + (premiumUsers * 49.90);

        // Conversão
        const conversionRate = totalUsers > 0 ? ((plusUsers + premiumUsers) / totalUsers) * 100 : 0;

        return NextResponse.json({
            totalUsers,
            byPlan: {
                FREE: freeUsers,
                PLUS: plusUsers,
                PREMIUM: premiumUsers
            },
            potentialMRR,
            conversionRate: conversionRate.toFixed(1) + "%"
        });

    } catch (error) {
        console.error("Stats API Error:", error);
        return NextResponse.json({ error: "Erro ao buscar estatísticas." }, { status: 500 });
    }
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;

        // Fetch User plus progress and badges mapped through Prisma Schema
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                name: true,
                email: true,
                plan: true,
                wealthCoins: true,
                currentStreak: true,
                highestStreak: true,
                score: true,
                objective: true,
                riskProfile: true,
                progress: {
                    select: {
                        lessonId: true,
                        trilhaId: true,
                        completedAt: true
                    }
                },
                badges: {
                    select: {
                        badgeId: true,
                        earnedAt: true
                    }
                }
            }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user);

    } catch (error) {
        console.error("GET /api/user mapping error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Email e senha são obrigatórios." }, { status: 400 });
        }

        if (password.length < 6) {
            return NextResponse.json({ error: "A senha deve ter pelo menos 6 caracteres." }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ error: "Este email já está cadastrado." }, { status: 400 });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
                plan: "FREE",
                objective: "Em definição",
                riskProfile: "Em Definição",
                wealthCoins: 10, // Bem vindo bonus
            },
        });

        return NextResponse.json(
            { message: "Usuário criado com sucesso!", userId: user.id },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Registrar erro:", error);
        return NextResponse.json(
            { 
                error: "Ocorreu um erro inesperado.", 
                details: error.message || String(error) 
            }, 
            { status: 500 }
        );
    }
}

import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const defaultPassword = await bcrypt.hash("Render123", 10);

    const users = [
        {
            email: "admin@fazerrendermais.com.br",
            name: "Administrador Supremo",
            passwordHash: defaultPassword,
            plan: "ADMIN",
            wealthCoins: 9999,
            score: 100,
        },
        {
            email: "free@fazerrendermais.com.br",
            name: "Usuário Grátis",
            passwordHash: defaultPassword,
            plan: "FREE",
            wealthCoins: 10,
            score: 0,
        },
        {
            email: "plus@fazerrendermais.com.br",
            name: "Usuário Plus",
            passwordHash: defaultPassword,
            plan: "PLUS",
            wealthCoins: 500,
            score: 45,
        },
        {
            email: "premium@fazerrendermais.com.br",
            name: "Usuário Premium",
            passwordHash: defaultPassword,
            plan: "PREMIUM",
            wealthCoins: 1200,
            score: 88,
        },
    ];

    for (const u of users) {
        const userExists = await prisma.user.findUnique({ where: { email: u.email } });
        if (!userExists) {
            await prisma.user.create({ data: u });
            console.log(`✅ Usuário criado: ${u.email} (Senha: Render123) / Plano: ${u.plan}`);
        } else {
            console.log(`⚠️ Usuário já existe: ${u.email}`);
        }
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

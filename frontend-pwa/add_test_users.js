const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function addUsers() {
    try {
        const passwordHash = await bcrypt.hash("Render123", 10);

        const usersToAdd = [
            {
                email: "plus@fazerrendermais.com.br",
                name: "Usuário Plus",
                passwordHash,
                plan: "PLUS",
                wealthCoins: 500,
            },
            {
                email: "premium@fazerrendermais.com.br",
                name: "Usuário Premium",
                passwordHash,
                plan: "PREMIUM",
                wealthCoins: 1200,
            }
        ];

        for (const u of usersToAdd) {
            await prisma.user.upsert({
                where: { email: u.email },
                update: {
                    passwordHash: u.passwordHash,
                    plan: u.plan
                },
                create: u
            });
            console.log(`Usuário ${u.email} garantido no banco.`);
        }

    } catch (error) {
        console.error("Erro ao adicionar usuários:", error);
    } finally {
        await prisma.$disconnect();
    }
}

addUsers();

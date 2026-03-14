const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

async function exportUsers() {
    try {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: "desc" },
            select: {
                name: true,
                email: true,
                plan: true,
                createdAt: true,
                lastLoginDate: true
            }
        });

        const filePath = path.join(__dirname, "users_list.txt");
        let content = "LISTA DE USUÁRIOS - FAZER RENDER+\n";
        content += "====================================\n\n";

        users.forEach((u, i) => {
            content += `${i + 1}. ${u.email}\n`;
            content += `   Nome: ${u.name || "N/A"}\n`;
            content += `   Plano: ${u.plan}\n`;
            content += `   Cadastro: ${u.createdAt.toLocaleDateString("pt-BR")}\n`;
            content += `   Último Acesso: ${u.lastLoginDate ? u.lastLoginDate.toLocaleDateString("pt-BR") : "Nunca"}\n`;
            content += "------------------------------------\n";
        });

        fs.writeFileSync(filePath, content);
        console.log(`Arquivo criado com sucesso: ${filePath}`);

    } catch (error) {
        console.error("Erro ao exportar usuários:", error);
    } finally {
        await prisma.$disconnect();
    }
}

exportUsers();

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Users, BookOpen, GraduationCap, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
    const session = await getServerSession(authOptions);

    // Proteção da Rota: Apenas os administradores do sistema podem acessar
    if (!session?.user || session.user.plan !== "ADMIN") {
        redirect("/dashboard");
    }

    // Dashboard Metrics Fetched dynamically for Admin
    const totalUsers = await prisma.user.count();
    const allUsers = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            name: true,
            email: true,
            plan: true,
            wealthCoins: true,
            createdAt: true
        }
    });

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-50 p-6 md:p-10 font-sans">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Superior Header Admin */}
                <header className="flex justify-between items-center border-b border-rose-500/30 pb-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400 tracking-tight flex items-center">
                            <ShieldAlert className="w-8 h-8 mr-3 text-rose-500" />
                            Painel de Administração
                        </h1>
                        <p className="text-slate-400 font-medium text-sm mt-1">Supervisão Geral do Sistema Fazer Render+</p>
                    </div>
                    <div>
                        <Link href="/dashboard" className="px-4 py-2 border border-slate-700 bg-slate-800 text-slate-300 rounded-lg text-sm font-bold hover:bg-slate-700 transition">
                            Sair do modo Admin
                        </Link>
                    </div>
                </header>

                {/* Top Cards Visuais */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#1e293b] p-6 rounded-3xl border border-slate-800 shadow-xl shadow-slate-900/50 flex flex-col items-start gap-4">
                        <div className="w-12 h-12 bg-blue-500/10 flex items-center justify-center rounded-xl text-blue-400">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-slate-400 text-sm font-bold block mb-1">Total de Alunos</span>
                            <span className="text-4xl font-black text-white">{totalUsers}</span>
                        </div>
                    </div>
                    <div className="bg-[#1e293b] p-6 rounded-3xl border border-slate-800 shadow-xl shadow-slate-900/50 flex flex-col items-start gap-4">
                        <div className="w-12 h-12 bg-emerald-500/10 flex items-center justify-center rounded-xl text-emerald-400">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-slate-400 text-sm font-bold block mb-1">Trilhas Ativas</span>
                            <span className="text-4xl font-black text-white">4</span>
                        </div>
                    </div>
                    <div className="bg-[#1e293b] p-6 rounded-3xl border border-slate-800 shadow-xl shadow-slate-900/50 flex flex-col items-start gap-4">
                        <div className="w-12 h-12 bg-amber-500/10 flex items-center justify-center rounded-xl text-amber-400">
                            <GraduationCap className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-slate-400 text-sm font-bold block mb-1">Gamificação Geral</span>
                            <span className="text-slate-300 text-sm font-medium mt-1">Monitorando WealthCoins ativamente nas contas no Brasil todo.</span>
                        </div>
                    </div>
                </div>

                {/* User Table Management */}
                <div className="bg-[#1e293b] rounded-3xl border border-slate-800 p-6">
                    <h2 className="text-xl font-bold mb-6">Contas Mapeadas na Plataforma</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-800/50">
                                <tr>
                                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest rounded-l-xl">E-mail / ID</th>
                                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Nível de Assinatura</th>
                                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">WealthCoins Atuais</th>
                                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest rounded-r-xl">Cadastro</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allUsers.map((u) => (
                                    <tr key={u.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-200">{u.email}</span>
                                                <span className="text-xs text-slate-500">{u.name || "Usuário não identificou"}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 text-xs font-black rounded-full uppercase tracking-widest ${u.plan === 'ADMIN' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                                                    u.plan === 'PREMIUM' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                                        u.plan === 'PLUS' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                                            'bg-slate-700 text-slate-300'
                                                }`}>
                                                {u.plan}
                                            </span>
                                        </td>
                                        <td className="p-4 font-bold text-amber-400">{u.wealthCoins} WC</td>
                                        <td className="p-4 text-sm text-slate-400">{new Date(u.createdAt).toLocaleDateString("pt-BR")}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}

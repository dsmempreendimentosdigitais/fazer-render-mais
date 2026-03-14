import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Users, GraduationCap, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
    const session = await getServerSession(authOptions);

    // Proteção da Rota: Apenas os administradores do sistema podem acessar
    if (!session?.user || session.user.plan !== "ADMIN") {
        redirect("/dashboard");
    }

    // Dashboard Metrics
    const totalUsers = await prisma.user.count();
    const freeUsers = await prisma.user.count({ where: { plan: "FREE" } });
    const plusUsers = await prisma.user.count({ where: { plan: "PLUS" } });
    const premiumUsers = await prisma.user.count({ where: { plan: "PREMIUM" } });

    // Financial Metrics (Marketing/Financial Screen)
    const potentialMRR = (plusUsers * 19.90) + (premiumUsers * 49.90);
    const conversionRate = totalUsers > 0 ? ((plusUsers + premiumUsers) / totalUsers) * 100 : 0;

    const allUsers = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            name: true,
            email: true,
            plan: true,
            wealthCoins: true,
            createdAt: true,
            lastLoginDate: true
        }
    });

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-50 p-6 md:p-10 font-sans">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Superior Header Admin */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-rose-500/30 pb-6 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400 tracking-tight flex items-center">
                            <ShieldAlert className="w-8 h-8 mr-3 text-rose-500" />
                            Painel de Controle Render+
                        </h1>
                        <p className="text-slate-400 font-medium text-sm mt-1">Visão Estratégica: Admin, Financeiro e Marketing</p>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/dashboard" className="px-4 py-2 border border-slate-700 bg-slate-800 text-slate-300 rounded-lg text-sm font-bold hover:bg-slate-700 transition">
                            Voltar ao App
                        </Link>
                    </div>
                </header>

                {/* Dashboard Estratégico (Marketing/Financeiro) */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-[#1e293b] p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col items-start gap-4">
                        <div className="w-12 h-12 bg-blue-500/10 flex items-center justify-center rounded-xl text-blue-400">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-slate-400 text-xs font-bold block mb-1 uppercase tracking-wider">Total de Clientes</span>
                            <span className="text-3xl font-black text-white">{totalUsers}</span>
                        </div>
                    </div>
                    
                    <div className="bg-[#1e293b] p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col items-start gap-4">
                        <div className="w-12 h-12 bg-emerald-500/10 flex items-center justify-center rounded-xl text-emerald-400">
                            <GraduationCap className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-slate-400 text-xs font-bold block mb-1 uppercase tracking-wider">Faturamento (MRR)</span>
                            <span className="text-3xl font-black text-emerald-400">R$ {potentialMRR.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        </div>
                    </div>

                    <div className="bg-[#1e293b] p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col items-start gap-4">
                        <div className="w-12 h-12 bg-rose-500/10 flex items-center justify-center rounded-xl text-rose-400">
                            <ShieldAlert className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-slate-400 text-xs font-bold block mb-1 uppercase tracking-wider">Conversão de Assinatura</span>
                            <span className="text-3xl font-black text-rose-400">{conversionRate.toFixed(1)}%</span>
                        </div>
                    </div>

                    <div className="bg-[#1e293b] p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col items-start gap-4">
                        <div className="w-12 h-12 bg-amber-500/10 flex items-center justify-center rounded-xl text-amber-400">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-slate-400 text-xs font-bold block mb-1 uppercase tracking-wider">Base de Marketing</span>
                            <div className="flex gap-2 text-xs font-bold mt-1">
                                <span className="text-slate-400">Free: {freeUsers}</span>
                                <span className="text-blue-400">Plus: {plusUsers}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* User Table Management */}
                <div className="bg-[#1e293b] rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
                    <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                        <h2 className="text-xl font-bold">Listagem Geral de Clientes</h2>
                        <span className="text-xs font-bold text-slate-500 uppercase">Total: {allUsers.length} registros</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-[#0f172a]/50">
                                <tr>
                                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Cliente / Marketing</th>
                                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Plano Atual</th>
                                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">WealthCoins</th>
                                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Último Acesso / Cadastro</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allUsers.map((u) => (
                                    <tr key={u.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold border border-slate-700">
                                                    {(u.name?.[0] || u.email?.[0] || '?').toUpperCase()}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-200">{u.email}</span>
                                                    <span className="text-xs text-slate-500">{u.name || "Sem nome informado"}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-tighter border shadow-sm ${u.plan === 'ADMIN' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                                                    u.plan === 'PREMIUM' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                        u.plan === 'PLUS' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                            'bg-slate-800 text-slate-400 border-slate-700'
                                                }`}>
                                                {u.plan}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-amber-400">{u.wealthCoins}</span>
                                                <span className="text-[10px] text-slate-500 font-bold uppercase">WC</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex flex-col text-xs">
                                                <span className="text-slate-300 font-medium">Acesso: {u.lastLoginDate ? new Date(u.lastLoginDate).toLocaleDateString("pt-BR") : "Nunca"}</span>
                                                <span className="text-slate-500">Cad: {new Date(u.createdAt).toLocaleDateString("pt-BR")}</span>
                                            </div>
                                        </td>
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

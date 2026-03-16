"use client";

import { motion } from "framer-motion";
import { Flame, Award, ChevronRight, PlayCircle, Lock, BookOpen, Star, Target, ArrowUpRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Dashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    useEffect(() => {
        if (session?.user) {
            fetch("/api/user")
                .then(res => res.json())
                .then(data => setUserData(data))
                .catch(err => console.error(err));
        }
    }, [session]);

    if (status === "loading" || !userData) {
        return (
            <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
            </div>
        );
    }

    const user = {
        name: userData.name || userData.email.split('@')[0],
        streak: userData.currentStreak || 0,
        coins: userData.wealthCoins || 0,
        progressPercent: userData.progress?.length ? Math.min(Math.round((userData.progress.length / 10) * 100), 100) : 0,
        plan: userData.plan || "FREE",
        nextLesson: {
            id: "1.3",
            title: "CDB: Como comparar e escolher o melhor",
            duration: "8 min",
            module: "Trilha 1"
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-50 font-sans p-4 md:p-8 pb-32 overflow-x-hidden">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header (Greeting + Stats) */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mt-4">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <h1 className="text-3xl font-extrabold mb-1">
                            Bom dia, <span className="text-emerald-400">{user.name}</span>! 👋
                        </h1>
                        <p className="text-slate-400 text-sm md:text-base font-medium">Cada aula de hoje é um tijolo no seu futuro.</p>

                        {/* Logout & Reset Buttons */}
                        <div className="flex items-center gap-4 mt-2">
                            <button
                                onClick={() => signOut({ callbackUrl: '/login' })}
                                className="text-xs text-rose-400 hover:text-rose-300 transition font-bold underline decoration-rose-500/30 underline-offset-4"
                            >
                                Sair da conta
                            </button>
                            <button
                                onClick={() => router.push('/onboarding')}
                                className="text-xs text-slate-500 hover:text-emerald-400 transition font-bold underline decoration-slate-500/30 underline-offset-4"
                            >
                                Refazer meu perfil
                            </button>
                        </div>
                    </motion.div>

                    {/* Gamification Badges */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center space-x-3 bg-[#1e293b]/80 border border-slate-800 p-2 rounded-2xl glassmorphism"
                    >
                        <div className="flex items-center px-4 py-2 bg-rose-500/10 rounded-xl border border-rose-500/20">
                            <Flame className="w-5 h-5 text-rose-500 mr-2" />
                            <div className="flex flex-col">
                                <span className="text-xs text-rose-400 font-bold leading-none uppercase tracking-wide">Streak</span>
                                <span className="font-black text-rose-100 leading-none mt-1">{user.streak} dias</span>
                            </div>
                        </div>

                        <div className="flex items-center px-4 py-2 bg-amber-500/10 rounded-xl border border-amber-500/20">
                            <Award className="w-5 h-5 text-amber-500 mr-2" />
                            <div className="flex flex-col">
                                <span className="text-xs text-amber-400 font-bold leading-none uppercase tracking-wide">Coins</span>
                                <span className="font-black text-amber-100 leading-none mt-1">{user.coins}</span>
                            </div>
                        </div>
                    </motion.div>
                </header>

                {/* WealthAI Daily Check-in Alert */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="bg-gradient-to-r from-emerald-900/40 to-cyan-900/40 border border-emerald-500/30 p-5 md:p-6 rounded-3xl relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 blur-3xl rounded-full -mr-10 -mt-10"></div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
                        <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                                <h3 className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Fazer Render+ IA Diz:</h3>
                            </div>
                            <p className="text-slate-200 text-lg leading-snug font-medium max-w-lg mb-4">
                                "A Selic está em 15% a.a. Seu dinheiro na poupança está perdendo da inflação real. Vamos mudar isso hoje?"
                            </p>
                        </div>

                        <Link href="/trilhas" className="shrink-0">
                            <button className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-6 py-4 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center">
                                <PlayCircle className="w-5 h-5 mr-2" />
                                Continuar: Aula {user.nextLesson.id}
                            </button>
                        </Link>
                    </div>
                </motion.div>

                {/* Trilhas de Aprendizado */}
                <div className="space-y-4 pt-4">
                    <h2 className="text-xl font-extrabold flex items-center">
                        <BookOpen className="w-5 h-5 mr-2 text-slate-400" /> Seu Ecossistema de Evolução
                    </h2>
                    <p className="text-sm text-slate-400 font-medium">Desbloqueie novos níveis conforme sua jornada avança.</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {/* TRILHA 1: FREE */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                            className="bg-[#1e293b] border border-emerald-500/50 p-6 rounded-3xl cursor-pointer hover:bg-slate-800 transition-colors relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>

                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className="text-emerald-400 text-[10px] font-black tracking-widest uppercase mb-1 block">Iniciante • ATIVO</span>
                                    <h3 className="text-lg font-extrabold text-white">RENDA FIXA</h3>
                                </div>
                                <div className="bg-emerald-500/20 text-emerald-400 p-2 rounded-xl">
                                    <Target className="w-5 h-5" />
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
                                    <span>Progresso</span>
                                    <span className="text-emerald-400">{user.progressPercent}%</span>
                                </div>
                                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${user.progressPercent}%` }}></div>
                                </div>
                            </div>

                            <Link href="/trilhas">
                                <div className="flex justify-between items-center text-xs font-bold text-emerald-500 mt-4 pt-4 border-t border-slate-800">
                                    <span>Continuar</span>
                                    <ChevronRight className="w-4 h-4" />
                                </div>
                            </Link>
                        </motion.div>

                        {/* TRILHA 2: PLUS */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                            className={`bg-[#1e293b]/50 border border-slate-800 p-6 rounded-3xl relative overflow-hidden ${user.plan === "FREE" ? "group" : ""}`}
                        >
                            {(user.plan === "FREE") && (
                                <Link href="/planos" className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center text-center p-6 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <Lock className="w-6 h-6 text-amber-500 mb-2" />
                                    <span className="font-bold text-amber-500 text-sm">Nível PLUS</span>
                                    <button className="mt-3 bg-amber-500 text-slate-900 px-4 py-2 rounded-lg font-black text-[10px] uppercase tracking-wider">Desbloquear</button>
                                </Link>
                            )}

                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className="text-slate-500 text-[10px] font-bold tracking-widest uppercase mb-1 block">Intermediário • PLUS</span>
                                    <h3 className="text-lg font-extrabold text-slate-300">FIIS & DIVIDENDOS</h3>
                                </div>
                                <div className="bg-slate-800 text-slate-500 p-2 rounded-xl">
                                    {user.plan === "FREE" ? <Lock className="w-5 h-5" /> : <Target className="w-5 h-5 text-amber-500" />}
                                </div>
                            </div>

                            <p className="text-slate-400 text-[11px] leading-relaxed mb-4">
                                Aprenda a receber 'aluguéis' mensais isentos de IR e monte sua primeira máquina de renda passiva.
                            </p>

                            <div className="flex justify-between items-center text-xs font-bold text-slate-500 mt-4 pt-4 border-t border-slate-800">
                                <Link href="/planos" className="w-full flex justify-between items-center hover:text-amber-400 transition-colors">
                                    <span>{user.plan === "FREE" ? "Ver Benefícios" : "Acessar"}</span>
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </motion.div>

                        {/* TRILHA 3: PREMIUM */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                            className={`bg-[#1e293b]/50 border border-slate-800 p-6 rounded-3xl relative overflow-hidden ${user.plan !== "PREMIUM" ? "group" : ""}`}
                        >
                            {(user.plan !== "PREMIUM") && (
                                <Link href="/planos" className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center text-center p-6 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <Lock className="w-6 h-6 text-emerald-400 mb-2" />
                                    <span className="font-bold text-emerald-400 text-sm">Nível PREMIUM</span>
                                    <button className="mt-3 bg-emerald-500 text-slate-900 px-4 py-2 rounded-lg font-black text-[10px] uppercase tracking-wider">Ir para o Topo</button>
                                </Link>
                            )}

                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className="text-slate-500 text-[10px] font-bold tracking-widest uppercase mb-1 block">Avançado • PREMIUM</span>
                                    <h3 className="text-lg font-extrabold text-slate-300">AÇÕES GLOBAIS</h3>
                                </div>
                                <div className="bg-slate-800 text-slate-500 p-2 rounded-xl">
                                    {user.plan !== "PREMIUM" ? <Lock className="w-5 h-5" /> : <Star className="w-5 h-5 text-emerald-400" />}
                                </div>
                            </div>

                            <p className="text-slate-400 text-[11px] leading-relaxed mb-4">
                                O método Buffett para selecionar empresas vencedoras e proteger seu patrimônio com Dollar.
                            </p>

                            <div className="flex justify-between items-center text-xs font-bold text-slate-500 mt-4 pt-4 border-t border-slate-800">
                                <Link href="/planos" className="w-full flex justify-between items-center hover:text-emerald-400 transition-colors">
                                    <span>{user.plan === "PREMIUM" ? "Acessar" : "Vantagens Elite"}</span>
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Ferramentas Rápidas */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
                    <Link href="/simulador" className="bg-[#1e293b] p-5 rounded-2xl border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800 transition-all group flex flex-col items-center text-center">
                        <div className="bg-blue-500/10 p-3 rounded-xl text-blue-400 mb-3 group-hover:scale-110 transition-transform">
                            <ArrowUpRight className="w-6 h-6" />
                        </div>
                        <span className="font-bold text-sm text-slate-300">Simular Investimento</span>
                    </Link>

                    <Link href="/chat" className="bg-[#1e293b] p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800 transition-all group flex flex-col items-center text-center">
                        <div className="bg-emerald-500/10 p-3 rounded-xl text-emerald-400 mb-3 group-hover:scale-110 transition-transform">
                            <Star className="w-6 h-6" />
                        </div>
                        <span className="font-bold text-sm text-slate-300">Tirar Dúvida com IA</span>
                    </Link>
                </div>

            </div>
        </div>
    );
}

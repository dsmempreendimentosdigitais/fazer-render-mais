"use client";

import { motion } from "framer-motion";
import { PlayCircle, Award, CheckCircle2, ChevronLeft, Map, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const lessonData = {
    title: "1.3 Tesouro Selic: O melhor amigo da reserva de emergência",
    duration: "6 min",
    description: "Descubra como proteger seu dinheiro da inflação com o investimento mais seguro do Brasil. Adeus, poupança!",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder
};

export default function LessonPlayer() {
    const [completed, setCompleted] = useState(false);

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-50 flex flex-col font-sans">
            {/* Header */}
            <header className="px-6 py-4 glassmorphism border-b border-slate-800 flex items-center justify-between sticky top-0 z-10">
                <Link href="/dashboard" className="flex items-center text-slate-400 hover:text-emerald-400 transition-colors">
                    <ChevronLeft className="w-5 h-5 mr-1" />
                    <span className="font-medium">Voltar para Trilha 1</span>
                </Link>

                <div className="flex items-center space-x-4">
                    <div className="flex items-center text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full text-sm font-bold border border-amber-400/20">
                        <Award className="w-4 h-4 mr-1.5" />
                        140 Coins
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-5xl mx-auto w-full p-6 md:p-8 flex flex-col lg:flex-row gap-8">
                {/* Left Column: Video & Info */}
                <div className="flex-1 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl shadow-emerald-500/5 relative group border border-slate-800"
                    >
                        {/* Fake Player Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-slate-900/80 to-transparent z-10">
                            <button className="w-20 h-20 bg-emerald-500/90 text-white rounded-full flex items-center justify-center hover:bg-emerald-400 transition-all hover:scale-105 shadow-xl shadow-emerald-500/30">
                                <PlayCircle className="w-10 h-10 ml-1" />
                            </button>
                        </div>
                        {/* The pseudo video element */}
                        <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-60 mix-blend-luminosity"></div>
                    </motion.div>

                    <div>
                        <div className="flex items-center space-x-3 mb-3">
                            <span className="bg-slate-800 text-slate-300 text-xs font-bold px-2.5 py-1 rounded-md">
                                TRILHA 1: RENDA FIXA
                            </span>
                            <span className="text-slate-400 text-sm flex items-center">
                                <PlayCircle className="w-4 h-4 mr-1" /> {lessonData.duration}
                            </span>
                        </div>

                        <h1 className="text-3xl font-extrabold text-white mb-4 leading-tight">
                            {lessonData.title}
                        </h1>

                        <p className="text-slate-400 text-lg leading-relaxed">
                            {lessonData.description}
                        </p>
                    </div>
                </div>

                {/* Right Column: Next Steps / Exercises */}
                <div className="w-full lg:w-80 space-y-6">
                    <div className="bg-[#1e293b] rounded-3xl p-6 border border-slate-800 h-full flex flex-col">
                        <h3 className="text-xl font-bold mb-6 flex items-center">
                            <Map className="w-5 h-5 mr-2 text-emerald-400" />
                            Sua Jornada
                        </h3>

                        <div className="space-y-4 flex-1">
                            <button
                                onClick={() => setCompleted(!completed)}
                                className={`w-full p-4 rounded-xl flex items-center justify-between font-bold transition-all border ${completed
                                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-lg shadow-emerald-500/10"
                                        : "bg-slate-800/50 border-slate-700 hover:bg-slate-800 text-slate-300"
                                    }`}
                            >
                                <div className="flex items-center">
                                    <CheckCircle2 className={`w-6 h-6 mr-3 ${completed ? "text-emerald-400" : "text-slate-600"}`} />
                                    Assistir Aula
                                </div>
                                {completed && <span className="text-xs font-extrabold bg-emerald-500/20 px-2 py-1 rounded-md">+10 Coins</span>}
                            </button>

                            <button className="w-full p-4 rounded-xl flex items-center bg-slate-800/50 border border-slate-700 hover:bg-slate-800 text-slate-300 font-bold transition-all group disabled:opacity-50">
                                <div className="p-1.5 bg-slate-700 rounded-lg mr-3 group-hover:bg-slate-600 transition-colors">
                                    <HelpCircle className="w-5 h-5" />
                                </div>
                                Quiz de Fixação
                            </button>

                            <Link href="/simulador" className="w-full p-4 rounded-xl flex items-center bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 text-blue-400 font-bold transition-all group mt-4 block text-left">
                                <div className="p-1.5 bg-blue-500/20 rounded-lg mr-3">
                                    <Target className="w-5 h-5 text-blue-400" />
                                </div>
                                Simular Tesouro Selic
                            </Link>
                        </div>

                        <button
                            className={`w-full py-4 mt-8 rounded-xl font-bold text-white transition-all ${completed
                                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:shadow-lg hover:shadow-emerald-500/25"
                                    : "bg-slate-800 text-slate-500 cursor-not-allowed"
                                }`}
                        >
                            Próxima Aula: Tesouro IPCA+
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

// Just an icon import fix
function Target(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>;
}

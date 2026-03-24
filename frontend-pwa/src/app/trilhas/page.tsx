"use client";

import { motion } from "framer-motion";
import { PlayCircle, Award, CheckCircle2, ChevronLeft, Map, HelpCircle, ChevronRight, Lock, Bot, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Logo from "@/components/ui/Logo";
import QuizModal from "@/components/trilhas/QuizModal";

// ── Lesson Data ──────────────────────────────────────────────────────
interface Lesson {
    id: string;
    title: string;
    duration: string;
    description: string;
    videoId: string; // YouTube video ID
    trilha: string;
    trilhaLabel: string;
    nextLessonId: string | null;
    nextLessonTitle: string | null;
    requiredPlan: "FREE" | "PLUS" | "PREMIUM";
}

const lessons: Record<string, Lesson> = {
    "1.1": {
        id: "1.1",
        title: "Reserva de Emergência: O Primeiro Passo",
        duration: "12 min",
        description: "Aprenda como montar sua reserva de emergência do jeito certo e nunca mais ficar vulnerável a imprevistos financeiros.",
        videoId: "egtTW_zvqJM",
        trilha: "1",
        trilhaLabel: "TRILHA 1: RENDA FIXA",
        nextLessonId: "1.2",
        nextLessonTitle: "Poupança vs Tesouro Direto",
        requiredPlan: "FREE",
    },
    "1.2": {
        id: "1.2",
        title: "Poupança vs Tesouro Direto: A Verdade",
        duration: "15 min",
        description: "Descubra por que a poupança está te fazendo perder dinheiro e como o Tesouro Direto pode mudar sua vida financeira.",
        videoId: "y2sBkIX72-g",
        trilha: "1",
        trilhaLabel: "TRILHA 1: RENDA FIXA",
        nextLessonId: "1.3",
        nextLessonTitle: "Tesouro Direto Completo",
        requiredPlan: "FREE",
    },
    "1.3": {
        id: "1.3",
        title: "Tesouro Direto Completo: Selic, IPCA+ e Prefixado",
        duration: "18 min",
        description: "Aula completa sobre todos os títulos do Tesouro Direto: Selic, IPCA+ e Prefixado. Qual é melhor para cada objetivo?",
        videoId: "OOEssu7j5UQ",
        trilha: "1",
        trilhaLabel: "TRILHA 1: RENDA FIXA",
        nextLessonId: "1.4",
        nextLessonTitle: "CDB: Como Escolher o Ideal",
        requiredPlan: "FREE",
    },
    "1.4": {
        id: "1.4",
        title: "CDB: Como Escolher o Ideal para Você",
        duration: "14 min",
        description: "Aprenda a comparar CDBs e escolher o que melhor se encaixa nos seus objetivos. Passo a passo prático para investir com pouco.",
        videoId: "yr2-aZoOvlQ",
        trilha: "1",
        trilhaLabel: "TRILHA 1: RENDA FIXA",
        nextLessonId: "1.5",
        nextLessonTitle: "Poupança vs CDB vs Tesouro",
        requiredPlan: "FREE",
    },
    "1.5": {
        id: "1.5",
        title: "Poupança vs CDB vs Tesouro: Teste Real de 1 Ano",
        duration: "16 min",
        description: "Veja o resultado real de R$1.000 investidos na poupança, CDB e Tesouro Direto por 1 ano. Qual rendeu mais?",
        videoId: "piCLfWcA1JU",
        trilha: "1",
        trilhaLabel: "TRILHA 1: RENDA FIXA",
        nextLessonId: null,
        nextLessonTitle: null,
        requiredPlan: "FREE",
    },
    // ── Trilha 2: FIIs (PLUS) ──
    "2.1": {
        id: "2.1",
        title: "Fundos Imobiliários: O Que São e Como Funcionam",
        duration: "14 min",
        description: "Entenda o que são FIIs, como eles geram renda passiva mensal e por que são isentos de Imposto de Renda para pessoa física.",
        videoId: "nQVYluPiZdA",
        trilha: "2",
        trilhaLabel: "TRILHA 2: FIIs & DIVIDENDOS",
        nextLessonId: "2.2",
        nextLessonTitle: "Guia Completo para Iniciantes",
        requiredPlan: "PLUS",
    },
    "2.2": {
        id: "2.2",
        title: "FIIs: Guia Completo para Iniciantes",
        duration: "20 min",
        description: "Um guia passo a passo sobre como escolher, analisar e investir em Fundos Imobiliários mesmo com pouco dinheiro.",
        videoId: "gOuYvRw5kE4",
        trilha: "2",
        trilhaLabel: "TRILHA 2: FIIs & DIVIDENDOS",
        nextLessonId: "2.3",
        nextLessonTitle: "Como Analisar um FII",
        requiredPlan: "PLUS",
    },
    "2.3": {
        id: "2.3",
        title: "Como Analisar um FII como Profissional",
        duration: "18 min",
        description: "Aprenda os indicadores essenciais (P/VP, DY, Vacância) para analisar Fundos Imobiliários e montar uma carteira sólida.",
        videoId: "BpEbmjv7Z9o",
        trilha: "2",
        trilhaLabel: "TRILHA 2: FIIs & DIVIDENDOS",
        nextLessonId: null,
        nextLessonTitle: null,
        requiredPlan: "PLUS",
    },
    // ── Trilha 3: Ações Globais (PREMIUM) ──
    "3.1": {
        id: "3.1",
        title: "Bolsa de Valores: Do Zero ao Primeiro Investimento",
        duration: "16 min",
        description: "Entenda como funciona a Bolsa de Valores brasileira (B3), o que são ações e como dar seus primeiros passos como investidor.",
        videoId: "jJFVKgHr3BA",
        trilha: "3",
        trilhaLabel: "TRILHA 3: AÇÕES GLOBAIS",
        nextLessonId: "3.2",
        nextLessonTitle: "Como Comprar sua Primeira Ação",
        requiredPlan: "PREMIUM",
    },
    "3.2": {
        id: "3.2",
        title: "Como Comprar sua Primeira Ação na Prática",
        duration: "13 min",
        description: "Acompanhe o passo a passo real de como abrir conta na corretora e comprar sua primeira ação na B3.",
        videoId: "6B7PGZ0l8TQ",
        trilha: "3",
        trilhaLabel: "TRILHA 3: AÇÕES GLOBAIS",
        nextLessonId: "3.3",
        nextLessonTitle: "ETFs e Diversificação Global",
        requiredPlan: "PREMIUM",
    },
    "3.3": {
        id: "3.3",
        title: "ETFs: Diversificação Global com Um Clique",
        duration: "15 min",
        description: "Descubra como investir no mundo inteiro através de ETFs, a forma mais inteligente de diversificar seu patrimônio.",
        videoId: "EJ11Rm6oJcE",
        trilha: "3",
        trilhaLabel: "TRILHA 3: AÇÕES GLOBAIS",
        nextLessonId: null,
        nextLessonTitle: null,
        requiredPlan: "PREMIUM",
    },
};

// ── Component ────────────────────────────────────────────────────────
export default function LessonPlayerPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0f172a] flex items-center justify-center"><div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>}>
            <LessonPlayer />
        </Suspense>
    );
}

function LessonPlayer() {
    const searchParams = useSearchParams();
    const aulaParam = searchParams.get("aula") || "1.1";
    const currentLesson = lessons[aulaParam] || lessons["1.1"];

    const [completed, setCompleted] = useState(false);
    const [isQuizOpen, setIsQuizOpen] = useState(false);

    // Get all lessons for the current trilha for the sidebar
    const trilhaLessons = Object.values(lessons).filter(l => l.trilha === currentLesson.trilha);

    const trilhaColors: Record<string, { accent: string; bg: string; border: string; text: string }> = {
        "1": { accent: "emerald", bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400" },
        "2": { accent: "amber", bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400" },
        "3": { accent: "violet", bg: "bg-violet-500/10", border: "border-violet-500/30", text: "text-violet-400" },
    };
    const colors = trilhaColors[currentLesson.trilha] || trilhaColors["1"];

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-50 flex flex-col font-sans">
            {/* Header */}
            <header className="px-6 py-4 glassmorphism border-b border-slate-800 flex items-center justify-between sticky top-0 z-10">
                <Link href="/dashboard" className="flex items-center text-slate-400 hover:text-emerald-400 transition-colors">
                    <ChevronLeft className="w-5 h-5 mr-1" />
                    <span className="font-medium">Voltar ao Dashboard</span>
                </Link>

                <div className="hidden sm:block">
                    <Logo size="md" />
                </div>

                <div className="flex items-center space-x-4">
                    <div className="flex items-center text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full text-sm font-bold border border-amber-400/20">
                        <Award className="w-4 h-4 mr-1.5" />
                        140 Coins
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-6xl mx-auto w-full p-6 md:p-8 flex flex-col lg:flex-row gap-8">
                {/* Left Column: Video & Info */}
                <div className="flex-1 space-y-6">
                    {/* YouTube Video Player */}
                    <motion.div
                        key={currentLesson.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl shadow-emerald-500/5 border border-slate-800"
                    >
                        <iframe
                            src={`https://www.youtube.com/embed/${currentLesson.videoId}?rel=0&modestbranding=1`}
                            title={currentLesson.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            className="w-full h-full"
                        />
                    </motion.div>

                    {/* Lesson Info */}
                    <div>
                        <div className="flex items-center space-x-3 mb-3">
                            <span className={`${colors.bg} ${colors.text} text-xs font-bold px-2.5 py-1 rounded-md border ${colors.border}`}>
                                {currentLesson.trilhaLabel}
                            </span>
                            <span className="text-slate-400 text-sm flex items-center">
                                <PlayCircle className="w-4 h-4 mr-1" /> {currentLesson.duration}
                            </span>
                        </div>

                        <h1 className="text-3xl font-extrabold text-white mb-4 leading-tight">
                            {currentLesson.title}
                        </h1>

                        <p className="text-slate-400 text-lg leading-relaxed">
                            {currentLesson.description}
                        </p>
                    </div>

                    {/* Motivational Tip */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 border border-emerald-500/20 rounded-2xl p-4 flex items-start gap-3"
                    >
                        <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        <p className="text-sm text-slate-300 leading-relaxed">
                            <strong className="text-emerald-400">Você está investindo em conhecimento.</strong>{" "}
                            Somente vídeos e informações essenciais. Um plano passo a passo para fazer seu dinheiro render mais e crescer seu patrimônio de forma simples e segura.
                        </p>
                    </motion.div>
                </div>

                {/* Right Column: Sidebar */}
                <div className="w-full lg:w-80 space-y-6">
                    <div className="bg-[#1e293b] rounded-3xl p-6 border border-slate-800 flex flex-col">
                        <h3 className="text-xl font-bold mb-6 flex items-center">
                            <Map className="w-5 h-5 mr-2 text-emerald-400" />
                            Sua Jornada
                        </h3>

                        {/* Actions */}
                        <div className="space-y-4 mb-6">
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

                            <button 
                                onClick={() => setIsQuizOpen(true)}
                                className="w-full p-4 rounded-xl flex items-center bg-slate-800/50 border border-slate-700 hover:bg-slate-800 text-slate-300 font-bold transition-all group"
                            >
                                <div className="p-1.5 bg-slate-700 rounded-lg mr-3 group-hover:bg-slate-600 transition-colors">
                                    <HelpCircle className="w-5 h-5" />
                                </div>
                                Quiz de Fixação
                            </button>

                            <Link href="/simulador" className="w-full p-4 rounded-xl flex items-center bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 text-blue-400 font-bold transition-all group block text-left">
                                <div className="p-1.5 bg-blue-500/20 rounded-lg mr-3">
                                    <svg className="w-5 h-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>
                                </div>
                                Simular no Calculador
                            </Link>

                            {/* AI Chat Button */}
                            <Link href={`/chat?contexto=${encodeURIComponent(currentLesson.trilhaLabel + ' - ' + currentLesson.title)}`} className="w-full p-4 rounded-xl flex items-center bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 hover:from-emerald-500/20 hover:to-cyan-500/20 text-emerald-400 font-bold transition-all group block text-left">
                                <div className="p-1.5 bg-emerald-500/20 rounded-lg mr-3 group-hover:scale-110 transition-transform">
                                    <Bot className="w-5 h-5 text-emerald-400" />
                                </div>
                                <div className="flex flex-col">
                                    <span>Tirar Dúvida com IA</span>
                                    <span className="text-[10px] text-slate-500 font-normal">Pergunte sobre esta aula</span>
                                </div>
                            </Link>
                        </div>

                        {/* Lesson List for current Trilha */}
                        <div className="border-t border-slate-800 pt-4">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Aulas desta Trilha</h4>
                            <div className="space-y-2">
                                {trilhaLessons.map((lesson) => (
                                    <Link
                                        key={lesson.id}
                                        href={`/trilhas?aula=${lesson.id}`}
                                        className={`flex items-center p-3 rounded-xl text-sm transition-all ${
                                            lesson.id === currentLesson.id
                                                ? `${colors.bg} ${colors.text} ${colors.border} border font-bold`
                                                : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                                        }`}
                                    >
                                        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black mr-3 shrink-0 ${
                                            lesson.id === currentLesson.id
                                                ? `${colors.bg} ${colors.text}`
                                                : "bg-slate-800 text-slate-500"
                                        }`}>
                                            {lesson.id}
                                        </span>
                                        <span className="truncate">{lesson.title.replace(/^\d+\.\d+ /, '')}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Next Lesson Button */}
                        {currentLesson.nextLessonId && (
                            <Link
                                href={`/trilhas?aula=${currentLesson.nextLessonId}`}
                                onClick={() => setCompleted(false)}
                                className={`w-full py-4 mt-6 rounded-xl font-bold text-white transition-all text-center block ${completed
                                        ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:shadow-lg hover:shadow-emerald-500/25"
                                        : "bg-slate-800 text-slate-500 cursor-not-allowed pointer-events-none"
                                    }`}
                            >
                                <span className="flex items-center justify-center">
                                    Próxima Aula: {currentLesson.nextLessonTitle}
                                    <ChevronRight className="w-5 h-5 ml-1" />
                                </span>
                            </Link>
                        )}

                        {!currentLesson.nextLessonId && (
                            <Link
                                href="/dashboard"
                                className="w-full py-4 mt-6 rounded-xl font-bold text-white transition-all text-center block bg-gradient-to-r from-emerald-500 to-emerald-600 hover:shadow-lg hover:shadow-emerald-500/25"
                            >
                                🎉 Trilha Concluída! Voltar ao Dashboard
                            </Link>
                        )}
                    </div>
                </div>
            </main>

            <QuizModal 
                isOpen={isQuizOpen} 
                onClose={() => setIsQuizOpen(false)} 
                trilhaId={currentLesson.trilha} 
            />
        </div>
    );
}

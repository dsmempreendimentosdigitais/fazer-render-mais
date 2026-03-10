"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Target, Brain, Shield, HandCoins, Check } from "lucide-react";
import { useRouter } from "next/navigation";

const questions = [
    {
        id: 1,
        title: "Qual é o seu maior objetivo neste momento?",
        options: [
            { text: "Criar uma reserva de emergência e dormir em paz", icon: Shield },
            { text: "Começar a investir meus primeiros R$50/mês", icon: HandCoins },
            { text: "Entender de ações e montar uma carteira global", icon: Target },
            { text: "Sair das dívidas e organizar a vida financeira", icon: Brain }
        ]
    },
    {
        id: 2,
        title: "Como você se sente em relação a dinheiro?",
        options: [
            { text: "Sobra pouco, não acho que vale investir", icon: Brain },
            { text: "É complicado, tenho medo de perder", icon: Shield },
            { text: "Quero aprender para garantir meu futuro", icon: Target },
            { text: "Já guardo um pouquinho na poupança", icon: HandCoins }
        ]
    },
    {
        id: 3,
        title: "Qual o seu nível de experiência na bolsa de valores?",
        options: [
            { text: "Zero. Nem sei por onde começar.", icon: Brain },
            { text: "Já tentei B3, mas fico perdido com siglas.", icon: Target },
            { text: "Conheço Tesouro Direto e alguns CDBs.", icon: HandCoins },
            { text: "Já tenho conta em corretora, quero melhorar.", icon: Target }
        ]
    }
];

export default function Onboarding() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [isFinished, setIsFinished] = useState(false);

    const handleSelect = (optionText: string) => {
        setAnswers({ ...answers, [currentStep]: optionText });

        setTimeout(() => {
            if (currentStep < questions.length - 1) {
                setCurrentStep(currentStep + 1);
            } else {
                setIsFinished(true);
            }
        }, 400); // Small delay for UX reaction
    };

    const progress = ((currentStep + (isFinished ? 1 : 0)) / questions.length) * 100;

    if (isFinished) {
        return (
            <div className="min-h-screen bg-[#0f172a] text-slate-50 flex items-center justify-center p-6">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-[#1e293b] p-10 rounded-3xl max-w-lg w-full text-center border border-emerald-500/30 shadow-2xl shadow-emerald-500/10"
                >
                    <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check size={40} />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Perfil Mapeado!</h2>
                    <p className="text-slate-400 mb-8 leading-relaxed">
                        Nossa IA, Fazer Render+, já analisou seu perfil baseado em Graham e Buffett. Você começará pela <b>Trilha 1: Reserva Blindada</b>.
                    </p>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 font-bold py-4 rounded-xl transition text-white"
                    >
                        Acessar meu Plano de Jornada
                    </button>
                </motion.div>
            </div>
        );
    }

    const question = questions[currentStep];

    return (
        <div className="min-h-screen bg-[#0f172a] flex flex-col justify-center px-6 antialiased text-slate-50">
            <div className="max-w-xl mx-auto w-full">
                {/* Progress Bar */}
                <div className="mb-12">
                    <div className="flex justify-between text-sm font-semibold text-emerald-500 mb-3">
                        <span>Passo {currentStep + 1} de {questions.length}</span>
                        <span>{Math.round(progress)}% Completo</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <motion.div
                            className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-full rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                    </div>
                </div>

                {/* Question Area */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -50, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-extrabold mb-8 leading-tight tracking-tight">
                            {question.title}
                        </h2>

                        <div className="grid gap-4">
                            {question.options.map((option, idx) => {
                                const Icon = option.icon;
                                const isSelected = answers[currentStep] === option.text;

                                return (
                                    <button
                                        key={idx}
                                        onClick={() => handleSelect(option.text)}
                                        className={`flex items-center w-full p-5 rounded-2xl border text-left transition-all ${isSelected
                                                ? "border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/5 text-white ring-1 ring-emerald-500"
                                                : "border-slate-800 bg-[#1e293b] hover:border-slate-600 hover:bg-slate-800 text-slate-300"
                                            }`}
                                    >
                                        <div className={`p-3 rounded-lg mr-4 ${isSelected ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-400"}`}>
                                            <Icon size={24} />
                                        </div>
                                        <span className="flex-1 font-medium">{option.text}</span>
                                        <ChevronRight className={`ml-4 ${isSelected ? "text-emerald-500" : "text-slate-600"}`} />
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

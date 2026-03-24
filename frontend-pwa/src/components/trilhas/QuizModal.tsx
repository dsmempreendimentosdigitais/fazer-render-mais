"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, AlertCircle, Award, X, ChevronRight, HelpCircle } from "lucide-react";
import { quizData, Question } from "@/data/quizQuestions";

interface QuizModalProps {
    isOpen: boolean;
    onClose: () => void;
    trilhaId: string;
}

export default function QuizModal({ isOpen, onClose, trilhaId }: QuizModalProps) {
    const questions = quizData[trilhaId] || quizData["1"]; // Default to trilha 1 

    const [currentStep, setCurrentStep] = useState<"intro" | "questions" | "results">("intro");
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    
    // An array to store the result of each question: true (correct) or false (incorrect)
    const [results, setResults] = useState<boolean[]>([]);

    if (!isOpen) return null;

    const actQuestion = questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    const handleStart = () => {
        setCurrentStep("questions");
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setShowExplanation(false);
        setResults([]);
    };

    const handleAnswer = (index: number) => {
        if (showExplanation) return; // Prevent changing answer
        setSelectedOption(index);
        setShowExplanation(true);
        
        const isCorrect = index === actQuestion.correctAnswerIndex;
        setResults((prev) => [...prev, isCorrect]);
    };

    const handleNextQuestion = () => {
        if (isLastQuestion) {
            setCurrentStep("results");
        } else {
            setCurrentQuestionIndex((prev) => prev + 1);
            setSelectedOption(null);
            setShowExplanation(false);
        }
    };

    const handleClose = () => {
        // Reset states for next open
        setCurrentStep("intro");
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setShowExplanation(false);
        setResults([]);
        onClose();
    };

    // Calculate score
    const correctAnswersCount = results.filter(Boolean).length;
    const scorePercentage = (correctAnswersCount / questions.length) * 100;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    onClick={handleClose}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
                />

                {/* Modal Viewport */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative w-full max-w-2xl bg-[#1e293b] border border-slate-700/50 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-[#0f172a]/50">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-emerald-500/10 rounded-lg">
                                <HelpCircle className="w-5 h-5 text-emerald-400" />
                            </div>
                            <h2 className="text-xl font-bold text-white">Quiz de Fixação</h2>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Dynamic Content */}
                    <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                        {currentStep === "intro" && (
                            <div className="text-center py-8 space-y-6">
                                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-500/10 text-emerald-400 mb-4 border border-emerald-500/20">
                                    <Award className="w-12 h-12" />
                                </div>
                                <h3 className="text-2xl font-bold text-white">Teste Seus Conhecimentos</h3>
                                <p className="text-slate-400 max-w-md mx-auto text-lg leading-relaxed">
                                    Este quiz tem <strong className="text-emerald-400">{questions.length} perguntas</strong> baseadas nas aulas da trilha atual. Responda para fixar o aprendizado e ganhar coins!
                                </p>
                                <button
                                    onClick={handleStart}
                                    className="mt-8 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/20"
                                >
                                    Começar o Quiz
                                </button>
                            </div>
                        )}

                        {currentStep === "questions" && (
                            <div className="flex flex-col h-full">
                                {/* Progress bar */}
                                <div className="mb-8">
                                    <div className="flex justify-between text-sm font-bold text-slate-500 mb-2">
                                        <span>Pergunta {currentQuestionIndex + 1} de {questions.length}</span>
                                        <span className="text-emerald-400">{Math.round(((currentQuestionIndex) / questions.length) * 100)}% concluso</span>
                                    </div>
                                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                        <motion.div
                                            className="bg-emerald-500 h-full rounded-full"
                                            initial={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
                                            animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </div>
                                </div>

                                {/* Question Title */}
                                <h3 className="text-xl md:text-2xl font-bold text-white mb-8 leading-relaxed">
                                    {actQuestion.text}
                                </h3>

                                {/* Options */}
                                <div className="space-y-3 flex-1">
                                    {actQuestion.options.map((option, index) => {
                                        const isSelected = selectedOption === index;
                                        const isCorrect = index === actQuestion.correctAnswerIndex;
                                        const showSuccess = showExplanation && isCorrect;
                                        const showError = showExplanation && isSelected && !isCorrect;

                                        let styleClass = "bg-slate-800/50 border-slate-700 hover:bg-slate-800 text-slate-300";
                                        
                                        if (showExplanation) {
                                            if (showSuccess) {
                                                styleClass = "bg-emerald-500/20 border-emerald-500/50 text-emerald-100";
                                            } else if (showError) {
                                                styleClass = "bg-rose-500/20 border-rose-500/50 text-rose-100";
                                            } else {
                                                styleClass = "bg-slate-800/20 border-slate-800/50 text-slate-600 opacity-50"; // Dim others
                                            }
                                        } else if (isSelected) {
                                            styleClass = "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
                                        }

                                        return (
                                            <button
                                                key={index}
                                                onClick={() => handleAnswer(index)}
                                                disabled={showExplanation}
                                                className={`w-full p-4 rounded-xl text-left border transition-all flex items-start gap-3 ${styleClass}`}
                                            >
                                                <div className="mt-0.5 shrink-0">
                                                    {showSuccess ? (
                                                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                                    ) : showError ? (
                                                        <XCircle className="w-5 h-5 text-rose-400" />
                                                    ) : (
                                                        <div className={`w-5 h-5 rounded-full border-2 ${isSelected ? "border-emerald-400 bg-emerald-400/20" : "border-slate-600"}`} />
                                                    )}
                                                </div>
                                                <span className="font-medium">{option}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Explanation Banner */}
                                {showExplanation && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, height: 0 }}
                                        animate={{ opacity: 1, y: 0, height: "auto" }}
                                        className="mt-6 bg-[#0f172a] rounded-xl p-5 border border-slate-800"
                                    >
                                        <h4 className="flex items-center text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">
                                            <AlertCircle className="w-4 h-4 mr-2" />
                                            Explicação
                                        </h4>
                                        <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                                            {actQuestion.explanation}
                                        </p>
                                    </motion.div>
                                )}
                            </div>
                        )}

                        {currentStep === "results" && (
                            <div className="flex flex-col h-full py-6">
                                <div className="text-center mb-8">
                                    <div className="inline-flex items-center justify-center w-28 h-28 rounded-full mb-6 border-4 border-slate-800 relative shadow-2xl overflow-hidden">
                                        <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
                                            <span className="text-4xl font-black text-white">
                                                {scorePercentage}<span className="text-2xl text-slate-500">%</span>
                                            </span>
                                        </div>
                                        <div 
                                            className="absolute bottom-0 w-full bg-emerald-500/20"
                                            style={{ height: `${scorePercentage}%` }}
                                        />
                                    </div>

                                    <h3 className="text-3xl font-extrabold text-white mb-2">
                                        {scorePercentage >= 70 ? "Parabéns, excelente!" : "Você pode melhorar!"}
                                    </h3>
                                    <p className="text-slate-400 text-lg">
                                        Você acertou <strong className="text-white">{correctAnswersCount}</strong> de <strong className="text-white">{questions.length}</strong> questões.
                                    </p>
                                </div>

                                <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 scrollbar-hide">
                                    <h4 className="font-bold text-slate-500 sticky top-0 bg-[#1e293b] py-2 z-10 border-b border-slate-800">
                                        Revisão Rápida
                                    </h4>
                                    {questions.map((q, index) => {
                                        const isCorrect = results[index];
                                        return (
                                            <div key={q.id} className="bg-slate-800/30 rounded-xl p-4 border border-slate-800/50">
                                                <div className="flex items-start gap-3">
                                                    {isCorrect ? (
                                                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                                    ) : (
                                                        <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                                                    )}
                                                    <div>
                                                        <p className="font-bold text-sm text-slate-300 leading-snug mb-1">{q.text}</p>
                                                        <p className="text-xs text-slate-500 leading-relaxed">
                                                            Correta: <span className="text-emerald-400 font-medium">{q.options[q.correctAnswerIndex]}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-slate-800 bg-[#0f172a]/50">
                        {currentStep === "questions" && (
                            <button
                                onClick={handleNextQuestion}
                                disabled={!showExplanation}
                                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center transition-all ${
                                    showExplanation 
                                        ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20" 
                                        : "bg-slate-800 text-slate-600 cursor-not-allowed"
                                }`}
                            >
                                {isLastQuestion ? "Ver Resultado Final" : "Próxima Pergunta"}
                                <ChevronRight className="w-5 h-5 ml-1" />
                            </button>
                        )}
                        
                        {currentStep === "results" && (
                            <div className="flex gap-4">
                                <button
                                    onClick={handleStart}
                                    className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all"
                                >
                                    Refazer Quiz
                                </button>
                                <button
                                    onClick={handleClose}
                                    className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20"
                                >
                                    Voltar à Aula
                                </button>
                            </div>
                        )}
                        
                        {currentStep === "intro" && (
                            <button
                                onClick={handleClose}
                                className="w-full py-4 text-slate-400 hover:text-white font-bold transition-all"
                            >
                                Cancelar e Voltar
                            </button>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

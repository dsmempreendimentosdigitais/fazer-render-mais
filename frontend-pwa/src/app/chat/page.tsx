"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, ShieldCheck, Zap, BookOpen, ChevronRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";

type Message = {
    id: string;
    role: "user" | "ai";
    content: string;
    blocks?: { title: string; text: string; icon: any; color: string }[];
};

export default function ChatIA() {
    const { data: session } = useSession();
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "ai",
            content: "Bem-vindo ao Fazer Render+ IA! Eu fui treinado nos ensinamentos dos maiores investidores do mundo (Buffett, Graham, Bogle, Barsi).\n\nComo posso ajudar na sua jornada com a Renda Fixa hoje?",
        }
    ]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (session?.user) {
            fetch("/api/user")
                .then(res => res.json())
                .then(data => setUserData(data))
                .catch(err => console.error(err));

            // Carregar Histórico
            fetch("/api/chat/history")
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data) && data.length > 0) {
                        setMessages(data.map((m: any) => ({
                            id: m.id,
                            role: m.role,
                            content: m.content
                        })));
                    }
                })
                .catch(err => console.error("Erro ao carregar histórico:", err));
        }
    }, [session]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userText = input;
        const newMsg: Message = { id: Date.now().toString(), role: "user", content: userText };
        setMessages(prev => [...prev, newMsg]);
        setInput("");
        setLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userText,
                    context: {
                        plan: userData?.plan || "FREE"
                    }
                })
            });

            if (!response.ok) throw new Error("Erro de conexão com o servidor de chat");

            const data = await response.json();

            setMessages(prev => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    role: "ai",
                    content: data.reply
                }
            ]);
        } catch (error) {
            setMessages(prev => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    role: "ai",
                    content: "⚠️ Desculpe, o servidor de chat está com dificuldades no momento. Tente novamente em instantes."
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen bg-[#0f172a] text-slate-50 flex flex-col font-sans overflow-hidden py-4 px-4 max-w-4xl mx-auto w-full">
            {/* Header */}
            <header className="px-6 py-4 glassmorphism border border-slate-800 rounded-3xl flex items-center justify-between shadow-xl shadow-emerald-500/5 mb-4 shrink-0">
                <div className="flex items-center space-x-4">
                    <button 
                        onClick={() => window.history.back()}
                        className="p-2 hover:bg-slate-800 rounded-xl transition-colors border border-slate-700/50 group"
                    >
                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-400 rotate-180" />
                    </button>
                    <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center relative overflow-hidden p-1">
                        <img src="/branding/icon.png" alt="Icon" className="w-full h-full object-contain" />
                        <span className="w-2.5 h-2.5 bg-emerald-500 absolute bottom-1 right-1 rounded-full animate-pulse ring-2 ring-[#0f172a]"></span>
                    </div>
                    <div>
                        <h1 className="font-bold text-lg leading-tight">Fazer Render+ IA</h1>
                        <p className="text-xs text-emerald-400 font-medium tracking-wide">Tutor Educativo Online</p>
                    </div>
                </div>

                <div className="hidden md:flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Conexão Segura</span>
                </div>
            </header>

            {/* Chat Messages */}
            <main className="flex-1 overflow-y-auto pr-2 space-y-6 flex flex-col scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                <AnimatePresence>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div className={`max-w-[85%] ${msg.role === "user"
                                ? "bg-slate-800/80 border border-slate-700 rounded-2xl rounded-tr-sm p-4 text-slate-200"
                                : "w-full"
                                }`}>
                                {msg.role === "ai" && (
                                    <div className="flex items-start mb-2 space-x-3">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 mt-1">
                                            <Bot className="w-4 h-4 text-emerald-400" />
                                        </div>

                                        <div className="flex-1 space-y-4">
                                            {/* Text content if string */}
                                            {msg.content && <p className="text-slate-300 leading-relaxed text-[15px] whitespace-pre-line">{msg.content}</p>}

                                            {/* Blocks format like scope 5.3 */}
                                            {msg.blocks && msg.blocks.map((block, i) => {
                                                const Icon = block.icon;
                                                return (
                                                    <div key={i} className={`p-4 rounded-xl border ${block.color} shadow-sm`}>
                                                        <h4 className="text-xs font-bold tracking-widest uppercase mb-2 flex items-center opacity-80">
                                                            <Icon className="w-4 h-4 mr-2" />
                                                            {block.title}
                                                        </h4>
                                                        <p className="text-sm font-medium leading-relaxed opacity-95 whitespace-pre-line">
                                                            {block.text}
                                                        </p>
                                                    </div>
                                                )
                                            })}

                                            {/* Next Step Action Button */}
                                            {msg.blocks && (
                                                <button className="flex justify-between items-center w-full p-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl transition text-sm font-bold text-slate-300 mt-2">
                                                    <span className="flex items-center">📚 Próximo: Simular Tesouro Selic</span>
                                                    <ChevronRight className="w-4 h-4 text-emerald-500" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {msg.role === "user" && (
                                    <p className="leading-relaxed">{msg.content}</p>
                                )}
                            </div>
                        </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                </AnimatePresence>
            </main>

            {/* Input Area */}
            <footer className="mt-4 glassmorphism border border-slate-800 p-2 pl-6 rounded-3xl flex items-center shrink-0">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Pergunte sobre CDB, juros compostos..."
                    className="flex-1 bg-transparent border-none outline-none text-slate-200 placeholder:text-slate-500 h-14"
                />
                <button
                    onClick={handleSend}
                    disabled={loading}
                    className="w-12 h-12 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 disabled:opacity-50 rounded-2xl flex items-center justify-center text-white transition-colors"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 ml-1" />}
                </button>
            </footer>
        </div>
    );
}

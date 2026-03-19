"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ShieldCheck, CreditCard, Smartphone, Loader2, Star, BookOpen, Bot, Target } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/ui/Logo";

export default function Planos() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loadingStripe, setLoadingStripe] = useState<string | false>(false);
    const [loadingPix, setLoadingPix] = useState<string | false>(false);

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
            </div>
        );
    }

    if (status === "unauthenticated") {
        router.push("/login");
        return null;
    }

    const handleStripeCheckout = async (plan: string) => {
        setLoadingStripe(plan);
        try {
            const res = await fetch("/api/checkout/stripe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plan: plan }),
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                alert("Erro ao iniciar o checkout seguro via Stripe.");
            }
        } catch (error) {
            console.error(error);
            alert("Erro na conexão com o gateway de pagamento.");
        } finally {
            setLoadingStripe(false);
        }
    };

    const handleMercadoPagoCheckout = async (plan: string) => {
        setLoadingPix(plan);
        try {
            const res = await fetch("/api/checkout/mercadopago", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plan: plan }),
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                alert("Erro ao iniciar o checkout via Mercado Pago.");
            }
        } catch (error) {
            console.error(error);
            alert("Erro na conexão com o Mercado Pago.");
        } finally {
            setLoadingPix(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-50 font-sans p-6 overflow-hidden relative">
            {/* Background elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="max-w-5xl mx-auto py-12 relative z-10 flex flex-col items-center">
                
                <Logo size="xl" className="mb-8" />

                <header className="mb-12 text-center max-w-2xl">
                    <span className="text-emerald-400 font-bold uppercase tracking-widest text-xs mb-3 block">Elevando o seu nível</span>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
                        Destrave o seu futuro financeiro
                    </h1>
                    <p className="text-slate-400 text-lg leading-relaxed">
                        Pare de perder dinheiro para a inflação. Acesso imediato à Trilha de Fundos Imobiliários e muito mais.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl opacity-90 hover:opacity-100 transition-opacity">

                    {/* Free Plan */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#1e293b] border border-slate-800 rounded-3xl p-8 flex flex-col h-full"
                    >
                        <div className="mb-6">
                            <h3 className="text-2xl font-bold text-slate-300">Iniciante</h3>
                            <div className="mt-4 flex items-baseline text-white">
                                <span className="text-4xl font-black">Grátis</span>
                            </div>
                            <p className="text-slate-400 text-sm mt-2">Para quem está aprendendo a poupar.</p>
                        </div>

                        <ul className="space-y-4 mb-8 flex-1 text-sm text-slate-300">
                            <li className="flex items-start"><Check className="w-5 h-5 text-emerald-500 mr-3 shrink-0" />Trilha Renda Fixa liberada</li>
                            <li className="flex items-start"><Check className="w-5 h-5 text-emerald-500 mr-3 shrink-0" />Acesso ao Simulador</li>
                            <li className="flex items-start"><Check className="w-5 h-5 text-emerald-500 mr-3 shrink-0" />I.A. Limitada (10 msg/mês)</li>
                            <li className="flex items-start opacity-40"><div className="w-5 h-5 mr-3 shrink-0 border-2 border-slate-600 rounded-full"></div>Trilha de Fundos Imobiliários</li>
                            <li className="flex items-start opacity-40"><div className="w-5 h-5 mr-3 shrink-0 border-2 border-slate-600 rounded-full"></div>Comunidade Exclusiva</li>
                        </ul>

                        <Link href="/dashboard" className="w-full bg-slate-800 text-slate-300 text-center font-bold py-3 rounded-xl transition hover:bg-slate-700">
                            Meu plano atual
                        </Link>
                    </motion.div>


                    {/* Plus Plan - The main package */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gradient-to-b from-emerald-900/40 to-slate-900 border-2 border-emerald-500 rounded-3xl p-8 flex flex-col h-full relative shadow-2xl shadow-emerald-500/10"
                    >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-slate-950 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-lg flex items-center">
                            <Star className="w-3 h-3 mr-1" /> Mais Popular
                        </div>

                        <div className="mb-6">
                            <h3 className="text-2xl font-bold text-white">Plano PLUS</h3>
                            <div className="mt-4 flex items-baseline text-white">
                                <span className="text-2xl font-bold text-slate-400 mr-1">R$</span>
                                <span className="text-5xl font-black text-emerald-400">29</span>
                                <span className="text-xl font-bold text-emerald-400">,90</span>
                                <span className="text-slate-400 ml-1">/mês</span>
                            </div>
                            <p className="text-emerald-400/80 text-sm mt-2 font-medium">Acelere seus dividendos hoje mesmo.</p>
                        </div>

                        <ul className="space-y-4 mb-8 flex-1 text-sm text-slate-200">
                            <li className="flex items-start"><Check className="w-5 h-5 text-emerald-400 mr-3 shrink-0" />Tudo do plano grátis</li>
                            <li className="flex items-start font-bold text-white"><Check className="w-5 h-5 text-emerald-400 mr-3 shrink-0" />Trilha FIIs 100% Desbloqueada</li>
                            <li className="flex items-start"><Check className="w-5 h-5 text-emerald-400 mr-3 shrink-0" />Bônus Mensal de 500 WealthCoins</li>
                            <li className="flex items-start"><Check className="w-5 h-5 text-emerald-400 mr-3 shrink-0" />Tutor I.A. ilimitado</li>
                            <li className="flex items-start"><Check className="w-5 h-5 text-emerald-400 mr-3 shrink-0" />Acesso à carteira Recomendada</li>
                        </ul>

                        <div className="space-y-3 mt-auto">
                            {/* Stripe - Cartão */}
                            <button
                                onClick={() => handleStripeCheckout("PLUS")}
                                disabled={!!loadingStripe || !!loadingPix}
                                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-4 rounded-xl shadow-lg transition flex items-center justify-center disabled:opacity-70"
                            >
                                {loadingStripe === "PLUS" ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                    <>
                                        <CreditCard className="w-5 h-5 mr-2" />
                                        Assinar PLUS
                                    </>
                                )}
                            </button>

                            {/* Mercado Pago - PIX e Fallback */}
                            <button
                                onClick={() => handleMercadoPagoCheckout("PLUS")}
                                disabled={!!loadingStripe || !!loadingPix}
                                className="w-full bg-[#1e293b] border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 font-bold py-3 text-sm rounded-xl transition flex items-center justify-center disabled:opacity-70"
                            >
                                {loadingPix === "PLUS" ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                    <>
                                        <Smartphone className="w-4 h-4 mr-2" />
                                        PIX (Mercado Pago)
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="mt-4 flex items-center justify-center text-xs text-slate-500 pt-2 font-medium">
                            <ShieldCheck className="w-4 h-4 mr-1 text-slate-400" /> Transação Criptografada Ponto-a-Ponto.
                        </div>

                    </motion.div>

                    {/* Premium Plan - Full unlock */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-[#1e293b] border border-amber-500/50 rounded-3xl p-8 flex flex-col h-full relative"
                    >
                        <div className="absolute top-0 right-4 -translate-y-1/2 bg-amber-500 text-slate-950 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                            Profissional
                        </div>

                        <div className="mb-6">
                            <h3 className="text-2xl font-bold text-amber-500">PREMIUM</h3>
                            <div className="mt-4 flex items-baseline text-white">
                                <span className="text-2xl font-bold text-slate-400 mr-1">R$</span>
                                <span className="text-5xl font-black text-amber-500">49</span>
                                <span className="text-xl font-bold text-amber-500">,90</span>
                                <span className="text-slate-400 ml-1">/mês</span>
                            </div>
                            <p className="text-slate-400 text-sm mt-2 font-medium">Acesso total e irrestrito.</p>
                        </div>

                        <ul className="space-y-4 mb-8 flex-1 text-sm text-slate-300">
                            <li className="flex items-start"><Check className="w-5 h-5 text-amber-500 mr-3 shrink-0" />Tudo dos planos anteriores</li>
                            <li className="flex items-start font-bold text-white"><Check className="w-5 h-5 text-amber-500 mr-3 shrink-0" />Todas as Trilhas Desbloqueadas</li>
                            <li className="flex items-start font-bold text-white"><Check className="w-5 h-5 text-amber-500 mr-3 shrink-0" />Ações e Fundos Nacionais</li>
                            <li className="flex items-start font-bold text-white"><Check className="w-5 h-5 text-amber-500 mr-3 shrink-0" />Fundos Internacionais</li>
                            <li className="flex items-start"><Check className="w-5 h-5 text-amber-500 mr-3 shrink-0" />Carteiras Recomendadas</li>
                            <li className="flex items-start"><Check className="w-5 h-5 text-amber-500 mr-3 shrink-0" />I.A. Especialista em Ações Lider</li>
                        </ul>

                        <div className="space-y-3 mt-auto">
                            {/* Stripe - Cartão */}
                            <button
                                onClick={() => handleStripeCheckout("PREMIUM")}
                                disabled={!!loadingStripe || !!loadingPix}
                                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-4 rounded-xl shadow-lg transition flex items-center justify-center disabled:opacity-70"
                            >
                                {loadingStripe === "PREMIUM" ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                    <>
                                        <CreditCard className="w-5 h-5 mr-2" />
                                        Assinar PREMIUM
                                    </>
                                )}
                            </button>

                            {/* Mercado Pago - PIX */}
                            <button
                                onClick={() => handleMercadoPagoCheckout("PREMIUM")}
                                disabled={!!loadingStripe || !!loadingPix}
                                className="w-full bg-[#1e293b] border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 font-bold py-3 text-sm rounded-xl transition flex items-center justify-center disabled:opacity-70"
                            >
                                {loadingPix === "PREMIUM" ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                    <>
                                        <Smartphone className="w-4 h-4 mr-2" />
                                        PIX (Mercado Pago)
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="mt-4 flex items-center justify-center text-xs text-slate-500 pt-2 font-medium">
                            <ShieldCheck className="w-4 h-4 mr-1 text-slate-400" /> Transação Segura.
                        </div>

                    </motion.div>

                </div>

                {/* Persuasive Copywriting Section */}
                <div className="mt-20 max-w-4xl text-left bg-[#1e293b]/50 border border-slate-800 p-8 md:p-12 rounded-3xl">
                    <h2 className="text-3xl font-black mb-6 text-white text-center">O que você está garantindo hoje?</h2>

                    <div className="space-y-8 mt-10">
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="bg-emerald-500/10 p-4 rounded-2xl flex-shrink-0">
                                <BookOpen className="w-8 h-8 text-emerald-400" />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-emerald-400 mb-2">Trilhas de Conhecimento Estruturadas</h4>
                                <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                                    Não importa se você é o assinante <strong>Grátis</strong>, <strong>PLUS</strong> ou <strong>PREMIUM</strong>. O aprendizado evolui com você.<br /><br />
                                    No plano <strong>GRÁTIS</strong>, você domina as bases: <em>Renda Fixa e Tesouro Direto</em>. Você aprende a sair da poupança com segurança.<br /><br />
                                    Ao subir para o <strong>PLUS</strong>, a <em>Trilha 2 de Fundos Imobiliários (FIIs)</em> é liberada para você aprender a receber aluguéis mensais isentos de imposto de renda.<br /><br />
                                    E no plano <strong>PREMIUM</strong>, <em>ABSOLUTAMENTE TODAS as Trilhas</em> são desbloqueadas: Ações Nacionais, BDRs, Mercado Internacional, Criptomoedas e muito mais. O mapa completo da riqueza na sua mão.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="bg-blue-500/10 p-4 rounded-2xl flex-shrink-0">
                                <Bot className="w-8 h-8 text-blue-400" />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-blue-400 mb-2">Acesso ao Cérebro da Inteligência Artificial</h4>
                                <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                                    A Fazer Render+ IA não é um robô de chat comum. Ela foi educada com os princípios de Graham, Barsi, e Warren Buffett.<br /><br />
                                    <strong>I.A. Limitada (Grátis):</strong> Você tem 10 perguntas cruciais por mês sobre juros, CDBs e Tesouro Direto.<br />
                                    <strong>I.A. Ilimitada (PLUS):</strong> Faça mil perguntas se quiser. Ela calculará juros sobre juros e te avaliará em Renda Fixa e FIIs.<br />
                                    <strong>I.A. Especialista (PREMIUM):</strong> O Cérebro se abre. Peça à IA para analisar balanços de empresas da Bolsa, avaliar o risco de uma ação específica ou estruturar proteções cambiais. O nível Institucional em seu bolso.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="bg-amber-500/10 p-4 rounded-2xl flex-shrink-0">
                                <Target className="w-8 h-8 text-amber-500" />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-amber-500 mb-2">Carteiras Recomendadas Exclusivas</h4>
                                <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                                    Apenas os membros das camadas mais altas (A partir do <strong>PLUS</strong>) recebem as Carteiras Oficiais atualizadas.<br /><br />
                                    Diga adeus as dicas aleatórias da internet. Acesso mensal a um portfólio defensivo e vencedor revisado pela nossa equipe de veteranos de mercado, dizendo exatamente o que comprar e a que preço. Um assinante <strong>PREMIUM</strong> tem acesso também as carteiras Arrojadas e Internacionais.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

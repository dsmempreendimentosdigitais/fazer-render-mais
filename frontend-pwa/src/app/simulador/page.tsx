"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DollarSign, Percent, Calendar, TrendingUp, Calculator, ArrowRight, Lock, Info, CheckCircle2, ChevronRight, HelpCircle, AlertTriangle, Star, Loader2, Target } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Logo from "@/components/ui/Logo";

export default function Simulator() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [userData, setUserData] = useState<any>(null);

    const [initialAmount, setInitialAmount] = useState<number>(50);
    const [monthlyContribution, setMonthlyContribution] = useState<number>(100);
    const [years, setYears] = useState<number>(5);

    const [selicRate, setSelicRate] = useState<number>(10.5);
    const [savingsRate, setSavingsRate] = useState<number>(6.17);
    const inflation = 4.5;
    const cdbD0Rate = 11.5;

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

    useEffect(() => {
        const fetchMarketData = async () => {
            try {
                // BCB API: Série 432 (Taxa Selic Meta)
                const response = await fetch("https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados/ultimos/1?formato=json");
                const data = await response.json();
                if (data && data[0] && data[0].valor) {
                    const currentSelic = parseFloat(data[0].valor);
                    setSelicRate(currentSelic);

                    // Regra da Poupança: Se Selic <= 8.5%, rende 70% da Selic. Se > 8.5%, rende 6.17% aa + TR
                    if (currentSelic <= 8.5) {
                        setSavingsRate(Number((currentSelic * 0.7).toFixed(2)));
                    } else {
                        setSavingsRate(6.17);
                    }
                }
            } catch (error) {
                console.error("Erro ao buscar dados do Banco Central do Brasil", error);
            }
        };
        fetchMarketData();
    }, []);

    // Calculadora de juros compostos
    const calculateCompoundInterest = (p: number, pmt: number, r: number, t: number) => {
        const monthlyRate = r / 100 / 12;
        const months = t * 12;
        return p * Math.pow(1 + monthlyRate, months) + pmt * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    };

    const selicResult = calculateCompoundInterest(initialAmount, monthlyContribution, selicRate, years);
    const savingsResult = calculateCompoundInterest(initialAmount, monthlyContribution, savingsRate, years);

    // Novas Simulações Avançadas (Média dos últimos 10 anos representativa para didática)
    const plusRate = 12.5; // Histórico médio de Renda Fixa + FIIs
    const g4pRate = 14.8; // Estratégia 4 Pilares (Global) / All-Weather
    const barsiRate = 16.5; // Carteira Previdenciária Método Barsi (Ações Dividendos e FIIs)

    const plusResult = calculateCompoundInterest(initialAmount, monthlyContribution, plusRate, years);
    const g4pResult = calculateCompoundInterest(initialAmount, monthlyContribution, g4pRate, years);
    const barsiResult = calculateCompoundInterest(initialAmount, monthlyContribution, barsiRate, years);

    const totalInvested = initialAmount + (monthlyContribution * years * 12);

    const userPlan = userData?.plan || "FREE";
    const isAdmin = userPlan === "ADMIN";
    const isPremium = userPlan === "PREMIUM" || isAdmin;
    const isPlus = userPlan === "PLUS" || isPremium;

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    if (status === "loading" || (!userData && status === "authenticated")) {
        return (
            <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-50 p-6 font-sans antialiased overflow-x-hidden">
            <div className="max-w-6xl mx-auto py-10">
                <div className="flex justify-start mb-8">
                    <Logo size="lg" />
                </div>
                
                <div className="flex flex-col xl:flex-row gap-10">

                {/* Left Col: Controls */}
                <div className="w-full xl:w-96 flex-shrink-0 space-y-8">
                    <div className="mb-4">
                        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 tracking-tight mb-2">
                            Juros Compostos
                        </h1>
                        <p className="text-slate-400 font-medium">Veja o tempo a favor do seu dinheiro, como ensina Warren Buffett.</p>
                    </div>

                    <div className="glassmorphism p-6 rounded-3xl border border-slate-800 space-y-6 shadow-2xl shadow-emerald-500/5">
                        <div>
                            <label className="text-sm font-bold text-slate-300 mb-2 flex flex-col justify-between">
                                <span>Valor Inicial</span>
                                <span className="text-2xl text-emerald-400 font-black mt-1">{formatCurrency(initialAmount)}</span>
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="10000"
                                step="50"
                                value={initialAmount}
                                onChange={(e) => setInitialAmount(Number(e.target.value))}
                                className="w-full accent-emerald-500 mt-2 h-2 rounded-lg bg-slate-800 appearance-none"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-bold text-slate-300 mb-2 flex flex-col justify-between">
                                <span>Aporte Mensal (R$)</span>
                                <span className="text-2xl text-emerald-400 font-black mt-1">{formatCurrency(monthlyContribution)}</span>
                            </label>
                            <input
                                type="range"
                                min="50"
                                max="5000"
                                step="50"
                                value={monthlyContribution}
                                onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                                className="w-full accent-emerald-500 mt-2 h-2 rounded-lg bg-slate-800 appearance-none cursor-pointer"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-bold text-slate-300 mb-2 flex flex-col justify-between">
                                <span>Prazo (Anos)</span>
                                <span className="text-2xl text-cyan-400 font-black mt-1">{years} {years === 1 ? 'ano' : 'anos'}</span>
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="30"
                                value={years}
                                onChange={(e) => setYears(Number(e.target.value))}
                                className="w-full accent-cyan-500 mt-2 h-2 rounded-lg bg-slate-800 appearance-none cursor-pointer"
                            />
                        </div>

                        <div className="pt-4 border-t border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-widest flex justify-between">
                            <span>Total Investido do Bolso:</span>
                            <span className="text-white">{formatCurrency(totalInvested)}</span>
                        </div>
                    </div>
                </div>

                {/* Right Col: Results */}
                <div className="flex-1 space-y-6 flex flex-col">
                    {/* Top Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-[#1e293b] p-4 rounded-2xl border border-slate-700/50 flex flex-col justify-between">
                            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">CDI Hoje</span>
                            <span className="text-xl font-black text-amber-400 flex items-center">
                                {selicRate}% <Percent className="w-4 h-4 ml-1 opacity-50" />
                            </span>
                        </div>
                        <div className="bg-[#1e293b] p-4 rounded-2xl border border-slate-700/50 flex flex-col justify-between">
                            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Poupança Hoje</span>
                            <span className="text-xl font-black text-red-400 flex items-center">
                                {savingsRate}% <Percent className="w-4 h-4 ml-1 opacity-50" />
                            </span>
                        </div>
                        <div className="bg-[#1e293b] p-4 rounded-2xl border border-slate-700/50 flex flex-col justify-between">
                            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Tempo total</span>
                            <span className="text-xl font-black text-white flex items-center">
                                {years * 12} <span className="text-slate-500 text-sm ml-2 font-normal">meses</span>
                                <Calendar className="w-4 h-4 ml-auto opacity-30" />
                            </span>
                        </div>
                    </div>

                    {/* SCENARIO 1: INICIANTE (FREE) */}
                    <div className="mb-10">
                        <h2 className="text-xl font-bold text-slate-300 mb-4 flex items-center">
                            <Target className="w-5 h-5 mr-2 text-emerald-400" />
                            Cenário 1: Renda Fixa Base (Poupança vs Selic)
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:gap-6 flex-1">
                            <motion.div
                                key={selicResult}
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                className="bg-gradient-to-br from-emerald-500/10 to-emerald-900/40 border border-emerald-500/50 p-6 xl:p-8 rounded-3xl relative overflow-hidden flex flex-col h-full justify-between"
                            >
                                <div className="absolute top-0 right-0 p-6 opacity-10">
                                    <TrendingUp className="w-32 h-32 text-emerald-500" />
                                </div>

                                <div>
                                    <span className="bg-emerald-500 text-slate-900 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-emerald-500/20">
                                        Tesouro Selic / CDB
                                    </span>
                                    <h3 className="text-3xl xl:text-4xl font-black mt-6 mb-2 tracking-tighter truncate" title={formatCurrency(selicResult)}>{formatCurrency(selicResult)}</h3>
                                    <p className="text-emerald-400 font-bold text-sm">
                                        + {formatCurrency(selicResult - totalInvested)} só de juros!
                                    </p>
                                </div>

                                <div className="mt-8">
                                    <p className="text-slate-300 text-sm leading-relaxed mb-4">
                                        O Tesouro Selic protege o seu dinheiro da inflação com o menor risco do Brasil.
                                    </p>
                                    <Link href="/trilhas" className="w-full relative inline-flex h-12 overflow-hidden rounded-xl p-[1px] focus:outline-none hover:scale-105 transition-transform">
                                        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#10b981_50%,#E2CBFF_100%)]" />
                                        <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-xl bg-slate-950 px-3 py-1 text-sm font-bold text-white backdrop-blur-3xl whitespace-nowrap">
                                            Aprender Renda Fixa agora
                                        </span>
                                    </Link>
                                </div>
                            </motion.div>

                            <motion.div
                                className="bg-red-500/5 border border-red-500/20 p-6 xl:p-8 rounded-3xl relative flex flex-col h-full justify-between"
                            >
                                <div>
                                    <span className="bg-slate-800 text-slate-400 border border-slate-700 text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest">
                                        Poupança Antiga
                                    </span>
                                    <h3 className="text-2xl xl:text-3xl font-extrabold mt-6 mb-2 opacity-50 tracking-tighter truncate" title={formatCurrency(savingsResult)}>{formatCurrency(savingsResult)}</h3>
                                    <p className="text-red-400 font-bold text-sm tracking-wide">
                                        Diferença de {formatCurrency(selicResult - savingsResult)}
                                    </p>
                                </div>

                                <div className="mt-8 bg-red-500/10 p-4 rounded-xl border border-red-500/20 text-red-200 text-xs leading-relaxed font-medium flex items-start">
                                    <AlertTriangle className="w-12 h-12 shrink-0 mr-3 text-red-400" />
                                    Isso quer dizer que se você deixar na poupança por {years} anos, você perderá literalmente {formatCurrency(selicResult - savingsResult)} de poder de compra pela péssima rentabilidade.
                                </div>
                            </motion.div>
                        </div>
                    </div> {/* End Scenario 1 */}

                    {/* SCENARIO 2: INTERMEDIÁRIO (PLUS) */}
                    <div className="mb-10 border-t border-slate-800/80 pt-10 relative">
                        {!isPlus && (
                            <Link href="/planos" className="absolute inset-0 z-20 bg-[#0f172a]/70 backdrop-blur-md flex flex-col items-center justify-center p-6 border border-amber-500/20 rounded-3xl cursor-pointer hover:bg-[#0f172a]/80 transition group pt-16">
                                <div className="bg-amber-500/10 p-4 rounded-full mb-4 group-hover:scale-110 transition">
                                    <Lock className="w-8 h-8 text-amber-500" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-100 mb-2">Desbloqueie o Cenário PLUS</h3>
                                <p className="text-sm text-slate-300 mt-2 max-w-md text-center leading-relaxed">Simule o poder multiplicador de adicionar <strong>Fundos Imobiliários</strong> e uma Seleção Premium de <strong>Renda Fixa Isenta</strong> na sua carteira. Os assinantes da Trilha 2 atingem média de 12,5% a.a.</p>
                                <button className="mt-6 bg-amber-500 hover:bg-amber-400 text-slate-900 px-8 py-3 rounded-xl font-bold text-sm transition">Ver Planos de Assinatura</button>
                            </Link>
                        )}
                        <h2 className="text-xl font-bold text-amber-400 mb-4 flex items-center">
                            <Star className="w-5 h-5 mr-2" />
                            Cenário 2: Carteira PLUS (Renda Fixa Avançada + FIIs)
                        </h2>
                        <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 xl:gap-6 flex-1 ${!isPlus ? 'opacity-30 pointer-events-none filter blur-[4px]' : ''}`}>
                            <div className="bg-[#1e293b] border border-amber-500/30 p-6 xl:p-8 rounded-3xl relative flex flex-col h-full justify-between shadow-lg shadow-amber-500/5">
                                <div>
                                    <span className="bg-amber-500/20 text-amber-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-amber-500/20 line-clamp-1">
                                        Histórico: 12.5% a.a
                                    </span>
                                    <h3 className="text-3xl xl:text-4xl font-black mt-6 mb-2 text-amber-400 tracking-tighter truncate" title={formatCurrency(plusResult)}>{formatCurrency(plusResult)}</h3>
                                    <p className="text-amber-500/80 font-bold text-sm">
                                        + {formatCurrency(plusResult - selicResult)} se comparado ao Tesouro Selic.
                                    </p>
                                </div>
                                <p className="text-slate-300 text-sm leading-relaxed mt-8">
                                    Mesclar bons FIIs para receber aluguéis mensais com IPCA+ de longo prazo gera um efeito bola de neve financeiro massivo.
                                </p>
                            </div>
                            <div className="bg-[#1e293b]/50 border border-slate-700/50 p-8 rounded-3xl text-sm text-slate-400 flex flex-col justify-center space-y-4">
                                <h4 className="font-bold text-slate-200 mb-2 uppercase tracking-wide text-xs">Composição Simulada</h4>
                                <div className="flex justify-between items-center"><span className="flex items-center"><div className="w-3 h-3 rounded-full bg-emerald-500 mr-3"></div> Renda Fixa (IPCA+/CDI)</span> <span className="font-bold text-slate-300">60%</span></div>
                                <div className="flex justify-between items-center"><span className="flex items-center"><div className="w-3 h-3 rounded-full bg-amber-500 mr-3"></div> Fundos Imobiliários (FIIs)</span> <span className="font-bold text-slate-300">40%</span></div>
                            </div>
                        </div>
                    </div> {/* End Scenario 2 */}

                    {/* SCENARIO 3: Estratégia 4 Pilares (PREMIUM) */}
                    <div className="mb-6 border-t border-slate-800/80 pt-10 relative">
                        {!isPremium && (
                            <Link href="/planos" className="absolute inset-0 z-20 bg-[#0f172a]/70 backdrop-blur-md flex flex-col items-center justify-center p-6 border border-emerald-500/30 rounded-3xl cursor-pointer hover:bg-[#0f172a]/80 transition group pt-16">
                                <div className="bg-emerald-500/10 p-4 rounded-full mb-4 group-hover:scale-110 transition border border-emerald-500/30">
                                    <Lock className="w-8 h-8 text-emerald-400" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-100 mb-2">Desbloqueie a Estratégia 4 Pilares (PREMIUM)</h3>
                                <p className="text-sm text-slate-300 mt-2 max-w-lg text-center leading-relaxed">Simule a blindagem patrimonial com 4 fatias iguais e diversificadas rendendo historicamente 14,8% a.a para te proteger de crises e oscilações do mercado.</p>
                                <button className="mt-6 bg-emerald-500 hover:bg-emerald-400 text-slate-900 px-8 py-3 rounded-xl font-bold text-sm transition">Fazer Upgrade Especialista</button>
                            </Link>
                        )}
                        <h2 className="text-xl font-bold text-emerald-400 mb-4 flex items-center">
                            <TrendingUp className="w-5 h-5 mr-2" />
                            Cenário 3: Estratégia Global de 4 Pilares (G4P)
                        </h2>
                        <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 xl:gap-6 flex-1 ${!isPremium ? 'opacity-30 pointer-events-none filter blur-[4px]' : ''}`}>
                            <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] border border-emerald-500/50 p-6 xl:p-8 rounded-3xl relative flex flex-col h-full justify-between shadow-xl shadow-emerald-500/10">
                                <div>
                                    <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-500/30 line-clamp-1">
                                        Histórico: 14.8% a.a
                                    </span>
                                    <h3 className="text-3xl xl:text-4xl font-black mt-6 mb-2 text-white tracking-tighter truncate" title={formatCurrency(g4pResult)}>{formatCurrency(g4pResult)}</h3>
                                    <p className="text-emerald-400 font-bold text-sm">
                                        + {formatCurrency(g4pResult - plusResult)} se comparado à Carteira PLUS.
                                    </p>
                                </div>
                                <p className="text-slate-300 text-sm leading-relaxed mt-8">
                                    A verdadeira diversificação All-Weather. Dividida em 4 quadrantes para ganhar dinheiro na alta e se proteger na baixa em qualquer ciclo econômico global.
                                </p>
                            </div>
                            <div className="bg-[#1e293b]/50 border border-slate-700/50 p-8 rounded-3xl text-sm text-slate-400 flex flex-col justify-center space-y-4">
                                <h4 className="font-bold text-slate-200 mb-2 uppercase tracking-wide text-xs">Divisão da Estratégia</h4>
                                <div className="flex justify-between items-center"><span className="flex items-center"><div className="w-3 h-3 rounded-full bg-blue-500 mr-3"></div> Ações Brasil</span> <span className="font-bold text-slate-300">25%</span></div>
                                <div className="flex justify-between items-center"><span className="flex items-center"><div className="w-3 h-3 rounded-full bg-amber-500 mr-3"></div> Real Estate (FIIs)</span> <span className="font-bold text-slate-300">25%</span></div>
                                <div className="flex justify-between items-center"><span className="flex items-center"><div className="w-3 h-3 rounded-full bg-emerald-500 mr-3"></div> Caixa (Renda Fixa IPCA+)</span> <span className="font-bold text-slate-300">25%</span></div>
                                <div className="flex justify-between items-center"><span className="flex items-center"><div className="w-3 h-3 rounded-full bg-violet-500 mr-3"></div> Ativos Internacionais (Dólar)</span> <span className="font-bold text-slate-300">25%</span></div>
                            </div>
                        </div>
                    </div> {/* End Scenario 3 */}

                    {/* SCENARIO 4: MÉTODO BARSI (PREMIUM VIP) */}
                    <div className="mb-6 border-t border-slate-800/80 pt-10 relative">
                        {!isPremium && (
                            <Link href="/planos" className="absolute inset-0 z-20 bg-[#0f172a]/70 backdrop-blur-md flex flex-col items-center justify-center p-6 border border-rose-500/30 rounded-3xl cursor-pointer hover:bg-[#0f172a]/80 transition group pt-16">
                                <div className="bg-rose-500/10 p-4 rounded-full mb-4 group-hover:scale-110 transition border border-rose-500/30">
                                    <Lock className="w-8 h-8 text-rose-400" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-100 mb-2">Desbloqueie o Método de Dividendos</h3>
                                <p className="text-sm text-slate-300 mt-2 max-w-lg text-center leading-relaxed">Simule a mesma estratégia (BESST) usada por Warren Buffett e Luiz Barsi Filho (o maior investidor do Brasil) para acumular uma vida de dividendos infinitos.</p>
                                <button className="mt-6 bg-rose-500 hover:bg-rose-400 text-slate-900 px-8 py-3 rounded-xl font-bold text-sm transition">Fazer Upgrade Especialista</button>
                            </Link>
                        )}
                        <h2 className="text-xl font-bold text-rose-400 mb-4 flex items-center">
                            <TrendingUp className="w-5 h-5 mr-2" />
                            Cenário 4: Previdência em Ações (Luiz Barsi / Buffett)
                        </h2>
                        <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 xl:gap-6 flex-1 ${!isPremium ? 'opacity-30 pointer-events-none filter blur-[4px]' : ''}`}>
                            <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] border border-rose-500/50 p-6 xl:p-8 rounded-3xl relative flex flex-col h-full justify-between shadow-xl shadow-rose-500/10">
                                <div>
                                    <span className="bg-rose-500/20 text-rose-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-rose-500/30 line-clamp-1">
                                        Histórico Estimado: 16.5% a.a
                                    </span>
                                    <h3 className="text-3xl xl:text-4xl font-black mt-6 mb-2 text-white tracking-tighter truncate" title={formatCurrency(barsiResult)}>{formatCurrency(barsiResult)}</h3>
                                    <p className="text-rose-400 font-bold text-sm">
                                        + {formatCurrency(barsiResult - g4pResult)} se comparado à Estratégia 4 Pilares.
                                    </p>
                                </div>
                                <p className="text-slate-300 text-sm leading-relaxed mt-8">
                                    Foco extremo em "Comprar Ações Garantidas" de setores perenes (Bancos, Energia, Saneamento, Seguros e Telecom). Você se torna sócio das empresas que cobram das outras pessoas todo mês e reinveste os dividendos.
                                </p>
                            </div>
                            <div className="bg-[#1e293b]/50 border border-slate-700/50 p-8 rounded-3xl text-sm text-slate-400 flex flex-col justify-center space-y-4">
                                <h4 className="font-bold text-slate-200 mb-2 uppercase tracking-wide text-xs">Divisão da Estratégia (Setores BEST)</h4>
                                <div className="flex justify-between items-center"><span className="flex items-center"><div className="w-3 h-3 rounded-full bg-rose-500 mr-3"></div> Ações de Dividendos Perenes</span> <span className="font-bold text-slate-300">70%</span></div>
                                <div className="flex justify-between items-center"><span className="flex items-center"><div className="w-3 h-3 rounded-full bg-amber-500 mr-3"></div> Fundos Imobiliários de Tijolo</span> <span className="font-bold text-slate-300">20%</span></div>
                                <div className="flex justify-between items-center"><span className="flex items-center"><div className="w-3 h-3 rounded-full bg-emerald-500 mr-3"></div> Reserva de Oportunidade (Caixa)</span> <span className="font-bold text-slate-300">10%</span></div>
                            </div>
                        </div>
                    </div> {/* End Scenario 4 */}
                    </div>
                </div>
            </div>
        </div>
    );
}

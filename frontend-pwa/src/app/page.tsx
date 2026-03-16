"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Brain, TrendingUp, ShieldCheck } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-50 font-sans overflow-hidden">
      {/* Navbar Minimalist */}
      <nav className="glassmorphism fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center shadow-lg border-b border-slate-800">
        <div className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
          Fazer Render+
        </div>
        <Link href="/login" className="text-sm font-medium hover:text-emerald-400 transition-colors">
          Entrar
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-emerald-400 text-sm font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Do Zero ao Patrimônio</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            Pare de apenas poupar. <br/>
            Comece a <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Render de Verdade.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            A ponte entre o seu salário e a liberdade financeira. Uma inteligência artificial treinada pelos métodos de <b>Buffett e Graham</b>, pronta para guiar você do zero ao seu primeiro milhão.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link href="/onboarding">
              <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg shadow-emerald-500/30 transition-all flex items-center space-x-2 group">
                <span>Quero minha liberdade financeira agora →</span>
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Features Cards */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
          {[
            {
              icon: Brain,
              title: "Fazer Render+ IA",
              desc: "Seu tutor pessoal 24/7. Explicamos o mercado na sua língua, não em jargões de Wall Street."
            },
            {
              icon: ShieldCheck,
              title: "Sem Gurus. Só Dados.",
              desc: "Tudo é baseado nos livros de Graham, Buffett e Bogle. Conhecimento atemporal focado na segurança do seu capital."
            },
            {
              icon: TrendingUp,
              title: "Simulação Real",
              desc: "Pratique aportes, entenda Renda Fixa e veja os juros compostos atuarem antes de colocar 1 real do seu bolso."
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-[#1e293b] p-8 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition-colors group"
            >
              <div className="w-14 h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Footer minimal */}
      <footer className="w-full text-center py-8 text-slate-500 text-sm border-t border-slate-800/50 mt-10">
        © 2026 Fazer Render+ Educação Financeira. Todos os direitos reservados.
      </footer>
    </div>
  );
}

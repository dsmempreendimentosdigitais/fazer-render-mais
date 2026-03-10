"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PlayCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isRegister, setIsRegister] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (isRegister) {
            // Registrar fluxo
            try {
                const res = await fetch("/api/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });

                if (res.ok) {
                    // Após registro, loga automaticamente
                    const signInRes = await signIn("credentials", {
                        email,
                        password,
                        redirect: false,
                    });

                    if (signInRes?.ok) {
                        router.push("/onboarding");
                    } else {
                        setError("Erro ao logar após registro. Tente novamente.");
                    }
                } else {
                    const data = await res.json();
                    setError(data.error || "Ocorreu um erro ao criar a conta.");
                }
            } catch (err) {
                setError("Falha na conexão.");
            }
        } else {
            // Login fluxo
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                setError(res.error);
            } else {
                router.push("/dashboard");
            }
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-50 flex flex-col justify-center items-center p-6 antialiased">
            <Link href="/">
                <div className="absolute top-8 left-8 text-2xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent hover:opacity-80 transition cursor-pointer">
                    Fazer Render+
                </div>
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-[#1e293b]/80 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl shadow-emerald-500/10"
            >
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold mb-2">
                        {isRegister ? "Criar Conta Grátis" : "Bem-vindo de volta"}
                    </h2>
                    <p className="text-slate-400 text-sm">
                        {isRegister
                            ? "Comece sua jornada Do Zero ao Patrimônio agora mesmo."
                            : "Faça login para continuar sua jornada de investimentos."}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl mb-6 text-sm text-center font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-slate-300 mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                            placeholder="seu@email.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-300 mb-2">Senha</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-4 rounded-xl transition flex justify-center items-center shadow-lg shadow-emerald-500/20 disabled:opacity-70"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <PlayCircle className="w-5 h-5 mr-2" />
                                {isRegister ? "Criar Conta e Começar" : "Entrar e Render"}
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm font-medium text-slate-400">
                    {isRegister ? "Já tem uma conta?" : "Ainda não investe seu futuro?"}{" "}
                    <button
                        onClick={() => setIsRegister(!isRegister)}
                        className="text-emerald-400 hover:text-emerald-300 transition hover:underline"
                    >
                        {isRegister ? "Faça login" : "Crie sua conta"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

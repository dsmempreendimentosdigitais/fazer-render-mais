import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { MercadoPagoConfig, Preference } from "mercadopago";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { plan } = body;

        // URL base para os redirecionamentos do Gateway
        const appUrl = process.env.NEXTAUTH_URL || "http://localhost:3003";

        // Verifica a chave (em Prod ela existirá)
        if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
            console.error("MERCADOPAGO_ACCESS_TOKEN is missing");
            return NextResponse.json({ error: "Configuração do MP inválida no ambiente." }, { status: 500 });
        }

        // Setup the MP Instance Official
        const client = new MercadoPagoConfig({
            accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
        });

        const preference = new Preference(client);

        // Cria a preferência de pagamento (Checkout Pro - que aceita PIX e Boleto rápido)
        const response = await preference.create({
            body: {
                items: [
                    {
                        id: plan === "PLUS" ? "frm-plus" : "frm-premium",
                        title: "Fazer Render+ " + plan,
                        description: plan === "PLUS" ? "Acesso à Trilha FIIs Mensal" : "Acesso Premium",
                        quantity: 1,
                        unit_price: plan === "PLUS" ? 29.90 : 49.90,
                        currency_id: "BRL"
                    }
                ],
                payer: {
                    name: session.user.name || "Usuario",
                    email: session.user.email || ""
                },
                back_urls: {
                    success: `${appUrl}/dashboard?success=true&provider=mp`,
                    failure: `${appUrl}/planos?canceled=true`,
                    pending: `${appUrl}/dashboard?pending=true&provider=mp`
                },
                auto_return: "approved",
                external_reference: session.user.id,
                statement_descriptor: "FAZER RENDER M",
                payment_methods: {
                    excluded_payment_types: [
                        { id: "credit_card" } // Podemos forçar ao MP exibir apenas PIX e boleto e deixar Cartão pro Stripe, aumentando resiliência.
                    ],
                    installments: 1
                }
            }
        });

        // Retorna a URL segura do Checkout do Mercado Pago
        // O init_point fornece a interface pronta da empresa
        return NextResponse.json({ url: response.init_point });

    } catch (error: any) {
        console.error("[MERCADOPAGO_ERROR]", error);
        return NextResponse.json({ error: "Falha na comunicação com gateway secundário." }, { status: 500 });
    }
}

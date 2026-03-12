import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2026-02-25.clover",
});

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

        // Cria a sessão de checkout segura com a Stripe Hosted Page
        const checkoutSession = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "subscription",
            billing_address_collection: "auto",
            customer_email: session.user.email || undefined,
            line_items: [
                {
                    price_data: {
                        currency: "brl",
                        product_data: {
                            name: "Fazer Render+ " + plan,
                            description: plan === "PLUS" ? "Acesso total à Trilha de FIIs, Tutor Inteligente Ilimitado." : "Plano Premium Anual"
                        },
                        unit_amount: plan === "PLUS" ? 2990 : 4990, // Em centavos (R$ 29,90 ou R$ 49,90)
                        recurring: {
                            interval: "month"
                        }
                    },
                    quantity: 1
                }
            ],
            metadata: {
                userId: session.user.id,
                planSelected: plan
            },
            success_url: `${appUrl}/dashboard?success=true&provider=stripe`,
            cancel_url: `${appUrl}/planos?canceled=true`,
        });

        // Retorna a URL da Hosted UI do Stripe (que é segura e converte bem)
        return NextResponse.json({ url: checkoutSession.url });

    } catch (error: any) {
        console.error("[STRIPE_ERROR]", error);
        return NextResponse.json({ error: "Falha na comunicação com gateway." }, { status: 500 });
    }
}

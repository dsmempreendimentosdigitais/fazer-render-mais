"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

interface LogoProps {
    className?: string;
    size?: "sm" | "md" | "lg" | "xl";
}

export default function Logo({ className = "", size = "md" }: LogoProps) {
    const { data: session } = useSession();
    
    // logic: If logged in, go to dashboard. If not, go to home.
    const href = session ? "/dashboard" : "/";

    const sizeClasses = {
        sm: "text-xl",
        md: "text-2xl",
        lg: "text-3xl",
        xl: "text-4xl"
    };

    return (
        <Link href={href} className={`flex items-center transition-all active:scale-95 hover:opacity-80 ${className}`}>
            <span className={`${sizeClasses[size]} font-black tracking-tight bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent select-none`}>
                Fazer Render+
            </span>
        </Link>
    );
}

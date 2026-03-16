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
        sm: "h-6",
        md: "h-10",
        lg: "h-14",
        xl: "h-20"
    };

    return (
        <Link href={href} className={`flex items-center transition-transform active:scale-95 ${className}`}>
            <img 
                src="/branding/logo-horizontal-v2.png" 
                alt="Fazer Render+" 
                className={`${sizeClasses[size]} w-auto object-contain drop-shadow-[0_0_15px_rgba(16,185,129,0.2)]`}
            />
        </Link>
    );
}

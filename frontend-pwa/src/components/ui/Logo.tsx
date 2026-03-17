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
        sm: "h-8",
        md: "h-12",
        lg: "h-16",
        xl: "h-24"
    };

    return (
        <Link href={href} className={`flex items-center transition-transform active:scale-95 ${className}`}>
            <img 
                src="/branding/logo-horizontal-v2.png" 
                alt="Fazer Render+" 
                className={`${sizeClasses[size]} w-auto object-contain`}
            />
        </Link>
    );
}

"use client";

import React, { useMemo } from 'react';
import styles from './fizzy-button.module.css';
import { cn } from '@/lib/utils';
import { Ticket, Loader2 } from 'lucide-react';

interface FizzyActionButtonProps {
    onClick?: () => void;
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties; // Add style prop
    disabled?: boolean;
    isLoading?: boolean;
    type?: "button" | "submit" | "reset";
}

export function FizzyActionButton({
    onClick,
    children,
    className,
    style,
    disabled,
    isLoading,
    type = "button"
}: FizzyActionButtonProps) {
    const particles = useMemo(() => {
        return Array.from({ length: 40 }).map((_, i) => {
            const angle = Math.random() * 360;
            // Reduced distance for more compact particle spread
            const distance = 80 + Math.random() * 60; // Changed from 250-400 to 80-140

            // Optional: Bias towards horizontal for wide buttons? 
            // Stick to radial for now but with high velocity.
            const tx = Math.cos(angle * (Math.PI / 180)) * distance;
            const ty = Math.sin(angle * (Math.PI / 180)) * distance;
            const size = 3 + Math.random() * 3 + 'px'; // Reduced from 8-16 to 3-6
            // Subtle pastel colors matching the Pay button gradient theme
            const colors = [
                'rgba(100, 149, 237, 0.6)',  // Soft cornflower blue
                'rgba(135, 206, 235, 0.6)',  // Soft sky blue
                'rgba(127, 255, 212, 0.6)',  // Soft aquamarine
                'rgba(152, 251, 152, 0.6)',  // Soft pale green
                'rgba(173, 216, 230, 0.6)',  // Soft light blue
            ];
            const color = colors[Math.floor(Math.random() * colors.length)];
            const delay = Math.random() * 0.5 + 's';

            return {
                id: i,
                style: {
                    '--tx': `${tx}px`,
                    '--ty': `${ty}px`,
                    '--size': size,
                    '--bg-color': color,
                    '--delay': delay,
                } as React.CSSProperties,
            };
        });
    }, []);

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || isLoading}
            className={cn(styles.container, "w-full focus:outline-none")}
        >
            <div className={styles.particles}>
                {particles.map((p) => (
                    <span key={p.id} className={styles.particle} style={p.style} />
                ))}
            </div>

            <div
                className={cn(
                    styles.buttonBody,
                    "justify-center w-full h-12 text-lg font-bold transition-all",
                    disabled && "opacity-70 cursor-not-allowed",
                    className
                )}
                style={style} // Apply inline styles to the inner body
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing...
                    </>
                ) : (
                    <>
                        <Ticket className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                        <span>{children}</span>
                    </>
                )}
            </div>
        </button>
    );
}

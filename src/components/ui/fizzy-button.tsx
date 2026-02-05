"use client";

import React, { useMemo } from 'react';
import Link from 'next/link';
import styles from './fizzy-button.module.css';
import { cn } from '@/lib/utils';
import { Ticket } from 'lucide-react';

interface FizzyButtonProps {
    href: string;
    children: React.ReactNode;
    className?: string; // Para ancho, margen, posición externa
}

export function FizzyButton({ href, children, className }: FizzyButtonProps) {
    const particles = useMemo(() => {
        return Array.from({ length: 40 }).map((_, i) => {
            // Ángulo aleatorio 0-360
            const angle = Math.random() * 360;
            // Distancia: Aseguramos que salgan DEL BOTÓN.
            // Si el botón mide aprox 200px (ancho) y 80px (alto), el radio mínimo para salir es distinto.
            // Simplificamos asumiendo que viajan suficiente lejos (e.g. 80px - 150px)
            const distance = 80 + Math.random() * 70;

            const tx = Math.cos(angle * (Math.PI / 180)) * distance;
            const ty = Math.sin(angle * (Math.PI / 180)) * distance;

            const size = 4 + Math.random() * 6 + 'px';
            const colors = ['#eab308', '#a855f7', '#22d3ee', '#fbbf24', '#c084fc'];
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
        <Link href={href} className={cn(styles.container, className)}>
            {/* Partículas detrás */}
            <div className={styles.particles}>
                {particles.map((p) => (
                    <span key={p.id} className={styles.particle} style={p.style} />
                ))}
            </div>

            {/* Contenido visible (Fondo blanco) */}
            <div className={styles.buttonBody}>
                <Ticket className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                <span>{children}</span>
            </div>
        </Link>
    );
}

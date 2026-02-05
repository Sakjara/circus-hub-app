import React from 'react';
import { cn } from '@/lib/utils';
import styles from './interactive-hover-text.module.css';

interface InteractiveHoverTextProps {
    text: string;
    className?: string; // Para clases extra del contenedor (alineación, márgenes)
    textClassName?: string; // Para clases de texto (color, gradiente, fuente)
}

export function InteractiveHoverText({ text, className, textClassName }: InteractiveHoverTextProps) {
    return (
        <div className={cn(styles.hoverContainer, className)}>
            {text.split('').map((char, index) => (
                <span
                    key={index}
                    className={cn(styles.hoverChar, textClassName)}
                // data-char to potentially use in CSS content if needed, though simple replacement is fine
                >
                    {char === ' ' ? '\u00A0' : char}
                </span>
            ))}
        </div>
    );
}

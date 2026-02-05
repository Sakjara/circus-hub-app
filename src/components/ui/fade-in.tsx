"use client"

import { motion } from "framer-motion"

type FadeInProps = {
    children: React.ReactNode
    className?: string
    delay?: number
    direction?: "up" | "down" | "left" | "right" | "none"
    duration?: number
}

export function FadeIn({
    children,
    className,
    delay = 0,
    direction = "up",
    duration = 0.5,
}: FadeInProps) {
    const directions = {
        up: { y: 40 },
        down: { y: -40 },
        left: { x: 40 },
        right: { x: -40 },
        none: {},
    }

    const initial = { opacity: 0, ...directions[direction] }
    const animate = { opacity: 1, x: 0, y: 0 }

    return (
        <motion.div
            initial={initial}
            whileInView={animate}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration, delay, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

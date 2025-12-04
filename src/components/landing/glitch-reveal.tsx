"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*"

export function GlitchReveal({ text, className, idleClassName = "text-white/50" }: { text: string; className?: string; idleClassName?: string }) {
    const [displayText, setDisplayText] = useState(text)
    const [isHovered, setIsHovered] = useState(false)

    useEffect(() => {
        if (!isHovered) {
            setDisplayText(text)
            return
        }

        let iteration = 0
        const interval = setInterval(() => {
            setDisplayText(() =>
                text
                    .split("")
                    .map((letter, index) => {
                        if (index < iteration) {
                            return text[index]
                        }
                        return chars[Math.floor(Math.random() * chars.length)]
                    })
                    .join("")
            )

            if (iteration >= text.length) {
                clearInterval(interval)
            }

            iteration += 1 / 2 // Speed of decoding
        }, 30)

        return () => clearInterval(interval)
    }, [isHovered, text])

    return (
        <motion.div
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className={`relative inline-block cursor-pointer group ${className}`}
        >
            <motion.span
                className={`relative z-10 inline-block bg-clip-text ${isHovered ? "text-transparent bg-gradient-to-r from-red-500 via-white to-red-500 bg-[length:200%_auto]" : idleClassName}`}
                animate={{
                    backgroundPosition: isHovered ? ["0%", "-200%"] : "0%",
                }}
                transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                }}
            >
                {displayText}
            </motion.span>
        </motion.div>
    )
}

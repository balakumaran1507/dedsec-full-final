"use client"

import { motion } from "framer-motion"

interface SectionHeaderProps {
    number: string
    title: string
    children?: React.ReactNode
    className?: string
}

export function SectionHeader({ number, title, children, className = "" }: SectionHeaderProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={`mb-8 md:mb-12 ${className}`}
        >
            <div className="group inline-block cursor-default">
                <p className="font-mono text-xs md:text-sm tracking-[0.3em] text-white/50 mb-3 relative overflow-hidden">
                    <span className="relative z-10 transition-all duration-300 group-hover:text-white">
                        <span className="text-red-500 group-hover:text-red-400 transition-colors duration-300">{number}</span> — {title}
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-red-500 via-white to-red-500 opacity-0 group-hover:opacity-100 bg-[length:200%_auto] animate-gradient-x bg-clip-text text-transparent transition-opacity duration-300 select-none pointer-events-none">
                        <span className="text-transparent">{number}</span> — {title}
                    </span>
                    <span className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-red-500 via-white to-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </p>
            </div>
            {children}
        </motion.div>
    )
}

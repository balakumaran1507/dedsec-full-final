"use client"

import { useState, useEffect } from "react"
import { motion, useSpring, useTransform } from "framer-motion"

interface LoadingScreenProps {
    onComplete: () => void
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
    const [isComplete, setIsComplete] = useState(false)

    // Smooth spring animation for the progress value
    const springProgress = useSpring(0, { stiffness: 60, damping: 20, mass: 0.5 })
    const displayProgress = useTransform(springProgress, (latest) => Math.floor(latest))

    useEffect(() => {
        // Start the loading animation
        springProgress.set(100)

        const unsubscribe = displayProgress.on("change", (latest) => {
            if (latest === 100 && !isComplete) {
                setIsComplete(true)
                setTimeout(() => {
                    onComplete()
                }, 600)
            }
        })

        return () => unsubscribe()
    }, [springProgress, displayProgress, onComplete, isComplete])

    return (
        <motion.div
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden"
            exit={{
                opacity: 0,
                transition: { duration: 0.8, ease: "easeInOut" },
            }}
        >
            {/* Background Scanlines (CSS-only for performance) */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,18,18,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06)_1px,transparent_1px),linear-gradient(rgba(255,0,0,0.06)_1px,transparent_1px)] bg-[length:100%_2px,20px_20px,20px_20px]" />

            <div className="relative z-10 w-full max-w-md px-8 flex flex-col gap-6">

                {/* Top Info Row */}
                <div className="flex justify-between items-end font-mono text-xs text-red-500/70 tracking-widest uppercase">
                    <span>System_Init</span>
                    <span>v.2.0.4</span>
                </div>

                {/* Main Loader Area */}
                <div className="relative">
                    {/* Corner Brackets */}
                    <div className="absolute -top-2 -left-2 w-4 h-4 border-t border-l border-white/30" />
                    <div className="absolute -top-2 -right-2 w-4 h-4 border-t border-r border-white/30" />
                    <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b border-l border-white/30" />
                    <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b border-r border-white/30" />

                    {/* Counter */}
                    <div className="flex justify-end mb-2">
                        <motion.span className="font-mono text-6xl md:text-7xl font-bold text-white tracking-tighter tabular-nums leading-none">
                            {displayProgress}
                        </motion.span>
                        <span className="font-mono text-xl text-red-500 font-bold mt-2">%</span>
                    </div>

                    {/* Progress Bar Container */}
                    <div className="h-1 w-full bg-white/10 relative overflow-hidden">
                        {/* Fill */}
                        <motion.div
                            className="absolute top-0 left-0 h-full bg-red-600"
                            style={{ width: useTransform(springProgress, (p) => `${p}%`) }}
                        />

                        {/* Glowing Leading Edge */}
                        <motion.div
                            className="absolute top-0 h-full w-[100px] bg-gradient-to-r from-transparent to-white/80 blur-[2px]"
                            style={{
                                left: useTransform(springProgress, (p) => `${p}%`),
                                x: "-100%"
                            }}
                        />
                    </div>
                </div>

                {/* Bottom Status */}
                <div className="flex justify-between font-mono text-[10px] text-white/40 tracking-widest uppercase">
                    <span>DedSec X01</span>
                    <motion.span
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                    >
                        Loading Assets...
                    </motion.span>
                </div>

            </div>
        </motion.div>
    )
}

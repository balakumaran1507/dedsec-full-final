"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export function DashboardLoader() {
    const [progress, setProgress] = useState(0)
    const [text, setText] = useState("INITIALIZING")

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval)
                    return 100
                }
                return prev + 1
            })
        }, 20)

        const textInterval = setInterval(() => {
            const texts = ["INITIALIZING", "CONNECTING...", "DECRYPTING", "ACCESSING KERNEL", "LOADING MODULES"]
            setText(texts[Math.floor(Math.random() * texts.length)])
        }, 400)

        return () => {
            clearInterval(interval)
            clearInterval(textInterval)
        }
    }, [])

    return (
        <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center font-mono">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(220,38,38,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(220,38,38,0.1)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
            <div className="w-64 space-y-4">
                <div className="flex justify-between items-end">
                    <span className="text-neutral-500 text-xs tracking-widest">{text}</span>
                    <span className="text-red-500 text-xs font-bold">{progress}%</span>
                </div>

                <div className="h-1 bg-neutral-900 w-full overflow-hidden">
                    <motion.div
                        className="h-full bg-red-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.1 }}
                    />
                </div>

                <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-neutral-700">
                        <span>MEM: 64TB OK</span>
                        <span>NET: SECURE</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-neutral-700">
                        <span>CPU: OPTIMAL</span>
                        <span>GPU: ACTIVE</span>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-8 text-red-900 text-[10px] tracking-[0.5em]">
                DEDSEC // GLOBAL // X01
            </div>
        </div>
    )
}

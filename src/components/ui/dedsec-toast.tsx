"use client"

import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, AlertCircle, X } from "lucide-react"
import { useEffect } from "react"

interface ToastProps {
    message: string
    type: "success" | "error"
    onClose: () => void
    duration?: number
}

export function DedSecToast({ message, type, onClose, duration = 3000 }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose()
        }, duration)

        return () => clearTimeout(timer)
    }, [duration, onClose])

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-4 py-3 rounded border bg-neutral-950 shadow-2xl max-w-sm ${type === "success" ? "border-emerald-900/50 text-emerald-500" : "border-red-900/50 text-red-500"
                }`}
        >
            {type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}

            <div className="flex flex-col">
                <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-500">
                    {type === "success" ? "SYSTEM_NOTIFICATION" : "SYSTEM_ERROR"}
                </span>
                <span className="text-xs font-mono tracking-wide text-neutral-300 whitespace-pre-line">
                    {message}
                </span>
            </div>

            <button
                onClick={onClose}
                className="ml-4 text-neutral-600 hover:text-neutral-400 transition-colors"
            >
                <X className="w-3 h-3" />
            </button>

            {/* Progress bar */}
            <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: duration / 1000, ease: "linear" }}
                className={`absolute bottom-0 left-0 h-[2px] ${type === "success" ? "bg-emerald-500/30" : "bg-red-500/30"
                    }`}
            />
        </motion.div>
    )
}

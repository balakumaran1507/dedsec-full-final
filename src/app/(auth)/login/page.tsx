"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Github, Eye, EyeOff, ChevronRight } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function LoginPage() {
    const [mode, setMode] = useState<"login" | "register">("login")
    const [step, setStep] = useState<"email" | "otp">("email")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [otp, setOtp] = useState(["", "", "", "", "", ""])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    // Mock Login
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email || !password) {
            setError("Credentials required")
            return
        }

        setIsLoading(true)
        setError("")

        setTimeout(() => {
            setIsLoading(false)
            alert("Access Granted")
        }, 1500)
    }

    // Mock Register
    const handleRegisterStart = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) {
            setError("Identity required")
            return
        }

        setIsLoading(true)
        setError("")

        setTimeout(() => {
            setIsLoading(false)
            setStep("otp")
        }, 1500)
    }

    // Mock Verify OTP
    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        const otpString = otp.join("")
        if (otpString.length < 6) {
            setError("Incomplete sequence")
            return
        }

        setIsLoading(true)
        setError("")

        setTimeout(() => {
            setIsLoading(false)
            alert("Identity Verified")
        }, 1500)
    }

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return

        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)

        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`)
            nextInput?.focus()
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`)
            prevInput?.focus()
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#030303] relative overflow-hidden font-sans text-white selection:bg-white/20">

            {/* Large Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none select-none">
                <div className="absolute top-[10%] left-[5%] font-mono text-[20vw] leading-none font-bold text-white/[0.02] tracking-tighter">
                    03
                </div>
                <div className="absolute bottom-[5%] right-[10%] font-mono text-[15vw] leading-none font-bold text-white/[0.02] tracking-tighter">
                    ACCESS
                </div>
                {/* Grid Lines */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem]" />
            </div>

            <div className="w-full max-w-md relative z-10 px-6">

                {/* Main Card */}
                <div className="bg-[#080808] border border-white/10 p-8 md:p-12 shadow-[0_0_40px_-10px_rgba(220,38,38,0.1)] relative">
                    {/* Corner Accents */}
                    <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white/30" />
                    <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/30" />
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-white/30" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/30" />

                    {/* Header */}
                    <div className="mb-12">
                        <Link href="/" className="inline-block mb-8 group">
                            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                                DEDSEC <span className="text-red-500">X01</span>
                            </h1>
                        </Link>

                        <div className="flex items-baseline gap-4 border-b border-white/10 pb-4">
                            <button
                                onClick={() => { setMode("login"); setError(""); }}
                                className={cn(
                                    "text-sm tracking-widest uppercase transition-colors duration-300",
                                    mode === "login" ? "text-white font-bold" : "text-white/40 hover:text-white"
                                )}
                            >
                                Login
                            </button>
                            <span className="text-white/10">/</span>
                            <button
                                onClick={() => { setMode("register"); setError(""); }}
                                className={cn(
                                    "text-sm tracking-widest uppercase transition-colors duration-300",
                                    mode === "register" ? "text-white font-bold" : "text-white/40 hover:text-white"
                                )}
                            >
                                Register
                            </button>
                        </div>
                    </div>

                    {/* Form */}
                    <AnimatePresence mode="wait">
                        {mode === "login" ? (
                            <motion.form
                                key="login-form"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                onSubmit={handleLogin}
                                className="space-y-8"
                            >
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest text-white/40">Identity</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-none py-3 px-4 text-sm focus:outline-none focus:border-red-500/50 focus:bg-red-500/[0.05] transition-all placeholder:text-white/10 font-mono"
                                            placeholder="USR_ID"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[10px] uppercase tracking-widest text-white/40">Passphrase</label>
                                            <button type="button" className="text-[10px] uppercase tracking-widest text-white/30 hover:text-white transition-colors">
                                                Recover?
                                            </button>
                                        </div>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full bg-white/[0.03] border border-white/10 rounded-none py-3 px-4 text-sm focus:outline-none focus:border-red-500/50 focus:bg-red-500/[0.05] transition-all placeholder:text-white/10 font-mono"
                                                placeholder="KEY_CODE"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                                            >
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-xs text-red-500 font-mono border-l-2 border-red-500 pl-3 py-1"
                                    >
                                        ERROR: {error}
                                    </motion.div>
                                )}

                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-white text-black font-bold py-4 text-xs tracking-[0.2em] uppercase hover:bg-white/90 transition-colors rounded-none flex items-center justify-center gap-2"
                                >
                                    {isLoading ? "AUTHENTICATING..." : "ENTER SYSTEM"}
                                    {!isLoading && <ArrowRight className="w-4 h-4" />}
                                </motion.button>
                            </motion.form>
                        ) : (
                            /* Register Flow */
                            step === "email" ? (
                                <motion.form
                                    key="register-email"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    onSubmit={handleRegisterStart}
                                    className="space-y-8"
                                >
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest text-white/40">Identity</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-none py-3 px-4 text-sm focus:outline-none focus:border-red-500/50 focus:bg-red-500/[0.05] transition-all placeholder:text-white/10 font-mono"
                                            placeholder="USR_ID"
                                        />
                                    </div>

                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-xs text-red-500 font-mono border-l-2 border-red-500 pl-3 py-1"
                                        >
                                            ERROR: {error}
                                        </motion.div>
                                    )}

                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-white text-black font-bold py-4 text-xs tracking-[0.2em] uppercase hover:bg-white/90 transition-colors rounded-none flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? "PROCESSING..." : "INITIATE"}
                                        {!isLoading && <ArrowRight className="w-4 h-4" />}
                                    </motion.button>
                                </motion.form>
                            ) : (
                                <motion.form
                                    key="register-otp"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    onSubmit={handleVerifyOtp}
                                    className="space-y-8"
                                >
                                    <div className="space-y-4">
                                        <label className="text-[10px] uppercase tracking-widest text-white/40 block text-center">Verification Sequence</label>
                                        <div className="flex justify-center gap-2">
                                            {otp.map((digit, index) => (
                                                <input
                                                    key={index}
                                                    id={`otp-${index}`}
                                                    type="text"
                                                    maxLength={1}
                                                    value={digit}
                                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                                    className="w-10 h-14 bg-white/[0.03] border border-white/10 rounded-none text-center text-lg font-mono focus:outline-none focus:border-red-500/50 focus:bg-red-500/[0.05] transition-all text-white"
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-xs text-red-500 font-mono border-l-2 border-red-500 pl-3 py-1"
                                        >
                                            ERROR: {error}
                                        </motion.div>
                                    )}

                                    <div className="space-y-4">
                                        <motion.button
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.99 }}
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full bg-white text-black font-bold py-4 text-xs tracking-[0.2em] uppercase hover:bg-white/90 transition-colors rounded-none flex items-center justify-center gap-2"
                                        >
                                            {isLoading ? "VERIFYING..." : "CONFIRM"}
                                            {!isLoading && <ArrowRight className="w-4 h-4" />}
                                        </motion.button>

                                        <button
                                            type="button"
                                            onClick={() => { setStep("email"); setError(""); setOtp(["", "", "", "", "", ""]); }}
                                            className="w-full text-[10px] text-white/30 hover:text-white transition-colors uppercase tracking-widest flex items-center justify-center gap-1"
                                        >
                                            <ChevronRight className="w-3 h-3 rotate-180" />
                                            Abort Sequence
                                        </button>
                                    </div>
                                </motion.form>
                            )
                        )}
                    </AnimatePresence>

                    {/* Socials - Minimal */}
                    {step === "email" && (
                        <div className="mt-12 pt-8 border-t border-white/5 flex justify-center gap-6">
                            <button className="text-white/30 hover:text-white transition-colors">
                                <Github className="w-5 h-5" />
                            </button>
                            <button className="text-white/30 hover:text-white transition-colors">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Right Branding - Clean, No Glow */}
            <div className="absolute bottom-8 right-8 text-right hidden md:block pointer-events-none select-none">
                <p className="font-mono text-xs tracking-[0.5em] text-red-600 font-bold mb-2">
                    SECURE GATEWAY
                </p>
                <h2 className="font-sans text-4xl font-bold tracking-tight text-white/90">
                    DEDSEC <span className="text-red-500">X01</span>
                </h2>
            </div>
        </div>
    )
}

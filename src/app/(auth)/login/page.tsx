/* eslint-disable */
"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Github, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth/useAuth"

export default function LoginPage() {
    const router = useRouter()
    const { signIn, signUp, signInWithGoogle, signInWithGithub, user } = useAuth()

    const [mode, setMode] = useState<"login" | "register">("login")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [displayName, setDisplayName] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            router.push('/dashboard')
        }
    }, [user, router])

    // Email/Password Login
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email || !password) {
            setError("Credentials required")
            return
        }

        setIsLoading(true)
        setError("")

        try {
            await signIn(email, password)
            router.push('/dashboard')
        } catch (err: any) {
            console.error('Login error:', err)
            if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                setError("Invalid credentials")
            } else if (err.code === 'auth/too-many-requests') {
                setError("Too many attempts. Try again later")
            } else {
                setError("Authentication failed")
            }
        } finally {
            setIsLoading(false)
        }
    }

    // Email/Password Register
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email || !password || !displayName) {
            setError("All fields required")
            return
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters")
            return
        }

        setIsLoading(true)
        setError("")

        try {
            await signUp(email, password, displayName)
            router.push('/dashboard')
        } catch (err: any) {
            console.error('Register error:', err)
            if (err.code === 'auth/email-already-in-use') {
                setError("Email already registered")
            } else if (err.code === 'auth/weak-password') {
                setError("Password too weak")
            } else {
                setError(`Registration failed: ${err.message || err.code}`)
            }
        } finally {
            setIsLoading(false)
        }
    }


    // Google OAuth
    const handleGoogleLogin = async () => {
        setIsLoading(true)
        setError("")

        try {
            await signInWithGoogle()
            router.push('/dashboard')
        } catch (err: any) {
            console.error('Google login error:', err)
            if (err.code === 'auth/popup-closed-by-user') {
                setError("Sign-in cancelled")
            } else {
                setError("Google sign-in failed")
            }
        } finally {
            setIsLoading(false)
        }
    }

    // GitHub OAuth
    const handleGithubLogin = async () => {
        setIsLoading(true)
        setError("")

        try {
            await signInWithGithub()
            router.push('/dashboard')
        } catch (err: any) {
            console.error('GitHub login error:', err)
            if (err.code === 'auth/popup-closed-by-user') {
                setError("Sign-in cancelled")
            } else if (err.code === 'auth/account-exists-with-different-credential') {
                setError("Account exists with different provider")
            } else {
                setError("GitHub sign-in failed")
            }
        } finally {
            setIsLoading(false)
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
                            // LOGIN FORM
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
                                        <label className="text-xxs uppercase tracking-widest text-white/40">Identity</label>
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
                                            <label className="text-xxs uppercase tracking-widest text-white/40">Passphrase</label>
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
                            // REGISTER FORM
                            <motion.form
                                key="register-email"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                onSubmit={handleRegister}
                                className="space-y-8"
                            >
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xxs uppercase tracking-widest text-white/40">Display Name</label>
                                        <input
                                            type="text"
                                            value={displayName}
                                            onChange={(e) => setDisplayName(e.target.value)}
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-none py-3 px-4 text-sm focus:outline-none focus:border-red-500/50 focus:bg-red-500/[0.05] transition-all placeholder:text-white/10 font-mono"
                                            placeholder="AGENT_NAME"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xxs uppercase tracking-widest text-white/40">Identity</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-none py-3 px-4 text-sm focus:outline-none focus:border-red-500/50 focus:bg-red-500/[0.05] transition-all placeholder:text-white/10 font-mono"
                                            placeholder="USR_ID"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xxs uppercase tracking-widest text-white/40">Passphrase</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full bg-white/[0.03] border border-white/10 rounded-none py-3 px-4 text-sm focus:outline-none focus:border-red-500/50 focus:bg-red-500/[0.05] transition-all placeholder:text-white/10 font-mono"
                                                placeholder="KEY_CODE (min 6 chars)"
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
                                    {isLoading ? "PROCESSING..." : "INITIATE"}
                                    {!isLoading && <ArrowRight className="w-4 h-4" />}
                                </motion.button>
                            </motion.form>
                        )}
                    </AnimatePresence>

                    {/* OAuth Buttons */}
                    <div className="mt-12 pt-8 border-t border-white/5">
                        <p className="text-xxs text-center text-white/40 uppercase tracking-widest mb-6">Or Continue With</p>
                        <div className="flex justify-center gap-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleGithubLogin}
                                disabled={isLoading}
                                className="text-white/30 hover:text-white transition-colors disabled:opacity-50"
                            >
                                <Github className="w-6 h-6" />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleGoogleLogin}
                                disabled={isLoading}
                                className="text-white/30 hover:text-white transition-colors disabled:opacity-50"
                            >
                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                                </svg>
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Right Branding */}
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

/* eslint-disable */
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface PolicyLayoutProps {
    children: React.ReactNode
    title: string
    date: string
}

export function PolicyLayout({ children, title, date }: PolicyLayoutProps) {
    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-red-500/30">
            {/* Abstract Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-900/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-50" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 opacity-30" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]" />
            </div>

            <div className="relative z-10 max-w-3xl mx-auto px-6 py-12 md:py-24">
                {/* Navigation */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-colors mb-16 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-mono text-xs tracking-[0.2em] uppercase">Return to Base</span>
                </Link>

                {/* Header */}
                <header className="mb-16">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-white">
                        {title}
                    </h1>
                    <div className="flex items-center gap-4 text-xs font-mono tracking-widest uppercase text-neutral-500">
                        <span className="text-red-500">///</span>
                        <span>Last Updated: {date}</span>
                    </div>
                </header>

                {/* Content */}
                <article className="prose prose-invert prose-neutral max-w-none 
                    prose-headings:font-sans prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-white 
                    prose-h3:text-xl prose-h3:mt-12 prose-h3:mb-4
                    prose-p:text-neutral-400 prose-p:leading-relaxed prose-p:mb-6
                    prose-strong:text-white prose-strong:font-medium
                    prose-ul:my-6 prose-ul:list-none prose-ul:pl-0
                    prose-li:relative prose-li:pl-6 prose-li:mb-2 prose-li:text-neutral-400
                    prose-li:before:content-[''] prose-li:before:absolute prose-li:before:left-0 prose-li:before:top-[0.6em] prose-li:before:w-1.5 prose-li:before:h-1.5 prose-li:before:bg-red-500/50 prose-li:before:rounded-full
                    prose-a:text-white prose-a:underline prose-a:decoration-neutral-700 prose-a:underline-offset-4 hover:prose-a:decoration-red-500 hover:prose-a:text-red-500 prose-a:transition-all
                    ">
                    {children}
                </article>

                {/* Footer */}
                <footer className="mt-32 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-neutral-600 font-mono text-[10px] tracking-widest uppercase">
                    <span>DEDSEC X01 // CYBER OPERATIONS</span>
                    <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-emerald-500/50 rounded-full animate-pulse" />
                        SECURE CONNECTION ESTABLISHED
                    </span>
                </footer>
            </div>
        </div>
    )
}

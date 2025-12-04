import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface PolicyLayoutProps {
    children: React.ReactNode
    title: string
    date: string
}

export function PolicyLayout({ children, title, date }: PolicyLayoutProps) {
    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-red-500/30">
            {/* Abstract Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-900/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 md:py-24">
                {/* Navigation */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-white/50 hover:text-red-500 transition-colors mb-12 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-mono text-xs tracking-widest uppercase">Return to Base</span>
                </Link>

                {/* Header */}
                <header className="mb-16 border-b border-white/10 pb-8">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 text-white">
                        {title}
                    </h1>
                    <p className="font-mono text-sm text-red-500 tracking-widest uppercase">
                        Last Updated: {date}
                    </p>
                </header>

                {/* Content */}
                <article className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-p:text-white/70 prose-a:text-red-500 prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-li:text-white/70">
                    {children}
                </article>

                {/* Footer */}
                <footer className="mt-24 pt-8 border-t border-white/10 flex justify-between items-center text-white/30 font-mono text-xs">
                    <span>DEDSEC X01 // CYBER OPERATIONS</span>
                    <span>SECURE CONNECTION</span>
                </footer>
            </div>
        </div>
    )
}

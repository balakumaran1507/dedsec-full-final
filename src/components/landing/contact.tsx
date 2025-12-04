"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

const socials = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/dedsec_x01/",
    handle: "@dedsec_x01",
    color: "hover:text-[#E1306C]",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 md:w-6 md:h-6 -rotate-45 group-hover:rotate-0 transition-transform duration-300">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    )
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/dedsec-x01/",
    handle: "DEDSEC X01",
    color: "hover:text-[#0077B5]",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 md:w-6 md:h-6 -rotate-45 group-hover:rotate-0 transition-transform duration-300">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    )
  },
  {
    name: "GitHub",
    href: "https://github.com/Dedsec-X01",
    handle: "Dedsec-X01",
    color: "hover:text-purple-500",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 md:w-6 md:h-6 -rotate-45 group-hover:rotate-0 transition-transform duration-300">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    )
  },
  {
    name: "Email",
    href: "mailto:dedsec@cybercom.live",
    handle: "dedsec@cybercom.live",
    color: "hover:text-blue-700",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 md:w-6 md:h-6 -rotate-45 group-hover:rotate-0 transition-transform duration-300">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    )
  },
]

export function Contact() {
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])

  return (
    <section ref={containerRef} id="contact" className="relative py-24 md:py-40 px-4 md:px-8 overflow-hidden min-h-[80vh] flex flex-col justify-center">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(circle_80%_at_50%_50%,#000_30%,transparent_100%)]" />

      <motion.div
        style={{ y }}
        className="absolute right-0 top-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl"
      />

      <div className="relative z-10 max-w-5xl mx-auto w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 md:mb-24"
        >
          <p className="font-mono text-xs md:text-sm tracking-[0.3em] text-white/50 mb-4">
            <span className="text-red-500">08</span> — TRANSMISSION
          </p>
          <h2 className="font-sans text-5xl md:text-8xl font-bold tracking-tighter leading-[0.9]">
            INITIATE <br />
            <span className="text-white/30">CONNECTION</span>
          </h2>
        </motion.div>

        {/* Links List */}
        <div className="flex flex-col">
          {socials.map((social, index) => (
            <motion.a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative border-t border-white/10 py-8 md:py-12 flex items-center justify-between hover:bg-white/[0.02] transition-colors duration-500"
            >
              <div className="flex items-baseline gap-4 md:gap-8">
                <span className="font-mono text-xs md:text-sm text-white/30 group-hover:text-red-500 transition-colors duration-300">
                  0{index + 1}
                </span>
                <h3 className={`font-sans text-3xl md:text-6xl font-bold text-white/70 transition-colors duration-300 ${social.color}`}>
                  {social.name}
                </h3>
              </div>

              <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-10 group-hover:translate-x-0">
                <span className="font-mono text-xs md:text-sm tracking-wider text-white/50 hidden md:block">
                  {social.handle}
                </span>
                <span className="w-8 h-8 md:w-12 md:h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white/50 group-hover:bg-white/10">
                  {social.icon}
                </span>
              </div>
            </motion.a>
          ))}
          <div className="border-t border-white/10" />
        </div>
      </div>
    </section>
  )
}

"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { SentientSphere } from "./sentient-sphere"
import { GlitchReveal } from "./glitch-reveal"
import Link from "next/link"

export function Hero() {
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])

  return (
    <section ref={containerRef} className="relative h-[85vh] md:h-screen w-full overflow-hidden bg-black">
      {/* 3D Sphere Background */}
      <div className="absolute inset-0">
        <SentientSphere />
      </div>

      {/* Typography Overlay */}
      <motion.div
        style={{ opacity, scale }}
        className="relative z-10 h-full flex flex-col justify-between p-4 pt-16 md:p-8 md:pt-20"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex flex-col items-start text-left"
        >
          <p className="font-mono text-xs md:text-sm tracking-[0.3em] text-white/50 mb-2">
            <span className="text-red-500">01</span> — COLLECTIVE
          </p>
          <h1 className="font-sans text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-balance">
            CYBER
            <br />
            <span className="text-white/70">OPERATIVES</span>
          </h1>
        </motion.div>

        {/* Center Content Wrapper - Positioned via CSS */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex flex-col items-center gap-3"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex items-center gap-3 font-mono text-xs md:text-lg tracking-[0.3em] whitespace-nowrap"
            >
              <GlitchReveal text="WE ARE" />
              <GlitchReveal text="INEVITABLE" idleClassName="text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
            </motion.div>

            {/* SEO Hidden Content */}
            <div className="sr-only">
              <h1>DEDSEC X01 - Elite Cybersecurity Collective</h1>
              <p>TLDR: We are an elite cybersecurity collective known as DEDSEC X01. Join our CTF challenges at cybercom.live.</p>
              <h2>cybercom ctf</h2>
              <h2>cybercom.live</h2>
              <p>dedsec.cybercom.live</p>
            </div>
            <Link href="/login">
              <motion.button
                data-cursor-hover
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative flex items-center justify-center px-6 py-3 md:px-8 md:py-4 border border-white bg-transparent text-white font-mono text-[10px] md:text-xs tracking-widest uppercase rounded-full hover:bg-white hover:text-black transition-all duration-300 group"
              >
                Member Login
                <span className="absolute -top-2 -right-2 w-2 h-2 bg-red-500 rounded-full" />
              </motion.button>
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="self-end text-right"
        >
          <p className="font-mono text-xs md:text-sm tracking-[0.3em] text-white/50 mb-2">
            <span className="text-red-500">02</span> — MISSION
          </p>
          <h2 className="font-sans text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-balance">
            <span className="text-white/80">DEDSEC</span>
            <br />
            <span className="text-red-500">X01</span>
          </h2>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="font-mono text-[8px] md:text-[10px] tracking-widest text-white/50 uppercase">Scroll</span>
          <div className="w-px h-6 md:h-8 bg-gradient-to-b from-white/50 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  )
}

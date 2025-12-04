"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"

const statements = [
  "All warfare is based on deception.",
  "We operate in the shadows.",
  "Privacy is not negotiable.",
  "The network is our battlefield.",
  "Anonymity is our armor.",
]

export function About() {
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-100%"])
  const smoothX = useSpring(x, { stiffness: 100, damping: 30 })

  return (
    <section id="philosophy" ref={containerRef} className="relative py-12 md:py-16 overflow-hidden">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="px-4 md:px-8 mb-0 py-8 md:py-12"
      >
        <p className="font-mono text-xs md:text-sm tracking-[0.3em] text-white/50 mb-3">
          <span className="text-red-500">03</span> — PHILOSOPHY
        </p>
        <h2 className="font-sans text-3xl md:text-6xl font-bold">
          The Art of <span className="text-white/70">War</span>
        </h2>
      </motion.div>

      {/* Horizontal Scroll Container */}
      <div className="relative flex items-center overflow-hidden py-0 gap-0 h-10 md:h-14">
        <motion.div style={{ x: smoothX }} className="flex gap-6 md:gap-16 px-4 md:px-8 whitespace-nowrap">
          {statements.map((statement, index) => (
            <motion.p
              key={index}
              className="text-xl md:text-5xl lg:text-6xl font-sans font-bold tracking-tight text-white/90"
              style={{
                WebkitTextStroke: index % 2 === 0 ? "none" : "1px rgba(255,255,255,0.3)",
                color: index % 2 === 0 ? "inherit" : "transparent",
              }}
            >
              {statement}
            </motion.p>
          ))}
        </motion.div>
      </div>

      {/* Decorative Line */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="mt-8 md:mt-12 mx-4 md:mx-8 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent origin-left"
      />
    </section>
  )
}

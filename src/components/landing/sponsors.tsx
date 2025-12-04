"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { GlitchReveal } from "@/components/landing/glitch-reveal"

const sponsors = [
  { name: "CYBERCOM", tier: "TITLE SPONSOR", color: "text-red-500" },
  { name: "ZAPSTERS", tier: "PLATINUM", color: "text-white" },
  { name: "ABCO", tier: "GOLD", color: "text-white" },
  { name: "IRIS", tier: "SILVER", color: "text-white" },
]

export function Sponsors() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section id="sponsors" className="relative py-20 md:py-32 px-4 md:px-8 overflow-hidden">
      {/* Background Grid Animation */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 mb-16 md:mb-24 text-center"
      >
        <p className="font-mono text-xs md:text-sm tracking-[0.3em] text-white/50 mb-4">
          <span className="text-red-500">07</span> — ALLIANCE
        </p>
        <h2 className="font-sans text-4xl md:text-7xl font-bold tracking-tighter">
          OUR <span className="text-white/30">PARTNERS</span>
        </h2>
      </motion.div>

      {/* Sponsors Display */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {sponsors.map((sponsor, index) => (
            <motion.div
              key={sponsor.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group relative border border-white/10 bg-black/40 backdrop-blur-sm p-8 md:p-12 overflow-hidden"
            >
              {/* Hover Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />

              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/30 group-hover:border-white transition-colors duration-300" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/30 group-hover:border-white transition-colors duration-300" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/30 group-hover:border-white transition-colors duration-300" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/30 group-hover:border-white transition-colors duration-300" />

              <div className="relative flex flex-col items-center justify-center gap-4">
                <div className={`font-sans text-3xl md:text-5xl font-bold tracking-tight transition-all duration-300 ${hoveredIndex === index ? "scale-110" : "scale-100"}`}>
                  <GlitchReveal
                    text={sponsor.name}
                    className={sponsor.color}
                    idleClassName={sponsor.color}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
                  <span className="font-mono text-[10px] md:text-xs tracking-[0.2em] text-white/40 uppercase">
                    {sponsor.tier}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <button className="group relative inline-flex items-center justify-center px-12 py-6 overflow-hidden font-mono font-bold text-white transition-all duration-300 bg-transparent border border-white/10 hover:border-red-500/50">
            {/* Hover Fill */}
            <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-700" />
            <span className="relative z-10 flex items-center gap-3 tracking-widest group-hover:text-red-500 transition-colors duration-300">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              BECOME A SPONSOR
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
            </span>

            {/* Cyber Glitch Borders */}
            <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white/30 group-hover:border-red-500 transition-colors duration-300" />
            <span className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-white/30 group-hover:border-red-500 transition-colors duration-300" />
            <span className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white/30 group-hover:border-red-500 transition-colors duration-300" />
            <span className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-white/30 group-hover:border-red-500 transition-colors duration-300" />

            {/* Scanline */}
            <span className="absolute inset-0 w-full h-full bg-red-500/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out skew-x-12" />
          </button>
        </motion.div>
      </div>
    </section>
  )
}

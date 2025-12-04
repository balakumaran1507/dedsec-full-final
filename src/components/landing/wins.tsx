"use client"

import { useState } from "react"
import { motion } from "framer-motion"

const wins = [
  {
    event: "Phantom CTF",
    host: "Saveetha Engineering College",
    rank: "2",
  },
  {
    event: "Flag Rush CTF",
    host: "New Prince College",
    rank: "2",
  },
  {
    event: "Signal CTF",
    host: "Cyberspatz",
    rank: "8",
  },
  {
    event: "Final Trace",
    host: "Vellore Institute of Technology",
    rank: "7",
  },
  {
    event: "Rstcon CTF",
    host: "MetaCTF",
    rank: "95",
  },
  {
    event: "K17 CTF",
    host: "UNSW Security Society",
    rank: "125",
  },
  {
    event: "ACNCTF",
    host: "Amrita Cybernation",
    rank: "37",
  },
]

const authored = [
  {
    event: "Cybercom CTF",
    role: "CTF Author Team",
    count: "40",
  },
  {
    event: "Nullcore CTF",
    role: "CTF Author Team",
    count: "35",
  },
]

import { SectionHeader } from "@/components/landing/section-header"

// ... (existing imports)

export function Wins() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [hoveredAuthoredIndex, setHoveredAuthoredIndex] = useState<number | null>(null)

  return (
    <section id="wins" className="relative py-12 md:py-16 px-4 md:px-8">
      {/* Section Header */}
      <SectionHeader number="06" title="VICTORIES">
        <h2 className="font-sans text-3xl md:text-6xl font-bold">
          Our <span className="text-white/70">Wins</span>
        </h2>
      </SectionHeader>

      <div className="relative mb-16">
        {wins.map((win, index) => (
          <motion.div
            key={win.event}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="relative border-t border-white/10 py-3 md:py-5 overflow-hidden group"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Shiny Red Hover Overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/20 to-transparent pointer-events-none"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />

            {/* Static Red Glow on Hover */}
            <div className="absolute inset-0 bg-red-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <div className="flex items-center justify-between gap-4 relative z-10">
              {/* Rank */}
              <span className="font-mono text-lg md:text-2xl font-bold text-red-500 w-12 md:w-16 text-center">
                {win.rank}
              </span>

              {/* Event Name */}
              <motion.h3
                className="font-sans text-base md:text-2xl font-bold tracking-tight group-hover:text-white/70 transition-colors duration-300 flex-1"
                animate={{
                  x: hoveredIndex === index ? 10 : 0,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {win.event}
              </motion.h3>

              {/* Host */}
              <span className="font-mono text-[10px] md:text-xs tracking-wider text-white/50 text-right max-w-[120px] md:max-w-none group-hover:text-red-500/70 transition-colors duration-300">
                {win.host}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Authored Challenges Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mb-8"
      >
        <SectionHeader number="XP" title="AUTHORED">
          <h3 className="font-sans text-2xl md:text-4xl font-bold">
            Challenges <span className="text-white/70">Authored</span>
          </h3>
        </SectionHeader>

        <div className="relative">
          {authored.map((item, index) => (
            <motion.div
              key={item.event}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="relative border-t border-white/10 py-3 md:py-5 overflow-hidden group"
              onMouseEnter={() => setHoveredAuthoredIndex(index)}
              onMouseLeave={() => setHoveredAuthoredIndex(null)}
            >
              {/* Shiny Red Hover Overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/20 to-transparent pointer-events-none"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 1, ease: "easeInOut" }}
              />

              {/* Static Red Glow on Hover */}
              <div className="absolute inset-0 bg-red-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div className="flex items-center justify-between gap-4 relative z-10">
                {/* Challenge Count */}
                <div className="w-16 md:w-20 text-center">
                  <span className="font-mono text-lg md:text-2xl font-bold text-red-500 block">
                    {item.count}
                  </span>
                  <span className="text-[8px] md:text-[10px] text-white/40 uppercase tracking-wider group-hover:text-red-500/70 transition-colors duration-300">Challenges</span>
                </div>

                {/* Event Name */}
                <motion.h3
                  className="font-sans text-base md:text-2xl font-bold tracking-tight group-hover:text-white/70 transition-colors duration-300 flex-1"
                  animate={{
                    x: hoveredAuthoredIndex === index ? 10 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {item.event}
                </motion.h3>

                {/* Role */}
                <span className="font-mono text-[10px] md:text-xs tracking-wider text-white/50 text-right group-hover:text-red-500/70 transition-colors duration-300">
                  {item.role}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Bottom Border */}
      <div className="border-t border-white/10" />
    </section>
  )
}

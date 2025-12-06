"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"

const projects = [
  {
    title: "Operation Blackout",
    tags: ["Network Security", "Penetration Testing", "Zero-Day"],
    year: "2024",
  },
  {
    title: "Project Phantom",
    tags: ["OSINT", "Social Engineering", "Recon"],
    year: "2024",
  },
  {
    title: "Ghost Protocol",
    tags: ["Encryption", "Anonymity", "Secure Comms"],
    year: "2023",
  },
  {
    title: "Red Cascade",
    tags: ["Vulnerability Research", "Exploit Dev", "CTF"],
    year: "2023",
  },
]

import { SectionHeader } from "@/components/landing/section-header"

// ... (existing imports)

export function Works() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <section id="operations" className="relative py-3 md:py-4 px-4 md:px-8">
      {/* Section Header */}
      <SectionHeader number="05" title="OPERATIONS">
        <h2 className="font-sans text-3xl md:text-6xl font-bold">
          Classified <span className="text-white/70">Missions</span>
        </h2>
      </SectionHeader>

      {/* Projects List */}
      <div ref={containerRef} className="relative">
        {projects.map((project, index) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            className="relative border-t border-white/10 py-4 md:py-8 overflow-hidden group"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Shiny Red Hover Overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-red-900/10 to-transparent pointer-events-none"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />

            {/* Static Red Glow on Hover */}
            <div className="absolute inset-0 bg-red-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <div
              data-cursor-hover
              className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4 cursor-default relative z-10"
            >
              <span className="font-mono text-[10px] md:text-xs text-red-500 tracking-widest order-1 md:order-none">
                {project.year}
              </span>

              {/* Title */}
              <motion.h3
                className="font-sans text-xl md:text-5xl lg:text-6xl font-bold tracking-tight group-hover:text-white/70 transition-colors duration-300 flex-1"
                animate={{
                  x: hoveredIndex === index ? 20 : 0,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {project.title}
              </motion.h3>

              {/* Tags */}
              <div className="flex gap-2 flex-wrap order-2 md:order-none">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[8px] md:text-[10px] tracking-wider px-2 py-0.5 border border-white/20 rounded-full text-white/50 group-hover:border-red-500/30 group-hover:text-red-500/70 transition-colors duration-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom Border */}
      <div className="border-t border-white/10" />
    </section>
  )
}

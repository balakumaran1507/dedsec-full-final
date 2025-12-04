"use client"

import { motion } from "framer-motion"
import { useRef } from "react"

const skills = [
  "Web Pentesting",
  "Network Security",
  "IoT Hacking",
  "WiFi Exploitation",
  "Side Channel Attacks",
  "Reverse Engineering",
  "Malware Analysis",
  "OSINT",
  "Cryptography",
  "Binary Exploitation",
]

export function AboutTeam() {
  const containerRef = useRef(null)

  return (
    <section id="about" className="relative py-12 md:py-16 px-4 md:px-8" ref={containerRef}>
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="mb-8 md:mb-12"
      >
        <p className="font-mono text-xs md:text-sm tracking-[0.3em] text-white/50 mb-3">
          <span className="text-red-500">04</span> — ABOUT
        </p>
        <h2 className="font-sans text-3xl md:text-6xl font-bold">
          Who We <span className="text-white/70">Are</span>
        </h2>
      </motion.div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-mono text-sm md:text-base text-white/70 leading-relaxed">
            A CTF team of highly skilled and diversely talented operatives. From web penetration testing to IoT
            exploitation, WiFi attacks to side-channel analysis — you name it, we have it.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.05,
              },
            },
          }}
          className="flex flex-wrap gap-2"
        >
          {skills.map((skill) => (
            <motion.span
              key={skill}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: "easeOut" }
                },
              }}
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                boxShadow: "0 0 15px rgba(255, 255, 255, 0.1)",
                borderColor: "rgba(255, 255, 255, 0.5)"
              }}
              className="font-mono text-[10px] md:text-xs tracking-wider px-3 py-1.5 border border-white/10 text-white/60 transition-colors duration-300 cursor-default"
            >
              {skill}
            </motion.span>
          ))}
        </motion.div>
      </div>

      {/* Decorative Line */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        className="mt-10 md:mt-14 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent origin-left"
      />
    </section>
  )
}

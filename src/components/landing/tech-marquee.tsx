"use client"

import { motion } from "framer-motion"
import { SectionHeader } from "@/components/landing/section-header"

const techItems = [
  "KALI LINUX",
  "METASPLOIT",
  "BURP SUITE",
  "WIRESHARK",
  "NMAP",
  "PYTHON",
  "RUST",
  "C++",
  "ASSEMBLY",
  "GHIDRA",
  "IDA PRO",
  "COBALT STRIKE",
]

const concepts = [
  "PENETRATION",
  "EXPLOITATION",
  "REVERSE ENGINEERING",
  "CRYPTOGRAPHY",
  "OSINT",
  "MALWARE ANALYSIS",
  "ZERO-DAY",
  "APT",
  "RED TEAM",
  "STEALTH",
  "PERSISTENCE",
  "EVASION",
]

function MarqueeRow({ items, direction = "left" }: { items: string[]; direction?: "left" | "right" }) {
  const duplicatedItems = [...items, ...items, ...items, ...items]

  return (
    <div className="relative overflow-hidden py-3">
      <motion.div
        className={`flex gap-8 ${direction === "left" ? "animate-marquee-left" : "animate-marquee-right"}`}
        style={{ width: "fit-content" }}
      >
        {duplicatedItems.map((item, index) => (
          <span
            key={index}
            className="group font-sans text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight whitespace-nowrap cursor-default"
            style={{
              WebkitTextStroke: "1px rgba(255,255,255,0.2)",
              color: "transparent",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#ffffff"
              e.currentTarget.style.webkitTextStroke = "none"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "transparent"
              e.currentTarget.style.webkitTextStroke = "1px rgba(255,255,255,0.2)"
            }}
          >
            {item}
            <span className="mx-8 text-white/20">•</span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}

export function TechMarquee() {
  return (
    <section id="arsenal" className="relative py-3 md:py-6 overflow-hidden">
      {/* Section Header */}
      <div className="px-4 md:px-8">
        <SectionHeader number="09" title="ARSENAL">
          <h2 className="font-sans text-3xl md:text-6xl font-bold">
            Technical <span className="text-white/70">Stack</span>
          </h2>
        </SectionHeader>
      </div>

      {/* Marquee Rows */}
      <div className="space-y-2">
        <MarqueeRow items={techItems} direction="left" />
        <MarqueeRow items={concepts} direction="right" />
      </div>
    </section>
  )
}

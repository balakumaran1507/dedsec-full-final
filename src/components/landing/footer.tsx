"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"

export function Footer() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <footer className="relative">
      <Link href="/login" className="block w-full">
        <motion.button
          data-cursor-hover
          className="relative block overflow-hidden w-full text-left"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.div
            className="absolute inset-0 bg-white"
            initial={{ y: "100%" }}
            animate={{ y: isHovered ? "0%" : "100%" }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          />

          {/* Content */}
          {/* Content */}
          {/* Content */}
          {/* Content */}
          <div className="relative py-20 md:py-28 px-4 md:px-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
              <motion.h2
                className="font-sans text-2xl md:text-5xl lg:text-6xl font-bold tracking-tight text-center md:text-left"
                animate={{
                  color: isHovered ? "#000000" : "#fafafa",
                }}
                transition={{ duration: 0.3 }}
              >
                <span className={isHovered ? "text-black" : "text-white"}>Member</span>{" "}
                <span className={isHovered ? "text-black/70" : "text-white/70"}>Login</span>
              </motion.h2>

              {/* Arrow icon using CSS */}
              <motion.div
                animate={{
                  rotate: isHovered ? 45 : 0,
                }}
                transition={{ duration: 0.3 }}
                className={`w-8 h-8 md:w-12 md:h-12 flex items-center justify-center ${isHovered ? "text-black" : "text-white"}`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-full h-full"
                >
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </motion.div>
            </div>
          </div>
        </motion.button>
      </Link>

      {/* Footer Info */}
      <div className="px-4 md:px-8 py-6 md:py-8 border-t border-white/10 relative">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 relative z-10">
          {/* Copyright Left */}
          <div className="font-mono text-[10px] md:text-xs tracking-widest text-white/30 order-3 md:order-1 w-full md:w-auto text-center md:text-left flex flex-col gap-2">
            <span>© CYBERCOM {new Date().getFullYear()}</span>
            <div className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-1">
              <Link href="/privacy-policy" className="hover:text-red-500 transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-red-500 transition-colors">Terms</Link>
              <Link href="/refund-policy" className="hover:text-red-500 transition-colors">Refunds</Link>
              <Link href="/about" className="hover:text-red-500 transition-colors">About</Link>
            </div>
          </div>

          {/* Right Side: Socials + Logo */}
          <div className="flex items-center justify-center md:justify-end gap-4 order-1 md:order-3 w-full md:w-auto">
            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/dedsec_x01/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/30 hover:text-white transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/dedsec-x01/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/30 hover:text-white transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a
                href="https://github.com/Dedsec-X01"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/30 hover:text-white transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a href="mailto:dedsec@cybercom.live" className="text-white/30 hover:text-white transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </a>
            </div>

            {/* Logo & Year */}
            <p className="font-mono text-xs md:text-sm tracking-widest text-white/30 text-right flex items-center gap-2">
              <span className="font-bold">
                DEDSEC <span className="text-red-400/80">X01</span>
              </span>
              <span>{new Date().getFullYear()}</span>
            </p>
          </div>
        </div>

        {/* Center Text - Absolutely Positioned */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="font-mono text-xs md:text-sm tracking-[0.3em] text-white/50 hidden md:block">
            WE ARE <span className="text-red-500">INEVITABLE</span>
          </span>
        </div>
      </div>
    </footer>
  )
}

"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

const navLinks = [
  { label: "Philosophy", href: "#philosophy" },
  { label: "About", href: "#about" },
  { label: "Operations", href: "#operations" },
  { label: "Wins", href: "#wins" },
  { label: "Sponsors", href: "#sponsors" },
  { label: "Contact", href: "#contact" },
  { label: "Arsenal", href: "#arsenal" },
]



export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (href: string) => {
    setIsMenuOpen(false)
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? "bg-black/80 backdrop-blur-md border-b border-white/10" : ""
          }`}
      >
        <nav className="flex items-center justify-between px-4 py-3 md:px-8 md:py-4">
          {/* Left Section: Logo */}
          <div className="flex-1 flex justify-start">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                window.scrollTo({ top: 0, behavior: "smooth" })
              }}
              className="group flex items-center gap-2"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="font-mono text-xs md:text-sm lg:text-base tracking-widest text-white font-bold flex items-center gap-2"
              >
                <span className="relative">
                  DEDSEC
                  <motion.span
                    className="absolute inset-0 text-red-500 opacity-0 group-hover:opacity-100"
                    animate={{ x: [-2, 2, -2, 0], opacity: [0, 0.5, 0] }}
                    transition={{ duration: 0.2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
                  >
                    DEDSEC
                  </motion.span>
                </span>
                <span className="text-red-500">X01</span>
              </motion.div>
              <span className="w-2 h-2 rounded-full bg-red-500 group-hover:shadow-[0_0_10px_rgba(239,68,68,0.8)] transition-all duration-300 animate-pulse" />
            </a>
          </div>

          {/* Center Section: Desktop Navigation */}
          <ul className="hidden xl:flex items-center justify-center gap-5 2xl:gap-8 flex-[2]">
            {navLinks.map((link, index) => (
              <li key={link.label}>
                <button
                  onClick={() => scrollToSection(link.href)}
                  className="group relative font-mono text-[11px] 2xl:text-xs tracking-wider text-white/70 hover:text-white transition-colors duration-300 whitespace-nowrap"
                >
                  <span className="text-red-500 mr-1 text-[11px] 2xl:text-xs">0{index + 1}</span>
                  {link.label.toUpperCase()}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300" />
                </button>
              </li>
            ))}
          </ul>

          {/* Right Section: Buttons & Mobile Toggle */}
          <div className="flex-1 flex justify-end items-center gap-4">
            <div className="hidden xl:flex items-center gap-3 2xl:gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => scrollToSection("#sponsors")}
                className="font-mono text-[10px] 2xl:text-[11px] tracking-wider px-3 py-1.5 2xl:px-4 2xl:py-2 border border-white/20 text-white/70 hover:text-white hover:border-white/60 hover:bg-white/5 transition-all duration-300 whitespace-nowrap"
              >
                BECOME A SPONSOR
              </motion.button>
              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative font-mono text-[10px] 2xl:text-[11px] tracking-wider px-4 py-1.5 2xl:px-5 2xl:py-2 border border-white bg-transparent text-white hover:bg-white hover:text-black transition-all duration-300 overflow-hidden group whitespace-nowrap"
                >
                  <span className="relative z-10">MEMBER LOGIN</span>
                  <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </motion.button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="xl:hidden relative w-8 h-8 flex flex-col items-center justify-center gap-1.5 z-50"
              aria-label="Toggle menu"
            >
              <motion.span
                animate={isMenuOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                className="w-6 h-px bg-white origin-center"
              />
              <motion.span
                animate={isMenuOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
                className="w-6 h-px bg-white"
              />
              <motion.span
                animate={isMenuOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                className="w-6 h-px bg-white origin-center"
              />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl xl:hidden"
          >
            {/* Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

            <nav className="relative z-10 flex flex-col items-center justify-center h-full gap-8 pt-16">
              {navLinks.map((link, index) => (
                <motion.button
                  key={link.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => scrollToSection(link.href)}
                  className="group text-2xl md:text-3xl font-sans font-bold tracking-tight text-white/80 hover:text-white"
                >
                  <span className="text-red-500 font-mono text-2xl md:text-3xl mr-3">0{index + 1}</span>
                  {link.label.toUpperCase()}
                </motion.button>
              ))}
              <div className="flex flex-col gap-4 mt-8 w-full px-8 max-w-xs">
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  onClick={() => scrollToSection("#sponsors")}
                  className="w-full font-mono text-[10px] md:text-xs tracking-wider px-4 py-2 md:px-5 md:py-3 border border-white/20 text-white/70 hover:bg-white/5"
                >
                  BECOME A SPONSOR
                </motion.button>
                <Link href="/login" className="w-full">
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="w-full font-mono text-[10px] md:text-xs tracking-wider px-4 py-2 md:px-5 md:py-3 border border-white bg-transparent text-white hover:bg-white hover:text-black transition-all duration-300"
                  >
                    MEMBER LOGIN
                  </motion.button>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

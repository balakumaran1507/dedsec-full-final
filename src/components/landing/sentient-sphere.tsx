"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"

export function SentientSphere() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height
        setMousePosition({ x, y })
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center relative overflow-hidden">
      {/* Animated sphere container */}
      <motion.div
        className="relative"
        animate={{
          rotateX: mousePosition.y * 15,
          rotateY: mousePosition.x * 15,
        }}
        transition={{ type: "spring", stiffness: 100, damping: 30 }}
        style={{ transformStyle: "preserve-3d", perspective: 1000 }}
      >
        {/* Main sphere */}
        <div className="relative w-[280px] h-[280px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px]">
          {/* Wireframe circles - horizontal */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`h-${i}`}
              className="absolute inset-0 rounded-full border border-white/10"
              style={{
                transform: `rotateX(${i * 15}deg)`,
                transformStyle: "preserve-3d",
              }}
              animate={{ rotate: 360 }}
              transition={{
                duration: 30 + i * 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />
          ))}

          {/* Wireframe circles - vertical */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`v-${i}`}
              className="absolute inset-0 rounded-full border border-white/10"
              style={{
                transform: `rotateY(${i * 15}deg)`,
                transformStyle: "preserve-3d",
              }}
              animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
              transition={{
                duration: 25 + i * 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />
          ))}

          {/* Inner glow */}
          <div className="absolute inset-[15%] rounded-full bg-white/[0.02] backdrop-blur-sm" />

          {/* Core */}
          <motion.div
            className="absolute inset-[30%] rounded-full border border-white/20"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />

          {/* Floating particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`p-${i}`}
              className="absolute w-1 h-1 rounded-full bg-white/40"
              style={{
                top: `${30 + ((i * 17) % 40)}%`,
                left: `${30 + ((i * 23) % 40)}%`,
              }}
              animate={{
                y: [0, -20, 0],
                x: [0, 10, 0],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[300px] h-[300px] md:w-[450px] md:h-[450px] lg:w-[550px] lg:h-[550px] rounded-full bg-gradient-to-r from-red-500/10 to-purple-500/10 blur-3xl" />
      </div>
    </div>
  )
}

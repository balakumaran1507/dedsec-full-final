"use client"

import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { About } from "@/components/landing/about"
import { Works } from "@/components/landing/works"
import { Wins } from "@/components/landing/wins"
import { AboutTeam } from "@/components/landing/about-team"
import { Sponsors } from "@/components/landing/sponsors"
import { Contact } from "@/components/landing/contact"
import { TechMarquee } from "@/components/landing/tech-marquee"
import { Footer } from "@/components/landing/footer"
import { CustomCursor } from "@/components/landing/custom-cursor"
import { SmoothScroll } from "@/components/landing/smooth-scroll"
import { SectionBlend } from "@/components/landing/section-blend"
import { LoadingScreen } from "@/components/landing/loading-screen"

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      {!isLoading && (
        <SmoothScroll>
          <CustomCursor />
          <Navbar />
          <main>
            <Hero />
            <SectionBlend />
            <About />
            <AboutTeam />
            <Works />
            <Wins />
            <Sponsors />
            <Contact />
            <TechMarquee />
            <Footer />
          </main>
        </SmoothScroll>
      )}
    </>
  )
}

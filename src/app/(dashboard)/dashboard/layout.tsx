import type React from "react"
import type { Metadata } from "next"
import { Share_Tech_Mono } from "next/font/google"
import "./globals.css"

const shareTechMono = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "DEDSEC X01 // CTF Dashboard",
  description: "CTF Team Command Center",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${shareTechMono.className} bg-black text-neutral-100 antialiased`}>{children}</body>
    </html>
  )
}

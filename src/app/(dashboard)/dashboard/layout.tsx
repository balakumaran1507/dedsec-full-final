import type React from "react"
import { Share_Tech_Mono } from "next/font/google"
import "./globals.css"

const shareTechMono = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${shareTechMono.className} bg-black text-neutral-100 antialiased text-[17px]`}>
      {children}
    </div>
  )
}

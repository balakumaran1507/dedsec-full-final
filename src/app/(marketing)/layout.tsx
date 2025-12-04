import type React from "react"
import type { Metadata, Viewport } from "next"

export const metadata: Metadata = {
  title: "DEDSEC X01 | Elite Cybersecurity Collective | cybercom.live",
  description:
    "DEDSEC X01 - Elite cybersecurity collective. We are inevitable. Join the operatives at dedsec.cybercom.live",
  keywords: [
    "DEDSEC",
    "X01",
    "cybersecurity",
    "cybercom.live",
    "dedsec.cybercom.live",
    "hacking",
    "security",
    "operatives",
    "CTF",
    "capture the flag",
  ],
  authors: [{ name: "DEDSEC X01" }],
  openGraph: {
    title: "DEDSEC X01 | Elite Cybersecurity Collective",
    description: "We are inevitable. Join the elite operatives.",
    siteName: "DEDSEC X01",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DEDSEC X01 | Elite Cybersecurity Collective",
    description: "We are inevitable. Join the elite operatives.",
  },
  generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
}

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <div className="noise-overlay" />
      {children}
    </>
  )
}

import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: {
    default: "Predatorgate",
    template: "%s | Predatorgate",
  },
  description: "Predatorgate - Surveillance Scandal Timeline",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}

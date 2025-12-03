import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import Script from "next/script";

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const _playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
})

export const metadata: Metadata = {
  title: "Predatorgate - Ιστορικό του Σκανδάλου",
  description:
    "Μια πλήρης χρονολογική καταγραφή των γεγονότων που συνθέτουν το σκάνδαλο παρακολουθήσεων με το λογισμικό Predator στην Ελλάδα",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="el" className={_playfair.variable}>
      <body className={`font-sans antialiased`}>
        {/* Google Analytics tag */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-XF5R1NQ8BH`}
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>

        {children}
        <Analytics />
      </body>
    </html>
  )
}

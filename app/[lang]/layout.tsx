import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google"
import "../globals.css"
import { GoogleAnalytics } from "@next/third-parties/google"
import { isValidLocale, defaultLocale, locales, getTranslations } from "@/lib/i18n"
import type { Locale } from "@/lib/i18n"

const _geist = Geist({ subsets: ["latin", "greek"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const _playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
})

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const locale = isValidLocale(lang) ? lang : defaultLocale
  const t = getTranslations(locale)

  return {
    title: t.meta.title,
    description: t.meta.description,
    generator: "v0.app",
    alternates: {
      languages: {
        el: "/gr",
        en: "/en",
      },
    },
  }
}

export default async function LangLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ lang: string }>
}>) {
  const { lang } = await params
  const locale = isValidLocale(lang) ? lang : defaultLocale
  const htmlLang = locale === "gr" ? "el" : "en"

  return (
    <html lang={htmlLang} className={_playfair.variable}>
      <body className={`font-sans antialiased`}>{children}</body>
      <GoogleAnalytics gaId="G-XF5R1NQ8BH" />
    </html>
  )
}

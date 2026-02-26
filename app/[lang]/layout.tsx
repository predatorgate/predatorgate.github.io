import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google"
import "../globals.css"
import { GoogleAnalytics } from "@next/third-parties/google"
import { isValidLocale, defaultLocale, locales, getTranslations } from "@/lib/i18n"
import type { Locale } from "@/lib/i18n"

const SITE_URL = "https://predatorgate.gr"

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
  const htmlLang = locale === "gr" ? "el" : "en"

  return {
    title: {
      default: t.meta.title,
      template: `%s | Predatorgate`,
    },
    description: t.meta.description,
    keywords: t.meta.keywords,
    authors: [{ name: "Predatorgate" }],
    openGraph: {
      title: t.meta.title,
      description: t.meta.description,
      url: `${SITE_URL}/${lang}`,
      siteName: "Predatorgate",
      locale: htmlLang,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t.meta.title,
      description: t.meta.description,
    },
    alternates: {
      canonical: `${SITE_URL}/${lang}`,
      languages: {
        "el": `${SITE_URL}/gr`,
        "en": `${SITE_URL}/en`,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

function JsonLd({ locale }: { locale: Locale }) {
  const t = getTranslations(locale)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Predatorgate",
    description: t.meta.description,
    url: SITE_URL,
    inLanguage: locale === "gr" ? "el" : "en",
    publisher: {
      "@type": "Organization",
      name: "Predatorgate",
      url: SITE_URL,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/${locale}`,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
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
      <head>
        <JsonLd locale={locale} />
      </head>
      <body className={`font-sans antialiased`}>{children}</body>
      <GoogleAnalytics gaId="G-XF5R1NQ8BH" />
    </html>
  )
}

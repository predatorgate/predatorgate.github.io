import Link from "next/link"
import { promises as fs } from "fs"
import path from "path"
import { parseVictimsCSV, enrichVictimsWithSources, enrichVictimsWithCategories, getCategoryList } from "@/lib/parse-people"
import type { VictimSourcesData, VictimCategoriesData } from "@/lib/parse-people"
import { isValidLocale, defaultLocale, getTranslations } from "@/lib/i18n"
import type { Locale } from "@/lib/i18n"
import { LanguageSwitcher } from "@/components/language-switcher"
import { VictimsFilter } from "@/components/victims-filter"

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const locale: Locale = isValidLocale(lang) ? lang : defaultLocale
  const t = getTranslations(locale)
  return { title: t.nav.victims }
}

export default async function VictimsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const locale: Locale = isValidLocale(lang) ? lang : defaultLocale
  const t = getTranslations(locale)

  // Load victims CSV
  const dataDir = path.join(process.cwd(), "data", locale)
  const fallbackDir = path.join(process.cwd(), "data")

  let victimsPath = path.join(dataDir, "victims.csv")
  try {
    await fs.access(victimsPath)
  } catch {
    victimsPath = path.join(fallbackDir, "victims.csv")
  }

  const victimsContent = await fs.readFile(victimsPath, "utf-8")
  const victims = parseVictimsCSV(victimsContent)

  // Load victim sources
  const victimSourcesPath = path.join(process.cwd(), "data", "victim-sources.json")
  const victimSourcesContent = await fs.readFile(victimSourcesPath, "utf-8")
  const victimSourcesData: VictimSourcesData = JSON.parse(victimSourcesContent)
  const enrichedVictims = enrichVictimsWithSources(victims, victimSourcesData, locale)

  // Load victim categories
  const victimCategoriesPath = path.join(process.cwd(), "data", "victim-categories.json")
  const victimCategoriesContent = await fs.readFile(victimCategoriesPath, "utf-8")
  const victimCategoriesData: VictimCategoriesData = JSON.parse(victimCategoriesContent)
  const categorizedVictims = enrichVictimsWithCategories(enrichedVictims, victimCategoriesData, locale)
  const categoryList = getCategoryList(victimCategoriesData, locale)

  // For English, show "EYP" instead of "ΕΥΠ" in method badges
  const eypLabel = locale === "en" ? "EYP" : "ΕΥΠ"

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-3 py-3 sm:px-4 sm:py-6">
          <div className="flex items-center justify-between gap-2">
            <Link href={`/${locale}`}>
              <h1 className="text-lg sm:text-2xl font-bold tracking-tight cursor-pointer hover:text-primary transition-colors">
                PREDATORGATE
              </h1>
            </Link>
            <nav className="flex items-center gap-3 sm:gap-6">
              <Link href={`/${locale}`} className="text-xs sm:text-sm hover:text-primary transition-colors">
                {t.nav.timeline}
              </Link>
              <Link href={`/${locale}/people`} className="text-xs sm:text-sm hover:text-primary transition-colors">
                {t.nav.people}
              </Link>
              <Link href={`/${locale}/victims`} className="text-xs sm:text-sm text-primary font-semibold">
                {t.nav.victims}
              </Link>
              <LanguageSwitcher currentLang={locale} currentPath="/victims" />
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-16">
            {/* Page Title */}
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-serif font-bold">{t.victims.pageTitle}</h2>
              <p className="text-muted-foreground text-lg">{t.victims.pageSubtitle}</p>
            </div>

            {/* Victims Section */}
            <div className="space-y-8">
              <VictimsFilter
                victims={categorizedVictims}
                eypLabel={eypLabel}
                categories={categoryList}
                labels={{
                  all: t.victims.filterAll,
                  predatorOnly: t.victims.filterPredator,
                  eypOnly: t.victims.filterEyp,
                  both: t.victims.filterBoth,
                  source: t.victims.filterSource,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <h4 className="text-lg font-semibold">PREDATORGATE</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t.footer.contribute}{" "}
              <a href="https://docs.google.com/forms/d/e/1FAIpQLSeJu3Rrt5-Y_a6b6WuE3GomtsccJ1ILf5grbKEL2BK6WC_s0g/viewform" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                {t.footer.googleForm}
              </a>
              . {t.footer.githubText}{" "}
              <a href="https://github.com/predatorgate/predatorgate.github.io" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Github
              </a>
              . {t.footer.contactText}{" "}
              <a href="mailto:predatorgate@proton.me" className="text-primary hover:underline">
                predatorgate@proton.me
              </a>
              . {t.footer.builtWith}{" "}
              <a href="https://v0.dev" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                v0 by Vercel
              </a>
              .
            </p>
            <div className="flex justify-center gap-6 text-sm">
              <Link href={`/${locale}`} className="hover:text-primary transition-colors">
                {t.nav.timeline}
              </Link>
              <Link href={`/${locale}/people`} className="hover:text-primary transition-colors">
                {t.nav.people}
              </Link>
              <Link href={`/${locale}/victims`} className="hover:text-primary transition-colors">
                {t.nav.victims}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

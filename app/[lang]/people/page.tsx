import Link from "next/link"
import { promises as fs } from "fs"
import path from "path"
import { parsePeopleCSV, categorizePeople, getPeopleCategoryList } from "@/lib/parse-people"
import type { PeopleCategoriesData } from "@/lib/parse-people"
import { isValidLocale, defaultLocale, getTranslations } from "@/lib/i18n"
import type { Locale } from "@/lib/i18n"
import { LanguageSwitcher } from "@/components/language-switcher"
import { PeopleSections } from "@/components/people-sections"

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const locale: Locale = isValidLocale(lang) ? lang : defaultLocale
  const t = getTranslations(locale)
  return {
    title: t.nav.people,
    description: t.meta.peopleDescription,
    openGraph: {
      title: t.meta.peopleTitle,
      description: t.meta.peopleDescription,
    },
  }
}

export default async function PeoplePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const locale: Locale = isValidLocale(lang) ? lang : defaultLocale
  const t = getTranslations(locale)

  // Load people CSV
  const dataDir = path.join(process.cwd(), "data", locale)
  const fallbackDir = path.join(process.cwd(), "data")

  let peoplePath = path.join(dataDir, "people.csv")
  try {
    await fs.access(peoplePath)
  } catch {
    peoplePath = path.join(fallbackDir, "people.csv")
  }

  const peopleContent = await fs.readFile(peoplePath, "utf-8")
  const people = parsePeopleCSV(peopleContent)

  // Load people categories
  const categoriesPath = path.join(process.cwd(), "data", "people-categories.json")
  const categoriesContent = await fs.readFile(categoriesPath, "utf-8")
  const categoriesData: PeopleCategoriesData = JSON.parse(categoriesContent)
  const categorizedPeople = categorizePeople(people, categoriesData, locale)
  const categoryList = getPeopleCategoryList(categoriesData, locale)

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
              <Link href={`/${locale}/people`} className="text-xs sm:text-sm text-primary font-semibold">
                {t.nav.people}
              </Link>
              <Link href={`/${locale}/victims`} className="text-xs sm:text-sm hover:text-primary transition-colors">
                {t.nav.victims}
              </Link>
              <LanguageSwitcher currentLang={locale} currentPath="/people" />
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-16">
            {/* Page Title */}
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-serif font-bold">{t.people.pageTitle}</h2>
              <p className="text-muted-foreground text-lg">{t.people.pageSubtitle}</p>
            </div>

            {/* Grouped Sections */}
            <PeopleSections people={categorizedPeople} categories={categoryList} />
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

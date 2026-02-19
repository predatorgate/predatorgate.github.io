import Link from "next/link"
import { Card } from "@/components/ui/card"
import { promises as fs } from "fs"
import path from "path"
import { parseCSV, enrichWithSources } from "@/lib/parse-timeline"
import { isValidLocale, defaultLocale, getTranslations } from "@/lib/i18n"
import type { Locale } from "@/lib/i18n"
import { LanguageSwitcher } from "@/components/language-switcher"

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const locale: Locale = isValidLocale(lang) ? lang : defaultLocale
  const t = getTranslations(locale)

  // Load data from the locale-specific directory, falling back to root
  const dataDir = path.join(process.cwd(), "data", locale)
  const fallbackDir = path.join(process.cwd(), "data")

  let csvPath = path.join(dataDir, "timeline.csv")
  // Single shared sources.json for all languages (keyed by hash of Greek date+description)
  const sourcesPath = path.join(fallbackDir, "sources.json")

  // Fall back to root data dir if locale-specific CSV doesn't exist
  try {
    await fs.access(csvPath)
  } catch {
    csvPath = path.join(fallbackDir, "timeline.csv")
  }

  const csvContent = await fs.readFile(csvPath, "utf-8")
  const sourcesContent = await fs.readFile(sourcesPath, "utf-8")

  const events = parseCSV(csvContent)
  const sourcesMap = JSON.parse(sourcesContent)
  const timelineEvents = enrichWithSources(events, sourcesMap).reverse()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <header className="border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href={`/${locale}`}>
              <h1 className="text-2xl font-bold tracking-tight cursor-pointer hover:text-primary transition-colors">
                PREDATORGATE
              </h1>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href={`/${locale}`} className="text-sm text-primary font-semibold">
                {t.nav.timeline}
              </Link>
              <Link href={`/${locale}/people`} className="text-sm hover:text-primary transition-colors">
                {t.nav.people}
              </Link>
              <LanguageSwitcher currentLang={locale} currentPath="/" />
            </nav>
          </div>
        </div>
      </header>

      {/* Timeline Section */}
      <section id="timeline" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-16 text-center">
              <h3 className="text-3xl md:text-4xl font-serif font-bold mb-4">{t.timeline.heading}</h3>
              <p className="text-muted-foreground">{t.timeline.subheading}</p>
            </div>

            {/* Timeline */}
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-border hidden md:block" />

              {timelineEvents.map((event, idx) => (
                <TimelineItem
                  key={idx}
                  date={event.date}
                  description={event.description}
                  sources={event.sources}
                  align={idx % 2 === 0 ? "right" : "left"}
                  sourceLabel={t.timeline.source}
                  sourcesLabel={t.timeline.sources}
                />
              ))}
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
              <a
                href="https://forms.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {t.footer.googleForm}
              </a>
              . {t.footer.githubText}{" "}
              <a
                href="https://github.com/predatorgate/predatorgate.github.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Github
              </a>
              . {t.footer.contactText}{" "}
              <a href="mailto:predatorgate@proton.me" className="text-primary hover:underline">
                predatorgate@proton.me
              </a>
              . {t.footer.builtWith}{" "}
              <a
                href="https://v0.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                v0 by Vercel
              </a>
              . {t.footer.translatedBy}{" "}
              <a
                href="https://claude.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Claude AI
              </a>
              . {t.footer.copyright}{" "}
              <a
                href="https://creativecommons.org/licenses/by/4.0"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Creative Commons Attribution 4.0 International License
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
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

interface TimelineItemProps {
  date: string
  description: string
  sources: string[]
  align: "left" | "right"
  sourceLabel: string
  sourcesLabel: string
}

function TimelineItem({ date, description, sources, align, sourceLabel, sourcesLabel }: TimelineItemProps) {
  const extractDomain = (url: string) => {
    try {
      const urlObj = new URL(url)
      return urlObj.hostname.replace("www.", "")
    } catch {
      return url
    }
  }

  return (
    <div className={`relative mb-12 ${align === "right" ? "md:pl-1/2" : ""}`}>
      <div className={`flex ${align === "right" ? "md:justify-end" : ""}`}>
        <Card className="max-w-2xl p-6 hover:border-primary/50 transition-colors">
          {/* Date Badge */}
          <div className="inline-block mb-4">
            <span className="text-xs uppercase tracking-wider bg-primary/10 text-primary px-3 py-1 rounded-full font-semibold">
              {date}
            </span>
          </div>

          {/* Content */}
          <p className="text-muted-foreground leading-relaxed mb-4 text-pretty">{description}</p>

          {/* Sources */}
          {sources.length > 0 && (
            <div className="text-xs text-muted-foreground">
              <span className="font-semibold">{sources.length > 1 ? sourcesLabel : sourceLabel}</span>{" "}
              {sources.map((url, idx) => (
                <span key={idx}>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {extractDomain(url)}
                  </a>
                  {idx < sources.length - 1 && ", "}
                </span>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Timeline Dot */}
      <div className="absolute left-0 md:left-1/2 top-8 w-3 h-3 bg-primary rounded-full -translate-x-1/2 hidden md:block ring-4 ring-background" />
    </div>
  )
}

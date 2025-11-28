import Link from "next/link"
import { Card } from "@/components/ui/card"
import { promises as fs } from "fs"
import path from "path"
import { parseCSV, enrichWithSources } from "@/lib/parse-timeline"

export default async function Home() {
  const csvPath = path.join(process.cwd(), "data", "timeline.csv")
  const sourcesPath = path.join(process.cwd(), "data", "sources.json")

  const csvContent = await fs.readFile(csvPath, "utf-8")
  const sourcesContent = await fs.readFile(sourcesPath, "utf-8")

  const events = parseCSV(csvContent)
  const sourcesMap = JSON.parse(sourcesContent)
  const timelineEvents = enrichWithSources(events, sourcesMap).reverse()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">PREDATORGATE</h1>
            <nav className="flex items-center gap-6">
              <Link href="/" className="text-sm hover:text-primary transition-colors">
                Χρονολόγιο
              </Link>
              <Link href="/people" className="text-sm hover:text-primary transition-colors">
                Πρόσωπα
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Hero */}
      {/* <section className="py-20 md:py-32 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-block">
              <span className="text-sm uppercase tracking-wider text-primary font-semibold">Ιστορία Σκανδάλου</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-serif font-bold leading-tight text-balance">
              Ιστορικό του σκανδάλου Predatorgate
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto text-pretty">
              Μια πλήρης χρονολογική καταγραφή των γεγονότων που συνθέτουν το σκάνδαλο παρακολουθήσεων με το λογισμικό
              Predator στην Ελλάδα
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="text-base" asChild>
                <a href="#timeline">Διαβάστε το Χρονολόγιο</a>
              </Button>
              <Button size="lg" variant="outline" className="text-base bg-transparent" asChild>
                <a href="/reverse.html">Αντίστροφη Χρονολογική Σειρά</a>
              </Button>
            </div>
          </div>
        </div>
      </section> */}

      {/* Stats Section */}
      {/* <section className="py-16 border-y border-border bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{timelineEvents.length}</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">Γεγονότα</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">3+</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">Χρόνια</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">100+</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">Θύματα</div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Timeline Section */}
      <section id="timeline" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-16 text-center">
              <h3 className="text-3xl md:text-4xl font-serif font-bold mb-4">Χρονολογική Σειρά Γεγονότων</h3>
              <p className="text-muted-foreground">Από τις πρώτες αποκαλύψεις μέχρι σήμερα</p>
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
              Για να προσθέσετε νέα γεγονότα ή να προτείνετε αλλαγές, επισκεφθείτε την{" "}
              <a
                href="https://forms.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Φόρμα Google
              </a>
              . Μπορείτε να συνεισφέρετε στην ανάπτυξη της σελίδας στο{" "}
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Github
              </a>
              . Επικοινωνία στο{" "}
              <a href="mailto:predatorgate@proton.me" className="text-primary hover:underline">
                predatorgate@proton.me
              </a>
              . Αναπτύχθηκε με{" "}
              <a
                href="https://v0.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                v0 by Vercel
              </a>
              .
            </p>
            <div className="flex justify-center gap-6 text-sm">
              <Link href="/" className="hover:text-primary transition-colors">
                Χρονολόγιο
              </Link>
              <Link href="/people" className="hover:text-primary transition-colors">
                Πρόσωπα
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
}

function TimelineItem({ date, description, sources, align }: TimelineItemProps) {
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
              <span className="font-semibold">{sources.length > 1 ? "Πηγές:" : "Πηγή:"}</span>{" "}
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

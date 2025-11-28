import Link from "next/link"
import { Card } from "@/components/ui/card"
import { promises as fs } from "fs"
import path from "path"
import { parsePeopleCSV, parseVictimsCSV } from "@/lib/parse-people"

export default async function PeoplePage() {
  const peoplePath = path.join(process.cwd(), "data", "people.csv")
  const victimsPath = path.join(process.cwd(), "data", "victims.csv")

  const peopleContent = await fs.readFile(peoplePath, "utf-8")
  const victimsContent = await fs.readFile(victimsPath, "utf-8")

  const people = parsePeopleCSV(peopleContent)
  const victims = parseVictimsCSV(victimsContent)

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href="/">
              <h1 className="text-2xl font-bold tracking-tight cursor-pointer hover:text-primary transition-colors">
                PREDATORGATE
              </h1>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/" className="text-sm hover:text-primary transition-colors">
                Χρονολόγιο
              </Link>
              <Link href="/people" className="text-sm text-primary font-semibold">
                Πρόσωπα
              </Link>
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
              <h2 className="text-4xl md:text-5xl font-serif font-bold">Πρόσωπα του Σκανδάλου</h2>
              <p className="text-muted-foreground text-lg">
                Τα κύρια πρόσωπα που εμπλέκονται και τα θύματα του Predatorgate
              </p>
            </div>

            {/* Main People Section */}
            <div className="space-y-8">
              <div className="text-center space-y-2">
                <h3 className="text-3xl font-serif font-bold text-primary">Κύρια Εμπλεκόμενα Πρόσωπα</h3>
                <p className="text-muted-foreground">Πρόσωπα και οργανισμοί που σχετίζονται με το σκάνδαλο</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {people.map((person, idx) => (
                  <Card key={idx} className="p-6 hover:border-primary/50 transition-colors">
                    <div className="space-y-3">
                      <h4 className="text-lg font-bold">{person.name}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{person.description}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Victims Section */}
            <div className="space-y-8">
              <div className="text-center space-y-2">
                <h3 className="text-3xl font-serif font-bold text-primary">Θύματα Παρακολουθήσεων</h3>
                <p className="text-muted-foreground">Άτομα που στοχοποιήθηκαν μέσω του λογισμικού Predator ή της ΕΥΠ</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {victims.map((victim, idx) => (
                  <Card key={idx} className="p-6 hover:border-primary/50 transition-colors">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <h4 className="text-lg font-bold">{victim.name}</h4>
                        <div className="flex gap-2">
                          {victim.method.includes("Predator") && (
                            <span className="text-xs uppercase tracking-wider bg-red-100 text-red-700 px-3 py-1 rounded-full font-semibold whitespace-nowrap">
                              Predator
                            </span>
                          )}
                          {victim.method.includes("ΕΥΠ") && (
                            <span className="text-xs uppercase tracking-wider bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold whitespace-nowrap">
                              ΕΥΠ
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{victim.description}</p>
                    </div>
                  </Card>
                ))}
              </div>
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

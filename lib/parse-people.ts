export interface Person {
  name: string
  description: string
}

export interface Victim {
  name: string
  description: string
  method: string
}

export function parsePeopleCSV(csvContent: string): Person[] {
  const lines = csvContent.trim().split("\n")
  const people: Person[] = []

  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    // Split by comma, but respect quoted fields
    const match = line.match(/^"?([^"]*)"?,(.*)$/)
    if (!match) continue

    const name = match[1].trim()
    const description = match[2].replace(/^"(.*)"$/, "$1").trim()

    if (name) {
      people.push({ name, description })
    }
  }

  return people
}

export function parseVictimsCSV(csvContent: string): Victim[] {
  const lines = csvContent.trim().split("\n")
  const victims: Victim[] = []

  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    // Split by comma, but respect quoted fields
    const match = line.match(/^"?([^"]*)"?,"([^"]*)","([^"]*)"$/)
    if (!match) continue

    const name = match[1].trim()
    const description = match[2].trim()
    const method = match[3].trim()

    if (name) {
      victims.push({ name, description, method })
    }
  }

  return victims
}

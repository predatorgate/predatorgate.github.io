export interface TimelineEvent {
  date: string
  description: string
  link: string
  sortNumber: string
  sources: string[]
}

export function parseCSV(csvContent: string): TimelineEvent[] {
  const lines = csvContent.split("\n")
  const events: TimelineEvent[] = []

  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    // Parse CSV line handling quoted fields with commas
    const fields: string[] = []
    let currentField = ""
    let inQuotes = false

    for (let j = 0; j < line.length; j++) {
      const char = line[j]

      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === "," && !inQuotes) {
        fields.push(currentField)
        currentField = ""
      } else {
        currentField += char
      }
    }
    fields.push(currentField) // Add last field

    if (fields.length >= 4) {
      const date = fields[0].trim()
      if (!date) continue

      events.push({
        date: fields[0],
        description: fields[1],
        link: fields[2],
        sortNumber: fields[3],
        sources: [],
      })
    }
  }

  return events
}

export function enrichWithSources(events: TimelineEvent[], sourcesMap: Record<string, string[]>): TimelineEvent[] {
  return events.map((event, index) => ({
    ...event,
    // Map by row index: first event (index 0) corresponds to sources["1"], etc.
    sources: sourcesMap[String(index + 1)] || [],
  }))
}

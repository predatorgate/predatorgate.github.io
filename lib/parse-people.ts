export interface Person {
  name: string
  description: string
}

export interface Victim {
  name: string
  description: string
  method: string
  sources: { label: string; url: string; method: "predator" | "eyp" | "both" }[]
  category: string
}

export interface VictimSourcesData {
  source_definitions: Record<string, { label: Record<string, string>; url: string; method: "predator" | "eyp" | "both" }>
  victims: Record<string, Record<string, string[]>>
}

export interface VictimCategoriesData {
  category_labels: Record<string, Record<string, string>>
  category_order: string[]
  victims: Record<string, Record<string, string>>
}

export function enrichVictimsWithSources(
  victims: Victim[],
  sourcesData: VictimSourcesData,
  locale: string
): Victim[] {
  const victimSources = sourcesData.victims[locale] || {}
  const defs = sourcesData.source_definitions

  return victims.map((victim) => {
    const sourceKeys = victimSources[victim.name] || []
    const sources = sourceKeys
      .filter((key) => defs[key])
      .map((key) => ({
        label: defs[key].label[locale] || defs[key].label["en"] || key,
        url: defs[key].url,
        method: defs[key].method,
      }))
    return { ...victim, sources }
  })
}

export function enrichVictimsWithCategories(
  victims: Victim[],
  categoriesData: VictimCategoriesData,
  locale: string
): Victim[] {
  const victimCategories = categoriesData.victims[locale] || {}

  return victims.map((victim) => ({
    ...victim,
    category: victimCategories[victim.name] || "other",
  }))
}

export function getCategoryList(
  categoriesData: VictimCategoriesData,
  locale: string
): { key: string; label: string }[] {
  return categoriesData.category_order.map((key) => ({
    key,
    label: categoriesData.category_labels[key]?.[locale] || categoriesData.category_labels[key]?.["en"] || key,
  }))
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
      victims.push({ name, description, method, sources: [], category: "other" })
    }
  }

  return victims
}

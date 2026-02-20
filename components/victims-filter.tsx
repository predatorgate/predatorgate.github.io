"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"

interface VictimSource {
  label: string
  url: string
  method: "predator" | "eyp" | "both"
}

interface Victim {
  name: string
  description: string
  method: string
  sources: VictimSource[]
  category: string
}

interface CategoryDef {
  key: string
  label: string
}

type FilterValue = "all" | "predator" | "eyp" | "both"

interface VictimsFilterProps {
  victims: Victim[]
  eypLabel: string
  categories: CategoryDef[]
  labels: {
    all: string
    predatorOnly: string
    eypOnly: string
    both: string
    source: string
  }
}

function VictimCard({ victim, eypLabel, sourceLabel }: { victim: Victim; eypLabel: string; sourceLabel: string }) {
  const hasPredator = victim.method.includes("Predator")
  const hasEyp = victim.method.includes("ΕΥΠ") || victim.method.includes("EYP")
  const predatorSources = victim.sources.filter((s) => s.method === "predator" || s.method === "both")
  const eypSources = victim.sources.filter((s) => s.method === "eyp" || s.method === "both")

  return (
    <Card className="p-6 hover:border-primary/50 transition-colors">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <h4 className="text-lg font-bold">{victim.name}</h4>
          <div className="flex gap-2">
            {hasPredator && (
              <span className="text-xs uppercase tracking-wider bg-red-100 text-red-700 px-3 py-1 rounded-full font-semibold whitespace-nowrap">
                Predator
              </span>
            )}
            {hasEyp && (
              <span className="text-xs uppercase tracking-wider bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold whitespace-nowrap">
                {eypLabel}
              </span>
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{victim.description}</p>
        {(predatorSources.length > 0 || eypSources.length > 0) && (
          <div className="space-y-1">
            {hasPredator && predatorSources.length > 0 && (
              <div className="text-xs text-muted-foreground">
                <span className="font-medium">Predator {sourceLabel}: </span>
                {predatorSources.map((source, i) => (
                  <span key={i}>
                    {i > 0 && ", "}
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2 hover:text-foreground transition-colors"
                    >
                      {source.label}
                    </a>
                  </span>
                ))}
              </div>
            )}
            {hasEyp && eypSources.length > 0 && (
              <div className="text-xs text-muted-foreground">
                <span className="font-medium">{eypLabel} {sourceLabel}: </span>
                {eypSources.map((source, i) => (
                  <span key={i}>
                    {i > 0 && ", "}
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2 hover:text-foreground transition-colors"
                    >
                      {source.label}
                    </a>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}

export function VictimsFilter({ victims, eypLabel, categories, labels }: VictimsFilterProps) {
  const [filter, setFilter] = useState<FilterValue>("all")
  const [openSections, setOpenSections] = useState<Set<string>>(() => new Set())

  function toggleSection(key: string) {
    setOpenSections((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  const filtered = victims.filter((victim) => {
    if (filter === "all") return true
    const hasPredator = victim.method.includes("Predator")
    const hasEyp = victim.method.includes("ΕΥΠ") || victim.method.includes("EYP")
    if (filter === "both") return hasPredator && hasEyp
    if (filter === "predator") return hasPredator && !hasEyp
    if (filter === "eyp") return hasEyp && !hasPredator
    return true
  })

  const filterOptions: { value: FilterValue; label: string }[] = [
    { value: "all", label: labels.all },
    { value: "predator", label: labels.predatorOnly },
    { value: "eyp", label: labels.eypOnly },
    { value: "both", label: labels.both },
  ]

  // Group filtered victims by category
  const grouped = new Map<string, typeof filtered>()
  for (const cat of categories) {
    const members = filtered.filter((v) => v.category === cat.key)
    if (members.length > 0) {
      grouped.set(cat.key, members)
    }
  }

  return (
    <>
      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-3">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setFilter(option.value)}
            className={`text-sm px-4 py-2 rounded-full font-medium transition-colors border ${
              filter === option.value
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-transparent text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Count */}
      <p className="text-center text-sm text-muted-foreground">
        {filtered.length} / {victims.length}
      </p>

      {/* Victims grouped by category */}
      <div className="space-y-8">
        {categories.map((cat) => {
          const members = grouped.get(cat.key)
          if (!members || members.length === 0) return null
          const isOpen = openSections.has(cat.key)

          return (
            <div key={cat.key}>
              <button
                onClick={() => toggleSection(cat.key)}
                className="w-full text-left group"
              >
                <div className="flex items-center gap-4">
                  <span
                    className="text-muted-foreground text-sm transition-transform duration-200 select-none"
                    style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}
                  >
                    ▶
                  </span>
                  <h4 className="text-lg sm:text-xl font-serif font-bold group-hover:text-primary transition-colors">
                    {cat.label}
                  </h4>
                  <div className="h-px bg-border flex-1 min-w-[2rem]" />
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    {members.length}
                  </span>
                </div>
              </button>

              <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{
                  maxHeight: isOpen ? `${members.length * 300}px` : "0px",
                  opacity: isOpen ? 1 : 0,
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                  {members.map((victim, idx) => (
                    <VictimCard
                      key={idx}
                      victim={victim}
                      eypLabel={eypLabel}
                      sourceLabel={labels.source}
                    />
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

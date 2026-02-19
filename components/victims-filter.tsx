"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"

interface Victim {
  name: string
  description: string
  method: string
}

type FilterValue = "all" | "predator" | "eyp" | "both"

interface VictimsFilterProps {
  victims: Victim[]
  eypLabel: string
  labels: {
    all: string
    predatorOnly: string
    eypOnly: string
    both: string
  }
}

export function VictimsFilter({ victims, eypLabel, labels }: VictimsFilterProps) {
  const [filter, setFilter] = useState<FilterValue>("all")

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

      {/* Victims Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((victim, idx) => (
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
                  {(victim.method.includes("ΕΥΠ") || victim.method.includes("EYP")) && (
                    <span className="text-xs uppercase tracking-wider bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold whitespace-nowrap">
                      {eypLabel}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{victim.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </>
  )
}

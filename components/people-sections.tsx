"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"

interface Person {
  name: string
  description: string
  category: string
}

interface CategoryDef {
  key: string
  label: string
  description: string
}

interface PeopleSectionsProps {
  people: Person[]
  categories: CategoryDef[]
}

export function PeopleSections({ people, categories }: PeopleSectionsProps) {
  const [openSections, setOpenSections] = useState<Set<string>>(
    () => new Set()
  )

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

  return (
    <div className="space-y-8">
      {categories.map((cat) => {
        const members = people.filter((p) => p.category === cat.key)
        if (members.length === 0) return null
        const isOpen = openSections.has(cat.key)

        return (
          <div key={cat.key}>
            {/* Clickable Header */}
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
                <h3 className="text-2xl font-serif font-bold whitespace-nowrap group-hover:text-primary transition-colors">
                  {cat.label}
                </h3>
                <div className="h-px bg-border flex-1" />
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  {members.length}
                </span>
              </div>
              {cat.description && (
                <p className="text-muted-foreground text-sm leading-relaxed mt-3 ml-8">
                  {cat.description}
                </p>
              )}
            </button>

            {/* Collapsible Content */}
            <div
              className="overflow-hidden transition-all duration-300 ease-in-out"
              style={{
                maxHeight: isOpen ? `${members.length * 300}px` : "0px",
                opacity: isOpen ? 1 : 0,
              }}
            >
              <div className="space-y-4 pt-6">
                {members.map((person, idx) => (
                  <Card key={idx} className="p-6 hover:border-primary/50 transition-colors">
                    <div className="space-y-2">
                      <h4 className="text-lg font-bold">{person.name}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {person.description}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

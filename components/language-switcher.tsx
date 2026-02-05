import Link from "next/link"
import type { Locale } from "@/lib/i18n"
import { getTranslations } from "@/lib/i18n"

interface LanguageSwitcherProps {
  currentLang: Locale
  currentPath: string // e.g. "/" or "/people"
}

export function LanguageSwitcher({ currentLang, currentPath }: LanguageSwitcherProps) {
  const t = getTranslations(currentLang)
  const targetLang = currentLang === "gr" ? "en" : "gr"
  const targetPath = `/${targetLang}${currentPath}`

  return (
    <Link
      href={targetPath}
      className="text-sm font-semibold border border-border rounded-md px-3 py-1 hover:bg-accent transition-colors"
      lang={targetLang}
    >
      {t.langSwitcher.label}
    </Link>
  )
}

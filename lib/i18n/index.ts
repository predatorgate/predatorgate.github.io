export const locales = ["gr", "en"] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = "gr"

export function isValidLocale(lang: string): lang is Locale {
  return locales.includes(lang as Locale)
}

const translations = {
  gr: {
    // Metadata
    meta: {
      title: "Predatorgate - Ιστορικό του Σκανδάλου",
      description:
        "Μια πλήρης χρονολογική καταγραφή των γεγονότων που συνθέτουν το σκάνδαλο παρακολουθήσεων με το λογισμικό Predator στην Ελλάδα. Χρονολόγιο, εμπλεκόμενα πρόσωπα και στόχοι παρακολουθήσεων.",
      keywords: "predatorgate, predator, σκάνδαλο υποκλοπών, παρακολουθήσεις, ΕΥΠ, Ελλάδα, λογισμικό κατασκοπείας, Intellexa, Krikel, χρονολόγιο, surveillance scandal, spyware Greece",
      timelineTitle: "Χρονολόγιο | Predatorgate",
      timelineDescription: "Χρονολογική σειρά γεγονότων του σκανδάλου παρακολουθήσεων με το λογισμικό Predator στην Ελλάδα.",
      peopleTitle: "Πρόσωπα | Predatorgate",
      peopleDescription: "Τα κύρια εμπλεκόμενα πρόσωπα και οργανισμοί στο σκάνδαλο παρακολουθήσεων Predator στην Ελλάδα.",
      targetsTitle: "Στόχοι | Predatorgate",
      targetsDescription: "Τα άτομα που στοχοποιήθηκαν μέσω του λογισμικού Predator ή της ΕΥΠ στην Ελλάδα.",
    },

    // Navigation
    nav: {
      timeline: "Χρονολόγιο",
      people: "Πρόσωπα",
      victims: "Στόχοι",
    },

    // Timeline page
    timeline: {
      heading: "Χρονολογική Σειρά Γεγονότων",
      subheading: "Από τις πρώτες αποκαλύψεις μέχρι σήμερα",
      source: "Πηγή:",
      sources: "Πηγές:",
    },

    // People (Key Figures) page
    people: {
      pageTitle: "Κύρια Εμπλεκόμενα Πρόσωπα",
      pageSubtitle: "Πρόσωπα και οργανισμοί που σχετίζονται με το σκάνδαλο",
    },

    // Victims page
    victims: {
      pageTitle: "Στόχοι Παρακολουθήσεων",
      pageSubtitle: "Άτομα που στοχοποιήθηκαν μέσω του λογισμικού Predator ή της ΕΥΠ",
      filterAll: "Όλα",
      filterPredator: "Μόνο Predator",
      filterEyp: "Μόνο ΕΥΠ",
      filterBoth: "Predator & ΕΥΠ",
      filterSource: "πηγή",
    },

    // Footer
    footer: {
      contribute: "Για να προσθέσετε νέα γεγονότα ή να προτείνετε αλλαγές, επισκεφθείτε την",
      googleForm: "Φόρμα Google",
      githubText: "Μπορείτε να συνεισφέρετε στην ανάπτυξη της σελίδας στο",
      contactText: "Επικοινωνία στο",
      builtWith: "Αναπτύχθηκε με",
      translatedBy: "Μεταφράστηκε από τα ελληνικά με",
      copyright: "Το περιεχόμενο της σελίδας είναι αδειοδοτημένο με",
    },

    // Language switcher
    langSwitcher: {
      label: "EN",
    },
  },

  en: {
    // Metadata
    meta: {
      title: "Predatorgate - Scandal Timeline",
      description:
        "A comprehensive chronological record of the events that make up the Predator spyware surveillance scandal in Greece. Timeline, key figures, and surveillance targets.",
      keywords: "predatorgate, predator spyware, surveillance scandal, Greece, wiretapping, EYP, Greek intelligence, Intellexa, Krikel, timeline, Predator Files, spyware Greece",
      timelineTitle: "Timeline | Predatorgate",
      timelineDescription: "Chronological timeline of the Predator spyware surveillance scandal in Greece.",
      peopleTitle: "Key Figures | Predatorgate",
      peopleDescription: "The key individuals and organizations involved in the Predator spyware surveillance scandal in Greece.",
      targetsTitle: "Targets | Predatorgate",
      targetsDescription: "Individuals targeted through the Predator spyware or the Greek Intelligence Service (EYP).",
    },

    // Navigation
    nav: {
      timeline: "Timeline",
      people: "Key Figures",
      victims: "Targets",
    },

    // Timeline page
    timeline: {
      heading: "Chronological Order of Events",
      subheading: "From the first revelations to the present day",
      source: "Source:",
      sources: "Sources:",
    },

    // People (Key Figures) page
    people: {
      pageTitle: "Key Figures",
      pageSubtitle: "People and organizations linked to the scandal",
    },

    // Victims page
    victims: {
      pageTitle: "Surveillance Targets",
      pageSubtitle: "Individuals targeted through the Predator spyware or the Greek Intelligence Service (EYP)",
      filterAll: "All",
      filterPredator: "Predator only",
      filterEyp: "EYP only",
      filterBoth: "Predator & EYP",
      filterSource: "source",
    },

    // Footer
    footer: {
      contribute: "To add new events or suggest changes, visit the",
      googleForm: "Google Form",
      githubText: "You can contribute to the development of the site on",
      contactText: "Contact us at",
      builtWith: "Built with",
      translatedBy: "Translated from Greek with",
      copyright: "This work is licensed under a",
    },

    // Language switcher
    langSwitcher: {
      label: "GR",
    },
  },
} as const

export type TranslationKeys = typeof translations.gr
export function getTranslations(locale: Locale): TranslationKeys {
  return translations[locale]
}

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
      title: "Predatorgate - Predator και ΕΥΠ: Το σκάνδαλο υποκλοπών στην Ελλάδα",
      description:
        "Το πληρέστερο αρχείο για το σκάνδαλο υποκλοπών στην Ελλάδα. Χρονολόγιο γεγονότων, εμπλεκόμενα πρόσωπα και στόχοι παρακολουθήσεων με το λογισμικό Predator και την ΕΥΠ. Πρωτογενείς πηγές, δικαστικές καταθέσεις και δημοσιογραφικές έρευνες.",
      keywords: "predatorgate, predator, σκάνδαλο υποκλοπών, παρακολουθήσεις, ΕΥΠ, Ελλάδα, λογισμικό κατασκοπείας, Intellexa, Krikel, Μητσοτάκης, Ανδρουλάκης, Κουκάκης, Δημητριάδης, χρονολόγιο, surveillance scandal, spyware Greece, Greek wiretapping scandal",
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

    // Landing page
    landing: {
      headline: "Predator και ΕΥΠ: Το σκάνδαλο υποκλοπών στην Ελλάδα",
      intro: "Το 2022 αποκαλύφθηκε ότι η Εθνική Υπηρεσία Πληροφοριών (ΕΥΠ) παρακολουθούσε δημοσιογράφους, πολιτικούς, επιχειρηματίες και δημόσια πρόσωπα, ενώ παράλληλα το λογισμικό κατασκοπείας Predator χρησιμοποιούνταν για την παράνομη παρακολούθηση των κινητών τηλεφώνων τους. Αυτή η σελίδα καταγράφει ολόκληρο το εύρος του σκανδάλου μέσα από πρωτογενείς πηγές, δικαστικές καταθέσεις και δημοσιογραφικές έρευνες.",
      statEvents: "Χρονολογικά γεγονότα",
      statFigures: "Εμπλεκόμενα πρόσωπα",
      statTargets: "Στόχοι",
      explore: "Εξερευνήστε το",
      latestTitle: "Τελευταίες εξελίξεις",
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
      title: "Predatorgate - Predator and EYP: The Surveillance Scandal in Greece",
      description:
        "The most comprehensive archive of the Greek surveillance scandal. Timeline of events, key figures, and surveillance targets of the Predator spyware and the Greek National Intelligence Service (EYP). Primary sources, court testimony, and investigative reporting.",
      keywords: "predatorgate, predator spyware, surveillance scandal, Greece, wiretapping, EYP, Greek intelligence, Greek wiretapping scandal, Intellexa, Krikel, Mitsotakis, Androulakis, Koukakis, Predator Files, spyware Greece, predator spyware Greece, Greek surveillance",
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

    // Landing page
    landing: {
      headline: "Predator and EYP: The surveillance scandal in Greece",
      intro: "In 2022, it was revealed that the Greek National Intelligence Service (EYP) had been surveilling journalists, politicians, businesspeople, and public officials, while the Predator spyware was simultaneously used to illegally monitor their mobile phones. This site documents the full scope of the scandal through primary sources, court testimony, and investigative reporting.",
      statEvents: "Events",
      statFigures: "Key Figures",
      statTargets: "Targets",
      explore: "Explore the",
      latestTitle: "Latest developments",
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

"use client";

import { useEffect, useState } from "react";
import { detectLanguage, TRANSLATIONS, type Language } from "@/lib/i18n";

export function useLanguage() {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const detected = detectLanguage();
    document.documentElement.lang = detected;
    const timer = window.setTimeout(() => setLanguageState(detected), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const setLanguage = (value: Language) => {
    setLanguageState(value);
    localStorage.setItem("4d-results-language", value);
    document.documentElement.lang = value;
  };

  return { language, setLanguage, t: TRANSLATIONS[language] };
}

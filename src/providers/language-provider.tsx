"use client";

import { createContext, useContext, useSyncExternalStore, useCallback } from "react";
import ar from "@/locales/ar.json";
import en from "@/locales/en.json";

export type Language = "ar" | "en";
type Translations = Record<string, string>;

const STORAGE_KEY = "esap-language";
const DEFAULT_LANGUAGE: Language = "ar";

const translations: Record<Language, Translations> = { ar, en };

const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot(): Language {
  return (localStorage.getItem(STORAGE_KEY) as Language) || DEFAULT_LANGUAGE;
}

function getServerSnapshot(): Language {
  return DEFAULT_LANGUAGE;
}

type LanguageContextValue = {
  language: Language;
  dir: "rtl" | "ltr";
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  formatNumber: (value: number) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const language = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const dir = language === "ar" ? "rtl" : "ltr";

  const setLanguage = useCallback((lang: Language) => {
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    listeners.forEach((l) => l());
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === "ar" ? "en" : "ar");
  }, [language, setLanguage]);

  const formatNumber = useCallback(
    (value: number): string =>
      language === "ar" ? value.toLocaleString("ar-SA") : value.toLocaleString("en-US"),
    [language]
  );

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      let value = translations[language][key] ?? key;
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          const formatted = typeof v === "number" ? formatNumber(v) : v;
          value = value.replace(`{${k}}`, String(formatted));
        });
      }
      return value;
    },
    [language, formatNumber]
  );

  return (
    <LanguageContext.Provider value={{ language, dir, setLanguage, toggleLanguage, t, formatNumber }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

export function useTranslation() {
  return useLanguage().t;
}

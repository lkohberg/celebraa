import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import de from "./de";
import en from "./en";

type Translations = Record<string, string>;
type Locale = "de" | "en";

const translations: Record<Locale, Translations> = { de, en };

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

function detectLocale(): Locale {
  const stored = localStorage.getItem("celebra-lang");
  if (stored === "de" || stored === "en") return stored;
  const browserLang = navigator.language.slice(0, 2);
  return browserLang === "de" ? "de" : "en";
}

export const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>(detectLocale);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("celebra-lang", l);
  }, []);

  const t = useCallback(
    (key: string) => translations[locale][key] || translations["de"][key] || key,
    [locale]
  );

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useTranslation = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    // Fallback for HMR edge cases — return default German translations
    const fallbackT = (key: string) => translations["de"][key] || key;
    return { locale: "de" as Locale, setLocale: () => {}, t: fallbackT };
  }
  return ctx;
};

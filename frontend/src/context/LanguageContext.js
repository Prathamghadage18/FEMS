"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { translations, getTranslation } from "../constants/translations";

// Default context value for SSR
const defaultContextValue = {
  language: "en",
  changeLanguage: () => {},
  t: (path) => getTranslation(translations["en"], path),
  translations: translations["en"],
  isMarathi: false,
  isEnglish: true,
};

const LanguageContext = createContext(defaultContextValue);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load saved language preference from localStorage
    const savedLanguage = localStorage.getItem("fems-language");
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "mr")) {
      setLanguage(savedLanguage);
    }
    setMounted(true);
  }, []);

  const changeLanguage = (lang) => {
    if (lang === "en" || lang === "mr") {
      setLanguage(lang);
      localStorage.setItem("fems-language", lang);
    }
  };

  const t = (path) => {
    return getTranslation(translations[language], path);
  };

  // Get current translations object
  const currentTranslations = translations[language];

  const value = {
    language,
    changeLanguage,
    t,
    translations: currentTranslations,
    isMarathi: language === "mr",
    isEnglish: language === "en",
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  return context;
};

export default LanguageContext;

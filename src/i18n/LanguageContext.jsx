import { createContext, useContext, useState, useEffect, useCallback } from "react"
import en from "./translations/en"
import mr from "./translations/mr"

const translations = { en, mr }

const LanguageContext = createContext(null)

function getNested(obj, path) {
  return path.split(".").reduce((acc, key) => acc?.[key], obj)
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem("sk-lang")
    return saved === "en" || saved === "mr" ? saved : "mr"
  })

  useEffect(() => {
    localStorage.setItem("sk-lang", lang)
    document.documentElement.lang = lang === "mr" ? "mr" : "en"
    document.title = translations[lang].meta.title
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute("content", translations[lang].meta.description)
  }, [lang])

  const t = useCallback(
    (key) => {
      const value = getNested(translations[lang], key)
      if (value === undefined) return key
      return value
    },
    [lang]
  )

  const tReplace = useCallback(
    (key, vars = {}) => {
      let str = String(t(key))
      Object.entries(vars).forEach(([k, v]) => {
        str = str.replaceAll(`{${k}}`, v)
      })
      return str
    },
    [t]
  )

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, tReplace }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useTranslation() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error("useTranslation must be used within LanguageProvider")
  return ctx
}

export const navRoutes = [
  { path: "/", key: "nav.home" },
  { path: "/about", key: "nav.about" },
  { path: "/services", key: "nav.services" },
  { path: "/gallery", key: "nav.gallery" },
  { path: "/owners", key: "nav.owners" },
  { path: "/contact", key: "nav.contact" },
]

export const serviceIcons = ["chariot", "wrench", "hammer", "map"]

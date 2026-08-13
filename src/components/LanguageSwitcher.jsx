import { Languages } from "lucide-react"
import { useTranslation } from "../i18n/LanguageContext"

export default function LanguageSwitcher({ compact = false }) {
  const { lang, setLang, t } = useTranslation()

  return (
    <div
      className={`flex items-center gap-1 rounded-full border border-white/20 bg-white/10 p-1 ${compact ? "" : ""}`}
      role="group"
      aria-label={t("lang.switch")}
    >
      <Languages className="ml-2 hidden h-4 w-4 text-gold-400/70 sm:block" />
      {(["mr", "en"]).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
            lang === code
              ? "bg-saffron-500 text-maroon-950"
              : "text-white/80 hover:bg-white/10 hover:text-white"
          }`}
        >
          {code === "mr" ? "मराठी" : "EN"}
        </button>
      ))}
    </div>
  )
}

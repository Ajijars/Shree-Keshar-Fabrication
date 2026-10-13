import { Languages } from "lucide-react"
import { useTranslation } from "../i18n/LanguageContext"

export default function LanguageSwitcher({ compact = false }) {
  const { lang, setLang, t } = useTranslation()

  return (
    <div
      className="flex items-center gap-1 rounded-full border border-slate-200/90 bg-slate-50/90 p-1 shadow-xs"
      role="group"
      aria-label={t("lang.switch")}
    >
      {!compact && <Languages className="ml-2 hidden h-4 w-4 text-amber-700/80 sm:block" />}
      {(["mr", "en"]).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          className={`rounded-full transition ${compact ? "px-2.5 py-1 text-[11px]" : "px-3 py-1.5 text-xs"} font-semibold ${
            lang === code
              ? "bg-amber-500 text-slate-950 shadow-xs font-bold"
              : "text-slate-600 hover:bg-slate-200/60 hover:text-slate-900"
          }`}
        >
          {code === "mr" ? "मराठी" : "EN"}
        </button>
      ))}
    </div>
  )
}

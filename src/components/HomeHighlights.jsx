import { Link } from "react-router-dom"
import { Heart, Clock, Palette, MapPinned } from "lucide-react"
import { useTranslation } from "../i18n/LanguageContext"

const icons = [Heart, Clock, Palette, MapPinned]

export default function HomeHighlights() {
  const { t } = useTranslation()
  const items = t("whyChooseUs.items")

  return (
    <section className="bg-cream-100 py-12 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 text-center reveal-on-scroll">
          <p className="font-devanagari text-sm font-bold text-amber-600">
            {t("home.highlightsAccent")}
          </p>
          <h2 className="font-display heading-flourish mt-1 text-2xl sm:text-3xl font-bold text-slate-900">
            {t("home.highlightsTitle")}
          </h2>
        </div>

        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => {
            const Icon = icons[i]
            const delayClass = `delay-${(i + 1) * 100}`
            return (
              <div
                key={item.title}
                className={`pro-card card-shine reveal-on-scroll ${delayClass} group rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-7 text-center shadow-xs hover:border-amber-400 hover:shadow-xl active:scale-[0.98] transition-transform`}
              >
                <div className="mx-auto mb-4 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/90 text-amber-700 border border-amber-200/50 shadow-2xs transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-amber-500 group-hover:text-slate-950">
                  <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
                </div>
                <h3 className="font-display text-base sm:text-lg font-bold text-slate-900 group-hover:text-amber-800 transition">
                  {item.title}
                </h3>
                <p className="font-devanagari mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            )
          })}
        </div>

        <div className="mt-12 text-center reveal-on-scroll">
          <Link
            to="/about"
            className="btn-interactive inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-2.5 text-xs sm:text-sm font-bold text-slate-800 shadow-2xs hover:border-amber-500 hover:text-amber-800 hover:shadow-sm"
          >
            {t("common.learnMore")}
          </Link>
        </div>
      </div>
    </section>
  )
}


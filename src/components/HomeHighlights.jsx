import { Link } from "react-router-dom"
import { Heart, Clock, Palette, MapPinned } from "lucide-react"
import { useTranslation } from "../i18n/LanguageContext"

const icons = [Heart, Clock, Palette, MapPinned]

export default function HomeHighlights() {
  const { t } = useTranslation()
  const items = t("whyChooseUs.items")

  return (
    <section className="bg-cream-100 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <p className="font-devanagari text-sm font-medium text-saffron-500">
            {t("home.highlightsAccent")}
          </p>
          <h2 className="font-display mt-1 text-3xl font-bold text-maroon-900">
            {t("home.highlightsTitle")}
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => {
            const Icon = icons[i]
            return (
              <div
                key={item.title}
                className="pro-card group rounded-3xl border border-slate-200/90 bg-white p-7 text-center shadow-xs transition-all duration-300 hover:border-amber-400 hover:shadow-lg"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/90 text-amber-700 border border-amber-200/50 shadow-2xs transition-all duration-300 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-slate-950">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="font-display text-lg font-bold text-slate-900 group-hover:text-amber-800 transition">
                  {item.title}
                </h3>
                <p className="font-devanagari mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            )
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/about"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-2.5 text-xs sm:text-sm font-bold text-slate-800 shadow-2xs transition hover:border-amber-500 hover:text-amber-800 hover:shadow-sm"
          >
            {t("common.learnMore")}
          </Link>
        </div>
      </div>
    </section>
  )
}


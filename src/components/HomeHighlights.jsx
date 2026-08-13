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

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => {
            const Icon = icons[i]
            return (
              <div
                key={item.title}
                className="rounded-2xl border border-cream-200 bg-white p-5 text-center"
              >
                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-saffron-500/15 text-saffron-500">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-base font-semibold text-maroon-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600">{item.description}</p>
              </div>
            )
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/about"
            className="text-sm font-semibold text-maroon-800 underline-offset-4 hover:text-saffron-500 hover:underline"
          >
            {t("common.learnMore")}
          </Link>
        </div>
      </div>
    </section>
  )
}

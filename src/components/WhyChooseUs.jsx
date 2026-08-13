import { Heart, Clock, Palette, MapPinned } from "lucide-react"
import { useTranslation } from "../i18n/LanguageContext"
import SectionHeading from "./SectionHeading"

const icons = [Heart, Clock, Palette, MapPinned]

export default function WhyChooseUs({ showHeading = true }) {
  const { t } = useTranslation()
  const items = t("whyChooseUs.items")

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {showHeading && (
          <SectionHeading
            title={t("whyChooseUs.sectionTitle")}
            subtitle={t("whyChooseUs.sectionSubtitle")}
          />
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => {
            const Icon = icons[i]
            return (
              <div
                key={item.title}
                className="rounded-2xl border border-cream-200 p-6 text-center transition hover:shadow-md"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-saffron-500/15 text-saffron-500">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-lg font-semibold text-maroon-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

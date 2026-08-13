import { MapPin } from "lucide-react"
import { useTranslation } from "../i18n/LanguageContext"
import SectionHeading from "./SectionHeading"

export default function ServiceAreas() {
  const { t } = useTranslation()
  const cities = t("serviceAreas.cities")

  return (
    <section className="relative overflow-hidden bg-maroon-950 py-20 sm:py-28">
      <div className="pattern-overlay absolute inset-0 opacity-20" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          light
          title={t("serviceAreas.title")}
          subtitle={t("serviceAreas.subtitle")}
        />

        <div className="flex flex-wrap justify-center gap-3">
          {cities.map((city) => (
            <span
              key={city}
              className="inline-flex items-center gap-2 rounded-full border border-gold-500/25 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/90 backdrop-blur-sm transition hover:border-gold-500/50 hover:bg-white/10"
            >
              <MapPin className="h-3.5 w-3.5 text-gold-400" />
              {city}
            </span>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-white/60">
          {t("serviceAreas.description")}
        </p>
      </div>
    </section>
  )
}

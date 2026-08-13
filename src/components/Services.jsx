import { Truck, Wrench, Hammer, MapPin } from "lucide-react"
import { useTranslation, serviceIcons } from "../i18n/LanguageContext"
import SectionHeading from "./SectionHeading"

const iconMap = {
  chariot: Truck,
  wrench: Wrench,
  hammer: Hammer,
  map: MapPin,
}

export default function Services({ showHeading = true }) {
  const { t } = useTranslation()
  const services = t("services.items")

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {showHeading && (
          <SectionHeading
            title={t("services.sectionTitle")}
            subtitle={t("services.sectionSubtitle")}
          />
        )}

        <div className="grid gap-6 sm:grid-cols-2">
          {services.map((service, i) => {
            const Icon = iconMap[serviceIcons[i]]
            return (
              <article
                key={service.title}
                className="group relative overflow-hidden rounded-2xl border border-cream-200 bg-cream-50 p-6 transition hover:border-gold-500/30 hover:shadow-lg"
              >
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gold-500/5 transition group-hover:bg-gold-500/10" />
                <div className="relative">
                  <div className="mb-4 inline-flex rounded-xl bg-maroon-900 p-3 text-gold-400">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-maroon-900">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">{service.description}</p>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

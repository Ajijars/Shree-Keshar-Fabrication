import { Link } from "react-router-dom"
import { Truck, Wrench, Hammer, MapPin, ArrowRight } from "lucide-react"
import { useTranslation, serviceIcons } from "../i18n/LanguageContext"

const iconMap = {
  chariot: Truck,
  wrench: Wrench,
  hammer: Hammer,
  map: MapPin,
}

export default function HomeServicesPreview() {
  const { t } = useTranslation()
  const services = t("services.items")

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="font-devanagari text-sm font-medium text-saffron-500">
              {t("home.servicesAccent")}
            </p>
            <h2 className="font-display mt-1 text-3xl font-bold text-maroon-900">
              {t("home.servicesTitle")}
            </h2>
            <p className="mt-2 max-w-lg text-gray-600">{t("home.servicesSubtitle")}</p>
          </div>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 rounded-full border border-maroon-800/20 px-5 py-2.5 text-sm font-semibold text-maroon-800 transition hover:border-maroon-800 hover:bg-maroon-800 hover:text-white"
          >
            {t("common.allServices")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, i) => {
            const Icon = iconMap[serviceIcons[i]]
            return (
              <article
                key={service.title}
                className="rounded-2xl border border-cream-200 bg-cream-50 p-5 transition hover:border-gold-500/30 hover:shadow-md"
              >
                <div className="mb-3 inline-flex rounded-lg bg-maroon-900 p-2.5 text-gold-400">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-base font-semibold text-maroon-900">
                  {service.title}
                </h3>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

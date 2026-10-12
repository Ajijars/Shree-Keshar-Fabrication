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

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, i) => {
            const Icon = iconMap[serviceIcons[i]] || Wrench
            return (
              <Link
                key={service.title}
                to="/services"
                className="pro-card group relative flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs transition-all duration-300 hover:border-amber-400 hover:shadow-lg"
              >
                <div>
                  <div className="mb-4 inline-flex rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/80 p-3.5 text-amber-800 border border-amber-200/50 shadow-2xs transition-all duration-300 group-hover:bg-amber-500 group-hover:text-slate-950 group-hover:scale-110">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-slate-900 group-hover:text-amber-800 transition">
                    {service.title}
                  </h3>
                  {service.description && (
                    <p className="font-devanagari mt-2.5 text-xs text-slate-500 line-clamp-3 leading-relaxed">
                      {service.description}
                    </p>
                  )}
                </div>

                <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-amber-700 transition group-hover:text-amber-600">
                  <span>{t("common.readMore")}</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}


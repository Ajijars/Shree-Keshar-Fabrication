import { Truck, Wrench, Hammer, MapPin, IndianRupee } from "lucide-react"
import { useTranslation, serviceIcons } from "../i18n/LanguageContext"
import { useAdminData } from "../admin/AdminContext"
import SectionHeading from "./SectionHeading"

const iconMap = {
  chariot: Truck,
  wrench: Wrench,
  hammer: Hammer,
  map: MapPin,
}

export default function Services({ showHeading = true }) {
  const { t, lang } = useTranslation()
  const adminData = useAdminData()
  const services = adminData.services || []

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
            const Icon = iconMap[serviceIcons[i]] || Wrench
            const title = lang === "mr" ? (service.titleMr || service.titleEn) : (service.titleEn || service.titleMr)
            const desc = lang === "mr" ? (service.descMr || service.descEn) : (service.descEn || service.descMr)

            return (
              <article
                key={service.id || title}
                className="group relative overflow-hidden rounded-2xl border border-cream-200 bg-cream-50 transition hover:border-gold-500/30 hover:shadow-lg"
              >
                {service.image ? (
                  <div className="aspect-video w-full overflow-hidden border-b border-cream-200">
                    <img
                      src={service.image}
                      alt={title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gold-500/5 transition group-hover:bg-gold-500/10" />
                )}
                
                <div className="relative p-6">
                  {!service.image && (
                    <div className="mb-4 inline-flex rounded-xl bg-maroon-900 p-3 text-gold-400">
                      <Icon className="h-6 w-6" />
                    </div>
                  )}
                  <h3 className="font-display text-xl font-semibold text-maroon-900">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">{desc}</p>
                  
                  {service.price && (
                    <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-green-50 px-4 py-1.5 text-sm font-semibold text-green-700">
                      <IndianRupee className="h-4 w-4" />
                      {service.price}
                      {service.priceNote && (
                        <span className="ml-1 text-xs font-normal text-green-600">
                          ({service.priceNote})
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

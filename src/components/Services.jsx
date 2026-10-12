import { Link } from "react-router-dom"
import { Truck, Wrench, Hammer, MapPin, IndianRupee, MessageSquareQuote } from "lucide-react"
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
  const isMr = lang === "mr"

  return (
    <section className="bg-gradient-to-b from-white via-amber-50/20 to-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {showHeading && (
          <SectionHeading
            title={t("services.sectionTitle")}
            subtitle={t("services.sectionSubtitle")}
          />
        )}

        <div className="grid gap-8 sm:grid-cols-2">
          {services.map((service, i) => {
            const Icon = iconMap[serviceIcons[i]] || Wrench
            const title = lang === "mr" ? (service.titleMr || service.titleEn) : (service.titleEn || service.titleMr)
            const desc = lang === "mr" ? (service.descMr || service.descEn) : (service.descEn || service.descMr)

            return (
              <article
                key={service.id || title}
                className="pro-card group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xs transition-all duration-300 hover:border-amber-400 hover:shadow-xl"
              >
                <div>
                  {service.image ? (
                    <div className="img-zoom-container aspect-video w-full overflow-hidden border-b border-slate-100 bg-slate-100">
                      <img
                        src={service.image}
                        alt={title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : null}
                  
                  <div className="p-7">
                    {!service.image && (
                      <div className="mb-5 inline-flex rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/80 p-3.5 text-amber-800 border border-amber-200/50 shadow-2xs group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all duration-300">
                        <Icon className="h-6 w-6" />
                      </div>
                    )}

                    <h3 className="font-display text-2xl font-bold text-slate-900 group-hover:text-amber-800 transition">
                      {title}
                    </h3>
                    <p className="font-devanagari mt-3 text-sm leading-relaxed text-slate-600">{desc}</p>
                    
                    {service.price && (
                      <div className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-4 py-1.5 text-xs sm:text-sm font-bold text-emerald-800 border border-emerald-200/60 shadow-2xs">
                        <IndianRupee className="h-4 w-4" />
                        <span>{service.price}</span>
                        {service.priceNote && (
                          <span className="text-xs font-normal text-emerald-700">
                            ({service.priceNote})
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-slate-100 p-5 bg-slate-50/50 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">
                    {isMr ? "कस्टम निर्मिती उपलब्ध" : "Custom Fabrication Available"}
                  </span>

                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 shadow-2xs transition"
                  >
                    <MessageSquareQuote className="h-3.5 w-3.5" />
                    <span>{isMr ? "चौकशी करा" : "Request Quote"}</span>
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}


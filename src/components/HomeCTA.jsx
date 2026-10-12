import { Link } from "react-router-dom"
import { Phone, Images, Users } from "lucide-react"
import { useTranslation } from "../i18n/LanguageContext"

export default function HomeCTA() {
  const { t } = useTranslation()

  const links = [
    {
      to: "/gallery",
      icon: Images,
      title: t("home.ctaGallery"),
      description: t("home.ctaGalleryDesc"),
    },
    {
      to: "/owners",
      icon: Users,
      title: t("home.ctaOwners"),
      description: t("home.ctaOwnersDesc"),
    },
    {
      to: "/contact",
      icon: Phone,
      title: t("home.ctaContact"),
      description: t("home.ctaContactDesc"),
    },
  ]

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/80 via-white to-amber-50/50 border-y border-amber-200/60 py-16 sm:py-20">
      <div className="pattern-overlay absolute inset-0 opacity-10" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <p className="font-devanagari text-sm font-semibold text-amber-700">{t("home.ctaDevotional")}</p>
          <h2 className="font-display mt-2 text-3xl font-bold text-slate-900">{t("home.ctaTitle")}</h2>
          <p className="font-devanagari mx-auto mt-3 max-w-lg text-slate-600">{t("home.ctaSubtitle")}</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {links.map(({ to, icon: Icon, title, description }) => (
            <Link
              key={to}
              to={to}
              className="pro-card group flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-7 shadow-xs transition-all duration-300 hover:border-amber-400 hover:shadow-xl"
            >
              <div>
                <div className="mb-5 inline-flex rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/90 p-3.5 text-amber-800 border border-amber-200/50 shadow-2xs transition-all duration-300 group-hover:bg-amber-500 group-hover:text-slate-950 group-hover:scale-110">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-bold text-slate-900 group-hover:text-amber-800 transition">{title}</h3>
                <p className="font-devanagari mt-2 text-sm text-slate-600 leading-relaxed">{description}</p>
              </div>

              <div className="mt-5 flex items-center gap-1 text-xs font-bold text-amber-700 group-hover:text-amber-600">
                <span>पहा / Explore</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

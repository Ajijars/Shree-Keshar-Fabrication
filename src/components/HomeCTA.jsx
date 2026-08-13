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
    <section className="relative overflow-hidden bg-maroon-950 py-16 sm:py-20">
      <div className="pattern-overlay absolute inset-0 opacity-20" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <p className="font-devanagari text-sm text-gold-400">{t("home.ctaDevotional")}</p>
          <h2 className="font-display mt-2 text-3xl font-bold text-white">{t("home.ctaTitle")}</h2>
          <p className="mx-auto mt-3 max-w-lg text-white/60">{t("home.ctaSubtitle")}</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          {links.map(({ to, icon: Icon, title, description }) => (
            <Link
              key={to}
              to={to}
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-gold-500/40 hover:bg-white/10"
            >
              <div className="mb-4 inline-flex rounded-xl bg-gold-500/15 p-3 text-gold-400 transition group-hover:bg-gold-500/25">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm text-white/60">{description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

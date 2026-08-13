import { Link } from "react-router-dom"
import { ChevronDown, Phone, MessageCircle } from "lucide-react"
import { siteData } from "../data/siteData"
import { useTranslation } from "../i18n/LanguageContext"

export default function Hero() {
  const { t } = useTranslation()

  return (
    <section className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={siteData.images.hero}
          alt="Shree Keshar Fabrication Works — illuminated Rath for Viththal Yatra"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-maroon-950/85 via-maroon-900/75 to-maroon-950/90" />
        <div className="pattern-overlay absolute inset-0 opacity-20" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-4 pb-20 pt-32 sm:px-6">
        <div className="animate-fade-up max-w-3xl">
          <p className="font-devanagari mb-3 text-base font-medium text-gold-400 sm:text-lg">
            {t("business.name")}
          </p>
          <h1 className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            {t("hero.tagline")}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
            {t("hero.subTagline")}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-saffron-500 px-7 py-3.5 text-sm font-semibold text-maroon-950 shadow-lg transition hover:bg-saffron-400 hover:shadow-xl"
            >
              <Phone className="h-4 w-4" />
              {t("hero.requestQuote")}
            </Link>
            <a
              href={`https://wa.me/${siteData.contact.whatsapp}?text=${encodeURIComponent(t("whatsapp.message"))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-gold-500/50 hover:bg-white/15"
            >
              <MessageCircle className="h-4 w-4" />
              {t("hero.whatsapp")}
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-6 border-t border-white/15 pt-8">
            {t("about.stats")
              .slice(0, 3)
              .map((stat) => (
                <div key={stat.label}>
                  <p className="font-display text-2xl font-bold text-gold-400">{stat.value}</p>
                  <p className="text-sm text-white/60">{stat.label}</p>
                </div>
              ))}
          </div>
        </div>

        <Link
          to="/about"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float text-white/50 transition hover:text-gold-400"
          aria-label={t("hero.learnAbout")}
        >
          <ChevronDown className="h-8 w-8" />
        </Link>
      </div>
    </section>
  )
}

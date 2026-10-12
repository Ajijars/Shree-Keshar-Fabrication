import { Link } from "react-router-dom"
import { ChevronDown, Phone, MessageCircle } from "lucide-react"
import { siteData } from "../data/siteData"
import { useTranslation } from "../i18n/LanguageContext"

export default function Hero() {
  const { t } = useTranslation()

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background with subtle overlay */}
      <div className="absolute inset-0">
        <img
          src={siteData.images.hero}
          alt="Shree Keshar Fabrication Works — illuminated Rath for Viththal Yatra"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/30 via-slate-950/20 to-slate-950/70" />
        <div className="pattern-overlay absolute inset-0 opacity-15" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-4 pb-20 pt-36 sm:px-6">
        <div className="animate-fade-up max-w-3xl rounded-3xl border border-white/20 bg-slate-950/45 p-6 backdrop-blur-md shadow-2xl sm:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-500/20 px-4 py-1.5 text-xs font-semibold text-amber-300">
            <span>✨</span>
            <span className="font-devanagari">{t("business.name")}</span>
          </div>
          
          <h1 className="font-display mt-4 text-3xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            {t("hero.tagline")}
          </h1>
          <p className="font-devanagari mt-4 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">
            {t("hero.subTagline")}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-7 py-3.5 text-sm font-semibold text-slate-950 shadow-lg transition hover:bg-amber-400 hover:shadow-xl hover:scale-102"
            >
              <Phone className="h-4 w-4" />
              {t("hero.requestQuote")}
            </Link>
            <a
              href={`https://wa.me/${siteData.contact.whatsapp}?text=${encodeURIComponent(t("whatsapp.message"))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-amber-400/60 hover:bg-white/25"
            >
              <MessageCircle className="h-4 w-4 text-emerald-400" />
              {t("hero.whatsapp")}
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-6 border-t border-white/20 pt-6">
            {t("about.stats")
              .slice(0, 3)
              .map((stat) => (
                <div key={stat.label}>
                  <p className="font-display text-2xl font-bold text-amber-400">{stat.value}</p>
                  <p className="font-devanagari text-xs text-white/75">{stat.label}</p>
                </div>
              ))}
          </div>
        </div>

        <Link
          to="/about"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-float text-white/60 transition hover:text-amber-400"
          aria-label={t("hero.learnAbout")}
        >
          <ChevronDown className="h-8 w-8" />
        </Link>
      </div>
    </section>
  )
}

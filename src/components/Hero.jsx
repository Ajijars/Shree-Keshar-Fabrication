import { Link } from "react-router-dom"
import { ChevronDown, Phone, MessageCircle, Calculator, ShieldCheck, Sparkles } from "lucide-react"
import { siteData } from "../data/siteData"
import { useTranslation } from "../i18n/LanguageContext"

export default function Hero() {
  const { t, lang } = useTranslation()

  return (
    <section className="relative min-h-[92vh] overflow-hidden flex items-center">
      {/* Background with cinematic lighting overlay */}
      <div className="absolute inset-0">
        <img
          src={siteData.images.hero}
          alt="Shree Keshar Fabrication Works — illuminated Rath for Viththal Yatra"
          className="h-full w-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/65 to-slate-950/40" />
        <div className="pattern-overlay absolute inset-0 opacity-15" />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col justify-center px-4 pb-16 pt-32 sm:px-6">
        <div className="animate-fade-up max-w-3xl rounded-3xl border border-white/20 bg-slate-950/50 p-6 backdrop-blur-xl shadow-2xl sm:p-10">
          <div className="shimmer-badge inline-flex items-center gap-2 rounded-full border border-amber-400/50 px-4 py-1.5 text-xs font-semibold text-amber-200">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span className="font-devanagari">{t("business.name")}</span>
            <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] text-amber-300">वारसा & गुणवत्ता</span>
          </div>
          
          <h1 className="font-display mt-4 text-3xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl drop-shadow-sm">
            {t("hero.tagline")}
          </h1>
          <p className="font-devanagari mt-4 max-w-xl text-base leading-relaxed text-slate-200 sm:text-lg">
            {t("hero.subTagline")}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            <Link
              to="/contact"
              className="btn-interactive inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-7 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 hover:shadow-amber-500/35"
            >
              <Phone className="h-4 w-4" />
              {t("hero.requestQuote")}
            </Link>

            <Link
              to="/services#estimator"
              className="btn-interactive inline-flex items-center gap-2 rounded-full border border-amber-400/60 bg-amber-500/15 px-6 py-3.5 text-sm font-semibold text-amber-300 backdrop-blur-sm hover:bg-amber-500/30 hover:border-amber-400"
            >
              <Calculator className="h-4 w-4 text-amber-400" />
              <span>{lang === "mr" ? "रथ खर्च अंदाजपत्रक" : "Rath Cost Estimator"}</span>
            </Link>

            <a
              href={`https://wa.me/${siteData.contact.whatsapp}?text=${encodeURIComponent(t("whatsapp.message"))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-interactive inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/20 hover:border-emerald-400/60"
            >
              <MessageCircle className="h-4 w-4 text-emerald-400" />
              {t("hero.whatsapp")}
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-6 border-t border-white/15 pt-6">
            <div className="flex flex-wrap gap-6 sm:gap-8">
              {t("about.stats")
                .slice(0, 3)
                .map((stat) => (
                  <div key={stat.label}>
                    <p className="font-display text-2xl font-bold text-amber-400 sm:text-3xl">{stat.value}</p>
                    <p className="font-devanagari text-xs text-slate-300">{stat.label}</p>
                  </div>
                ))}
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs text-amber-300/90 font-medium">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>{lang === "mr" ? "१००% मजबूत व विश्वासार्ह" : "100% Guaranteed Heavy Duty"}</span>
            </div>
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

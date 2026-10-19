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

      <div className="relative mx-auto flex w-full max-w-6xl flex-col justify-center px-4 pb-12 pt-24 sm:pb-16 sm:pt-32 sm:px-6">
        <div className="animate-fade-up max-w-3xl rounded-3xl border border-white/20 bg-slate-950/60 p-5 sm:p-10 backdrop-blur-xl shadow-2xl">
          {/* Badge */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="shimmer-badge inline-flex items-center gap-2 rounded-full border border-amber-400/50 px-3.5 py-1 text-xs font-semibold text-amber-200">
              <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
              <span className="font-devanagari">{t("business.name")}</span>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/20 px-2.5 py-0.5 text-[11px] font-bold text-amber-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              {lang === "mr" ? "वारी बुकींग सुरू" : "Yatra Bookings Open"}
            </span>
          </div>
          
          <h1 className="font-display mt-4 text-2xl font-black leading-tight text-white sm:text-4xl lg:text-5xl text-shadow-hero">
            {lang === "mr" ? (
              <>
                विठ्ठलाच्या दिव्य प्रवासासाठी{" "}
                <span className="text-gradient-gold block sm:inline">
                  पवित्र रथ निर्माण
                </span>
              </>
            ) : (
              <>
                Crafting Sacred Chariots For{" "}
                <span className="text-gradient-gold block sm:inline">
                  Lord Viththal Yatra
                </span>
              </>
            )}
          </h1>

          <p className="font-devanagari mt-3.5 max-w-xl text-sm leading-relaxed text-slate-200 sm:text-base sm:leading-relaxed">
            {t("hero.subTagline")}
          </p>

          {/* Action CTAs: Stack full-width on mobile, row on tablet/desktop */}
          <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3.5">
            <Link
              to="/contact"
              className="btn-interactive inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 active:scale-95"
            >
              <Phone className="h-4 w-4" />
              <span>{t("hero.requestQuote")}</span>
            </Link>

            <Link
              to="/services#estimator"
              className="btn-interactive inline-flex items-center justify-center gap-2 rounded-full border border-amber-400/60 bg-amber-500/20 px-5 py-3.5 text-sm font-bold text-amber-200 backdrop-blur-sm hover:bg-amber-500/30 hover:border-amber-400 active:scale-95"
            >
              <Calculator className="h-4 w-4 text-amber-400" />
              <span>{lang === "mr" ? "रथ खर्च अंदाजपत्रक" : "Rath Cost Estimator"}</span>
            </Link>

            <a
              href={`https://wa.me/${siteData.contact.whatsapp}?text=${encodeURIComponent(t("whatsapp.message"))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-interactive inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3.5 text-sm font-bold text-white backdrop-blur-sm hover:bg-white/20 hover:border-emerald-400/60 active:scale-95"
            >
              <MessageCircle className="h-4 w-4 text-emerald-400" />
              <span>{t("hero.whatsapp")}</span>
            </a>
          </div>

          {/* Clean 3-Column Stats Grid for Mobile & Desktop */}
          <div className="mt-6 border-t border-white/15 pt-5">
            <div className="grid grid-cols-3 divide-x divide-white/15 text-center sm:text-left">
              {t("about.stats")
                .slice(0, 3)
                .map((stat, idx) => (
                  <div key={stat.label} className={idx === 0 ? "pr-2" : idx === 1 ? "px-2" : "pl-2"}>
                    <p className="font-display text-xl font-black text-amber-400 sm:text-3xl leading-none">{stat.value}</p>
                    <p className="font-devanagari mt-1 text-[11px] sm:text-xs text-slate-300 font-medium leading-tight">{stat.label}</p>
                  </div>
                ))}
            </div>

            <div className="mt-4 flex items-center justify-center sm:justify-start gap-2 text-xs text-amber-300/90 font-semibold border-t border-white/10 pt-3">
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>{lang === "mr" ? "१००% मजबूत बांधणी • वेळेत डिलिव्हरी हमी" : "100% Guaranteed Heavy Duty • Timely Delivery"}</span>
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

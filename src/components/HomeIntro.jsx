import { Link } from "react-router-dom"
import { ArrowRight, CheckCircle2, Shield, Sparkles } from "lucide-react"
import { useTranslation } from "../i18n/LanguageContext"
import { useAdminData } from "../admin/AdminContext"
import ImagePlaceholder from "./ImagePlaceholder"

export default function HomeIntro() {
  const { t, lang } = useTranslation()
  const adminData = useAdminData()
  const paragraphs = t("about.paragraphs")
  const isMr = lang === "mr"

  const highlights = isMr
    ? [
        "दिंडी व पायी यात्रेसाठी खास डिझाइन",
        "१००% गॅल्व्हनाइज्ड व हाय-टेन्साइल स्टील",
        "कस्टम देव्हारा, छत्र व कोरीव काम",
        "वेळेत डिलिव्हरी व संपूर्ण महाराष्ट्रात वाहतूक",
      ]
    : [
        "Specially designed for Dindi & Payi Yatra",
        "100% Galvanized & High-Tensile Steel",
        "Custom Deoghar, Chhatra & Ornamental Art",
        "Punctual Delivery & Statewide Transport",
      ]

  return (
    <section className="relative bg-gradient-to-b from-white via-amber-50/20 to-white py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-3.5 py-1 text-xs font-bold text-amber-800">
              <Sparkles className="h-3.5 w-3.5 text-amber-600" />
              <span className="font-devanagari">{t("home.introAccent")}</span>
            </div>

            <h2 className="font-display mt-4 text-3xl font-extrabold text-slate-900 sm:text-4xl leading-tight">
              {t("home.introTitle")}
            </h2>

            <p className="mt-4 leading-relaxed text-slate-700 font-devanagari text-base sm:text-lg">
              {paragraphs[0]}
            </p>
            <p className="mt-3 leading-relaxed text-slate-600 font-devanagari text-sm sm:text-base">
              {t("home.introP2")}
            </p>

            {/* Key Craftsmanship Pillars */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {highlights.map((item) => (
                <div key={item} className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-800">
                  <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0" />
                  <span className="font-devanagari">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center gap-4">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-xs transition hover:bg-amber-600 hover:shadow-md"
              >
                <span>{t("common.readMore")}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to="/owners"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-700 hover:text-amber-800 underline-offset-4 hover:underline"
              >
                <span>{isMr ? "कारागीरांना भेटा" : "Meet The Craftsmen"}</span>
              </Link>
            </div>
          </div>

          <div className="relative">
            {/* Decorative Gold Glow Backdrop */}
            <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-amber-400/20 to-amber-200/40 blur-xl -z-10" />

            <div className="pro-card overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-3 shadow-lg">
              {adminData.shopImage ? (
                <img
                  src={adminData.shopImage}
                  alt="Workshop"
                  className="aspect-[4/3] w-full rounded-2xl object-cover"
                />
              ) : (
                <ImagePlaceholder
                  label={t("placeholders.shopLabel")}
                  sublabel={t("placeholders.shopSublabel")}
                  aspect="aspect-[4/3]"
                  variant="gold"
                />
              )}

              <div className="mt-3 flex items-center justify-between rounded-xl bg-amber-50/80 px-4 py-2.5 border border-amber-200/40">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-amber-700" />
                  <span className="font-devanagari text-xs font-bold text-slate-800">
                    {isMr ? "अखंड वारकरी परंपरा" : "Sacred Chariot Tradition"}
                  </span>
                </div>
                <span className="text-xs font-bold text-amber-700 font-display">२५+ YRS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


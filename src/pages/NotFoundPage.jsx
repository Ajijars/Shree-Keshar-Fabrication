import { Link } from "react-router-dom"
import { Home, Sparkles, PhoneCall, HelpCircle } from "lucide-react"
import { useTranslation } from "../i18n/LanguageContext"
import SEO from "../components/SEO"
import { siteData } from "../data/siteData"

export default function NotFoundPage() {
  const { lang } = useTranslation()
  const isMr = lang === "mr"

  return (
    <main className="min-h-[75vh] flex items-center justify-center py-16 px-4 bg-gradient-to-b from-amber-500/10 via-amber-400/5 to-white relative overflow-hidden">
      <SEO
        title={isMr ? "पृष्ठ आढळले नाही | ४०४" : "Page Not Found | 404"}
        description={isMr ? "हे पृष्ठ उपलब्ध नाही किंवा हलवले गेले आहे." : "The requested page was not found."}
        url="/404"
      />
      <div className="pattern-overlay absolute inset-0 opacity-10 pointer-events-none" />

      <div className="relative mx-auto max-w-xl w-full text-center">
        {/* Glow & Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/60 bg-amber-500/15 px-4 py-1.5 text-xs font-bold text-amber-900 shadow-2xs mb-6">
          <HelpCircle className="h-4 w-4 text-amber-700" />
          <span>४०४ / 404 Not Found</span>
        </div>

        {/* Big visual number */}
        <h1 className="font-display text-7xl sm:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 drop-shadow-xs">
          404
        </h1>

        <h2 className="font-display mt-4 text-2xl sm:text-3xl font-extrabold text-slate-900">
          {isMr ? "क्षमस्व! हे पृष्ठ आढळले नाही" : "Oops! Page Not Found"}
        </h2>

        <p className="font-devanagari mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-md mx-auto">
          {isMr
            ? "तुम्ही शोधत असलेले पान कदाचित काढले गेले आहे किंवा त्याचा पत्ता बदलला आहे. मुख्य पानावर जाण्यासाठी खालील बटणावर क्लिक करा."
            : "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable."}
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="pro-card inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-md hover:from-amber-400 hover:to-amber-500 hover:scale-102 transition"
          >
            <Home className="h-4 w-4" />
            <span>{isMr ? "मुख्यपृष्ठावर जा" : "Back to Home"}</span>
          </Link>

          <Link
            to="/services"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border border-amber-300 bg-white/90 px-6 py-3.5 text-sm font-bold text-slate-800 shadow-xs hover:bg-amber-50 hover:border-amber-400 transition"
          >
            <Sparkles className="h-4 w-4 text-amber-600" />
            <span>{isMr ? "आमच्या सेवा" : "Our Services"}</span>
          </Link>

          <a
            href={`https://wa.me/${siteData.contact.whatsapp}?text=${encodeURIComponent(
              isMr ? "नमस्कार, मला श्री केशर फॅब्रिकेशनबद्दल माहिती हवी आहे." : "Hello, I would like information about Shree Keshar Fabrication."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border border-emerald-300 bg-emerald-50 px-6 py-3.5 text-sm font-bold text-emerald-800 shadow-xs hover:bg-emerald-100 transition"
          >
            <PhoneCall className="h-4 w-4 text-emerald-600" />
            <span>{isMr ? "WhatsApp मदत" : "WhatsApp Help"}</span>
          </a>
        </div>
      </div>
    </main>
  )
}

import { Sparkles, Award, ShieldCheck, HeartHandshake, Truck, MapPin } from "lucide-react"
import { useTranslation } from "../i18n/LanguageContext"

export default function TrustTicker() {
  const { lang } = useTranslation()
  const isMr = lang === "mr"

  const tickerItems = isMr
    ? [
        { icon: Sparkles, text: "जय जय राम कृष्ण हरी" },
        { icon: Award, text: "२५+ वर्षांची अखंड वारकरी रथ परंपरा" },
        { icon: Truck, text: "पंढरपूर, आळंदी, देहू, त्र्यंबकेश्वर वारी विशेष रथ" },
        { icon: ShieldCheck, text: "१००% हाय-टेन्साइल स्टील व अँटी-रस्ट वेल्डिंग" },
        { icon: HeartHandshake, text: "आधुनिक हायड्रॉलिक सिस्टीम व ऑटो-लाइटिंग" },
        { icon: MapPin, text: "नाशिक • मुंबई • पुणे • कोल्हापूर • सोलापूर • अहिल्यानगर" },
      ]
    : [
        { icon: Sparkles, text: "Jai Jai Ram Krushna Hari" },
        { icon: Award, text: "25+ Years Of Sacred Rath Craftsmanship" },
        { icon: Truck, text: "Pandharpur, Alandi, Dehu & Trimbakeshwar Yatra Rath" },
        { icon: ShieldCheck, text: "100% High-Tensile Steel & Anti-Rust Engineering" },
        { icon: HeartHandshake, text: "Hydraulic Lifting & Custom Audio-Visual Fitting" },
        { icon: MapPin, text: "Nashik • Mumbai • Pune • Kolhapur • Solapur • Statewide" },
      ]

  return (
    <div className="relative overflow-hidden border-y border-amber-300/80 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 py-2.5 sm:py-3 text-slate-950 shadow-xs">
      <div className="flex w-max animate-ticker items-center gap-6 sm:gap-8 whitespace-nowrap will-change-transform hover:[animation-play-state:paused] active:[animation-play-state:paused]">
        {/* Track 1 */}
        <div className="flex items-center gap-6 sm:gap-8">
          {tickerItems.map((item, idx) => {
            const Icon = item.icon
            return (
              <div key={`track1-${idx}`} className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-950/15 text-slate-950 shadow-2xs">
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <span className="font-devanagari text-xs sm:text-sm font-bold tracking-wide text-slate-950">
                  {item.text}
                </span>
                <span className="text-amber-900/40 font-black ml-2">•</span>
              </div>
            )
          })}
        </div>

        {/* Track 2 (Seamless loop duplicate) */}
        <div className="flex items-center gap-6 sm:gap-8" aria-hidden="true">
          {tickerItems.map((item, idx) => {
            const Icon = item.icon
            return (
              <div key={`track2-${idx}`} className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-950/15 text-slate-950 shadow-2xs">
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <span className="font-devanagari text-xs sm:text-sm font-bold tracking-wide text-slate-950">
                  {item.text}
                </span>
                <span className="text-amber-900/40 font-black ml-2">•</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

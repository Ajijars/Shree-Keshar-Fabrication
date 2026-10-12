import { useTranslation } from "../i18n/LanguageContext"

export default function TrustTicker() {
  const { lang } = useTranslation()

  const itemsMr = [
    "🚩 पंढरपूर वारी विशेष रथ",
    "✦ नाशिक, मुंबई, पुणे, कोल्हापूर सेवा",
    "✨ २५+ वर्षांचा समृद्ध वारसा",
    "🛡️ १००% मजबूत गॅल्व्हनाइज्ड स्टील",
    "🏆 ५०+ हून अधिक भव्य रथ निर्मिती",
    "🙏 जय जय राम कृष्ण हरी",
    "⚙️ आधुनिक हायड्रॉलिक व ऑटो लाईटिंग सोय",
    "📍 अहिल्यानगर, सातारा, सांगली, सोलापूर",
  ]

  const itemsEn = [
    "🚩 Pandharpur Wari Chariot Specialists",
    "✦ Serving Nashik, Mumbai, Pune, Kolhapur",
    "✨ 25+ Years Of Trusted Craftsmanship",
    "🛡️ Heavy-Duty Galvanized Engineering",
    "🏆 50+ Majestic Raths Built",
    "🙏 Devotion In Every Weld",
    "⚙️ Modern Hydraulic & Illumination Setup",
    "📍 Statewide Service Across Maharashtra",
  ]

  const items = lang === "mr" ? itemsMr : itemsEn

  return (
    <div className="relative overflow-hidden border-y border-amber-200/70 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-amber-500/10 py-3 backdrop-blur-xs">
      <div className="flex w-max animate-marquee items-center gap-8 whitespace-nowrap">
        {items.concat(items).map((text, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 font-devanagari text-xs sm:text-sm font-semibold tracking-wide text-slate-800"
          >
            <span className="text-amber-600">{text}</span>
            <span className="text-slate-300">|</span>
          </span>
        ))}
      </div>
    </div>
  )
}

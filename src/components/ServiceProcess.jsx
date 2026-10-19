import { MessageSquare, PenTool, Hammer, Truck, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react"
import { useTranslation } from "../i18n/LanguageContext"
import SectionHeading from "./SectionHeading"

const icons = [MessageSquare, PenTool, Hammer, Truck]

export default function ServiceProcess() {
  const { t, lang } = useTranslation()
  const isMr = lang === "mr"
  const steps = t("services.process")

  const guarantees = [
    {
      titleMr: "१००% ग्रेड-A स्टील चेसिस",
      titleEn: "100% Grade-A Steel Chassis",
      descMr: "उच्च क्षमतेचे बळकट पाइप्स व चॅनेल्स जे शेकडो किलोमीटर वारी सहन करतात.",
      descEn: "High-tensile structural steel built to endure hundreds of kilometers of Yatra.",
    },
    {
      titleMr: "हायड्रोलिक ब्रेक सुरक्षा",
      titleEn: "Hydraulic Disc Brake Safety",
      descMr: "गर्दीत व घाटात संपूर्ण नियंत्रण ठेवणारी अत्याधुनिक ब्रेकिंग सिस्टीम.",
      descEn: "Precision hydraulic brakes ensuring absolute control on crowded slopes.",
    },
    {
      titleMr: "वेदरप्रूफ ऑटोमोटिव्ह पेंट",
      titleEn: "Weatherproof PU Paint",
      descMr: "पावसाळा व कडक उन्हातही चमक टिकवून ठेवणारे अँटी-रस्ट कोटिंग.",
      descEn: "Anti-rust primer and UV-resistant PU automotive enamel coat.",
    },
    {
      titleMr: "वेळेत डिलिव्हरी व पूजा",
      titleEn: "On-Time Delivery & Puja",
      descMr: "यात्रेच्या मुहूर्तापूर्वी संपूर्ण महाराष्ट्रात प्रत्यक्ष जागेवर पोहोचवणे.",
      descEn: "Guaranteed delivery at your mandal or temple before the sacred Yatra date.",
    },
  ]

  return (
    <section className="bg-cream-50 py-16 sm:py-24 border-t border-amber-200/50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          title={t("services.processTitle")}
          subtitle={t("services.processSubtitle")}
        />

        {/* 4 Steps Grid with Step Indicators */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 relative mt-12">
          {steps.map((step, index) => {
            const Icon = icons[index]
            const delayClass = `delay-${(index + 1) * 150}`
            return (
              <article
                key={step.title}
                className={`pro-card card-shine reveal-on-scroll ${delayClass} relative rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs hover:border-amber-400 hover:shadow-xl transition-all group`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-display flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition">
                    0{index + 1}
                  </span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-700 transition group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-slate-950">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                <h3 className="font-display text-base sm:text-lg font-bold text-slate-900 group-hover:text-amber-800 transition">
                  {step.title}
                </h3>
                <p className="font-devanagari mt-2.5 text-xs sm:text-sm leading-relaxed text-slate-600">
                  {step.description}
                </p>

                <div className="mt-4 flex items-center gap-1.5 text-[11px] font-semibold text-amber-700">
                  <Sparkles className="h-3 w-3" />
                  <span>
                    {index === 0
                      ? (isMr ? "विनामूल्य सल्ला" : "Free Consultation")
                      : index === 1
                      ? (isMr ? "अचूक रेखाटन" : "Precision Blueprint")
                      : index === 2
                      ? (isMr ? "हस्तनिर्मित काम" : "Master Crafting")
                      : (isMr ? "सुरक्षित वितरण" : "Inspected Delivery")}
                  </span>
                </div>
              </article>
            )
          })}
        </div>

        {/* Quality Standards & Guarantee Section */}
        <div className="mt-16 rounded-3xl border border-amber-300/80 bg-gradient-to-br from-amber-50/90 via-white to-amber-100/50 p-6 sm:p-10 shadow-md">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/60 bg-amber-100 px-3.5 py-1 text-xs font-bold text-amber-900">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>{isMr ? "श्री केशर गुणवत्ता हमी (Craftsmanship Guarantee)" : "Craftsmanship Quality Guarantee"}</span>
            </div>
            <h3 className="font-display mt-3 text-xl sm:text-2xl font-bold text-slate-900">
              {isMr ? "प्रत्येक रथात परंपरेसोबत आधुनिक अभियांत्रिकी" : "Tradition Meets Precision Engineering"}
            </h3>
            <p className="font-devanagari mt-2 text-xs sm:text-sm text-slate-600">
              {isMr
                ? "आमच्या कार्यशाळेत तयार होणारा प्रत्येक रथ खालील ४ मुख्य तंत्रज्ञानावर आधारित असतो:"
                : "Every chariot crafted in our workshop adheres to these 4 engineering pillars:"}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {guarantees.map((g, i) => (
              <div
                key={i}
                className="rounded-2xl border border-amber-200/70 bg-white/90 p-4 shadow-2xs hover:border-amber-400 transition"
              >
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span className="font-display text-slate-900">{isMr ? g.titleMr : g.titleEn}</span>
                </div>
                <p className="font-devanagari mt-1.5 text-xs text-slate-600 leading-relaxed">
                  {isMr ? g.descMr : g.descEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

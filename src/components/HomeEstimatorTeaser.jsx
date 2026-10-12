import { Link } from "react-router-dom"
import { Calculator, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react"
import { useTranslation } from "../i18n/LanguageContext"

export default function HomeEstimatorTeaser() {
  const { lang } = useTranslation()

  const isMr = lang === "mr"

  const features = isMr
    ? ["आकार व लांबीनुसार खर्च", "४ किंवा ६ चाकी पर्याय", "साऊंड व लाईटिंग सोय", "झटपट WhatsApp कोटेशन"]
    : ["Custom Size & Dimensions", "4 or 6 Heavy Duty Wheels", "Integrated Light & Sound", "Instant WhatsApp Quote"]

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-amber-600/10 py-12 sm:py-16 border-y border-amber-200/80">
      <div className="pattern-overlay absolute inset-0 opacity-15" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="glass-panel relative rounded-3xl border border-amber-300/70 p-8 shadow-xl lg:flex lg:items-center lg:justify-between lg:p-12">
          
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/60 bg-amber-500/15 px-3.5 py-1 text-xs font-bold text-amber-800">
              <Sparkles className="h-3.5 w-3.5 text-amber-600" />
              <span>{isMr ? "नवीन सोय: ऑनलाइन कॅल्क्युलेटर" : "New Feature: Online Estimator"}</span>
            </div>

            <h2 className="font-display mt-4 text-2xl font-extrabold text-slate-900 sm:text-3xl lg:text-4xl">
              {isMr
                ? "तुमच्या रथाचा अंदाजे खर्च काही सेकंदात मोजा!"
                : "Estimate Your Custom Rath Project Cost In Seconds"}
            </h2>

            <p className="font-devanagari mt-3 text-base text-slate-600 leading-relaxed">
              {isMr
                ? "मंदिर, दिंडी किंवा पायी यात्रेसाठी रथाचा प्रकार, चाके, छत आणि रोषणाई निवडून अचूक व पारदर्शक खर्च अंदाज मिळवा."
                : "Select chariot type, wheel configuration, roof dome, and illumination to get an instant itemized estimate tailored for your temple or mandal."}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:gap-4">
              {features.map((feat) => (
                <div key={feat} className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700">
                  <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 shrink-0 lg:mt-0">
            <Link
              to="/services#estimator"
              className="pro-card inline-flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-4 text-base font-bold text-slate-950 shadow-lg hover:from-amber-400 hover:to-amber-500 sm:w-auto"
            >
              <Calculator className="h-5 w-5" />
              <span>{isMr ? "अंदाजपत्रक सुरू करा" : "Launch Estimator"}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  )
}

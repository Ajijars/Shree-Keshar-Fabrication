import { MessageSquare, PenTool, Hammer, Truck } from "lucide-react"
import { useTranslation } from "../i18n/LanguageContext"
import SectionHeading from "./SectionHeading"

const icons = [MessageSquare, PenTool, Hammer, Truck]

export default function ServiceProcess() {
  const { t } = useTranslation()
  const steps = t("services.process")

  return (
    <section className="bg-cream-50 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          title={t("services.processTitle")}
          subtitle={t("services.processSubtitle")}
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = icons[index]
            return (
              <article
                key={step.title}
                className="relative rounded-2xl border border-cream-200 bg-white p-6"
              >
                <span className="font-display absolute -top-3 left-5 rounded-full bg-maroon-900 px-3 py-0.5 text-xs font-bold text-gold-400">
                  {index + 1}
                </span>
                <div className="mb-4 mt-2 inline-flex rounded-xl bg-saffron-500/15 p-3 text-saffron-500">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-semibold text-maroon-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{step.description}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

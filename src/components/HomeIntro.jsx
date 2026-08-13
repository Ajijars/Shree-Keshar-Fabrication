import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { useTranslation } from "../i18n/LanguageContext"
import ImagePlaceholder from "./ImagePlaceholder"

export default function HomeIntro() {
  const { t } = useTranslation()
  const paragraphs = t("about.paragraphs")

  return (
    <section className="bg-cream-50 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="font-devanagari text-sm font-medium text-saffron-500">
              {t("home.introAccent")}
            </p>
            <h2 className="font-display mt-2 text-3xl font-bold text-maroon-900 sm:text-4xl">
              {t("home.introTitle")}
            </h2>
            <p className="mt-4 leading-relaxed text-gray-700">{paragraphs[0]}</p>
            <p className="mt-4 leading-relaxed text-gray-600">{t("home.introP2")}</p>
            <Link
              to="/about"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-maroon-800 transition hover:text-saffron-500"
            >
              {t("common.readMore")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <ImagePlaceholder
            label={t("placeholders.shopLabel")}
            sublabel={t("placeholders.shopSublabel")}
            aspect="aspect-[4/3]"
            variant="gold"
          />
        </div>
      </div>
    </section>
  )
}

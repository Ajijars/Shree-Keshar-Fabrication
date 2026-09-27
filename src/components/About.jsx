import { useTranslation } from "../i18n/LanguageContext"
import { useAdminData } from "../admin/AdminContext"
import SectionHeading from "./SectionHeading"
import ImagePlaceholder from "./ImagePlaceholder"

export default function About({ showHeading = true }) {
  const { t } = useTranslation()
  const adminData = useAdminData()
  const paragraphs = t("about.paragraphs")
  const stats = t("about.stats")

  return (
    <section className="bg-cream-50 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {showHeading && (
          <SectionHeading
            title={t("about.sectionTitle")}
            subtitle={t("about.sectionSubtitle")}
          />
        )}

        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-5">
            {paragraphs.map((p, i) => (
              <p key={i} className="leading-relaxed text-gray-700">
                {p}
              </p>
            ))}

            <div className="grid grid-cols-2 gap-4 pt-4 sm:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-gold-500/20 bg-white p-4 text-center shadow-sm"
                >
                  <p className="font-display text-2xl font-bold text-maroon-800">{stat.value}</p>
                  <p className="mt-1 text-xs text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {adminData.shopImage ? (
              <img
                src={adminData.shopImage}
                alt="Workshop"
                className="aspect-[4/3] w-full rounded-2xl object-cover shadow-sm"
              />
            ) : (
              <ImagePlaceholder
                label={t("placeholders.shopLabel")}
                sublabel={t("placeholders.shopSublabel")}
                aspect="aspect-[4/3]"
                variant="gold"
              />
            )}
            <div className="rounded-xl border border-maroon-800/10 bg-maroon-900 p-5 text-white">
              <p className="font-devanagari text-sm text-gold-400">{t("about.devotional")}</p>
              <p className="mt-2 text-sm leading-relaxed text-white/80">
                {t("about.devotionalText")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

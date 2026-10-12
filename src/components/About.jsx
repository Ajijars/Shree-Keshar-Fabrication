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
    <section className="bg-gradient-to-b from-white via-amber-50/20 to-white py-20 sm:py-28">
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
              <p key={i} className="font-devanagari text-base leading-relaxed text-slate-700">
                {p}
              </p>
            ))}

            <div className="grid grid-cols-2 gap-4 pt-6 sm:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="pro-card rounded-2xl border border-slate-200/90 bg-white p-5 text-center shadow-xs transition-all duration-300 hover:border-amber-400 hover:shadow-md"
                >
                  <p className="font-display text-3xl font-extrabold text-amber-700">{stat.value}</p>
                  <p className="font-devanagari mt-1.5 text-xs font-semibold text-slate-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5">
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
            </div>

            <div className="rounded-3xl border border-amber-300/80 bg-gradient-to-br from-amber-50 via-amber-100/40 to-amber-50 p-7 shadow-xs">
              <p className="font-devanagari text-base font-bold text-amber-900">✨ {t("about.devotional")}</p>
              <p className="font-devanagari mt-2.5 text-sm leading-relaxed text-slate-700">
                {t("about.devotionalText")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

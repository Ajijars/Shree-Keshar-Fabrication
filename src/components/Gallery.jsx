import { siteData } from "../data/siteData"
import { useTranslation } from "../i18n/LanguageContext"
import SectionHeading from "./SectionHeading"
import SiteImage from "./SiteImage"

export default function Gallery({ showHeading = true }) {
  const { t } = useTranslation()
  const items = t("gallery.items")

  return (
    <section className="bg-cream-100 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {showHeading && (
          <SectionHeading
            title={t("gallery.sectionTitle")}
            subtitle={t("gallery.sectionSubtitle")}
          />
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <figure key={index} className="group overflow-hidden rounded-2xl shadow-md">
              <SiteImage
                src={siteData.images.gallery[index]}
                alt={item.alt}
                label={item.caption}
                sublabel={item.alt}
                aspect="aspect-[4/3]"
                variant={index % 2 === 0 ? "default" : "gold"}
              />
              <figcaption className="bg-maroon-900 px-4 py-3 text-sm font-medium text-gold-400">
                {item.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

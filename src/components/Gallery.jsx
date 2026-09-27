import { siteData } from "../data/siteData"
import { useTranslation } from "../i18n/LanguageContext"
import { useAdminData } from "../admin/AdminContext"
import SectionHeading from "./SectionHeading"
import SiteImage from "./SiteImage"

export default function Gallery({ showHeading = true }) {
  const { t, lang } = useTranslation()
  const adminData = useAdminData()
  const translationItems = t("gallery.items")

  // Merge: admin gallery photos + static siteData photos
  const adminPhotos = adminData.gallery || []
  const staticPhotos = siteData.images.gallery || []

  // Build combined gallery items
  const allItems = []

  // First add admin-uploaded photos
  adminPhotos.forEach((photo) => {
    allItems.push({
      src: photo.src,
      caption: lang === "mr" ? photo.captionMr : photo.captionEn,
      alt: lang === "mr" ? (photo.altMr || photo.captionMr) : (photo.altEn || photo.captionEn),
      isAdmin: true,
    })
  })

  // Then add static gallery photos from siteData
  staticPhotos.forEach((src, index) => {
    if (src) {
      const item = translationItems[index] || { caption: "Rath Work", alt: "Rath fabrication" }
      allItems.push({
        src,
        caption: item.caption,
        alt: item.alt,
        isAdmin: false,
      })
    }
  })

  return (
    <section className="bg-cream-100 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {showHeading && (
          <SectionHeading
            title={t("gallery.sectionTitle")}
            subtitle={t("gallery.sectionSubtitle")}
          />
        )}

        {allItems.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-gray-400">{lang === "mr" ? "लवकरच फोटो जोडले जातील" : "Photos coming soon"}</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {allItems.map((item, index) => (
              <figure key={`${item.src}-${index}`} className="group overflow-hidden rounded-2xl shadow-md">
                <SiteImage
                  src={item.src}
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
        )}
      </div>
    </section>
  )
}

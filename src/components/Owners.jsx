import { Phone } from "lucide-react"
import { siteData } from "../data/siteData"
import { useTranslation } from "../i18n/LanguageContext"
import { useAdminData } from "../admin/AdminContext"
import SectionHeading from "./SectionHeading"
import SiteImage from "./SiteImage"

export default function Owners({ showHeading = true }) {
  const { t, tReplace, lang } = useTranslation()
  const adminData = useAdminData()
  const translationOwners = t("owners.items")

  return (
    <section className="bg-cream-50 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {showHeading && (
          <SectionHeading
            title={t("owners.sectionTitle")}
            subtitle={t("owners.sectionSubtitle")}
          />
        )}

        <div className="grid gap-8 md:grid-cols-2">
          {translationOwners.map((owner, index) => {
            const key = siteData.ownerKeys[index]
            const staticOwner = siteData.owners[key]
            const adminOwner = adminData.owners?.[key] || {}

            // Admin data overrides static/translation data
            const displayName = lang === "mr"
              ? (adminOwner.nameMr || owner.name)
              : (adminOwner.nameEn || owner.name)
            const displayRole = lang === "mr"
              ? (adminOwner.roleMr || owner.role)
              : (adminOwner.roleEn || owner.role)
            const displayBio = lang === "mr"
              ? (adminOwner.bioMr || owner.bio)
              : (adminOwner.bioEn || owner.bio)
            const displayPhone = adminOwner.phone || staticOwner?.phone
            const displayImage = adminOwner.image || staticOwner?.image

            return (
              <article
                key={displayName}
                className="overflow-hidden rounded-2xl border border-cream-200 bg-white shadow-sm transition hover:shadow-lg"
              >
                <SiteImage
                  src={displayImage}
                  alt={displayName}
                  label={displayName}
                  sublabel={tReplace("placeholders.ownerPhoto", { name: displayName })}
                  aspect="aspect-[5/4]"
                  variant="gold"
                  className="rounded-none rounded-t-2xl"
                  imgClassName="object-cover object-top"
                />
                <div className="p-6">
                  <h3 className="font-display text-2xl font-bold text-maroon-900">{displayName}</h3>
                  <p className="mt-1 text-sm font-medium text-saffron-500">{displayRole}</p>
                  {displayPhone && (
                    <a
                      href={`tel:${displayPhone.replace(/\s/g, "")}`}
                      className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-maroon-800 hover:text-saffron-500"
                    >
                      <Phone className="h-4 w-4" />
                      {displayPhone}
                    </a>
                  )}
                  <p className="mt-4 text-sm leading-relaxed text-gray-600">{displayBio}</p>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

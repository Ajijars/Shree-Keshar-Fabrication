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
                className="pro-card group overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xs transition-all duration-300 hover:border-amber-400 hover:shadow-xl"
              >
                <div className="img-zoom-container">
                  <SiteImage
                    src={displayImage}
                    alt={displayName}
                    label={displayName}
                    sublabel={tReplace("placeholders.ownerPhoto", { name: displayName })}
                    aspect="aspect-[5/4]"
                    variant="gold"
                    className="rounded-none rounded-t-3xl"
                    imgClassName="object-cover object-top"
                  />
                </div>
                <div className="p-7">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display text-2xl font-bold text-slate-900 group-hover:text-amber-800 transition">
                        {displayName}
                      </h3>
                      <p className="mt-1 inline-block rounded-full bg-amber-50 px-3 py-0.5 text-xs font-bold text-amber-800 border border-amber-200/50">
                        {displayRole}
                      </p>
                    </div>
                  </div>

                  <p className="font-devanagari mt-4 text-sm leading-relaxed text-slate-600">{displayBio}</p>

                  {displayPhone && (
                    <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-100 pt-5">
                      <a
                        href={`tel:${displayPhone.replace(/\s/g, "")}`}
                        className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-amber-600 transition"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        <span>{displayPhone}</span>
                      </a>
                      <a
                        href={`https://wa.me/91${displayPhone.replace(/\D/g, "")}?text=${encodeURIComponent(`नमस्कार ${displayName}, मला रथ / फॅब्रिकेशन कामाबद्दल बोलायचे आहे.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition"
                      >
                        <span>WhatsApp वर संपर्क</span>
                      </a>
                    </div>
                  )}
                </div>
              </article>
            )
          })}
        </div>

      </div>
    </section>
  )
}

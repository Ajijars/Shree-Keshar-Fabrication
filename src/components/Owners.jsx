import { Phone } from "lucide-react"
import { siteData } from "../data/siteData"
import { useTranslation } from "../i18n/LanguageContext"
import SectionHeading from "./SectionHeading"
import SiteImage from "./SiteImage"

export default function Owners({ showHeading = true }) {
  const { t, tReplace } = useTranslation()
  const owners = t("owners.items")

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
          {owners.map((owner, index) => {
            const key = siteData.ownerKeys[index]
            const ownerData = siteData.owners[key]

            return (
              <article
                key={owner.name}
                className="overflow-hidden rounded-2xl border border-cream-200 bg-white shadow-sm transition hover:shadow-lg"
              >
                <SiteImage
                  src={ownerData?.image}
                  alt={owner.name}
                  label={owner.name}
                  sublabel={tReplace("placeholders.ownerPhoto", { name: owner.name })}
                  aspect="aspect-[5/4]"
                  variant="gold"
                  className="rounded-none rounded-t-2xl"
                  imgClassName="object-cover object-top"
                />
                <div className="p-6">
                  <h3 className="font-display text-2xl font-bold text-maroon-900">{owner.name}</h3>
                  <p className="mt-1 text-sm font-medium text-saffron-500">{owner.role}</p>
                  {ownerData?.phone && (
                    <a
                      href={`tel:${ownerData.phone.replace(/\s/g, "")}`}
                      className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-maroon-800 hover:text-saffron-500"
                    >
                      <Phone className="h-4 w-4" />
                      {ownerData.phone}
                    </a>
                  )}
                  <p className="mt-4 text-sm leading-relaxed text-gray-600">{owner.bio}</p>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

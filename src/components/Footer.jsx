import { Link } from "react-router-dom"
import { Phone, Mail, MapPin, Share2 } from "lucide-react"
import { siteData } from "../data/siteData"
import { useTranslation, navRoutes } from "../i18n/LanguageContext"

export default function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <footer className="bg-maroon-950 text-white">
      <div className="pattern-overlay border-t border-gold-500/20">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-500/50 bg-gold-500/10">
                  <span className="font-display font-bold text-gold-400">SK</span>
                </div>
                <div>
                  <p className="font-display font-semibold">{t("business.shortName")}</p>
                  <p className="text-xs text-gold-400/80">{t("business.tagline")}</p>
                </div>
              </div>
              <p className="font-devanagari mt-4 text-sm text-white/60">{t("business.name")}</p>
              <p className="mt-3 text-sm leading-relaxed text-white/50">{t("footer.tagline")}</p>
            </div>

            <div>
              <h4 className="font-display font-semibold text-gold-400">{t("footer.quickLinks")}</h4>
              <ul className="mt-4 space-y-2">
                {navRoutes.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-sm text-white/60 transition hover:text-gold-400">
                      {t(link.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-display font-semibold text-gold-400">{t("footer.contact")}</h4>
              <ul className="mt-4 space-y-3 text-sm text-white/60">
                <li className="flex items-start gap-2">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                  <span>{siteData.owners.harsh.phone}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                  <span>{siteData.contact.email}</span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                  <span>{siteData.contact.address}</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-display font-semibold text-gold-400">{t("footer.followUs")}</h4>
              <div className="mt-4 flex flex-wrap gap-3">
                {[
                  { href: siteData.social.facebook, label: "Facebook", short: "f" },
                  { href: siteData.social.instagram, label: "Instagram", short: "ig" },
                  { href: siteData.social.youtube, label: "YouTube", short: "yt" },
                ].map(({ href, label, short }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    title={label}
                    className="flex h-10 min-w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 px-3 text-xs font-semibold uppercase text-white/70 transition hover:border-gold-500/40 hover:text-gold-400"
                  >
                    {short}
                  </a>
                ))}
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/30">
                  <Share2 className="h-4 w-4" />
                </span>
              </div>
              <p className="font-devanagari mt-6 text-sm text-white/40">{t("footer.devotional")}</p>
            </div>
          </div>

          <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-white/40">
            <p>
              © {year} {t("business.name")}. {t("footer.copyright")}
            </p>
            <p className="mt-1">{t("footer.ownersLine")}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

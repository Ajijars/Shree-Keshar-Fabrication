import { Link } from "react-router-dom"
import { Phone, Mail, MapPin } from "lucide-react"
import { siteData } from "../data/siteData"
import { useTranslation, navRoutes } from "../i18n/LanguageContext"
import { useAdminData } from "../admin/AdminContext"

export default function Footer() {
  const { t } = useTranslation()
  const adminData = useAdminData()
  const year = new Date().getFullYear()

  // Use admin data with siteData fallbacks
  const phone1 = adminData.owners?.prabhakar?.phone || siteData.owners.prabhakar.phone
  const phone2 = adminData.owners?.harsh?.phone || siteData.owners.harsh.phone
  const email = adminData.contact?.email || siteData.contact.email
  const address = adminData.contact?.address || siteData.contact.address
  const social = {
    facebook: adminData.social?.facebook || siteData.social.facebook,
    instagram: adminData.social?.instagram || siteData.social.instagram,
    youtube: adminData.social?.youtube || siteData.social.youtube,
  }

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
                  <span>{phone2}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                  <span>{email}</span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                  <span>{address}</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-display font-semibold text-gold-400">{t("footer.followUs")}</h4>
              <div className="mt-4 flex flex-wrap gap-3">
                {/* Facebook */}
                <a
                  href={social.facebook}
                  aria-label="Facebook"
                  title="Facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 transition hover:border-[#1877F2]/60 hover:bg-[#1877F2]/10 hover:text-[#1877F2]"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z"/></svg>
                </a>

                {/* Instagram */}
                <a
                  href={social.instagram}
                  aria-label="Instagram"
                  title="Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 transition hover:border-[#E4405F]/60 hover:bg-[#E4405F]/10 hover:text-[#E4405F]"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069ZM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z"/></svg>
                </a>

                {/* YouTube */}
                <a
                  href={social.youtube}
                  aria-label="YouTube"
                  title="YouTube"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 transition hover:border-[#FF0000]/60 hover:bg-[#FF0000]/10 hover:text-[#FF0000]"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.546 12 3.546 12 3.546s-7.505 0-9.377.504A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.504 9.376.504 9.376.504s7.505 0 9.377-.504a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z"/></svg>
                </a>
              </div>
              <p className="font-devanagari mt-6 text-sm text-white/40">{t("footer.devotional")}</p>
            </div>
          </div>

          <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-white/40">
            <p>
              © {year} {t("business.name")}. {t("footer.copyright")}
            </p>
            <p className="mt-1">{t("footer.ownersLine")}</p>
            <a
              href="/admin"
              className="mt-3 inline-block rounded-full border border-white/10 px-4 py-1.5 text-[10px] text-white/25 transition hover:border-gold-500/30 hover:text-gold-400"
            >
              🔐 Admin
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

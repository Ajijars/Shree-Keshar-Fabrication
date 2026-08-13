import { useState, useEffect } from "react"
import { Link, NavLink, useLocation } from "react-router-dom"
import { Menu, X, Phone } from "lucide-react"
import { useTranslation, navRoutes } from "../i18n/LanguageContext"
import LanguageSwitcher from "./LanguageSwitcher"

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const { t } = useTranslation()
  const isHome = pathname === "/"

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const solidNav = !isHome || scrolled

  const linkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition ${
      isActive
        ? "bg-white/15 text-gold-400"
        : "text-white/85 hover:bg-white/10 hover:text-gold-400"
    }`

  const mobileLinkClass = ({ isActive }) =>
    `block rounded-lg px-3 py-3 text-sm font-medium transition ${
      isActive ? "bg-white/10 text-gold-400" : "text-white/90 hover:bg-white/10"
    }`

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solidNav ? "bg-maroon-950/95 shadow-lg backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="group flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-500/50 bg-gold-500/10 transition group-hover:bg-gold-500/20">
            <span className="font-display text-lg font-bold text-gold-400">SK</span>
          </div>
          <div className="hidden sm:block">
            <p className="font-display text-sm font-semibold leading-tight text-white">
              {t("business.shortName")}
            </p>
            <p className="text-xs text-gold-400/80">{t("business.tagline")}</p>
          </div>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {navRoutes.map((link) => (
            <li key={link.path}>
              <NavLink to={link.path} end={link.path === "/"} className={linkClass}>
                {t(link.key)}
              </NavLink>
            </li>
          ))}
          <li>
            <LanguageSwitcher />
          </li>
          <li>
            <Link
              to="/contact"
              className="ml-1 inline-flex items-center gap-2 rounded-full bg-saffron-500 px-5 py-2 text-sm font-semibold text-maroon-950 transition hover:bg-saffron-400"
            >
              <Phone className="h-4 w-4" />
              {t("nav.getQuote")}
            </Link>
          </li>
        </ul>

        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitcher compact />
          <button
            type="button"
            className="rounded-lg p-2 text-white"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-white/10 bg-maroon-950/98 px-4 py-4 lg:hidden">
          <ul className="flex flex-col gap-1">
            {navRoutes.map((link) => (
              <li key={link.path}>
                <NavLink to={link.path} end={link.path === "/"} className={mobileLinkClass}>
                  {t(link.key)}
                </NavLink>
              </li>
            ))}
            <li>
              <Link
                to="/contact"
                className="mt-2 block rounded-full bg-saffron-500 px-5 py-3 text-center text-sm font-semibold text-maroon-950"
              >
                {t("nav.getQuote")}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}

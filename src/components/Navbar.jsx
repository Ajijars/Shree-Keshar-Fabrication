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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const linkClass = ({ isActive }) =>
    `rounded-xl px-3.5 py-2 text-sm font-medium transition ${
      isActive
        ? "bg-amber-50/90 text-amber-800 font-semibold shadow-2xs border border-amber-200/50"
        : "text-slate-700 hover:bg-slate-100/80 hover:text-amber-700"
    }`

  const mobileLinkClass = ({ isActive }) =>
    `block rounded-xl px-4 py-3 text-sm font-medium transition ${
      isActive ? "bg-amber-50 text-amber-800 font-semibold border border-amber-200/40" : "text-slate-700 hover:bg-slate-100"
    }`

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/98 shadow-md border-b border-slate-200/90 backdrop-blur-md"
          : "bg-white/95 shadow-xs border-b border-slate-200/80 backdrop-blur-md"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="group flex items-center gap-3">
          <img
            src="/images/logo.png"
            alt={t("business.shortName")}
            className="h-11 w-11 rounded-full object-cover border-2 border-amber-500/70 shadow-xs transition group-hover:scale-105 group-hover:border-amber-600 bg-white"
            onError={(e) => {
              e.currentTarget.style.display = "none"
              if (e.currentTarget.nextSibling) e.currentTarget.nextSibling.style.display = "flex"
            }}
          />
          <div className="hidden h-11 w-11 items-center justify-center rounded-full border-2 border-amber-500/60 bg-gradient-to-br from-amber-50 to-amber-100/60 shadow-xs">
            <span className="font-display text-lg font-bold text-amber-800">SK</span>
          </div>
          <div>
            <p className="font-display text-base font-bold leading-tight text-slate-900 group-hover:text-amber-800 transition">
              {t("business.shortName")}
            </p>
            <p className="font-devanagari text-xs font-medium text-amber-700/90">{t("business.tagline")}</p>
          </div>
        </Link>

        <ul className="hidden items-center gap-1.5 lg:flex">
          {navRoutes.map((link) => (
            <li key={link.path}>
              <NavLink to={link.path} end={link.path === "/"} className={linkClass}>
                {t(link.key)}
              </NavLink>
            </li>
          ))}
          <li className="ml-2">
            <LanguageSwitcher />
          </li>
          <li className="ml-2">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2 text-sm font-bold text-slate-950 shadow-xs transition-all duration-300 hover:from-amber-400 hover:to-amber-500 hover:shadow-md hover:scale-105"
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
            className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 transition"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-slate-200/80 bg-white/98 px-4 py-4 shadow-xl backdrop-blur-xl lg:hidden animate-fade-up">
          <ul className="flex flex-col gap-1.5">
            {navRoutes.map((link) => (
              <li key={link.path}>
                <NavLink to={link.path} end={link.path === "/"} className={mobileLinkClass}>
                  {t(link.key)}
                </NavLink>
              </li>
            ))}
            <li className="pt-2">
              <Link
                to="/contact"
                className="block rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-3 text-center text-sm font-bold text-slate-950 shadow-sm"
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

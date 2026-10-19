import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  Images,
  Wrench,
  Phone,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  ExternalLink,
  MoreHorizontal,
} from "lucide-react"
import { useState } from "react"
import { useAdmin } from "./AdminContext"

const navItems = [
  {
    to: "/admin",
    icon: LayoutDashboard,
    label: "डॅशबोर्ड",
    labelEn: "Dashboard",
    end: true,
  },
  {
    to: "/admin/gallery",
    icon: Images,
    label: "फोटो व्यवस्थापन",
    labelEn: "Photos",
  },
  {
    to: "/admin/services",
    icon: Wrench,
    label: "सेवा व किंमत",
    labelEn: "Services & Pricing",
  },
  {
    to: "/admin/owners",
    icon: Users,
    label: "मालक व कार्यशाळा",
    labelEn: "Owners & Workshop",
  },
  {
    to: "/admin/contact",
    icon: Phone,
    label: "संपर्क माहिती",
    labelEn: "Contact Info",
  },
  {
    to: "/admin/settings",
    icon: Settings,
    label: "सेटिंग्स",
    labelEn: "Settings",
  },
]

export default function AdminLayout() {
  const { logout } = useAdmin()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/admin")
  }

  // Get current section label for mobile header
  const currentNav = navItems.find((item) =>
    item.end ? location.pathname === item.to : location.pathname.startsWith(item.to)
  ) || navItems[0]

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
      isActive
        ? "bg-amber-500/15 text-amber-800 font-semibold border border-amber-300/40"
        : "text-gray-600 hover:bg-gray-100 hover:text-maroon-900"
    }`

  const mobileBottomLinkClass = ({ isActive }) =>
    `flex flex-col items-center justify-center rounded-xl py-1 px-2 text-[10px] font-bold transition active:scale-95 ${
      isActive
        ? "text-amber-700 font-extrabold"
        : "text-gray-500 hover:text-gray-800"
    }`

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-2xs lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-gray-200 bg-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <img
              src="/images/logo.png"
              alt="Shree Keshar Admin"
              className="h-10 w-10 rounded-full object-cover border border-amber-500/50 shadow-xs bg-white"
              onError={(e) => {
                e.currentTarget.style.display = "none"
                if (e.currentTarget.nextSibling) e.currentTarget.nextSibling.style.display = "flex"
              }}
            />
            <div className="hidden h-10 w-10 items-center justify-center rounded-full border border-gold-500/50 bg-maroon-900">
              <span className="font-display text-sm font-bold text-gold-400">SK</span>
            </div>
            <div>
              <p className="font-display text-sm font-bold text-maroon-900">श्री केशर फॅब्रिकेशन</p>
              <p className="font-devanagari text-[11px] text-amber-700 font-semibold">व्यवस्थापन पॅनेल (Admin)</p>
            </div>
          </div>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 p-1.5 text-gray-500 hover:bg-gray-200 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={linkClass}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="h-5 w-5 shrink-0 text-amber-700" />
              <div>
                <span className="font-devanagari">{item.label}</span>
                <span className="ml-1.5 text-xs text-gray-400 font-normal">({item.labelEn})</span>
              </div>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-100 p-4 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-between rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-semibold text-gray-700 transition hover:bg-amber-50 hover:border-amber-300 hover:text-amber-800"
          >
            <span className="flex items-center gap-2">
              <Home className="h-4 w-4 text-amber-600" />
              <span className="font-devanagari">वेबसाइट पहा (Live Site)</span>
            </span>
            <ExternalLink className="h-3.5 w-3.5 text-gray-400" />
          </a>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 rounded-xl border border-red-200 bg-red-50/60 px-4 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-100"
          >
            <LogOut className="h-4 w-4" />
            <span className="font-devanagari">बाहेर पडा (Logout)</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Mobile Sticky Top Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white/95 px-4 py-3 backdrop-blur-md lg:hidden shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-700 active:scale-95"
              aria-label="Open sidebar menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0 truncate">
              <p className="font-devanagari text-sm font-bold text-gray-900 truncate">
                {currentNav.label}
              </p>
              <p className="text-[10px] text-amber-700 font-semibold truncate">
                श्री केशर Admin
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-xl border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-[11px] font-bold text-gray-700 hover:bg-amber-50 active:scale-95"
            >
              <Home className="h-3.5 w-3.5 text-amber-600" />
              <span>साईट</span>
            </a>
            <button
              type="button"
              onClick={handleLogout}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600 active:scale-95"
              title="Logout"
              aria-label="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main
          className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8"
          style={{ paddingBottom: "max(5.5rem, calc(4.5rem + env(safe-area-inset-bottom)))" }}
        >
          <Outlet />
        </main>

        {/* Mobile Sticky Bottom Navigation Bar */}
        <nav
          className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 items-center border-t border-gray-200/90 bg-white/95 px-1 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] backdrop-blur-xl lg:hidden"
          style={{ paddingBottom: "max(0.35rem, env(safe-area-inset-bottom))" }}
          aria-label="Admin mobile quick navigation"
        >
          <NavLink to="/admin" end className={mobileBottomLinkClass}>
            <LayoutDashboard className="h-4 w-4" />
            <span className="font-devanagari mt-0.5">डॅशबोर्ड</span>
          </NavLink>

          <NavLink to="/admin/gallery" className={mobileBottomLinkClass}>
            <Images className="h-4 w-4" />
            <span className="font-devanagari mt-0.5">फोटो</span>
          </NavLink>

          <NavLink to="/admin/services" className={mobileBottomLinkClass}>
            <Wrench className="h-4 w-4" />
            <span className="font-devanagari mt-0.5">सेवा</span>
          </NavLink>

          <NavLink to="/admin/contact" className={mobileBottomLinkClass}>
            <Phone className="h-4 w-4" />
            <span className="font-devanagari mt-0.5">संपर्क</span>
          </NavLink>

          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="flex flex-col items-center justify-center rounded-xl py-1 px-2 text-[10px] font-bold text-gray-500 hover:text-gray-800 active:scale-95"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="font-devanagari mt-0.5">अधिक</span>
          </button>
        </nav>
      </div>
    </div>
  )
}

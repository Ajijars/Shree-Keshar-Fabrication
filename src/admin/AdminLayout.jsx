import { NavLink, Outlet, useNavigate } from "react-router-dom"
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
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/admin")
  }

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
      isActive
        ? "bg-saffron-500/15 text-saffron-500"
        : "text-gray-600 hover:bg-gray-100 hover:text-maroon-900"
    }`

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-gray-200 bg-white transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-500/50 bg-maroon-900">
              <span className="font-display text-sm font-bold text-gold-400">SK</span>
            </div>
            <div>
              <p className="font-display text-sm font-semibold text-maroon-900">Admin Panel</p>
              <p className="font-devanagari text-xs text-gray-400">व्यवस्थापन</p>
            </div>
          </div>
          <button
            type="button"
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={linkClass}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <div>
                <span className="font-devanagari">{item.label}</span>
                <span className="ml-1.5 text-xs text-gray-400">({item.labelEn})</span>
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
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-500 transition hover:bg-gray-100 hover:text-maroon-900"
          >
            <Home className="h-5 w-5" />
            <span className="font-devanagari">वेबसाइट पहा</span>
            <span className="text-xs text-gray-400">(View Site)</span>
          </a>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-500 transition hover:bg-red-50"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-devanagari">बाहेर पडा</span>
            <span className="text-xs text-gray-400">(Logout)</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-gray-200 bg-white/80 px-4 py-3 backdrop-blur-md sm:px-6 lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
          >
            <Menu className="h-5 w-5" />
          </button>
          <p className="font-display text-sm font-semibold text-maroon-900">
            श्री केशर — Admin
          </p>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

import { Link } from "react-router-dom"
import { Images, Wrench, Users, Phone, Settings, ArrowRight } from "lucide-react"
import { useAdmin } from "./AdminContext"

const quickLinks = [
  {
    to: "/admin/gallery",
    icon: Images,
    title: "फोटो व्यवस्थापन",
    titleEn: "Photo Management",
    desc: "रथाचे फोटो अपलोड करा, हटवा किंवा बदला",
    descEn: "Upload, delete or change rath photos",
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    to: "/admin/services",
    icon: Wrench,
    title: "सेवा व किंमत",
    titleEn: "Services & Pricing",
    desc: "सेवांची माहिती आणि किंमत अपडेट करा",
    descEn: "Update service details and pricing",
    color: "bg-emerald-500/10 text-emerald-600",
  },
  {
    to: "/admin/owners",
    icon: Users,
    title: "मालक व कार्यशाळा",
    titleEn: "Owners & Workshop",
    desc: "मालकांची माहिती, फोटो व कार्यशाळा फोटो बदला",
    descEn: "Update owner details, photos & workshop image",
    color: "bg-rose-500/10 text-rose-600",
  },
  {
    to: "/admin/contact",
    icon: Phone,
    title: "संपर्क माहिती",
    titleEn: "Contact Info",
    desc: "फोन नंबर, पत्ता, ईमेल बदला",
    descEn: "Change phone, address, email",
    color: "bg-purple-500/10 text-purple-600",
  },
  {
    to: "/admin/settings",
    icon: Settings,
    title: "सेटिंग्स",
    titleEn: "Settings",
    desc: "सोशल मीडिया लिंक्स व इतर सेटिंग्स",
    descEn: "Social media links & other settings",
    color: "bg-amber-500/10 text-amber-600",
  },
]

export default function AdminDashboard() {
  const { data } = useAdmin()

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="rounded-2xl border border-gold-500/20 bg-gradient-to-r from-maroon-900 to-maroon-800 p-6 text-white sm:p-8">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">
          🙏 नमस्कार!
        </h1>
        <p className="font-devanagari mt-2 text-white/80">
          श्री केशर फॅब्रिकेशन वर्क्स — वेबसाइट व्यवस्थापन पॅनेल
        </p>
        <p className="mt-1 text-sm text-white/60">
          Welcome to the admin panel. Manage your website content from here.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-3xl font-bold text-maroon-900">{data.gallery.length}</p>
          <p className="font-devanagari mt-1 text-sm text-gray-500">
            गॅलरी फोटो <span className="text-xs text-gray-400">(Gallery Photos)</span>
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-3xl font-bold text-maroon-900">{data.services.length}</p>
          <p className="font-devanagari mt-1 text-sm text-gray-500">
            सेवा <span className="text-xs text-gray-400">(Services)</span>
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-3xl font-bold text-maroon-900">2</p>
          <p className="font-devanagari mt-1 text-sm text-gray-500">
            मालक <span className="text-xs text-gray-400">(Owners)</span>
          </p>
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="font-devanagari mb-4 text-lg font-semibold text-gray-800">
          काय करायचे आहे? <span className="text-sm font-normal text-gray-400">(What to do?)</span>
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {quickLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="group flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-maroon-800/20 hover:shadow-md"
            >
              <div className={`rounded-xl p-3 ${link.color}`}>
                <link.icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-devanagari font-semibold text-gray-800">
                  {link.title}
                </h3>
                <p className="text-xs text-gray-400">{link.titleEn}</p>
                <p className="font-devanagari mt-1 text-sm text-gray-500">{link.desc}</p>
              </div>
              <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-gray-300 transition group-hover:text-maroon-800" />
            </Link>
          ))}
        </div>
      </div>

      {/* Help note */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <p className="font-devanagari text-sm font-medium text-amber-800">
          💡 मदत / Help
        </p>
        <p className="font-devanagari mt-2 text-sm text-amber-700">
          • फोटो अपलोड करण्यासाठी <strong>"फोटो व्यवस्थापन"</strong> वर जा
        </p>
        <p className="font-devanagari text-sm text-amber-700">
          • किंमत बदलण्यासाठी <strong>"सेवा व किंमत"</strong> वर जा
        </p>
        <p className="font-devanagari text-sm text-amber-700">
          • बदल लगेच वेबसाइटवर दिसतील
        </p>
        <p className="mt-2 text-xs text-amber-600">
          Changes appear on the website immediately after saving.
        </p>
      </div>
    </div>
  )
}

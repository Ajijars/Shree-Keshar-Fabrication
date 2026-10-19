import { Link } from "react-router-dom"
import { Phone, MessageCircle, Calculator, Image as ImageIcon } from "lucide-react"
import { siteData } from "../data/siteData"
import { useTranslation } from "../i18n/LanguageContext"
import { useAdminData } from "../admin/AdminContext"

export default function MobileQuickBar() {
  const { lang } = useTranslation()
  const adminData = useAdminData()
  const phone = adminData.contact?.phone || siteData.contact.phone
  const whatsapp = adminData.contact?.whatsapp || siteData.contact.whatsapp
  const isMr = lang === "mr"

  const whatsappMsg = encodeURIComponent(
    isMr
      ? "नमस्कार श्री केशर फॅब्रिकेशन, मला नवीन रथ / फॅब्रिकेशन कामाबद्दल माहिती हवी आहे."
      : "Hello Shree Keshar Fabrication, I would like to inquire about Rath / fabrication works."
  )

  return (
    <aside
      aria-label="Mobile quick actions"
      className="fixed inset-x-0 bottom-0 z-40 block border-t border-amber-300/60 bg-white/95 px-3 py-2 shadow-[0_-6px_25px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:hidden"
      style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
    >
      <div className="grid grid-cols-4 items-center gap-1.5 text-center">
        {/* Call Now */}
        <a
          href={`tel:${phone}`}
          className="group flex flex-col items-center justify-center rounded-xl py-1.5 text-slate-700 transition active:scale-95 active:bg-amber-100/60 hover:text-amber-800"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500 text-slate-950 shadow-xs transition-transform group-hover:scale-105">
            <Phone className="h-4 w-4" />
          </div>
          <span className="font-devanagari mt-1 text-[11px] font-bold text-slate-800">
            {isMr ? "कॉल करा" : "Call"}
          </span>
        </a>

        {/* WhatsApp Quote */}
        <a
          href={`https://wa.me/${whatsapp}?text=${whatsappMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center justify-center rounded-xl py-1.5 text-slate-700 transition active:scale-95 active:bg-emerald-50 hover:text-emerald-700"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xs transition-transform group-hover:scale-105">
            <MessageCircle className="h-4 w-4" />
          </div>
          <span className="font-devanagari mt-1 text-[11px] font-bold text-slate-800">
            WhatsApp
          </span>
        </a>

        {/* Cost Estimator */}
        <Link
          to="/services#estimator"
          className="group flex flex-col items-center justify-center rounded-xl py-1.5 text-slate-700 transition active:scale-95 active:bg-amber-50 hover:text-amber-700"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-amber-200 text-amber-800 border border-amber-300/80 shadow-2xs transition-transform group-hover:scale-105">
            <Calculator className="h-4 w-4" />
          </div>
          <span className="font-devanagari mt-1 text-[11px] font-bold text-slate-800">
            {isMr ? "अंदाजपत्रक" : "Estimator"}
          </span>
        </Link>

        {/* Gallery / Photos */}
        <Link
          to="/gallery"
          className="group flex flex-col items-center justify-center rounded-xl py-1.5 text-slate-700 transition active:scale-95 active:bg-slate-100 hover:text-slate-900"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs transition-transform group-hover:scale-105">
            <ImageIcon className="h-4 w-4" />
          </div>
          <span className="font-devanagari mt-1 text-[11px] font-bold text-slate-800">
            {isMr ? "कामे (फोटो)" : "Gallery"}
          </span>
        </Link>
      </div>
    </aside>
  )
}

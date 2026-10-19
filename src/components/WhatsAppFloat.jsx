import { MessageCircle } from "lucide-react"
import { siteData } from "../data/siteData"
import { useTranslation } from "../i18n/LanguageContext"
import { useAdminData } from "../admin/AdminContext"

export default function WhatsAppFloat() {
  const { t, lang } = useTranslation()
  const adminData = useAdminData()
  const whatsapp = adminData.contact?.whatsapp || siteData.contact.whatsapp
  const message = encodeURIComponent(t("whatsapp.message"))
  const isMr = lang === "mr"

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 group flex items-center">
      {/* Floating Tooltip Banner */}
      <div className="hidden sm:flex items-center gap-2 mr-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 pointer-events-none">
        <span className="rounded-full bg-slate-900/95 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xl border border-slate-700/60 backdrop-blur-md">
          {isMr ? "💬 काही प्रश्न आहेत? WhatsApp करा" : "💬 Have questions? Chat on WhatsApp"}
        </span>
      </div>

      <a
        href={`https://wa.me/${whatsapp}?text=${message}`}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 hover:shadow-2xl"
        aria-label={t("whatsapp.ariaLabel")}
      >
        {/* Pulsing Beacon Ring */}
        <span className="absolute -inset-1 animate-ping rounded-full bg-[#25D366] opacity-35" />
        <MessageCircle className="relative h-6 w-6 sm:h-7 sm:w-7" />
      </a>
    </div>
  )
}


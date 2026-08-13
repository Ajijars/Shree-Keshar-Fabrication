import { MessageCircle } from "lucide-react"
import { siteData } from "../data/siteData"
import { useTranslation } from "../i18n/LanguageContext"

export default function WhatsAppFloat() {
  const { t } = useTranslation()
  const message = encodeURIComponent(t("whatsapp.message"))

  return (
    <a
      href={`https://wa.me/${siteData.contact.whatsapp}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-110 hover:shadow-xl"
      aria-label={t("whatsapp.ariaLabel")}
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  )
}

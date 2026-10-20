import PageBanner from "../components/PageBanner"
import ContactForm from "../components/ContactForm"
import { useTranslation } from "../i18n/LanguageContext"
import SEO from "../components/SEO"
import { useAdminData } from "../admin/AdminContext"
import { siteData } from "../data/siteData"
import { MapPin, Navigation, ExternalLink, Phone, MessageCircle } from "lucide-react"

export default function ContactPage() {
  const { t, lang } = useTranslation()
  const adminData = useAdminData()

  const phone = adminData.contact?.phone || adminData.contact?.phone1 || siteData.contact.phone
  const whatsapp = adminData.contact?.whatsapp || siteData.contact.whatsapp
  const address = adminData.contact?.address || siteData.contact.address
  const mapLink = adminData.contact?.mapLink || siteData.contact.mapLink
  const mapUrl =
    mapLink && mapLink !== "#" && (mapLink.startsWith("http://") || mapLink.startsWith("https://"))
      ? mapLink
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Shree Keshar Fabrication Works, " + (address || "Maharashtra"))}`
  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent("Shree Keshar Fabrication Works " + (address || "Maharashtra"))}&t=&z=14&ie=UTF8&iwloc=&output=embed`

  const isMr = lang === "mr"

  return (
    <main>
      <SEO title={t("contact.pageTitle")} url="/contact" />
      <PageBanner title={t("contact.pageTitle")} subtitle={t("contact.pageSubtitle")} />
      
      {/* Contact Form & Info */}
      <ContactForm showHeading={false} />

      {/* Interactive Google Map & Location Section */}
      <section className="bg-slate-50 py-14 sm:py-20 border-t border-slate-200/80">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/80 bg-amber-50 px-3.5 py-1 text-xs font-bold text-amber-800 shadow-2xs">
                <MapPin className="h-3.5 w-3.5 text-amber-600" />
                <span>{isMr ? "थेट वर्कशॉपला भेट द्या" : "Visit Our Workshop"}</span>
              </div>
              <h2 className="font-display mt-2 text-2xl sm:text-3xl font-bold text-slate-900">
                {isMr ? "Google Maps वर आमचे स्थान व मार्ग" : "Find Us on Google Maps"}
              </h2>
              <p className="mt-1 text-sm text-slate-600 max-w-xl">
                📍 <strong className="text-slate-800">{address}</strong>
                <span className="block text-xs text-slate-500 mt-0.5">
                  {isMr ? "पुणे, आळंदी, पंढरपूर मार्ग व संपूर्ण महाराष्ट्र ऑन-साइट सेवा" : "Serving Pune, Alandi, Pandharpur route & all Maharashtra on-site"}
                </span>
              </p>
            </div>

            {/* Direct Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-interactive inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3 text-sm font-bold text-slate-950 shadow-md hover:from-amber-400 hover:to-amber-500 transition-all hover:scale-105 active:scale-95"
                title="Google Maps वर दिशानिर्देश मिळवा (Get Directions)"
              >
                <Navigation className="h-4 w-4" />
                <span>{isMr ? "Google Maps वर उघडा" : "Open in Google Maps"}</span>
                <ExternalLink className="h-3.5 w-3.5 opacity-80" />
              </a>

              <a
                href={`tel:${phone.replace(/\s+/g, "")}`}
                className="btn-interactive inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-800 shadow-xs hover:bg-slate-100 transition-all"
                title="फोनवर संपर्क करा"
              >
                <Phone className="h-4 w-4 text-amber-600" />
                <span>{phone}</span>
              </a>

              <a
                href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(
                  isMr
                    ? "नमस्कार श्री केशर फॅब्रिकेशन, मला तुमच्या वर्कशॉपचा पत्ता व भेट देण्याबद्दल माहिती हवी आहे."
                    : "Hello Shree Keshar Fabrication, I would like directions to your workshop."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-interactive inline-flex items-center justify-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-5 py-3 text-sm font-bold text-emerald-800 shadow-xs hover:bg-emerald-100 transition-all"
                title="WhatsApp वर लोकेशन मागा"
              >
                <MessageCircle className="h-4 w-4 text-emerald-600" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Map Frame Card */}
          <div className="overflow-hidden rounded-3xl border-2 border-amber-300/80 bg-white shadow-xl">
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-5 py-3 text-white flex items-center justify-between text-xs sm:text-sm font-bold">
              <span className="flex items-center gap-2">
                <span>🛕</span>
                <span>श्री केशर फॅब्रिकेशन वर्क्स — अधिकृत वर्कशॉप</span>
              </span>
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-amber-200 transition"
              >
                {isMr ? "पूर्ण नकाशा पहा ↗" : "View Larger Map ↗"}
              </a>
            </div>
            <iframe
              title="Google Maps Location - Shree Keshar Fabrication Works"
              src={embedUrl}
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
            />
          </div>
        </div>
      </section>
    </main>
  )
}

import { useState, useEffect } from "react"
import { Maximize2, X, Sparkles, Image as ImageIcon } from "lucide-react"
import { siteData } from "../data/siteData"
import { useTranslation } from "../i18n/LanguageContext"
import { useAdminData } from "../admin/AdminContext"
import SectionHeading from "./SectionHeading"
import SiteImage from "./SiteImage"

export default function Gallery({ showHeading = true }) {
  const { t, lang } = useTranslation()
  const adminData = useAdminData()
  const translationItems = t("gallery.items")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedImage, setSelectedImage] = useState(null)

  // Close lightbox on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setSelectedImage(null)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Merge: admin gallery photos + static siteData photos
  const adminPhotos = adminData.gallery || []
  const staticPhotos = siteData.images.gallery || []

  // Build combined gallery items with categories
  const allItems = []

  adminPhotos.forEach((photo, i) => {
    allItems.push({
      src: photo.src,
      caption: lang === "mr" ? photo.captionMr : photo.captionEn,
      alt: lang === "mr" ? (photo.altMr || photo.captionMr) : (photo.altEn || photo.captionEn),
      category: photo.category || (i % 2 === 0 ? "rath" : "fabrication"),
      isAdmin: true,
    })
  })

  staticPhotos.forEach((src, index) => {
    if (src) {
      const item = translationItems[index] || { caption: "Rath Work", alt: "Rath fabrication" }
      allItems.push({
        src,
        caption: item.caption,
        alt: item.alt,
        category: index < 2 ? "rath" : index === 2 ? "yatra" : "fabrication",
        isAdmin: false,
      })
    }
  })

  const isMr = lang === "mr"
  const tabs = [
    { id: "all", label: isMr ? "सर्व फोटो" : "All Photos" },
    { id: "rath", label: isMr ? "भव्य रथ निर्मिती" : "Grand Raths" },
    { id: "fabrication", label: isMr ? "मेटल फॅब्रिकेशन" : "Fabrication" },
    { id: "yatra", label: isMr ? "दिंडी व पायी यात्रा" : "Dindi & Yatra" },
  ]

  const filteredItems = activeTab === "all"
    ? allItems
    : allItems.filter((item) => item.category === activeTab || item.category === "all")

  return (
    <section className="bg-gradient-to-b from-white via-amber-50/20 to-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {showHeading && (
          <SectionHeading
            title={t("gallery.sectionTitle")}
            subtitle={t("gallery.sectionSubtitle")}
          />
        )}

        {/* Filter Tabs */}
        <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full px-5 py-2 text-xs sm:text-sm font-bold transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-amber-500 text-slate-950 shadow-md scale-105"
                  : "bg-white text-slate-700 border border-slate-200/90 hover:border-amber-400 hover:text-amber-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {filteredItems.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-slate-400">{isMr ? "या प्रकारात लवकरच फोटो जोडले जातील" : "Photos coming soon"}</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item, index) => (
              <figure
                key={`${item.src}-${index}`}
                onClick={() => setSelectedImage(item)}
                className="pro-card group cursor-pointer overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xs transition-all duration-300 hover:border-amber-400 hover:shadow-xl"
              >
                <div className="relative overflow-hidden">
                  <SiteImage
                    src={item.src}
                    alt={item.alt}
                    label={item.caption}
                    sublabel={item.alt}
                    aspect="aspect-[4/3]"
                    variant={index % 2 === 0 ? "default" : "gold"}
                  />
                  {/* Subtle hover overlay with inspect icon */}
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 opacity-0 backdrop-blur-2xs transition-opacity duration-300 group-hover:opacity-100">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-4 py-2 text-xs font-bold text-slate-950 shadow-lg backdrop-blur-md">
                      <Maximize2 className="h-3.5 w-3.5 text-amber-600" />
                      <span>{isMr ? "मोठा फोटो पहा" : "View Fullscreen"}</span>
                    </span>
                  </div>
                </div>

                <figcaption className="flex items-center justify-between border-t border-slate-100 px-5 py-3.5 bg-white">
                  <span className="font-devanagari text-sm font-semibold text-slate-800 group-hover:text-amber-800 transition">
                    {item.caption}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
                    {item.category === "rath" ? "रथ" : item.category === "yatra" ? "यात्रा" : "क्राफ्ट"}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        )}

        {/* Lightbox Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-md"
            onClick={() => setSelectedImage(null)}
          >
            <div
              className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="absolute right-4 top-4 z-10 rounded-full bg-slate-950/70 p-2.5 text-white/90 hover:bg-slate-950 hover:text-white transition"
                aria-label="Close modal"
              >
                <X className="h-6 w-6" />
              </button>

              <div className="max-h-[75vh] overflow-hidden bg-black flex items-center justify-center">
                <img
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  className="max-h-[75vh] w-auto object-contain"
                />
              </div>

              <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
                <div>
                  <h3 className="font-devanagari text-base font-bold text-amber-400">
                    {selectedImage.caption}
                  </h3>
                  <p className="font-devanagari text-xs text-slate-400 mt-0.5">
                    {selectedImage.alt}
                  </p>
                </div>

                <a
                  href={`https://wa.me/${siteData.contact.whatsapp}?text=${encodeURIComponent(`मला या फोटोमधील कामाबद्दल माहिती हवी आहे: ${selectedImage.caption}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition"
                >
                  {isMr ? "या कामाबाबत विचारा" : "Inquire About This"}
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}


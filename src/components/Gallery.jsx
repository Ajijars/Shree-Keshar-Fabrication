import { useState, useEffect, useCallback } from "react"
import { Maximize2, X, ChevronLeft, ChevronRight } from "lucide-react"
import { useTranslation } from "../i18n/LanguageContext"
import { useAdminData } from "../admin/AdminContext"
import { siteData } from "../data/siteData"
import SectionHeading from "./SectionHeading"
import SiteImage from "./SiteImage"
import { DEFAULT_GALLERY_PHOTOS } from "../data/defaultGallery"

export default function Gallery({ showHeading = true }) {
  const { lang, t } = useTranslation()
  const adminData = useAdminData()
  const [activeTab, setActiveTab] = useState("all")
  const [selectedImage, setSelectedImage] = useState(null)

  // Admin gallery photos with robust fallback to all 16 workshop default photos
  const rawAdminPhotos = adminData?.gallery || []
  const adminPhotos = rawAdminPhotos.filter((p) => p && p.src && !p.src.includes("test.png"))

  let sourcePhotos = []
  if (adminPhotos.length >= 16) {
    sourcePhotos = adminPhotos
  } else if (adminPhotos.length > 0) {
    const customSet = new Set(adminPhotos.map((p) => p.src))
    const missingDefaults = DEFAULT_GALLERY_PHOTOS.filter((dp) => !customSet.has(dp.src))
    sourcePhotos = [...adminPhotos, ...missingDefaults]
  } else {
    sourcePhotos = DEFAULT_GALLERY_PHOTOS
  }

  // Build gallery items with bilingual captions and categories
  const allItems = sourcePhotos.map((photo, i) => ({
    src: photo.src,
    caption: lang === "mr" ? (photo.captionMr || photo.caption) : (photo.captionEn || photo.caption),
    alt:
      lang === "mr"
        ? (photo.altMr || photo.captionMr || photo.alt || "श्री केशर फॅब्रिकेशन")
        : (photo.altEn || photo.captionEn || photo.alt || "Shree Keshar Fabrication"),
    category: photo.category || (i % 2 === 0 ? "rath" : "fabrication"),
    isAdmin: Boolean(photo.id && !photo.id.startsWith("default-")),
  }))

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

  // Index of currently viewed photo in filteredItems
  const selectedIndex = selectedImage
    ? filteredItems.findIndex((it) => it.src === selectedImage.src)
    : -1

  const handlePrev = useCallback(() => {
    if (filteredItems.length === 0) return
    const nextIdx = selectedIndex > 0 ? selectedIndex - 1 : filteredItems.length - 1
    setSelectedImage(filteredItems[nextIdx])
  }, [filteredItems, selectedIndex])

  const handleNext = useCallback(() => {
    if (filteredItems.length === 0) return
    const nextIdx = selectedIndex < filteredItems.length - 1 ? selectedIndex + 1 : 0
    setSelectedImage(filteredItems[nextIdx])
  }, [filteredItems, selectedIndex])

  // Keyboard navigation for lightbox: Escape, ArrowLeft, ArrowRight
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedImage) return
      if (e.key === "Escape") setSelectedImage(null)
      else if (e.key === "ArrowLeft") handlePrev()
      else if (e.key === "ArrowRight") handleNext()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedImage, handlePrev, handleNext])

  return (
    <section className="bg-gradient-to-b from-white via-amber-50/20 to-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {showHeading && (
          <SectionHeading
            title={t("gallery.sectionTitle")}
            subtitle={t("gallery.sectionSubtitle")}
          />
        )}

        {/* Filter Tabs - Swipeable horizontally on mobile, centered wrap on desktop */}
        <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar sm:flex-wrap sm:justify-center reveal-on-scroll">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`btn-interactive shrink-0 rounded-full px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold transition-all duration-300 ${
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
          <div className="py-16 text-center reveal-zoom">
            <p className="text-slate-400">{isMr ? "या प्रकारात लवकरच फोटो जोडले जातील" : "Photos coming soon"}</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item, index) => {
              const delayClass = `delay-${((index % 6) + 1) * 100}`
              return (
                <figure
                  key={`${item.src}-${index}`}
                  onClick={() => setSelectedImage(item)}
                  className={`pro-card card-shine reveal-on-scroll ${delayClass} group cursor-pointer overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white shadow-xs hover:border-amber-400 hover:shadow-2xl active:scale-[0.98] transition-transform`}
                >
                  <div className="relative overflow-hidden img-zoom-container">
                    <SiteImage
                      src={item.src}
                      alt={item.alt}
                      label={item.caption}
                      sublabel={item.alt}
                      aspect="aspect-[4/3]"
                      variant={index % 2 === 0 ? "default" : "gold"}
                    />
                    {/* Hover & Mobile Tap Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 opacity-0 backdrop-blur-2xs transition-all duration-300 group-hover:opacity-100">
                      <span className="btn-interactive inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-bold text-slate-950 shadow-xl backdrop-blur-md">
                        <Maximize2 className="h-3.5 w-3.5 text-amber-600" />
                        <span>{isMr ? "मोठा फोटो पहा" : "View Fullscreen"}</span>
                      </span>
                    </div>

                    {/* Mobile quick tap hint pill */}
                    <div className="sm:hidden absolute top-2.5 right-2.5 rounded-full bg-slate-950/60 p-1.5 text-white/80 backdrop-blur-xs">
                      <Maximize2 className="h-3.5 w-3.5" />
                    </div>
                  </div>

                  <figcaption className="flex items-center justify-between border-t border-slate-100 px-4 py-3 sm:px-5 sm:py-3.5 bg-white">
                    <span className="font-devanagari text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-amber-800 transition truncate pr-2">
                      {item.caption}
                    </span>
                    <span className="shrink-0 text-[10px] uppercase font-bold tracking-wider text-amber-600 bg-amber-50 px-2.5 py-0.5 sm:py-1 rounded-full border border-amber-200/60">
                      {item.category === "rath" ? "रथ" : item.category === "yatra" ? "यात्रा" : "क्राफ्ट"}
                    </span>
                  </figcaption>
                </figure>
              )
            })}
          </div>
        )}

        {/* Lightbox Modal with Next/Prev and Photo Counter */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/92 p-3 sm:p-6 backdrop-blur-md"
            onClick={() => setSelectedImage(null)}
          >
            <div
              className="animate-modal-pop relative flex flex-col max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-2xl sm:rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Bar inside modal: Counter & Close button */}
              <div className="absolute top-3 inset-x-3 z-30 flex items-center justify-between pointer-events-none">
                <span className="pointer-events-auto rounded-full bg-slate-950/75 border border-white/15 px-3 py-1 text-xs font-bold text-amber-300 backdrop-blur-md shadow-md">
                  {selectedIndex >= 0 ? `${selectedIndex + 1} / ${filteredItems.length}` : ""}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedImage(null)}
                  className="pointer-events-auto flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-slate-950/80 border border-white/20 text-white hover:bg-amber-500 hover:text-slate-950 transition active:scale-95 shadow-lg"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>

              {/* Prev / Next Navigation Arrows */}
              {filteredItems.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Previous photo"
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-slate-950/75 text-white border border-white/20 backdrop-blur-md hover:bg-amber-500 hover:text-slate-950 hover:border-amber-400 transition active:scale-90 shadow-xl"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next photo"
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-slate-950/75 text-white border border-white/20 backdrop-blur-md hover:bg-amber-500 hover:text-slate-950 hover:border-amber-400 transition active:scale-90 shadow-xl"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}

              {/* Responsive Image Display Container */}
              <div className="relative max-h-[62vh] sm:max-h-[75vh] w-full overflow-hidden bg-black flex items-center justify-center py-2">
                <img
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  className="max-h-[60vh] sm:max-h-[72vh] w-auto max-w-full object-contain"
                />
              </div>

              {/* Modal Details & Action Bar */}
              <div className="p-3.5 sm:p-5 bg-slate-900 border-t border-slate-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0 pr-2">
                  <h3 className="font-devanagari text-sm sm:text-base font-bold text-amber-400 truncate">
                    {selectedImage.caption}
                  </h3>
                  <p className="font-devanagari text-xs text-slate-400 mt-0.5 truncate">
                    {selectedImage.alt}
                  </p>
                </div>

                <a
                  href={`https://wa.me/${adminData?.contact?.whatsapp || siteData.contact.whatsapp}?text=${encodeURIComponent(
                    `मला या फोटोमधील कामाबद्दल माहिती हवी आहे: ${selectedImage.caption}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-interactive inline-flex items-center justify-center gap-2 rounded-full bg-amber-500 px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-950 hover:bg-amber-400 transition shadow-md active:scale-95 shrink-0"
                >
                  <span>{isMr ? "या कामाबाबत WhatsApp करा" : "Inquire On WhatsApp"}</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}


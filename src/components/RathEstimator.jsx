import { useState } from "react"
import { Calculator, CheckCircle2, MessageCircle, Sparkles, Shield, Clock } from "lucide-react"
import { useTranslation } from "../i18n/LanguageContext"
import { siteData } from "../data/siteData"

export default function RathEstimator() {
  const { lang } = useTranslation()
  const isMr = lang === "mr"

  const [rathType, setRathType] = useState("dindi")
  const [size, setSize] = useState("medium")
  const [features, setFeatures] = useState(["lighting", "brakes"])

  const rathTypes = [
    {
      id: "dindi",
      titleMr: "दिंडी यात्रा पालखी रथ",
      titleEn: "Dindi Yatra Palkhi Rath",
      descMr: "पायी वारी आणि पालखी सोहळ्यासाठी हलका व टिकाऊ",
      descEn: "Lightweight & sturdy for Payi Yatra & Palkhi",
      basePrice: 75000,
    },
    {
      id: "grand",
      titleMr: "भव्य मंदिर रथ",
      titleEn: "Grand Temple Chariot",
      descMr: "मंदिराच्या वार्षिक उत्सवांसाठी पारंपारिक नक्षीदार रथ",
      descEn: "Traditional carved chariot for temple festivals",
      basePrice: 150000,
    },
    {
      id: "mobile",
      titleMr: "फिरता प्रचार / शोभायात्रा रथ",
      titleEn: "Procession / Mobile Rath",
      descMr: "वाहनावर किंवा ट्रॅक्टरवर जोडता येणारा रथ",
      descEn: "Mountable on tractor or carriage for processions",
      basePrice: 95000,
    },
    {
      id: "repair",
      titleMr: "जीर्णोद्धार व दुरुस्ती",
      titleEn: "Restoration & Repair",
      descMr: "विद्यमान रथाची संपूर्ण दुरुस्ती व रंगकाम",
      descEn: "Complete repainting and structural reinforcement",
      basePrice: 35000,
    },
  ]

  const sizes = [
    {
      id: "small",
      labelMr: "लहान (६ ते ८ फूट)",
      labelEn: "Small (6 - 8 ft)",
      multiplier: 1.0,
      daysMr: "२ ते ३ आठवडे",
      daysEn: "2 - 3 weeks",
    },
    {
      id: "medium",
      labelMr: "मध्यम (१० ते १२ फूट)",
      labelEn: "Medium (10 - 12 ft)",
      multiplier: 1.35,
      daysMr: "३ ते ४ आठवडे",
      daysEn: "3 - 4 weeks",
    },
    {
      id: "large",
      labelMr: "भव्य (१४+ फूट)",
      labelEn: "Large (14+ ft)",
      multiplier: 1.8,
      daysMr: "४ ते ६ आठवडे",
      daysEn: "4 - 6 weeks",
    },
  ]

  const featureOptions = [
    {
      id: "lighting",
      labelMr: "एलईडी लायटिंग व बॅटरी सेटअप",
      labelEn: "LED Lighting & Battery Setup",
      price: 15000,
    },
    {
      id: "brakes",
      labelMr: "हायड्रोलिक डिस्क ब्रेक सिस्टीम",
      labelEn: "Hydraulic Disc Brake System",
      price: 18000,
    },
    {
      id: "brass",
      labelMr: "पितळी / तांब्याचे बारीक नक्षीकाम",
      labelEn: "Brass/Copper Carved Ornamentation",
      price: 25000,
    },
    {
      id: "canopy",
      labelMr: "वॉटरप्रूफ कॅनव्हास छत्री व कव्हर",
      labelEn: "Waterproof Canopy & Heavy Chhatri",
      price: 12000,
    },
  ]

  const toggleFeature = (id) => {
    setFeatures((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  // Calculate ballpark price
  const selectedType = rathTypes.find((t) => t.id === rathType) || rathTypes[0]
  const selectedSize = sizes.find((s) => s.id === size) || sizes[0]
  const featuresCost = features.reduce((sum, fId) => {
    const f = featureOptions.find((opt) => opt.id === fId)
    return sum + (f ? f.price : 0)
  }, 0)

  const estimatedTotal = Math.round(selectedType.basePrice * selectedSize.multiplier + featuresCost)

  const handleSendWhatsApp = () => {
    const typeName = isMr ? selectedType.titleMr : selectedType.titleEn
    const sizeName = isMr ? selectedSize.labelMr : selectedSize.labelEn
    const selectedFeaturesNames = features
      .map((fId) => {
        const f = featureOptions.find((opt) => opt.id === fId)
        return f ? (isMr ? f.labelMr : f.labelEn) : ""
      })
      .filter(Boolean)
      .join(", ")

    const message =
      `*नवीन रथ कोटेशन चौकशी (Rath Quotation Inquiry)*\n` +
      `------------------------------------\n` +
      `🛞 *रथाचा प्रकार:* ${typeName}\n` +
      `📏 *उंची / आकार:* ${sizeName}\n` +
      `✨ *वैशिष्ट्ये:* ${selectedFeaturesNames || "मानक (Standard)"}\n` +
      `💰 *अंदाजे बजेट:* ₹${estimatedTotal.toLocaleString("en-IN")}\n` +
      `⏳ *अंदाजे कालावधी:* ${isMr ? selectedSize.daysMr : selectedSize.daysEn}\n\n` +
      `कृपया अधिक माहिती व अंतिम कोटेशन द्यावे.\n` +
      `जय हरी विठ्ठल!`

    const url = `https://wa.me/${siteData.contact.whatsapp}?text=${encodeURIComponent(message)}`
    window.open(url, "_blank")
  }

  return (
    <section id="estimator" className="scroll-mt-16 bg-gradient-to-b from-white via-amber-50/40 to-white py-16 sm:py-24 border-y border-amber-200/50">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/50 bg-amber-100/70 px-4 py-1.5 text-xs font-semibold text-amber-900 shadow-2xs">
            <Calculator className="h-4 w-4 text-amber-700" />
            <span>{isMr ? "ऑनलाइन कोटेशन कॅल्क्युलेटर" : "Online Quotation Calculator"}</span>
          </div>
          <h2 className="font-display mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            {isMr ? "आपल्या रथाचा अंदाजे खर्च व माहिती मिळवा" : "Estimate Your Custom Rath Requirement"}
          </h2>
          <p className="font-devanagari mt-3 text-sm text-slate-600 max-w-2xl mx-auto">
            {isMr
              ? "आपल्या पसंतीचा रथाचा प्रकार, आकार आणि आवश्यक सुविधा निवडा. थेट प्रभाकर व हर्ष म्हसकेंकडून अधिकृत कोटेशन मिळवा."
              : "Select chariot type, dimensions, and custom requirements to get an instant estimate and consult directly with master craftsmen."}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 items-start">
          {/* Options Section */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Rath Type */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
              <label className="font-devanagari text-sm font-bold text-slate-900 mb-3 block">
                १. {isMr ? "रथाचा प्रकार निवडा" : "Select Rath Type"}
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                {rathTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setRathType(type.id)}
                    className={`rounded-xl border p-3.5 text-left transition-all ${
                      rathType === type.id
                        ? "border-amber-500 bg-amber-50/80 ring-2 ring-amber-500/20"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <p className="font-display text-sm font-bold text-slate-900">
                      {isMr ? type.titleMr : type.titleEn}
                    </p>
                    <p className="font-devanagari mt-1 text-xs text-slate-500 leading-snug">
                      {isMr ? type.descMr : type.descEn}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Size */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
              <label className="font-devanagari text-sm font-bold text-slate-900 mb-3 block">
                २. {isMr ? "आकार व उंची" : "Select Dimensions & Height"}
              </label>
              <div className="grid gap-3 sm:grid-cols-3">
                {sizes.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSize(s.id)}
                    className={`rounded-xl border p-3 text-center transition-all ${
                      size === s.id
                        ? "border-amber-500 bg-amber-50/80 ring-2 ring-amber-500/20"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <p className="font-devanagari text-sm font-bold text-slate-900">
                      {isMr ? s.labelMr : s.labelEn}
                    </p>
                    <p className="font-devanagari mt-1 text-[11px] text-amber-700">
                      ⏱️ {isMr ? s.daysMr : s.daysEn}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Extra Features */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
              <label className="font-devanagari text-sm font-bold text-slate-900 mb-3 block">
                ३. {isMr ? "विशेष सोयी व नक्षीकाम" : "Custom Add-ons & Ornamentation"}
              </label>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {featureOptions.map((f) => {
                  const isChecked = features.includes(f.id)
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => toggleFeature(f.id)}
                      className={`flex items-center gap-2.5 rounded-xl border p-3 text-left transition-all ${
                        isChecked
                          ? "border-amber-500 bg-amber-50/60"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                          isChecked
                            ? "border-amber-600 bg-amber-500 text-slate-950"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {isChecked && <CheckCircle2 className="h-3.5 w-3.5" />}
                      </div>
                      <span className="font-devanagari text-xs font-medium text-slate-700">
                        {isMr ? f.labelMr : f.labelEn}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Estimate Summary Card */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="rounded-3xl border border-amber-300/80 bg-gradient-to-br from-amber-50/90 via-white to-amber-100/50 p-6 shadow-md">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-sm mb-4">
                <Sparkles className="h-5 w-5 text-amber-600" />
                <span className="font-devanagari">{isMr ? "अंदाजे कोटेशन तपशील" : "Estimated Quote Summary"}</span>
              </div>

              <div className="space-y-3.5 border-b border-amber-200/80 pb-5 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-devanagari">{isMr ? "प्रकार:" : "Type:"}</span>
                  <span className="font-bold text-slate-900 font-devanagari">
                    {isMr ? selectedType.titleMr : selectedType.titleEn}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-devanagari">{isMr ? "आकार:" : "Size:"}</span>
                  <span className="font-bold text-slate-900 font-devanagari">
                    {isMr ? selectedSize.labelMr : selectedSize.labelEn}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-devanagari">{isMr ? "अंदाजे वेळ:" : "Duration:"}</span>
                  <span className="font-semibold text-amber-800 font-devanagari">
                    {isMr ? selectedSize.daysMr : selectedSize.daysEn}
                  </span>
                </div>
              </div>

              <div className="py-5">
                <p className="text-xs font-devanagari text-slate-500 uppercase tracking-wider">
                  {isMr ? "अंदाजे सुरुवातीचा खर्च (Starting Estimate)" : "Estimated Starting Cost"}
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-display text-3xl font-extrabold text-amber-800">
                    ₹{estimatedTotal.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs text-slate-500 font-devanagari">
                    {isMr ? "*अंदाजे / नियमांनुसार" : "*Ballpark approx"}
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-500 font-devanagari leading-relaxed">
                  {isMr
                    ? "टीप: अंतिम किंमत डिझाइन आणि लाकूड/लोखंडाच्या वजनावर अवलंबून असते."
                    : "Note: Final price is confirmed after detailed structural design and steel/wood requirements."}
                </p>
              </div>

              <button
                type="button"
                onClick={handleSendWhatsApp}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-4 text-sm font-bold text-white shadow-md transition hover:bg-emerald-500 hover:shadow-lg"
              >
                <MessageCircle className="h-5 w-5" />
                <span className="font-devanagari">
                  {isMr ? "WhatsApp वर कोटेशन मिळवा" : "Send Quote to WhatsApp"}
                </span>
              </button>

              <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-slate-500 font-devanagari">
                <span className="inline-flex items-center gap-1">
                  <Shield className="h-3.5 w-3.5 text-emerald-600" />
                  {isMr ? "१००% मजबूत बांधकाम" : "100% Durable Steel"}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-amber-600" />
                  {isMr ? "वेळेत डिलिव्हरी" : "On-Time Delivery"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

import { useState, useMemo } from "react"
import { ChevronDown, HelpCircle, Phone, MessageCircle, Search, ShieldCheck } from "lucide-react"
import { useTranslation } from "../i18n/LanguageContext"
import { siteData } from "../data/siteData"

const faqs = [
  {
    qMr: "नवीन रथ बांधण्यासाठी साधारण किती दिवस लागतात?",
    qEn: "How much time does it take to fabricate a new Rath?",
    aMr: "लहान व मध्यम रथांसाठी साधारणपणे २ ते ४ आठवडे लागतात. भव्य मंदिर किंवा सानुकूल नक्षीदार रथांसाठी ३ ते ५ आठवडे लागतात. आषाढी वारी किंवा कार्तिकी एकादशीच्या हंगामात तातडीची कामे नियोजित वेळेनुसार प्राधान्याने पूर्ण केली जातात.",
    aEn: "Small to medium chariots take 2 to 4 weeks. Grand temple or custom-ornamented raths take 3 to 5 weeks. For upcoming Ashadhi Wari or festival seasons, we schedule rush fabrication with guaranteed on-time delivery.",
    category: "timeline",
  },
  {
    qMr: "आमच्या ट्रॅक्टर किंवा पिकअप वाहनावर रथ बसवता येतो का?",
    qEn: "Can the rath be mounted on our tractor or pickup vehicle?",
    aMr: "होय, १००%! आम्ही महिंद्रा, स्वराज, आयशर किंवा कोणत्याही पिकअप वाहनाच्या चेसिस मापानुसार अचूक माउंटिंग कपलिंग तयार करतो. यामध्ये हायड्रोलिक शॉक-ॲबसॉर्बर आणि हेवी-ड्युटी कपलिंग दिली जाते, जेणेकरून चढ-उतार आणि खडकाळ रस्त्यांवरही प्रवास अत्यंत सुरक्षित राहतो.",
    aEn: "Yes, 100%! We engineer custom mounting frames and heavy-duty shock-absorbing couplings tailored to your tractor or pickup chassis (Mahindra, Swaraj, Eicher, Tata, etc.) ensuring total stability on rough roads.",
    category: "vehicle",
  },
  {
    qMr: "संपूर्ण महाराष्ट्रात डिलिव्हरी व वाहतूक कशी मिळते?",
    qEn: "How is delivery and transport handled across Maharashtra?",
    aMr: "आम्ही विशेष हायड्रोलिक ट्रेलर्स आणि सुरक्षित वाहतुकीद्वारे थेट तुमच्या गावी, मंदिरात किंवा दिंडीच्या प्रस्थान स्थळावर (उदा. आळंदी, देहू, पंढरपूर, नाशिक, पुणे, कोल्हापूर इ.) सुरक्षितपणे रथ पोहोचवतो. आवश्यक असल्यास आमचे कारागीर प्रत्यक्ष उपस्थित राहून जोडणी व चाचणी करून देतात.",
    aEn: "We arrange safe, direct trailer transport to your village, temple, or Yatra starting point (Alandi, Dehu, Pandharpur, Nashik, Pune, Kolhapur, etc.). Our craftsmen can also assist on-site with assembly and final trial.",
    category: "delivery",
  },
  {
    qMr: "विद्यमान जुन्या लाकडी किंवा लोखंडी रथाचा जीर्णोद्धार (दुरुस्ती) करता येतो का?",
    qEn: "Can older wooden or iron temple raths be repaired/restored?",
    aMr: "होय! आमच्याकडे अनेक शतकांची वारकरी रथांची परंपरा माहिती आहे. आम्ही जुन्या रथांचे स्ट्रक्चरल ऑडीट करून लोखंडी बळकटीकरण, पितळी/तांब्याचे बारीक नक्षीकाम, आधुनिक हायड्रोलिक ब्रेक्स, वॉटरप्रूफ छत आणि ऑटोमोटिव्ह वेदरप्रूफ रंगकाम करून रथाला नवसंजीवनी देतो.",
    aEn: "Yes! We specialize in heritage and historic rath restoration: reinforcing the chassis, replacing worn wooden axles with heavy-duty steel, adding CNC laser brass detailing, modern disc brakes, waterproof canopies, and long-lasting enamel painting.",
    category: "restoration",
  },
  {
    qMr: "रथात सुरक्षितता आणि ब्रेकिंगसाठी काय सोय असते?",
    qEn: "What safety, steering, and braking systems are installed?",
    aMr: "वारकरी मिरवणुकीत गर्दी व घाटातील उताराचा विचार करून आम्ही हेवी-ड्युटी हायड्रोलिक डिस्क ब्रेक्स, मेकॅनिकल हँडब्रेक (पार्किंग लॉक), सुरळीत स्टीअरिंग टाय-रॉड आणि सेफ-लॉक पिन बसवतो. सोबतच रात्रीच्या वारीसाठी इन-बिल्ट बॅटरी एलईडी व साऊंड वायरिंगची सुरक्षित व्यवस्था केली जाते.",
    aEn: "Given crowded processions and steep ghat sections, we fit heavy-duty hydraulic disc brakes, mechanical parking handbrakes, balanced steering tie-rods, and locking pins. Safe waterproof conduit wiring is also integrated for LED lighting and battery systems.",
    category: "safety",
  },
  {
    qMr: "बुकिंग प्रक्रिया आणि पेमेंटचे टप्पे कसे असतात?",
    qEn: "What are the booking process and payment milestones?",
    aMr: "अतिशय पारदर्शक व स्पष्ट ३ टप्पे: १) डिझाइन व आकार निश्चितीनंतर ३०% ॲडव्हान्स, २) फॅब्रिकेशन व फ्रेम स्ट्रक्चर पूर्ण झाल्यावर प्रत्यक्ष किंवा व्हिडिओ तपासणीदरम्यान ४०%, आणि ३) अंतिम रंगकाम, सजावट व डिलिव्हरी पूजेच्या वेळी उर्वरित ३०%. अधिकृत पावतीसह व्यवहार होतो.",
    aEn: "Transparent 3-stage milestones: 1) 30% advance on design and blueprint finalization, 2) 40% midway structural frame inspection (in-person or video call), and 3) balance 30% upon final painting, trial, and delivery puja.",
    category: "payment",
  },
]

export default function FAQ({ showHeading = true }) {
  const { lang } = useTranslation()
  const isMr = lang === "mr"
  const [openIndex, setOpenIndex] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return faqs
    const q = searchQuery.toLowerCase().trim()
    return faqs.filter(
      (item) =>
        item.qMr.toLowerCase().includes(q) ||
        item.qEn.toLowerCase().includes(q) ||
        item.aMr.toLowerCase().includes(q) ||
        item.aEn.toLowerCase().includes(q)
    )
  }, [searchQuery])

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx)
  }

  return (
    <section id="faq" className="scroll-mt-16 bg-cream-50 py-16 sm:py-24 border-t border-amber-200/50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {showHeading && (
          <div className="text-center mb-10 reveal-on-scroll">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/50 bg-amber-100/70 px-4 py-1.5 text-xs font-semibold text-amber-900 shadow-2xs">
              <HelpCircle className="h-4 w-4 text-amber-700" />
              <span>{isMr ? "वारंवार विचारले जाणारे प्रश्न" : "Frequently Asked Questions"}</span>
            </div>
            <h2 className="font-display heading-flourish mt-3 text-2xl sm:text-4xl font-bold text-slate-900">
              {isMr ? "मंडळ व भाविकांचे नेहमीचे प्रश्न" : "Questions Devotees & Mandals Ask"}
            </h2>
            <p className="font-devanagari mt-3 text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
              {isMr
                ? "रथ निर्मिती, वाहनांवर बसवणे, डिलिव्हरी आणि बुकिंग संदर्भातील सर्व महत्वाच्या प्रश्नांची उत्तरे."
                : "Comprehensive answers on chariot fabrication, vehicle mounting, statewide delivery, and restoration."}
            </p>
          </div>
        )}

        {/* Search bar */}
        <div className="relative mb-8 max-w-md mx-auto reveal-on-scroll">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isMr
                ? "प्रश्नात शोधा (उदा. डिलिव्हरी, ब्रेक, ट्रॅक्टर...)"
                : "Search questions (e.g. delivery, brakes, tractor)..."
            }
            className="w-full rounded-full border border-slate-200/90 bg-white py-2.5 pl-11 pr-4 text-xs sm:text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 shadow-xs"
          />
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3.5">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx
            return (
              <div
                key={idx}
                className={`pro-card rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "border-amber-400/90 bg-white shadow-md ring-1 ring-amber-400/20"
                    : "border-slate-200/90 bg-white hover:border-slate-300 shadow-2xs"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="flex w-full items-center justify-between p-4 sm:p-5 text-left transition"
                  aria-expanded={isOpen}
                >
                  <span className="font-display pr-4 text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2.5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-xs font-bold text-amber-800">
                      Q
                    </span>
                    {isMr ? faq.qMr : faq.qEn}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-amber-700 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="border-t border-amber-100 bg-amber-50/30 px-5 py-4 animate-fade-in">
                    <p className="font-devanagari text-xs sm:text-sm leading-relaxed text-slate-700">
                      {isMr ? faq.aMr : faq.aEn}
                    </p>
                  </div>
                )}
              </div>
            )
          })}

          {filteredFaqs.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
              <p className="font-devanagari text-sm">
                {isMr
                  ? "या संदर्भात प्रश्न सापडला नाही. कृपया थेट आम्हाला कॉल करा."
                  : "No matching questions found. Feel free to call us directly."}
              </p>
            </div>
          )}
        </div>

        {/* Still have questions banner */}
        <div className="mt-10 rounded-3xl border border-amber-300/80 bg-gradient-to-r from-amber-50 via-white to-amber-100/40 p-6 sm:p-8 text-center shadow-xs">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/20 text-amber-700 mb-3">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900">
            {isMr
              ? "तुमच्या मंडळाचा काही विशेष किंवा वेगळा प्रश्न आहे का?"
              : "Have a Specific or Custom Chariot Requirement?"}
          </h3>
          <p className="font-devanagari mt-2 text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            {isMr
              ? "प्रभाकर म्हसके व हर्ष म्हसके थेट आपल्याशी चर्चा करून योग्य मार्गदर्शन व मोफत सल्ला देतील."
              : "Speak directly with master craftsmen Prabhakar & Harsh Mhaske for expert technical advice and free consultation."}
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <a
              href={`tel:${siteData.contact.phone.replace(/\s/g, "")}`}
              className="btn-interactive inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-amber-600 transition"
            >
              <Phone className="h-4 w-4" />
              <span>{isMr ? "थेट फोन करा" : "Call Directly"}</span>
            </a>
            <a
              href={`https://wa.me/${siteData.contact.whatsapp}?text=${encodeURIComponent(
                isMr
                  ? "नमस्कार, मला रथ निर्मिती संदर्भात काही प्रश्न विचारायचे आहेत."
                  : "Hello, I have questions regarding Rath fabrication."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-interactive inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-emerald-500 transition"
            >
              <MessageCircle className="h-4 w-4" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

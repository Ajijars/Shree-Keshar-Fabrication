import { Star, Quote, MapPin } from "lucide-react"
import { useTranslation } from "../i18n/LanguageContext"

export default function Testimonials() {
  const { lang } = useTranslation()
  const isMr = lang === "mr"

  const reviews = [
    {
      nameMr: "ह.भ.प. गजानन महाराज कदम",
      nameEn: "H.B.P. Gajanan Maharaj Kadam",
      roleMr: "पालखी सोहळा प्रमुख, आळंदी ते पंढरपूर दिंडी",
      roleEn: "Palkhi Chief, Alandi to Pandharpur Dindi",
      locationMr: "आळंदी / पुणे",
      locationEn: "Alandi / Pune",
      textMr:
        "श्री केशर फॅब्रिकेशनने आमच्या दिंडीसाठी तयार केलेला रथ अप्रतिम आहे. वारीच्या शेकडो किलोमीटरच्या प्रवासात रथाची चाके आणि चेसिस अजिबात अडखळली नाहीत. प्रभाकररावांचे काम अतिशय मजबूत आणि पवित्र भावनेने केलेले आहे.",
      textEn:
        "The chariot built by Shree Keshar Fabrication for our Dindi is exceptional. Over hundreds of kilometers during Wari, the wheels and chassis performed flawlessly. Truly sturdy and devout craftsmanship.",
      rating: 5,
    },
    {
      nameMr: "श्री. संभाजीराव पाटील (विश्वस्त)",
      nameEn: "Shri Sambhajirao Patil (Trustee)",
      roleMr: "विठ्ठल मंदिर ट्रस्ट",
      roleEn: "Viththal Mandir Trust",
      locationMr: "पंढरपूर",
      locationEn: "Pandharpur",
      textMr:
        "आमच्या जुन्या लाकडी रथाचा संपूर्ण जीर्णोद्धार आणि नवीन लोखंडी मजबूत फ्रेम हर्ष म्हसके यांनी वेळेत पूर्ण करून दिली. रंगकाम आणि बारीक नक्षीकाम पाहून सर्व भाविक प्रसन्न झाले.",
      textEn:
        "Harsh Mhaske completely restored our historic temple rath with a reinforced steel frame within the deadline. Devotees were delighted with the repainting and fine ornamentation.",
      rating: 5,
    },
    {
      nameMr: "ज्ञानेश्वर वाघमारे",
      nameEn: "Dnyaneshwar Waghmare",
      roleMr: "संत ज्ञानेश्वर वारकरी मंडळ",
      roleEn: "Sant Dnyaneshwar Warkari Mandal",
      locationMr: "नाशिक",
      locationEn: "Nashik",
      textMr:
        "हायड्रोलिक ब्रेक आणि सुरळीत स्टीअरिंग सिस्टीममुळे घाटात आणि गर्दीत रथ नियंत्रित करणे अतिशय सोपे झाले. महाराष्ट्रात रथ बांधणीत यांच्या तोडीचे काम दुसरे कोणी करू शकत नाही.",
      textEn:
        "The hydraulic braking and smooth steering made handling the rath effortless through hilly ghats and crowded processions. Unmatched rath fabrication in Maharashtra.",
      rating: 5,
    },
  ]

  return (
    <section className="bg-cream-100 py-12 sm:py-20 border-t border-amber-200/50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-10 reveal-on-scroll">
          <p className="font-devanagari text-sm font-bold text-amber-700">
            {isMr ? "🙏 भाविक व मंडळांचे अनुभव" : "Devotee & Mandir Trust Experiences"}
          </p>
          <h2 className="font-display heading-flourish mt-2 text-2xl sm:text-4xl font-bold text-slate-900 leading-tight">
            {isMr ? "महाराष्ट्रातील वारकरी मंडळांचा विश्वास" : "Trusted by Mandals Across Maharashtra"}
          </h2>
          <p className="font-devanagari mt-4 text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            {isMr
              ? "पंढरपूर, आळंदी, पुणे, नाशिक व संपूर्ण महाराष्ट्रातील भाविक आणि पालखी सोहळ्यांचा २५+ वर्षांचा अखंड विश्वास."
              : "Over 25 years of unwavering devotion and structural reliability for temple trusts and Wari yatras."}
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
          {reviews.map((rev, index) => {
            const delayClass = `delay-${(index + 1) * 150}`
            return (
              <div
                key={index}
                className={`pro-card card-shine reveal-on-scroll ${delayClass} rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs flex flex-col justify-between hover:border-amber-400 hover:shadow-xl active:scale-[0.98] transition-transform group`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex text-amber-500 gap-0.5">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <Quote className="h-6 w-6 text-amber-200 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12 group-hover:text-amber-400" />
                  </div>
                  <p className="font-devanagari text-sm text-slate-700 leading-relaxed mb-6 italic">
                    "{isMr ? rev.textMr : rev.textEn}"
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-sm font-bold text-slate-900 group-hover:text-amber-800 transition">
                      {isMr ? rev.nameMr : rev.nameEn}
                    </h3>
                    <p className="font-devanagari text-xs text-amber-700">
                      {isMr ? rev.roleMr : rev.roleEn}
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-devanagari bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200/60 transition group-hover:bg-amber-50 group-hover:border-amber-200/60 group-hover:text-amber-800">
                    <MapPin className="h-3 w-3 text-amber-600" />
                    <span>{isMr ? rev.locationMr : rev.locationEn}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

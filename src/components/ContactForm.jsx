import { useState } from "react"
import { Send, CheckCircle, Phone, Mail, MapPin, ExternalLink } from "lucide-react"
import { siteData } from "../data/siteData"
import { useTranslation } from "../i18n/LanguageContext"
import { useAdminData } from "../admin/AdminContext"
import SectionHeading from "./SectionHeading"

const initialForm = {
  name: "",
  phone: "",
  email: "",
  city: "",
  service: "",
  message: "",
  contactMethod: "phone",
}

export default function ContactForm({ showHeading = true }) {
  const { t } = useTranslation()
  const [form, setForm] = useState(initialForm)
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState("")

  const cityOptions = t("contact.cityOptions")
  const serviceOptions = t("contact.serviceOptions")
  const owners = t("owners.items")
  const adminData = useAdminData()

  const phonePrabhakar = adminData.owners?.prabhakar?.phone || siteData.owners.prabhakar.phone
  const phoneHarsh = adminData.owners?.harsh?.phone || siteData.owners.harsh.phone
  const contactEmail = adminData.contact?.email || siteData.contact.email
  const contactAddress = adminData.contact?.address || siteData.contact.address
  const mapLink = adminData.contact?.mapLink || siteData.contact.mapLink
  const mapUrl =
    mapLink && mapLink !== "#" && (mapLink.startsWith("http://") || mapLink.startsWith("https://"))
      ? mapLink
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Shree Keshar Fabrication Works, " + (contactAddress || "Maharashtra"))}`

  const sanitizeInput = (val, maxLen = 200) => {
    if (typeof val !== "string") return ""
    return val
      .replace(/[<>]/g, "") // strip HTML tags to prevent XSS
      .trim()
      .slice(0, maxLen)
  }

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = t("contact.errors.name")
    if (!form.phone.trim()) next.phone = t("contact.errors.phone")
    else if (!/^[0-9+\s-]{10,15}$/.test(form.phone.trim()))
      next.phone = t("contact.errors.phoneInvalid")
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = t("contact.errors.emailInvalid") || "कृपया वैध ईमेल टाका / Enter valid email"
    }
    if (!form.city) next.city = t("contact.errors.city")
    if (!form.service) next.service = t("contact.errors.service")
    if (!form.message.trim()) next.message = t("contact.errors.message")
    return next
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const next = validate()
    if (Object.keys(next).length) {
      setErrors(next)
      return
    }

    setIsSubmitting(true)
    setSubmitError("")

    const cleanName = sanitizeInput(form.name, 80)
    const cleanPhone = sanitizeInput(form.phone, 20)
    const cleanEmail = sanitizeInput(form.email, 100)
    const cleanCity = sanitizeInput(form.city, 50)
    const cleanService = sanitizeInput(form.service, 80)
    const cleanMessage = sanitizeInput(form.message, 1000)

    const web3Key = import.meta.env.VITE_WEB3FORMS_KEY

    // If preferred contact is WhatsApp or if no Web3Forms key is configured, send via WhatsApp
    if (form.contactMethod === "whatsapp" || !web3Key || web3Key === "YOUR_WEB3FORMS_ACCESS_KEY_HERE") {
      const text = `*नवीन चौकशी (New Inquiry) - Shree Keshar Fabrication*\n\n` +
        `👤 *नाव (Name):* ${cleanName || "-"}\n` +
        `📞 *फोन (Phone):* ${cleanPhone || "-"}\n` +
        `📍 *गाव/शहर (City):* ${cleanCity || "-"}\n` +
        `🔧 *सेवा (Service):* ${cleanService || "-"}\n` +
        `📝 *संदेश (Message):* ${cleanMessage || "-"}\n\n` +
        `जय हरी विठ्ठल!`
      window.open(`https://wa.me/919699371940?text=${encodeURIComponent(text)}`, "_blank")
      setSubmitted(true)
      setForm(initialForm)
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: web3Key,
          subject: `New Lead from ${cleanName} - Shree Keshar Fabrication`,
          from_name: cleanName,
          name: cleanName,
          phone: cleanPhone,
          email: cleanEmail,
          city: cleanCity,
          service: cleanService,
          message: cleanMessage,
          contactMethod: form.contactMethod,
        }),
      })

      const result = await response.json()
      if (result.success) {
        setSubmitted(true)
        setForm(initialForm)
      } else {
        setSubmitError(t("contact.errors.submissionFailed") || "Something went wrong. You can also contact us directly via WhatsApp.")
      }
    } catch {
      setSubmitError(t("contact.errors.submissionFailed") || "Something went wrong. You can also contact us directly via WhatsApp.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactMethods = [
    { value: "phone", label: t("contact.form.phoneCall") },
    { value: "whatsapp", label: t("contact.form.whatsapp") },
    { value: "email", label: t("contact.form.emailOption") },
  ]

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {showHeading && (
          <SectionHeading
            title={t("contact.sectionTitle")}
            subtitle={t("contact.sectionSubtitle")}
          />
        )}

        <div className="grid gap-10 lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-3xl bg-slate-900 p-7 text-white shadow-xl border border-slate-800">
              <h3 className="font-display text-2xl font-bold text-amber-400">
                {t("contact.getInTouch")}
              </h3>
              <p className="mt-2 text-sm text-slate-300">{t("contact.getInTouchDesc")}</p>

              <ul className="mt-6 space-y-4">
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-xl bg-amber-500/20 p-2 text-amber-400">
                    <Phone className="h-4 w-4 shrink-0" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">{owners[0]?.name || "श्री. प्रभाकर म्हसके"}</p>
                    <a
                      href={`tel:${phonePrabhakar.replace(/\s/g, "")}`}
                      className="text-sm font-semibold text-white hover:text-amber-400 transition"
                      title="कॉल करा (Call Prabhakar Mhaske)"
                    >
                      {phonePrabhakar}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-xl bg-amber-500/20 p-2 text-amber-400">
                    <Phone className="h-4 w-4 shrink-0" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">{owners[1]?.name || "श्री. हर्ष म्हसके"}</p>
                    <a
                      href={`tel:${phoneHarsh.replace(/\s/g, "")}`}
                      className="text-sm font-semibold text-white hover:text-amber-400 transition"
                      title="कॉल करा (Call Harsh Mhaske)"
                    >
                      {phoneHarsh}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-xl bg-amber-500/20 p-2 text-amber-400">
                    <Mail className="h-4 w-4 shrink-0" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">ईमेल (Email)</p>
                    <a
                      href={`mailto:${contactEmail}`}
                      className="text-sm text-slate-200 hover:text-amber-400 transition break-all"
                      title="ईमेल पाठवा (Send Email)"
                    >
                      {contactEmail}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-xl bg-amber-500/20 p-2 text-amber-400">
                    <MapPin className="h-4 w-4 shrink-0" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-400">पत्ता (Workshop Location)</p>
                    <a
                      href={mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group mt-1 flex flex-col rounded-xl border border-amber-400/30 bg-white/5 p-2.5 transition hover:border-amber-400 hover:bg-amber-500/10"
                      title="Google Maps वर उघडा (Open in Google Maps)"
                    >
                      <span className="text-sm font-medium text-slate-100 group-hover:text-amber-300">
                        {contactAddress}
                      </span>
                      <span className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-amber-400 group-hover:text-amber-300">
                        📍 Google Maps वर उघडा (Get Directions) ↗
                      </span>
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            <div className="rounded-3xl border border-amber-300/80 bg-gradient-to-br from-amber-50 via-amber-100/30 to-amber-50 p-6 shadow-xs">
              <p className="font-devanagari text-sm font-bold text-amber-800">
                ✨ {t("contact.devotional")}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">{t("contact.demoNote")}</p>
            </div>
          </div>

          <div className="lg:col-span-3">
            {submitted ? (
              <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-3xl border border-emerald-200 bg-emerald-50/60 p-8 text-center shadow-xs">
                <CheckCircle className="h-16 w-16 text-emerald-600" />
                <h3 className="mt-4 font-display text-2xl font-bold text-slate-900">
                  {t("contact.thankYou")}
                </h3>
                <p className="mt-2 max-w-sm text-sm text-slate-600">{t("contact.thankYouDesc")}</p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-6 rounded-full bg-slate-900 px-6 py-2.5 text-sm font-bold text-white hover:bg-amber-600 transition"
                >
                  {t("common.sendAnother")}
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="pro-card rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs"
                noValidate
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-1.5 block text-xs sm:text-sm font-bold text-slate-700">
                      {t("contact.form.name")} <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      placeholder={t("contact.form.placeholders.name")}
                      className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 ${errors.name ? "border-red-400" : "border-slate-200"}`}
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="mb-1.5 block text-xs sm:text-sm font-bold text-slate-700">
                      {t("contact.form.phone")} <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder={t("contact.form.placeholders.phone")}
                      className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 ${errors.phone ? "border-red-400" : "border-slate-200"}`}
                    />
                    {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                  </div>

                  <div>
                    <label htmlFor="email" className="mb-1.5 block text-xs sm:text-sm font-bold text-slate-700">
                      {t("contact.form.email")}{" "}
                      <span className="text-slate-400 font-normal">{t("common.optional")}</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder={t("contact.form.placeholders.email")}
                      className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 ${errors.email ? "border-red-400" : "border-slate-200"}`}
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="city" className="mb-1.5 block text-xs sm:text-sm font-bold text-slate-700">
                      {t("contact.form.city")} <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="city"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 ${errors.city ? "border-red-400" : "border-slate-200"}`}
                    >
                      <option value="">{t("common.selectCity")}</option>
                      {cityOptions.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="service" className="mb-1.5 block text-xs sm:text-sm font-bold text-slate-700">
                      {t("contact.form.service")} <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={form.service}
                      onChange={handleChange}
                      className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 ${errors.service ? "border-red-400" : "border-slate-200"}`}
                    >
                      <option value="">{t("common.selectService")}</option>
                      {serviceOptions.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    {errors.service && <p className="mt-1 text-xs text-red-500">{errors.service}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="message" className="mb-1.5 block text-xs sm:text-sm font-bold text-slate-700">
                      {t("contact.form.message")} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={form.message}
                      onChange={handleChange}
                      placeholder={t("contact.form.placeholders.message")}
                      className={`w-full resize-none rounded-2xl border bg-white px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 ${errors.message ? "border-red-400" : "border-slate-200"}`}
                    />
                    {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <p className="mb-2 text-xs sm:text-sm font-bold text-slate-700">
                      {t("contact.form.preferredContact")}
                    </p>
                    <div className="flex flex-wrap gap-4">
                      {contactMethods.map((opt) => (
                        <label key={opt.value} className="flex cursor-pointer items-center gap-2">
                          <input
                            type="radio"
                            name="contactMethod"
                            value={opt.value}
                            checked={form.contactMethod === opt.value}
                            onChange={handleChange}
                            className="accent-amber-600"
                          />
                          <span className="text-xs sm:text-sm font-medium text-slate-700">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {submitError && (
                  <div className="mb-4 rounded-xl bg-red-50 p-4 text-xs sm:text-sm text-red-600 border border-red-100">
                    {submitError}
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 py-3.5 text-sm font-bold text-slate-950 shadow-md transition-all duration-300 hover:from-amber-400 hover:to-amber-500 hover:scale-102 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed sm:w-auto sm:px-10"
                >
                  <Send className={`h-4 w-4 ${isSubmitting ? "animate-pulse" : ""}`} />
                  <span>{isSubmitting ? t("common.loading") || "Sending..." : t("common.submit")}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

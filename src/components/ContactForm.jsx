import { useState } from "react"
import { Send, CheckCircle, Phone, Mail, MapPin } from "lucide-react"
import { siteData } from "../data/siteData"
import { useTranslation } from "../i18n/LanguageContext"
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
  const [errors, setErrors] = useState({})

  const cityOptions = t("contact.cityOptions")
  const serviceOptions = t("contact.serviceOptions")
  const owners = t("owners.items")

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = t("contact.errors.name")
    if (!form.phone.trim()) next.phone = t("contact.errors.phone")
    else if (!/^[0-9+\s-]{10,15}$/.test(form.phone.trim()))
      next.phone = t("contact.errors.phoneInvalid")
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

  const handleSubmit = (e) => {
    e.preventDefault()
    const next = validate()
    if (Object.keys(next).length) {
      setErrors(next)
      return
    }
    setSubmitted(true)
    setForm(initialForm)
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
            <div className="rounded-2xl bg-maroon-900 p-6 text-white">
              <h3 className="font-display text-xl font-semibold text-gold-400">
                {t("contact.getInTouch")}
              </h3>
              <p className="mt-2 text-sm text-white/70">{t("contact.getInTouchDesc")}</p>

              <ul className="mt-6 space-y-4">
                <li className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-gold-400" />
                  <div>
                    <p className="text-xs text-white/50">{owners[0].name}</p>
                    <a
                      href={`tel:${siteData.owners.prabhakar.phone.replace(/\s/g, "")}`}
                      className="text-sm hover:text-gold-400"
                    >
                      {siteData.owners.prabhakar.phone}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-gold-400" />
                  <div>
                    <p className="text-xs text-white/50">{owners[1].name}</p>
                    <a
                      href={`tel:${siteData.owners.harsh.phone.replace(/\s/g, "")}`}
                      className="text-sm hover:text-gold-400"
                    >
                      {siteData.owners.harsh.phone}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-gold-400" />
                  <a href={`mailto:${siteData.contact.email}`} className="text-sm hover:text-gold-400">
                    {siteData.contact.email}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold-400" />
                  <p className="text-sm text-white/80">{siteData.contact.address}</p>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-cream-200 bg-cream-50 p-5">
              <p className="font-devanagari text-sm font-medium text-maroon-800">
                {t("contact.devotional")}
              </p>
              <p className="mt-2 text-xs text-gray-500">{t("contact.demoNote")}</p>
            </div>
          </div>

          <div className="lg:col-span-3">
            {submitted ? (
              <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
                <CheckCircle className="h-16 w-16 text-green-600" />
                <h3 className="mt-4 font-display text-2xl font-bold text-green-800">
                  {t("contact.thankYou")}
                </h3>
                <p className="mt-2 max-w-sm text-sm text-green-700">{t("contact.thankYouDesc")}</p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-6 rounded-full bg-maroon-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-maroon-800"
                >
                  {t("common.sendAnother")}
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="rounded-2xl border border-cream-200 bg-cream-50 p-6 sm:p-8"
                noValidate
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-gray-700">
                      {t("contact.form.name")} <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      placeholder={t("contact.form.placeholders.name")}
                      className={`w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition focus:border-maroon-800 focus:ring-2 focus:ring-maroon-800/20 ${errors.name ? "border-red-400" : "border-gray-200"}`}
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                  </div>

                  <div>
                    <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-gray-700">
                      {t("contact.form.phone")} <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder={t("contact.form.placeholders.phone")}
                      className={`w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition focus:border-maroon-800 focus:ring-2 focus:ring-maroon-800/20 ${errors.phone ? "border-red-400" : "border-gray-200"}`}
                    />
                    {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                  </div>

                  <div>
                    <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
                      {t("contact.form.email")}{" "}
                      <span className="text-gray-400">{t("common.optional")}</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder={t("contact.form.placeholders.email")}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-maroon-800 focus:ring-2 focus:ring-maroon-800/20"
                    />
                  </div>

                  <div>
                    <label htmlFor="city" className="mb-1.5 block text-sm font-medium text-gray-700">
                      {t("contact.form.city")} <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="city"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      className={`w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition focus:border-maroon-800 focus:ring-2 focus:ring-maroon-800/20 ${errors.city ? "border-red-400" : "border-gray-200"}`}
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
                    <label htmlFor="service" className="mb-1.5 block text-sm font-medium text-gray-700">
                      {t("contact.form.service")} <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={form.service}
                      onChange={handleChange}
                      className={`w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition focus:border-maroon-800 focus:ring-2 focus:ring-maroon-800/20 ${errors.service ? "border-red-400" : "border-gray-200"}`}
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
                    <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-gray-700">
                      {t("contact.form.message")} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={form.message}
                      onChange={handleChange}
                      placeholder={t("contact.form.placeholders.message")}
                      className={`w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm outline-none transition focus:border-maroon-800 focus:ring-2 focus:ring-maroon-800/20 ${errors.message ? "border-red-400" : "border-gray-200"}`}
                    />
                    {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <p className="mb-2 text-sm font-medium text-gray-700">
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
                            className="accent-maroon-800"
                          />
                          <span className="text-sm text-gray-600">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-maroon-900 py-3.5 text-sm font-semibold text-white transition hover:bg-maroon-800 sm:w-auto sm:px-10"
                >
                  <Send className="h-4 w-4" />
                  {t("common.submit")}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

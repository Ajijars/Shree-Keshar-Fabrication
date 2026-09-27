import { useState } from "react"
import { Save, Check } from "lucide-react"
import { useAdmin } from "./AdminContext"
import PageIndicator from "./PageIndicator"

export default function AdminContact() {
  const { data, updateContact, updateOwner } = useAdmin()
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleContactChange = (field, value) => {
    updateContact({ [field]: value })
  }

  const handleOwnerChange = (key, field, value) => {
    updateOwner(key, { [field]: value })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-devanagari text-2xl font-bold text-gray-800">
            संपर्क माहिती
          </h1>
          <p className="text-sm text-gray-400">Contact Info — Update phone numbers, address, email</p>
        </div>
        {saved && (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
            <Check className="h-4 w-4" /> जतन झाले! (Saved!)
          </span>
        )}
      </div>

      {/* Where changes appear */}
      <PageIndicator
        pages={[
          { path: "/contact", label: "संपर्क पेज", icon: "📞" },
          { path: "/", label: "होम पेज — फूटर", icon: "🏠" },
          { path: "/about", label: "आम्हाला पेज", icon: "ℹ️" },
        ]}
        description="फोन नंबर, पत्ता, ईमेल बदलल्यास 'संपर्क' पेज, फूटर आणि इतर पेजवर बदल दिसतील."
        descriptionEn="Phone, address, email changes appear on Contact page, Footer, and other pages."
      />

      {/* Owner 1 - Prabhakar */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="font-devanagari mb-4 text-lg font-semibold text-maroon-900">
          👤 मालक १ — प्रभाकर म्हसके
          <span className="ml-2 text-sm font-normal text-gray-400">(Owner 1 — Prabhakar Mhaske)</span>
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              फोन नंबर <span className="text-xs text-gray-400">(Phone)</span>
            </label>
            <input
              type="tel"
              value={data.owners.prabhakar?.phone || ""}
              onChange={(e) => handleOwnerChange("prabhakar", "phone", e.target.value)}
              onBlur={handleSave}
              placeholder="+91 98765 43210"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-maroon-800 focus:ring-2 focus:ring-maroon-800/20"
            />
          </div>
        </div>
      </div>

      {/* Owner 2 - Harsh */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="font-devanagari mb-4 text-lg font-semibold text-maroon-900">
          👤 मालक २ — हर्ष म्हसके
          <span className="ml-2 text-sm font-normal text-gray-400">(Owner 2 — Harsh Mhaske)</span>
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              फोन नंबर <span className="text-xs text-gray-400">(Phone)</span>
            </label>
            <input
              type="tel"
              value={data.owners.harsh?.phone || ""}
              onChange={(e) => handleOwnerChange("harsh", "phone", e.target.value)}
              onBlur={handleSave}
              placeholder="+91 96993 71940"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-maroon-800 focus:ring-2 focus:ring-maroon-800/20"
            />
          </div>
        </div>
      </div>

      {/* General Contact */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="font-devanagari mb-4 text-lg font-semibold text-maroon-900">
          📞 सामान्य संपर्क
          <span className="ml-2 text-sm font-normal text-gray-400">(General Contact)</span>
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              WhatsApp नंबर <span className="text-xs text-gray-400">(without +)</span>
            </label>
            <input
              type="tel"
              value={data.contact.whatsapp}
              onChange={(e) => handleContactChange("whatsapp", e.target.value)}
              onBlur={handleSave}
              placeholder="919699371940"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-maroon-800 focus:ring-2 focus:ring-maroon-800/20"
            />
            <p className="mt-1 text-xs text-gray-400">
              Format: 91XXXXXXXXXX (country code + number, no +)
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              ईमेल <span className="text-xs text-gray-400">(Email)</span>
            </label>
            <input
              type="email"
              value={data.contact.email}
              onChange={(e) => handleContactChange("email", e.target.value)}
              onBlur={handleSave}
              placeholder="info@example.com"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-maroon-800 focus:ring-2 focus:ring-maroon-800/20"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              पत्ता <span className="text-xs text-gray-400">(Address)</span>
            </label>
            <textarea
              value={data.contact.address}
              onChange={(e) => handleContactChange("address", e.target.value)}
              onBlur={handleSave}
              rows={2}
              placeholder="Your full address"
              className="font-devanagari w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-maroon-800 focus:ring-2 focus:ring-maroon-800/20"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Google Maps लिंक <span className="text-xs text-gray-400">(Map Link)</span>
            </label>
            <input
              type="url"
              value={data.contact.mapLink}
              onChange={(e) => handleContactChange("mapLink", e.target.value)}
              onBlur={handleSave}
              placeholder="https://maps.google.com/..."
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-maroon-800 focus:ring-2 focus:ring-maroon-800/20"
            />
          </div>
        </div>
      </div>

      {/* Help */}
      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
        <p className="font-devanagari text-sm font-medium text-blue-800">💡 मदत / Help</p>
        <p className="font-devanagari mt-2 text-sm text-blue-700">
          • माहिती बदलल्यावर ती आपोआप जतन होते
        </p>
        <p className="font-devanagari text-sm text-blue-700">
          • WhatsApp नंबर 91 ने सुरू करा (उदा: 919699371940)
        </p>
        <p className="mt-2 text-xs text-blue-600">
          Changes auto-save when you click outside the field.
        </p>
      </div>
    </div>
  )
}

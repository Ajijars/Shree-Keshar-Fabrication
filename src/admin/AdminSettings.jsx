import { useState } from "react"
import { Check, RotateCcw, AlertTriangle } from "lucide-react"
import { useAdmin } from "./AdminContext"
import PageIndicator from "./PageIndicator"

export default function AdminSettings() {
  const { data, updateSocial, resetToDefaults } = useAdmin()
  const [saved, setSaved] = useState(false)
  const [showReset, setShowReset] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleSocialChange = (field, value) => {
    updateSocial({ [field]: value })
  }

  const handleReset = () => {
    resetToDefaults()
    setShowReset(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-devanagari text-2xl font-bold text-gray-800">
            सेटिंग्स
          </h1>
          <p className="text-sm text-gray-400">Settings — Social media links & other settings</p>
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
          { path: "/", label: "फूटर (सर्व पेजवर)", icon: "🔗" },
        ]}
        description="सोशल मीडिया लिंक्स वेबसाइटच्या फूटरमध्ये दिसतील (प्रत्येक पेजवर)."
        descriptionEn="Social media links appear in the website footer on every page."
      />

      {/* Social Media */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="font-devanagari mb-4 text-lg font-semibold text-maroon-900">
          🔗 सोशल मीडिया लिंक्स
          <span className="ml-2 text-sm font-normal text-gray-400">(Social Media Links)</span>
        </h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Facebook Page URL
            </label>
            <input
              type="url"
              value={data.social.facebook}
              onChange={(e) => handleSocialChange("facebook", e.target.value)}
              onBlur={handleSave}
              placeholder="https://facebook.com/yourpage"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-maroon-800 focus:ring-2 focus:ring-maroon-800/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Instagram URL
            </label>
            <input
              type="url"
              value={data.social.instagram}
              onChange={(e) => handleSocialChange("instagram", e.target.value)}
              onBlur={handleSave}
              placeholder="https://instagram.com/yourprofile"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-maroon-800 focus:ring-2 focus:ring-maroon-800/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              YouTube Channel URL
            </label>
            <input
              type="url"
              value={data.social.youtube}
              onChange={(e) => handleSocialChange("youtube", e.target.value)}
              onBlur={handleSave}
              placeholder="https://youtube.com/@yourchannel"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-maroon-800 focus:ring-2 focus:ring-maroon-800/20"
            />
          </div>
        </div>
      </div>

      {/* Admin Info */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="font-devanagari mb-4 text-lg font-semibold text-maroon-900">
          🔑 Admin माहिती
          <span className="ml-2 text-sm font-normal text-gray-400">(Admin Info)</span>
        </h2>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="font-devanagari text-sm text-amber-800">
            <strong>Admin URL:</strong>{" "}
            <code className="rounded bg-amber-100 px-2 py-0.5 text-amber-900">
              /admin
            </code>
          </p>
          <p className="font-devanagari mt-2 text-sm text-amber-800">
            <strong>पासवर्ड:</strong>{" "}
            <code className="rounded bg-amber-100 px-2 py-0.5 text-amber-900">
              keshar2024
            </code>
          </p>
          <p className="font-devanagari mt-2 text-xs text-amber-600">
            पासवर्ड बदलण्यासाठी डेव्हलपरशी संपर्क करा.
          </p>
          <p className="text-xs text-amber-600">
            Contact developer to change the password.
          </p>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-2xl border border-red-200 bg-white p-6">
        <h2 className="font-devanagari mb-4 text-lg font-semibold text-red-600">
          ⚠️ धोक्याचे क्षेत्र
          <span className="ml-2 text-sm font-normal text-red-400">(Danger Zone)</span>
        </h2>
        <p className="font-devanagari mb-4 text-sm text-gray-600">
          सर्व बदल रद्द करा आणि मूळ माहिती परत आणा. <strong>हे पूर्ववत करता येणार नाही!</strong>
        </p>
        <p className="mb-4 text-xs text-gray-400">
          Reset all changes and restore original data. This cannot be undone!
        </p>

        {showReset ? (
          <div className="flex items-center gap-3 rounded-xl border border-red-300 bg-red-50 p-4">
            <AlertTriangle className="h-5 w-5 shrink-0 text-red-500" />
            <p className="font-devanagari flex-1 text-sm text-red-700">
              खात्री आहे का? सर्व डेटा हटवला जाईल!
            </p>
            <button
              type="button"
              onClick={() => setShowReset(false)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              नाही (No)
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
            >
              होय, रीसेट करा (Yes, Reset)
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowReset(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-red-300 px-5 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            <RotateCcw className="h-4 w-4" />
            <span className="font-devanagari">सर्व रीसेट करा</span> (Reset All)
          </button>
        )}
      </div>
    </div>
  )
}

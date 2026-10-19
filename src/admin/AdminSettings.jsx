import { useState } from "react"
import { RotateCcw, AlertTriangle, Key, Lock } from "lucide-react"
import { useAdmin } from "./AdminContext"
import PageIndicator from "./PageIndicator"
import toast from "react-hot-toast"

export default function AdminSettings() {
  const { data, updateSocial, resetToDefaults, changePassword } = useAdmin()
  const [showReset, setShowReset] = useState(false)

  // Password state
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordError, setPasswordError] = useState("")

  const handleSave = () => {
    toast.success("सेटिंग्स जतन केल्या! (Settings Saved!)")
  }

  const handleSocialChange = (field, value) => {
    updateSocial({ [field]: value })
  }

  const handleReset = () => {
    resetToDefaults()
    setShowReset(false)
    toast.success("सर्व सेटिंग्स पूर्ववत केल्या! (Reset successfully)")
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setPasswordError("")

    if (!currentPassword) {
      setPasswordError("कृपया सध्याचा पासवर्ड टाका / Enter current password")
      return
    }
    if (newPassword.length < 8) {
      setPasswordError("नवीन पासवर्ड किमान ८ अक्षरांचा असावा / Minimum 8 characters")
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("दोन्ही नवीन पासवर्ड जुळत नाहीत / Passwords do not match")
      return
    }

    setPasswordLoading(true)
    try {
      const res = await changePassword(currentPassword, newPassword)
      if (res.success) {
        toast.success(res.message || "पासवर्ड यशस्वीरित्या बदलला! (Password updated!)")
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        setPasswordError(res.error || "पासवर्ड बदलण्यात त्रुटी / Failed to update")
      }
    } catch {
      setPasswordError("तांत्रिक त्रुटी. पुन्हा प्रयत्न करा. / Network error")
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-devanagari text-2xl font-bold text-gray-800">
            सेटिंग्स
          </h1>
          <p className="text-sm text-gray-400">Settings — Social media links, admin security & configuration</p>
        </div>
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

      {/* Admin Security & Password Change */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <Key className="h-5 w-5 text-amber-600" />
          <h2 className="font-devanagari text-lg font-semibold text-gray-900">
            🔐 Admin पासवर्ड बदला
            <span className="ml-2 text-sm font-normal text-gray-400">(Change Admin Password)</span>
          </h2>
        </div>
        <p className="text-sm text-gray-500 mb-6 font-devanagari">
          सुरक्षिततेसाठी नवीन पासवर्ड सेट करा. पासवर्ड AWS DynamoDB मध्ये एन्क्रिप्टेड (PBKDF2 SHA-512) साठवला जातो.
        </p>

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-xl">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              सध्याचा पासवर्ड (Current Password)
            </label>
            <div className="relative">
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="सध्याचा पासवर्ड टाका"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-maroon-800 focus:ring-2 focus:ring-maroon-800/20"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                नवीन पासवर्ड (New Password)
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="किमान ८ अक्षरे"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-maroon-800 focus:ring-2 focus:ring-maroon-800/20"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                नवीन पासवर्ड पुन्हा टाका (Confirm)
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="नवीन पासवर्ड पुन्हा टाका"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-maroon-800 focus:ring-2 focus:ring-maroon-800/20"
                required
              />
            </div>
          </div>

          {passwordError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {passwordError}
            </div>
          )}

          <button
            type="submit"
            disabled={passwordLoading}
            className="inline-flex items-center gap-2 rounded-xl bg-maroon-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-maroon-800 disabled:opacity-50"
          >
            <Lock className="h-4 w-4" />
            <span>{passwordLoading ? "अपडेट करत आहे..." : "नवीन पासवर्ड जतन करा (Save Password)"}</span>
          </button>
        </form>
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-red-300 bg-red-50 p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 shrink-0 text-red-500" />
              <p className="font-devanagari text-xs sm:text-sm font-semibold text-red-800">
                खात्री आहे का? सर्व डेटा हटवला जाईल! (Are you sure?)
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => setShowReset(false)}
                className="flex-1 sm:flex-initial rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 active:scale-95"
              >
                नाही (No)
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 sm:flex-initial rounded-lg bg-red-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-red-700 active:scale-95 shadow-xs"
              >
                होय, रीसेट करा (Yes, Reset)
              </button>
            </div>
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

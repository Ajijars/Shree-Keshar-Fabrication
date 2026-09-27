import { useState, useRef } from "react"
import { Save, Check, ImageIcon, X, Store } from "lucide-react"
import { useAdmin } from "./AdminContext"
import PageIndicator from "./PageIndicator"

export default function AdminOwners() {
  const { data, updateOwner, updateShopImage } = useAdmin()
  const [saved, setSaved] = useState(false)
  const fileRefs = { prabhakar: useRef(null), harsh: useRef(null), shop: useRef(null) }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleImageUpload = (key, e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      alert("फाइल खूप मोठी! 2MB पेक्षा कमी वापरा.\nFile too large! Use under 2MB.")
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => {
      if (key === "shop") {
        updateShopImage(ev.target.result)
      } else {
        updateOwner(key, { image: ev.target.result })
      }
      handleSave()
    }
    reader.readAsDataURL(file)
  }

  const ownerCards = [
    { key: "prabhakar", emoji: "👤", label: "मालक १", labelEn: "Owner 1" },
    { key: "harsh", emoji: "👤", label: "मालक २", labelEn: "Owner 2" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-devanagari text-2xl font-bold text-gray-800">
            मालक व कार्यशाळा
          </h1>
          <p className="text-sm text-gray-400">Owners & Workshop — Update owner details, photos & shop image</p>
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
          { path: "/owners", label: "मालक पेज", icon: "👥" },
          { path: "/about", label: "आम्हाबद्दल पेज", icon: "ℹ️" },
          { path: "/", label: "होम पेज — फूटर", icon: "🏠" },
        ]}
        description="मालकांची माहिती, फोटो आणि कार्यशाळेचा फोटो 'मालक' व 'आम्हाबद्दल' पेजवर दिसतील."
        descriptionEn="Owner details, photos & workshop photo appear on the Owners and About pages."
      />

      {/* Owner Cards */}
      {ownerCards.map(({ key, emoji, label, labelEn }) => {
        const owner = data.owners[key] || {}
        return (
          <div key={key} className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="font-devanagari mb-5 text-lg font-semibold text-maroon-900">
              {emoji} {label} — {owner.nameMr || key}
              <span className="ml-2 text-sm font-normal text-gray-400">({labelEn})</span>
            </h2>

            <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
              {/* Photo */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  फोटो <span className="text-xs text-gray-400">(Photo)</span>
                </label>
                {owner.image ? (
                  <div className="relative overflow-hidden rounded-xl">
                    <img
                      src={owner.image}
                      alt={owner.nameEn}
                      className="h-48 w-full object-cover object-top"
                    />
                    <button
                      type="button"
                      onClick={() => { updateOwner(key, { image: "" }); handleSave() }}
                      className="absolute right-2 top-2 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileRefs[key].current?.click()}
                    className="flex h-48 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 text-gray-400 transition hover:border-maroon-800 hover:text-maroon-800"
                  >
                    <ImageIcon className="mb-2 h-8 w-8" />
                    <p className="font-devanagari text-xs font-medium">फोटो अपलोड करा</p>
                    <p className="text-[10px]">Click to upload (max 2MB)</p>
                  </button>
                )}
                <input
                  ref={fileRefs[key]}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(key, e)}
                  className="hidden"
                />
                {/* Or enter path */}
                <div className="mt-2">
                  <input
                    type="text"
                    value={owner.image || ""}
                    onChange={(e) => { updateOwner(key, { image: e.target.value }); handleSave() }}
                    placeholder="/images/owner-name.jpg"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-maroon-800"
                  />
                  <p className="mt-0.5 text-[10px] text-gray-400">किंवा image path टाका</p>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">मराठी नाव</label>
                    <input
                      type="text"
                      value={owner.nameMr || ""}
                      onChange={(e) => updateOwner(key, { nameMr: e.target.value })}
                      onBlur={handleSave}
                      className="font-devanagari w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-maroon-800"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">English Name</label>
                    <input
                      type="text"
                      value={owner.nameEn || ""}
                      onChange={(e) => updateOwner(key, { nameEn: e.target.value })}
                      onBlur={handleSave}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-maroon-800"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">मराठी पद</label>
                    <input
                      type="text"
                      value={owner.roleMr || ""}
                      onChange={(e) => updateOwner(key, { roleMr: e.target.value })}
                      onBlur={handleSave}
                      placeholder="संस्थापक"
                      className="font-devanagari w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-maroon-800"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">English Role</label>
                    <input
                      type="text"
                      value={owner.roleEn || ""}
                      onChange={(e) => updateOwner(key, { roleEn: e.target.value })}
                      onBlur={handleSave}
                      placeholder="Founder"
                      className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-maroon-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500">
                    फोन नंबर <span className="text-gray-400">(Phone)</span>
                  </label>
                  <input
                    type="tel"
                    value={owner.phone || ""}
                    onChange={(e) => updateOwner(key, { phone: e.target.value })}
                    onBlur={handleSave}
                    placeholder="+91 96993 71940"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-maroon-800"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500">
                    मराठी परिचय <span className="text-gray-400">(Marathi Bio)</span>
                  </label>
                  <textarea
                    value={owner.bioMr || ""}
                    onChange={(e) => updateOwner(key, { bioMr: e.target.value })}
                    onBlur={handleSave}
                    rows={2}
                    className="font-devanagari w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-maroon-800"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500">
                    English Bio
                  </label>
                  <textarea
                    value={owner.bioEn || ""}
                    onChange={(e) => updateOwner(key, { bioEn: e.target.value })}
                    onBlur={handleSave}
                    rows={2}
                    className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-maroon-800"
                  />
                </div>
              </div>
            </div>
          </div>
        )
      })}

      {/* Workshop / Shop Photo */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="font-devanagari mb-4 text-lg font-semibold text-maroon-900">
          <Store className="mr-2 inline h-5 w-5" />
          कार्यशाळा / दुकान फोटो
          <span className="ml-2 text-sm font-normal text-gray-400">(Workshop / Shop Photo)</span>
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            {data.shopImage ? (
              <div className="relative overflow-hidden rounded-xl">
                <img
                  src={data.shopImage}
                  alt="Workshop"
                  className="h-48 w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => { updateShopImage(""); handleSave() }}
                  className="absolute right-2 top-2 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRefs.shop.current?.click()}
                className="flex h-48 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 text-gray-400 transition hover:border-maroon-800 hover:text-maroon-800"
              >
                <Store className="mb-2 h-8 w-8" />
                <p className="font-devanagari text-xs font-medium">कार्यशाळा फोटो अपलोड करा</p>
                <p className="text-[10px]">Click to upload workshop photo (max 2MB)</p>
              </button>
            )}
            <input
              ref={fileRefs.shop}
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload("shop", e)}
              className="hidden"
            />
            <div className="mt-2">
              <input
                type="text"
                value={data.shopImage || ""}
                onChange={(e) => { updateShopImage(e.target.value); handleSave() }}
                placeholder="/images/shop.jpg"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-maroon-800"
              />
              <p className="mt-0.5 text-[10px] text-gray-400">किंवा image path टाका (or enter path)</p>
            </div>
          </div>
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
            <p className="font-devanagari text-sm font-medium text-blue-800">💡 मदत</p>
            <p className="font-devanagari mt-2 text-xs text-blue-700">
              • कार्यशाळेचा किंवा दुकानाचा फोटो अपलोड करा
            </p>
            <p className="font-devanagari text-xs text-blue-700">
              • हा फोटो 'आम्हाबद्दल' पेजवर दिसेल
            </p>
            <p className="mt-1 text-[10px] text-blue-600">
              This photo appears on the About page.
            </p>
          </div>
        </div>
      </div>

      {/* Help */}
      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
        <p className="font-devanagari text-sm font-medium text-blue-800">💡 मदत / Help</p>
        <p className="font-devanagari mt-2 text-sm text-blue-700">
          • फोटो अपलोड करा किंवा <code className="rounded bg-blue-100 px-1 text-xs">/images/</code> फोल्डरमधील path टाका
        </p>
        <p className="font-devanagari text-sm text-blue-700">
          • माहिती बदलल्यावर ती आपोआप जतन होते
        </p>
        <p className="mt-2 text-xs text-blue-600">
          Upload a photo or enter the path from /images/ folder. Changes auto-save.
        </p>
      </div>
    </div>
  )
}

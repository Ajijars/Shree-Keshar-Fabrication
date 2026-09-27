import { useState, useRef } from "react"
import { Plus, Trash2, Save, IndianRupee, Edit3, Check, X, ImageIcon } from "lucide-react"
import { useAdmin } from "./AdminContext"
import PageIndicator from "./PageIndicator"

export default function AdminServices() {
  const { data, updateService, addService, removeService } = useAdmin()
  const [editingId, setEditingId] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [saved, setSaved] = useState(false)
  const serviceFileRef = useRef(null)
  const [uploadingServiceId, setUploadingServiceId] = useState(null)
  const [newService, setNewService] = useState({
    titleEn: "",
    titleMr: "",
    descEn: "",
    descMr: "",
    price: "",
    priceNote: "",
    image: "",
  })

  const handleSave = (id, field, value) => {
    updateService(id, { [field]: value })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleAddService = () => {
    if (!newService.titleEn && !newService.titleMr) {
      alert("नाव टाका / Enter a name")
      return
    }
    addService(newService)
    setNewService({ titleEn: "", titleMr: "", descEn: "", descMr: "", price: "", priceNote: "", image: "" })
    setShowAdd(false)
  }

  const handleDelete = (id) => {
    if (window.confirm("ही सेवा हटवायची आहे का?\nDelete this service?")) {
      removeService(id)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-devanagari text-2xl font-bold text-gray-800">
            सेवा व किंमत
          </h1>
          <p className="text-sm text-gray-400">Services & Pricing — Update service details and rates</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
              <Check className="h-3 w-3" /> जतन झाले (Saved)
            </span>
          )}
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-maroon-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-maroon-800"
          >
            <Plus className="h-4 w-4" />
            <span className="font-devanagari">नवीन सेवा</span>
            <span className="text-xs text-white/60">(Add Service)</span>
          </button>
        </div>
      </div>

      {/* Where changes appear */}
      <PageIndicator
        pages={[
          { path: "/services", label: "सेवा पेज", icon: "🔧" },
          { path: "/", label: "होम पेज — सेवा सेक्शन", icon: "🏠" },
        ]}
        description="सेवा आणि किंमतीचे बदल 'सेवा' पेजवर आणि होम पेजवरील सेवा सेक्शनमध्ये दिसतील."
        descriptionEn="Service & pricing changes appear on the Services page and Home page services section."
      />

      {/* Add Service Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-devanagari text-lg font-bold text-gray-800">
                नवीन सेवा जोडा <span className="text-sm font-normal text-gray-400">(Add New Service)</span>
              </h2>
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    मराठी नाव
                  </label>
                  <input
                    type="text"
                    value={newService.titleMr}
                    onChange={(e) => setNewService((p) => ({ ...p, titleMr: e.target.value }))}
                    placeholder="रथ निर्माण"
                    className="font-devanagari w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-maroon-800"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    English Name
                  </label>
                  <input
                    type="text"
                    value={newService.titleEn}
                    onChange={(e) => setNewService((p) => ({ ...p, titleEn: e.target.value }))}
                    placeholder="Rath Building"
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-maroon-800"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  मराठी वर्णन <span className="text-xs text-gray-400">(Marathi Description)</span>
                </label>
                <textarea
                  value={newService.descMr}
                  onChange={(e) => setNewService((p) => ({ ...p, descMr: e.target.value }))}
                  rows={2}
                  className="font-devanagari w-full resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-maroon-800"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  English Description
                </label>
                <textarea
                  value={newService.descEn}
                  onChange={(e) => setNewService((p) => ({ ...p, descEn: e.target.value }))}
                  rows={2}
                  className="w-full resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-maroon-800"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    किंमत <span className="text-xs text-gray-400">(Price ₹)</span>
                  </label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={newService.price}
                      onChange={(e) => setNewService((p) => ({ ...p, price: e.target.value }))}
                      placeholder="50,000"
                      className="w-full rounded-xl border border-gray-200 py-2.5 pl-9 pr-4 text-sm outline-none focus:border-maroon-800"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    किंमत नोट <span className="text-xs text-gray-400">(Price Note)</span>
                  </label>
                  <input
                    type="text"
                    value={newService.priceNote}
                    onChange={(e) => setNewService((p) => ({ ...p, priceNote: e.target.value }))}
                    placeholder="पासून / Starting from"
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-maroon-800"
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
              >
                रद्द करा (Cancel)
              </button>
              <button
                type="button"
                onClick={handleAddService}
                className="flex-1 rounded-xl bg-maroon-900 py-3 text-sm font-semibold text-white transition hover:bg-maroon-800"
              >
                जतन करा (Save)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Services List */}
      <div className="space-y-4">
        {data.services.map((service) => (
          <div
            key={service.id}
            className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:shadow-sm"
          >
            {editingId === service.id ? (
              /* Edit Mode */
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">
                      मराठी नाव
                    </label>
                    <input
                      type="text"
                      defaultValue={service.titleMr}
                      onBlur={(e) => handleSave(service.id, "titleMr", e.target.value)}
                      className="font-devanagari w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-maroon-800"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">
                      English Name
                    </label>
                    <input
                      type="text"
                      defaultValue={service.titleEn}
                      onBlur={(e) => handleSave(service.id, "titleEn", e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-maroon-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500">
                    मराठी वर्णन
                  </label>
                  <textarea
                    defaultValue={service.descMr}
                    onBlur={(e) => handleSave(service.id, "descMr", e.target.value)}
                    rows={2}
                    className="font-devanagari w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-maroon-800"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500">
                    English Description
                  </label>
                  <textarea
                    defaultValue={service.descEn}
                    onBlur={(e) => handleSave(service.id, "descEn", e.target.value)}
                    rows={2}
                    className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-maroon-800"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">
                      किंमत (Price ₹)
                    </label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        defaultValue={service.price}
                        onBlur={(e) => handleSave(service.id, "price", e.target.value)}
                        placeholder="50,000"
                        className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-maroon-800"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">
                      किंमत नोट (Price Note)
                    </label>
                    <input
                      type="text"
                      defaultValue={service.priceNote}
                      onBlur={(e) => handleSave(service.id, "priceNote", e.target.value)}
                      placeholder="पासून / Starting from"
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-maroon-800"
                    />
                  </div>
                </div>

                {/* Service Image */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500">
                    सेवा फोटो <span className="text-gray-400">(Service Photo)</span>
                  </label>
                  <div className="flex items-center gap-3">
                    {service.image ? (
                      <div className="relative h-20 w-28 overflow-hidden rounded-lg">
                        <img src={service.image} alt="" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleSave(service.id, "image", "")}
                          className="absolute right-1 top-1 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => { setUploadingServiceId(service.id); serviceFileRef.current?.click() }}
                        className="flex h-20 w-28 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-gray-400 hover:border-maroon-800 hover:text-maroon-800"
                      >
                        <ImageIcon className="h-5 w-5" />
                        <span className="text-[9px]">Upload</span>
                      </button>
                    )}
                    <input
                      type="text"
                      defaultValue={service.image || ""}
                      onBlur={(e) => handleSave(service.id, "image", e.target.value)}
                      placeholder="/images/service.jpg"
                      className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-maroon-800"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
                >
                  <Check className="h-4 w-4" /> Done
                </button>
              </div>
            ) : (
              /* View Mode */
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-1 items-start gap-4">
                  {service.image && (
                    <img src={service.image} alt="" className="h-16 w-24 shrink-0 rounded-lg object-cover" />
                  )}
                  <div className="flex-1">
                    <h3 className="font-devanagari text-lg font-semibold text-maroon-900">
                      {service.titleMr}
                    </h3>
                    <p className="text-sm text-gray-500">{service.titleEn}</p>

                    {service.descMr && (
                      <p className="font-devanagari mt-2 text-sm text-gray-600">{service.descMr}</p>
                    )}

                    {service.price && (
                      <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-green-50 px-4 py-1.5 text-sm font-semibold text-green-700">
                        <IndianRupee className="h-3.5 w-3.5" />
                        {service.price}
                        {service.priceNote && (
                          <span className="ml-1 text-xs font-normal text-green-500">
                            ({service.priceNote})
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingId(service.id)}
                    className="rounded-lg border border-gray-200 p-2 text-gray-400 transition hover:bg-gray-100 hover:text-maroon-800"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(service.id)}
                    className="rounded-lg border border-gray-200 p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Hidden file input for service image upload */}
      <input
        ref={serviceFileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (!file || !uploadingServiceId) return
          if (file.size > 2 * 1024 * 1024) {
            alert("फाइल खूप मोठी! 2MB \nFile too large!")
            return
          }
          const reader = new FileReader()
          reader.onload = (ev) => {
            handleSave(uploadingServiceId, "image", ev.target.result)
            setUploadingServiceId(null)
          }
          reader.readAsDataURL(file)
          e.target.value = ""
        }}
      />

      {/* Help */}
      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
        <p className="font-devanagari text-sm font-medium text-blue-800">💡 मदत / Help</p>
        <p className="font-devanagari mt-2 text-sm text-blue-700">
          • किंमत टाकल्यावर ती वेबसाइटवर दिसेल
        </p>
        <p className="font-devanagari text-sm text-blue-700">
          • किंमत रिकामी ठेवल्यास ती दिसणार नाही
        </p>
        <p className="mt-2 text-xs text-blue-600">
          Leave price empty to hide it on website. Use "Price Note" for text like "Starting from" or "per unit".
        </p>
      </div>
    </div>
  )
}

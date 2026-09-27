import { useState, useRef } from "react"
import { Plus, Trash2, GripVertical, ImageIcon, X, Check, Edit3 } from "lucide-react"
import { useAdmin } from "./AdminContext"
import PageIndicator from "./PageIndicator"

export default function AdminGallery() {
  const { data, addGalleryImage, removeGalleryImage, updateGalleryImage, reorderGallery } = useAdmin()
  const [showUpload, setShowUpload] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [dragIndex, setDragIndex] = useState(null)
  const fileInputRef = useRef(null)

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    captionEn: "",
    captionMr: "",
    files: [],
    previews: [],
    urlPath: "",
    uploadType: "file", // "file" or "url"
  })

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Check total size to prevent localStorage quota issues
    const totalSize = files.reduce((acc, file) => acc + file.size, 0)
    if (totalSize > 4 * 1024 * 1024) {
      alert("एकूण फाइल्स खूप मोठ्या आहेत! (Max 4MB total)\nTotal file size is too large! Please select fewer or smaller files.")
      return
    }

    const readAsDataURL = (file) =>
      new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (ev) => resolve(ev.target.result)
        reader.readAsDataURL(file)
      })

    const results = await Promise.all(files.map(readAsDataURL))

    setUploadForm((prev) => ({
      ...prev,
      files,
      previews: results,
    }))
  }

  const handleUpload = () => {
    if (uploadForm.uploadType === "file") {
      if (!uploadForm.previews || uploadForm.previews.length === 0) {
        alert("फोटो निवडा\nSelect photos")
        return
      }

      uploadForm.previews.forEach((src) => {
        addGalleryImage({
          src,
          captionEn: uploadForm.captionEn || "New Photo",
          captionMr: uploadForm.captionMr || "नवीन फोटो",
          altEn: uploadForm.captionEn || "Gallery photo",
          altMr: uploadForm.captionMr || "गॅलरी फोटो",
        })
      })
    } else {
      if (!uploadForm.urlPath) {
        alert("Path टाका\nEnter path")
        return
      }
      addGalleryImage({
        src: uploadForm.urlPath,
        captionEn: uploadForm.captionEn || "New Photo",
        captionMr: uploadForm.captionMr || "नवीन फोटो",
        altEn: uploadForm.captionEn || "Gallery photo",
        altMr: uploadForm.captionMr || "गॅलरी फोटो",
      })
    }

    setUploadForm({
      captionEn: "",
      captionMr: "",
      files: [],
      previews: [],
      urlPath: "",
      uploadType: "file",
    })
    setShowUpload(false)
  }

  const handleDelete = (id) => {
    if (window.confirm("हा फोटो हटवायचा आहे का?\nDelete this photo?")) {
      removeGalleryImage(id)
    }
  }

  const handleDragStart = (index) => {
    setDragIndex(index)
  }

  const handleDragOver = (e, index) => {
    e.preventDefault()
    if (dragIndex !== null && dragIndex !== index) {
      reorderGallery(dragIndex, index)
      setDragIndex(index)
    }
  }

  const handleDragEnd = () => {
    setDragIndex(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-devanagari text-2xl font-bold text-gray-800">
            फोटो व्यवस्थापन
          </h1>
          <p className="text-sm text-gray-400">Photo Management — Upload, delete or reorder photos</p>
        </div>
        <button
          type="button"
          onClick={() => setShowUpload(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-maroon-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-maroon-800"
        >
          <Plus className="h-4 w-4" />
          <span className="font-devanagari">फोटो जोडा</span>
          <span className="text-xs text-white/60">(Add Photo)</span>
        </button>
      </div>

      {/* Where changes appear */}
      <PageIndicator
        pages={[
          { path: "/gallery", label: "गॅलरी पेज", icon: "📸" },
          { path: "/", label: "होम पेज", icon: "🏠" },
        ]}
        description="येथे जोडलेले फोटो 'गॅलरी' पेजवर दिसतील. होम पेजवरील CTA सेक्शनमध्येही दिसतील."
        descriptionEn="Photos added here appear on the Gallery page and Home page CTA section."
      />

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-devanagari text-lg font-bold text-gray-800">
                नवीन फोटो जोडा <span className="text-sm font-normal text-gray-400">(Add New Photo)</span>
              </h2>
              <button
                type="button"
                onClick={() => setShowUpload(false)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Upload Type Tabs */}
            <div className="mb-4 flex rounded-xl border border-gray-200 p-1">
              <button
                type="button"
                onClick={() => setUploadForm((p) => ({ ...p, uploadType: "file" }))}
                className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
                  uploadForm.uploadType === "file"
                    ? "bg-maroon-900 text-white"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                📁 फाइल अपलोड
              </button>
              <button
                type="button"
                onClick={() => setUploadForm((p) => ({ ...p, uploadType: "url" }))}
                className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
                  uploadForm.uploadType === "url"
                    ? "bg-maroon-900 text-white"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                🔗 Image Path / URL
              </button>
            </div>

            {uploadForm.uploadType === "file" ? (
              <div>
                {uploadForm.previews && uploadForm.previews.length > 0 ? (
                  <div className="mb-4">
                    <div className="mb-2 grid max-h-48 grid-cols-3 gap-2 overflow-y-auto">
                      {uploadForm.previews.map((preview, idx) => (
                        <div key={idx} className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50 aspect-square">
                          <img
                            src={preview}
                            alt={`Preview ${idx + 1}`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{uploadForm.previews.length} फोटो निवडले (photos selected)</span>
                      <button
                        type="button"
                        onClick={() =>
                          setUploadForm((p) => ({ ...p, files: [], previews: [] }))
                        }
                        className="font-medium text-red-500 hover:underline"
                      >
                        सर्व काढा (Clear All)
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mb-4 flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 py-10 text-gray-400 transition hover:border-maroon-800 hover:text-maroon-800"
                  >
                    <ImageIcon className="mb-2 h-10 w-10" />
                    <p className="font-devanagari text-sm font-medium">
                      फोटो निवडण्यासाठी क्लिक करा (एकापेक्षा जास्त निवडू शकता)
                    </p>
                    <p className="text-xs">Click to select photos (Multiple allowed, max 4MB total)</p>
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="mb-4">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Image Path
                </label>
                <input
                  type="text"
                  value={uploadForm.urlPath}
                  onChange={(e) =>
                    setUploadForm((p) => ({ ...p, urlPath: e.target.value }))
                  }
                  placeholder="/images/gallery/rath-1.jpg"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-maroon-800 focus:ring-2 focus:ring-maroon-800/20"
                />
                <p className="mt-1 text-xs text-gray-400">
                  Example: /images/gallery/rath-1.jpg
                </p>
              </div>
            )}

            {/* Captions */}
            <div className="mb-4">
              <div className="mb-3 rounded-xl bg-blue-50 p-3 text-sm text-blue-700">
                <span className="font-devanagari font-medium">💡 टीप:</span> फोटो अपलोड केल्यानंतर तुम्ही गॅलरीमध्ये प्रत्येकाचे नाव सहज बदलू शकता.
                <br />
                <span className="text-xs">(You can easily rename each photo later in the gallery grid.)</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    मराठी नाव <span className="text-xs text-gray-400">(Default Marathi)</span>
                  </label>
                <input
                  type="text"
                  value={uploadForm.captionMr}
                  onChange={(e) =>
                    setUploadForm((p) => ({ ...p, captionMr: e.target.value }))
                  }
                  placeholder="रथ काम"
                  className="font-devanagari w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-maroon-800 focus:ring-2 focus:ring-maroon-800/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  English Name <span className="text-xs text-gray-400">(Default English)</span>
                </label>
                <input
                  type="text"
                  value={uploadForm.captionEn}
                  onChange={(e) =>
                    setUploadForm((p) => ({ ...p, captionEn: e.target.value }))
                  }
                  placeholder="Rath Work"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-maroon-800 focus:ring-2 focus:ring-maroon-800/20"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowUpload(false)}
                className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
              >
                रद्द करा (Cancel)
              </button>
              <button
                type="button"
                onClick={handleUpload}
                className="flex-1 rounded-xl bg-maroon-900 py-3 text-sm font-semibold text-white transition hover:bg-maroon-800"
              >
                <span className="font-devanagari">जतन करा</span> (Save)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Grid */}
      {data.gallery.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 py-20 text-center">
          <ImageIcon className="mb-4 h-16 w-16 text-gray-300" />
          <p className="font-devanagari text-lg font-medium text-gray-500">
            अजून कोणताही फोटो नाही
          </p>
          <p className="text-sm text-gray-400">No photos added yet</p>
          <button
            type="button"
            onClick={() => setShowUpload(true)}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-maroon-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-maroon-800"
          >
            <Plus className="h-4 w-4" />
            पहिला फोटो जोडा (Add first photo)
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.gallery.map((img, index) => (
            <div
              key={img.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`group relative overflow-hidden rounded-2xl border bg-white shadow-sm transition ${
                dragIndex === index
                  ? "border-saffron-500 opacity-60"
                  : "border-gray-200 hover:shadow-md"
              }`}
            >
              {/* Image */}
              <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                <img
                  src={img.src}
                  alt={img.captionEn}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.target.src = ""
                    e.target.className = "hidden"
                  }}
                />
              </div>

              {/* Drag handle */}
              <div className="absolute left-2 top-2 cursor-grab rounded-lg bg-black/40 p-1.5 text-white opacity-0 transition group-hover:opacity-100">
                <GripVertical className="h-4 w-4" />
              </div>

              {/* Delete button */}
              <button
                type="button"
                onClick={() => handleDelete(img.id)}
                className="absolute right-2 top-2 rounded-lg bg-red-500/90 p-1.5 text-white opacity-0 transition hover:bg-red-600 group-hover:opacity-100"
              >
                <Trash2 className="h-4 w-4" />
              </button>

              {/* Caption */}
              <div className="p-3">
                {editingId === img.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      defaultValue={img.captionMr}
                      className="font-devanagari w-full rounded-lg border border-gray-200 px-2 py-1.5 text-xs outline-none focus:border-maroon-800"
                      placeholder="मराठी नाव"
                      onBlur={(e) => {
                        updateGalleryImage(img.id, { captionMr: e.target.value })
                      }}
                    />
                    <input
                      type="text"
                      defaultValue={img.captionEn}
                      className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-xs outline-none focus:border-maroon-800"
                      placeholder="English name"
                      onBlur={(e) => {
                        updateGalleryImage(img.id, { captionEn: e.target.value })
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="flex items-center gap-1 rounded-lg bg-green-500 px-3 py-1 text-xs font-medium text-white"
                    >
                      <Check className="h-3 w-3" /> Done
                    </button>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-devanagari text-sm font-medium text-gray-800">
                        {img.captionMr}
                      </p>
                      <p className="text-xs text-gray-400">{img.captionEn}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingId(img.id)}
                      className="shrink-0 rounded-lg p-1.5 text-gray-300 transition hover:bg-gray-100 hover:text-gray-600"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Help */}
      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
        <p className="font-devanagari text-sm font-medium text-blue-800">
          💡 मदत / Help
        </p>
        <p className="font-devanagari mt-2 text-sm text-blue-700">
          • <strong>फोटो जोडा:</strong> "फोटो जोडा" बटण दाबा → फाइल निवडा किंवा path टाका
        </p>
        <p className="font-devanagari text-sm text-blue-700">
          • <strong>फोटो हटवा:</strong> फोटोवर hover करा → लाल 🗑️ बटण दाबा
        </p>
        <p className="font-devanagari text-sm text-blue-700">
          • <strong>क्रम बदला:</strong> फोटो drag करून दुसऱ्या जागी ठेवा
        </p>
        <p className="font-devanagari text-sm text-blue-700">
          • <strong>नाव बदला:</strong> ✏️ बटण दाबा → नवीन नाव टाइप करा
        </p>
        <p className="mt-2 text-xs text-blue-600">
          For best results, use images smaller than 2MB. Use "Image Path" tab to reference photos in public/images/gallery/ folder.
        </p>
      </div>
    </div>
  )
}

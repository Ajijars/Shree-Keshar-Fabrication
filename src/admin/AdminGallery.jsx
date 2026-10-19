import { useState, useRef } from "react"
import {
  Plus,
  Trash2,
  GripVertical,
  ImageIcon,
  X,
  Edit3,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Download,
  Upload,
  Check,
} from "lucide-react"
import { useAdmin } from "./AdminContext"
import PageIndicator from "./PageIndicator"
import { DEFAULT_GALLERY_PHOTOS } from "../data/defaultGallery"
import toast from "react-hot-toast"

export default function AdminGallery() {
  const {
    data,
    addGalleryImage,
    removeGalleryImage,
    updateGalleryImage,
    reorderGallery,
    moveGalleryItem,
    resetGalleryToDefault,
    importDefaultPhotos,
  } = useAdmin()

  const [showUpload, setShowUpload] = useState(false)
  const [dragIndex, setDragIndex] = useState(null)
  const fileInputRef = useRef(null)

  // Edit modal state for updating existing photo (captions, category, or replacing image)
  const [editModalPhoto, setEditModalPhoto] = useState(null)
  const [editForm, setEditForm] = useState({
    captionMr: "",
    captionEn: "",
    category: "rath",
    src: "",
    newFilePreview: "",
  })
  const [isSavingEdit, setIsSavingEdit] = useState(false)
  const editFileInputRef = useRef(null)

  // Upload form state for adding new photos
  const [uploadForm, setUploadForm] = useState({
    captionEn: "",
    captionMr: "",
    category: "rath",
    files: [],
    previews: [],
    urlPath: "",
    uploadType: "file", // "file" or "url"
  })

  // Handle file select for adding photos
  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

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

  // Handle uploading/adding new photo(s)
  const handleUpload = () => {
    if (uploadForm.uploadType === "file") {
      if (!uploadForm.previews || uploadForm.previews.length === 0) {
        alert("फोटो निवडा\nSelect photos")
        return
      }

      uploadForm.previews.forEach((src) => {
        addGalleryImage({
          src,
          captionEn: uploadForm.captionEn || "Rath Work",
          captionMr: uploadForm.captionMr || "रथ काम",
          altEn: uploadForm.captionEn || "Rath fabrication",
          altMr: uploadForm.captionMr || "रथ फॅब्रिकेशन",
          category: uploadForm.category || "rath",
        })
      })
    } else {
      if (!uploadForm.urlPath) {
        alert("Path किंवा URL टाका\nEnter path or URL")
        return
      }
      addGalleryImage({
        src: uploadForm.urlPath,
        captionEn: uploadForm.captionEn || "Rath Work",
        captionMr: uploadForm.captionMr || "रथ काम",
        altEn: uploadForm.captionEn || "Rath fabrication",
        altMr: uploadForm.captionMr || "रथ फॅब्रिकेशन",
        category: uploadForm.category || "rath",
      })
    }

    setUploadForm({
      captionEn: "",
      captionMr: "",
      category: "rath",
      files: [],
      previews: [],
      urlPath: "",
      uploadType: "file",
    })
    setShowUpload(false)
    toast.success("फोटो जोडला! (Photo added!)")
  }

  // Open Edit Modal for an existing photo
  const handleOpenEdit = (photo) => {
    setEditModalPhoto(photo)
    setEditForm({
      captionMr: photo.captionMr || "",
      captionEn: photo.captionEn || "",
      category: photo.category || "rath",
      src: photo.src || "",
      newFilePreview: "",
    })
  }

  // Select replacement photo in Edit Modal
  const handleEditFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 4 * 1024 * 1024) {
      alert("फाइल खूप मोठी आहे! (Max 4MB)\nImage file is too large!")
      return
    }

    const reader = new FileReader()
    reader.onload = (ev) => {
      setEditForm((prev) => ({
        ...prev,
        newFilePreview: ev.target.result,
      }))
    }
    reader.readAsDataURL(file)
  }

  // Save changes to an existing photo
  const handleSaveEdit = async () => {
    if (!editModalPhoto) return
    setIsSavingEdit(true)
    try {
      const finalSrc = editForm.newFilePreview || editForm.src
      await updateGalleryImage(editModalPhoto.id, {
        captionMr: editForm.captionMr,
        captionEn: editForm.captionEn,
        category: editForm.category,
        src: finalSrc,
      })
      setEditModalPhoto(null)
      toast.success("फोटो अपडेट झाला! (Photo updated!)")
    } catch {
      toast.error("अपडेट करताना त्रुटी आली. (Error updating photo)")
    } finally {
      setIsSavingEdit(false)
    }
  }

  // Delete an existing photo with confirmation
  const handleDelete = (id, caption = "") => {
    const confirmMsg = caption
      ? `हा फोटो हटवायचा आहे का?\nDelete this photo? (${caption})`
      : "हा फोटो हटवायचा आहे का?\nDelete this photo?"

    if (window.confirm(confirmMsg)) {
      removeGalleryImage(id)
      if (editModalPhoto && editModalPhoto.id === id) {
        setEditModalPhoto(null)
      }
      toast.success("फोटो हटवला! (Photo deleted!)")
    }
  }

  // Import all 16 workshop default photos
  const handleImportDefaults = () => {
    importDefaultPhotos()
    toast.success("मूळ १६ फोटो आयात झाले! (16 default photos imported!)")
  }

  // Reset to original 16 default photos
  const handleResetDefaults = () => {
    if (
      window.confirm(
        "गॅलरी मूळ १६ फोटोंवर पूर्ववत करायची आहे का? (नवीन जोडलेले फोटो निघून जातील)\nReset gallery to original 16 photos?"
      )
    ) {
      resetGalleryToDefault()
      toast.success("गॅलरी पूर्ववत झाली! (Gallery reset to default 16 photos!)")
    }
  }

  // Desktop Drag & Drop handlers
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

  // Check if all 16 defaults are present
  const hasAllDefaults = DEFAULT_GALLERY_PHOTOS.every((dp) =>
    data.gallery.some((img) => img.src === dp.src)
  )

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-devanagari text-2xl font-bold text-gray-800">
              फोटो व्यवस्थापन
            </h1>
            <span className="rounded-full bg-maroon-100 px-2.5 py-0.5 text-xs font-bold text-maroon-900">
              {data.gallery.length} फोटो
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">
            Photo Management — Add, update, replace, reorder or delete photos
          </p>
        </div>

        {/* Action Buttons Header */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowUpload(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-maroon-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-maroon-800 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span className="font-devanagari">फोटो जोडा</span>
            <span className="text-xs text-white/70">(Add Photo)</span>
          </button>

          <button
            type="button"
            onClick={handleResetDefaults}
            title="मूळ १६ फोटोंवर पूर्ववत करा"
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 active:scale-95"
          >
            <RotateCcw className="h-3.5 w-3.5 text-gray-500" />
            <span>मूळ १६ पूर्ववत करा</span>
          </button>
        </div>
      </div>

      {/* Where changes appear indicator */}
      <PageIndicator
        pages={[
          { path: "/gallery", label: "गॅलरी पेज", icon: "📸" },
          { path: "/", label: "होम पेज", icon: "🏠" },
        ]}
        description="येथे केलेले सर्व बदल लगेच 'गॅलरी' पेजवर आणि होम पेजवरील सेक्शनमध्ये दिसतील."
        descriptionEn="All updates, replacements, and deletions instantly reflect on the live Gallery & Home pages."
      />

      {/* Prompt banner to import all 16 workshop default photos if missing */}
      {!hasAllDefaults && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50/90 p-4 shadow-sm">
          <div>
            <p className="font-devanagari font-bold text-sm text-amber-900">
              💡 कार्यशाळेचे आधीचे १६ मूळ फोटो येथे संपादित किंवा हटवायचे आहेत का?
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              Want to edit, replace or delete the workshop's existing 16 photos? Click to load them all here.
            </p>
          </div>
          <button
            type="button"
            onClick={handleImportDefaults}
            className="shrink-0 flex items-center gap-1.5 rounded-xl bg-amber-700 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-amber-800 active:scale-95 transition"
          >
            <Download className="h-4 w-4" />
            <span>मूळ १६ फोटो आयात करा</span>
            <span className="opacity-80 text-[10px]">(Import 16)</span>
          </button>
        </div>
      )}

      {/* Add New Photo Modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl bg-white p-5 sm:p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between sticky top-0 bg-white pb-2 border-b border-gray-100 z-10">
              <h2 className="font-devanagari text-base sm:text-lg font-bold text-gray-800">
                नवीन फोटो जोडा <span className="text-xs sm:text-sm font-normal text-gray-400">(Add New Photo)</span>
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
            <div className="mb-4 flex rounded-xl border border-gray-200 p-1 bg-gray-50">
              <button
                type="button"
                onClick={() => setUploadForm((p) => ({ ...p, uploadType: "file" }))}
                className={`flex-1 rounded-lg py-2 text-xs sm:text-sm font-medium transition ${
                  uploadForm.uploadType === "file"
                    ? "bg-maroon-900 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                📁 मोबाइल/फाइल अपलोड
              </button>
              <button
                type="button"
                onClick={() => setUploadForm((p) => ({ ...p, uploadType: "url" }))}
                className={`flex-1 rounded-lg py-2 text-xs sm:text-sm font-medium transition ${
                  uploadForm.uploadType === "url"
                    ? "bg-maroon-900 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
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
                    <div className="flex items-center justify-between text-xs text-gray-500">
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
                    className="mb-4 flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 py-10 text-gray-500 transition hover:border-maroon-800 hover:text-maroon-800 bg-gray-50/50"
                  >
                    <ImageIcon className="mb-2 h-10 w-10 text-gray-400" />
                    <p className="font-devanagari text-sm font-bold text-gray-700">
                      कॅमेरा किंवा गॅलरीतून फोटो निवडा
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Tap to select photos from phone or computer</p>
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
                <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                  Image Path / URL
                </label>
                <input
                  type="text"
                  value={uploadForm.urlPath}
                  onChange={(e) =>
                    setUploadForm((p) => ({ ...p, urlPath: e.target.value }))
                  }
                  placeholder="/images/gallery/rath-1.jpg किंवा https://..."
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-maroon-800 focus:ring-1 focus:ring-maroon-800"
                />
              </div>
            )}

            {/* Captions & Category */}
            <div className="space-y-3 mb-5">
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">
                  मराठी शीर्षक (Marathi Title)
                </label>
                <input
                  type="text"
                  value={uploadForm.captionMr}
                  onChange={(e) =>
                    setUploadForm((p) => ({ ...p, captionMr: e.target.value }))
                  }
                  placeholder="उदा. चांदीचा भव्य मंदिर रथ"
                  className="font-devanagari w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-maroon-800"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">
                  English Title
                </label>
                <input
                  type="text"
                  value={uploadForm.captionEn}
                  onChange={(e) =>
                    setUploadForm((p) => ({ ...p, captionEn: e.target.value }))
                  }
                  placeholder="e.g. Mastercraft Silver Temple Rath"
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-maroon-800"
                />
              </div>

              {/* Category */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">
                  श्रेणी (Category)
                </label>
                <select
                  value={uploadForm.category}
                  onChange={(e) =>
                    setUploadForm((p) => ({ ...p, category: e.target.value }))
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-maroon-800"
                >
                  <option value="rath">भव्य रथ निर्मिती (Grand Raths)</option>
                  <option value="fabrication">मेटल फॅब्रिकेशन (Fabrication)</option>
                  <option value="yatra">दिंडी व पायी यात्रा (Dindi & Yatra)</option>
                </select>
              </div>
            </div>

            {/* Modal Buttons */}
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
                className="flex-1 rounded-xl bg-maroon-900 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-maroon-800"
              >
                <span className="font-devanagari">जतन करा</span> (Save)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit / Replace Photo Modal */}
      {editModalPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl bg-white p-5 sm:p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between sticky top-0 bg-white pb-2 border-b border-gray-100 z-10">
              <div className="flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-maroon-900" />
                <h2 className="font-devanagari text-base sm:text-lg font-bold text-gray-800">
                  फोटो संपादित करा / बदला
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setEditModalPhoto(null)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Current Image & Replace Option */}
            <div className="mb-5 rounded-2xl border border-gray-200 bg-gray-50/70 p-3">
              <p className="text-xs font-semibold text-gray-700 mb-2">
                सध्याचा / नवीन फोटो (Current or New Photo):
              </p>
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-gray-200 border border-gray-300">
                <img
                  src={editForm.newFilePreview || editForm.src}
                  alt={editForm.captionEn || "Photo preview"}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none"
                  }}
                />
                {editForm.newFilePreview && (
                  <span className="absolute bottom-2 right-2 rounded-md bg-green-600 px-2 py-0.5 text-[11px] font-bold text-white shadow">
                    नवीन निवडलेला फोटो (New Photo)
                  </span>
                )}
              </div>

              {/* Change Image Button */}
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => editFileInputRef.current?.click()}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-gray-300 bg-white py-2 text-xs font-bold text-gray-800 shadow-sm hover:bg-gray-50 active:scale-95 transition"
                >
                  <Upload className="h-3.5 w-3.5 text-maroon-900" />
                  <span>नवीन फोटो फाइल निवडा (Choose New File)</span>
                </button>
                {editForm.newFilePreview && (
                  <button
                    type="button"
                    onClick={() => setEditForm((p) => ({ ...p, newFilePreview: "" }))}
                    className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100"
                  >
                    रद्द (Reset)
                  </button>
                )}
                <input
                  ref={editFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleEditFileSelect}
                  className="hidden"
                />
              </div>

              <div className="mt-2">
                <label className="text-[11px] font-medium text-gray-500">
                  किंवा Image Path / URL:
                </label>
                <input
                  type="text"
                  value={editForm.src}
                  onChange={(e) => setEditForm((p) => ({ ...p, src: e.target.value }))}
                  placeholder="/images/gallery/rath-1.jpg किंवा URL"
                  className="mt-0.5 w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-700 outline-none focus:border-maroon-800"
                />
              </div>
            </div>

            {/* Title & Category form */}
            <div className="space-y-3 mb-5">
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">
                  मराठी नाव (Marathi Title)
                </label>
                <input
                  type="text"
                  value={editForm.captionMr}
                  onChange={(e) => setEditForm((p) => ({ ...p, captionMr: e.target.value }))}
                  placeholder="उदा. चांदीचा रथ — ॐ घुमट"
                  className="font-devanagari w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-maroon-800"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">
                  English Title
                </label>
                <input
                  type="text"
                  value={editForm.captionEn}
                  onChange={(e) => setEditForm((p) => ({ ...p, captionEn: e.target.value }))}
                  placeholder="e.g. Silver Rath with Om Domes"
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-maroon-800"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">
                  श्रेणी (Category)
                </label>
                <select
                  value={editForm.category}
                  onChange={(e) => setEditForm((p) => ({ ...p, category: e.target.value }))}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-maroon-800"
                >
                  <option value="rath">भव्य रथ निर्मिती (Grand Raths)</option>
                  <option value="fabrication">मेटल फॅब्रिकेशन (Fabrication)</option>
                  <option value="yatra">दिंडी व पायी यात्रा (Dindi & Yatra)</option>
                </select>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditModalPhoto(null)}
                  className="flex-1 rounded-xl border border-gray-200 py-2.5 text-xs sm:text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                >
                  रद्द करा (Cancel)
                </button>
                <button
                  type="button"
                  disabled={isSavingEdit}
                  onClick={handleSaveEdit}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-maroon-900 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:bg-maroon-800 disabled:opacity-50"
                >
                  <Check className="h-4 w-4" />
                  <span>{isSavingEdit ? "जतन होत आहे..." : "बदल जतन करा (Save)"}</span>
                </button>
              </div>

              {/* Danger delete button inside modal */}
              <button
                type="button"
                onClick={() => handleDelete(editModalPhoto.id, editModalPhoto.captionMr)}
                className="mt-1 flex items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>हा फोटो कायमचा हटवा (Delete This Photo)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Photos Grid */}
      {data.gallery.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 py-16 px-4 text-center bg-gray-50/50">
          <ImageIcon className="mb-3 h-14 w-14 text-gray-300" />
          <p className="font-devanagari text-lg font-bold text-gray-700">
            कोणताही फोटो जोडलेला नाही
          </p>
          <p className="text-xs text-gray-400 mt-1">
            No photos in your gallery yet. You can import all 16 workshop default photos or add new ones.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={handleImportDefaults}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-amber-800 shadow-sm"
            >
              <Download className="h-4 w-4" />
              मूळ १६ फोटो लोड करा (Load Default 16)
            </button>
            <button
              type="button"
              onClick={() => setShowUpload(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-maroon-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-maroon-800 shadow-sm"
            >
              <Plus className="h-4 w-4" />
              नवीन फोटो जोडा (Add New Photo)
            </button>
          </div>
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
              className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md ${
                dragIndex === index
                  ? "border-saffron-500 opacity-60"
                  : "border-gray-200"
              }`}
            >
              <div>
                {/* Image Container with Badges */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                  <img
                    src={img.src}
                    alt={img.captionEn || img.captionMr}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.style.display = "none"
                    }}
                  />

                  {/* Position Badge */}
                  <div className="absolute left-2.5 top-2.5 rounded-full bg-black/60 px-2 py-0.5 text-[11px] font-bold text-white backdrop-blur-sm shadow-sm pointer-events-none">
                    #{index + 1}
                  </div>

                  {/* Category Pill */}
                  {img.category && (
                    <div className="absolute left-2.5 bottom-2.5 rounded-md bg-maroon-900/85 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm shadow-sm pointer-events-none">
                      {img.category === "rath"
                        ? "रथ"
                        : img.category === "fabrication"
                        ? "फॅब्रिकेशन"
                        : "दिंडी/यात्रा"}
                    </div>
                  )}

                  {/* Desktop drag handle */}
                  <div className="absolute left-10 top-2.5 hidden sm:flex cursor-grab rounded-lg bg-black/40 p-1.5 text-white opacity-0 transition group-hover:opacity-100">
                    <GripVertical className="h-3.5 w-3.5" />
                  </div>

                  {/* Visible Delete Button (Always visible on mobile, hover on desktop) */}
                  <button
                    type="button"
                    onClick={() => handleDelete(img.id, img.captionMr)}
                    title="फोटो हटवा (Delete photo)"
                    aria-label="फोटो हटवा (Delete photo)"
                    className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-lg bg-red-600/95 text-white shadow-md transition hover:bg-red-700 active:scale-90 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 z-10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Captions */}
                <div className="p-3 pb-1">
                  <p className="font-devanagari text-sm font-bold text-gray-800 leading-snug line-clamp-2">
                    {img.captionMr || "शीर्षक नाही"}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                    {img.captionEn || "No English name"}
                  </p>
                </div>
              </div>

              {/* Action Bar (Dedicated buttons on card footer) */}
              <div className="p-3 pt-2">
                <div className="flex items-center gap-1.5 border-t border-gray-100 pt-2.5">
                  {/* Edit / Replace Photo button */}
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(img)}
                    className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-maroon-800/30 bg-maroon-50/70 py-2 text-xs font-bold text-maroon-900 transition hover:bg-maroon-100 active:scale-95"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>संपादित करा</span>
                    <span className="text-[10px] font-normal opacity-70">(Edit)</span>
                  </button>

                  {/* Direct Delete button with label */}
                  <button
                    type="button"
                    onClick={() => handleDelete(img.id, img.captionMr)}
                    title="फोटो हटवा (Delete)"
                    className="flex items-center justify-center gap-1 rounded-xl border border-red-200 bg-red-50 px-2.5 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100 active:scale-95"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span className="text-[11px]">हटवा</span>
                  </button>

                  {/* Mobile Up/Down Reorder Buttons */}
                  <div className="flex items-center gap-0.5 pl-1 border-l border-gray-200">
                    <button
                      type="button"
                      onClick={() => moveGalleryItem(index, "up")}
                      disabled={index === 0}
                      title="वर हलवा (Move up)"
                      aria-label="वर हलवा"
                      className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-20 active:scale-90 transition"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveGalleryItem(index, "down")}
                      disabled={index === data.gallery.length - 1}
                      title="खाली हलवा (Move down)"
                      aria-label="खाली हलवा"
                      className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-20 active:scale-90 transition"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Helpful Mobile & Desktop Instructions */}
      <div className="rounded-2xl border border-blue-200 bg-blue-50/90 p-5 shadow-sm">
        <p className="font-devanagari text-sm font-bold text-blue-900 flex items-center gap-1.5">
          <span>💡</span>
          <span>फोटो कसे बदलायचे / हटवायचे? (Help & Guide)</span>
        </p>
        <div className="mt-3 space-y-2 text-xs sm:text-sm text-blue-800 font-devanagari">
          <p>
            • <strong>फोटो बदलण्यासाठी / नाव बदलण्यासाठी:</strong> प्रत्येक फोटोखाली दिलेले{" "}
            <span className="font-bold text-maroon-900 bg-maroon-50 px-1.5 py-0.5 rounded border border-maroon-200">
              ✏️ संपादित करा (Edit)
            </span>{" "}
            बटन दाबा. तेथून नवीन फोटो निवडू शकता, नाव किंवा श्रेणी बदलू शकता.
          </p>
          <p>
            • <strong>फोटो हटवण्यासाठी:</strong> फोटोवरील किंवा खालील लाल{" "}
            <span className="font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
              🗑️ हटवा (Delete)
            </span>{" "}
            बटन दाबा. फोटो लगेच काढून टाकला जाईल.
          </p>
          <p>
            • <strong>क्रम बदलण्यासाठी:</strong> फोटोखालील <strong>⬆️</strong> आणि <strong>⬇️</strong> बाण दाबा किंवा कॉम्प्युटरवर फोटो drag करा.
          </p>
          <p>
            • <strong>मूळ १६ फोटो आणण्यासाठी:</strong> वरील <strong>"मूळ १६ फोटो आयात करा"</strong> बटन दाबा.
          </p>
        </div>
      </div>
    </div>
  )
}

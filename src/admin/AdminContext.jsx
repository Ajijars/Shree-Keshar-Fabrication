/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react"
import toast from "react-hot-toast"
import { DEFAULT_GALLERY_PHOTOS } from "../data/defaultGallery"

const AdminContext = createContext(null)

const STORAGE_KEY = "sk-admin-data"
const AUTH_KEY = "sk-admin-auth"
const KEY_STORAGE = "sk-admin-key"

// Live AWS API Gateway Endpoint
const API_BASE = "https://9n5fxaqqel.execute-api.ap-southeast-2.amazonaws.com"

// Inactivity timeout: 30 minutes
const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000

const defaultData = {
  gallery: DEFAULT_GALLERY_PHOTOS,
  services: [
    {
      id: "1",
      titleEn: "Rath Building",
      titleMr: "रथ निर्माण",
      descEn: "Custom-built temple chariots (Rath) for Dindi Yatra, Payi Yatra, and religious processions across Maharashtra.",
      descMr: "दिंडी यात्रा, पायी यात्रा आणि धार्मिक मिरवणुकीसाठी सानुकूल रथ निर्माण.",
      price: "",
      priceNote: "",
      image: "",
    },
    {
      id: "2",
      titleEn: "Maintenance & Repair",
      titleMr: "देखभाल व दुरुस्ती",
      descEn: "Complete restoration, repainting, and structural repair of existing Rath and fabrication work.",
      descMr: "विद्यमान रथ व फॅब्रिकेशन कामाची संपूर्ण जीर्णोद्धार, पुनर्रंगवणूक आणि संरचनात्मक दुरुस्ती.",
      price: "",
      priceNote: "",
      image: "",
    },
    {
      id: "3",
      titleEn: "Custom Fabrication",
      titleMr: "सानुकूल फॅब्रिकेशन",
      descEn: "Steel and metal fabrication for gates, railings, decorative structures, and custom metalwork projects.",
      descMr: "गेट, रेलिंग, सजावटीच्या संरचना आणि सानुकूल धातूकाम प्रकल्पांसाठी स्टील व धातू फॅब्रिकेशन.",
      price: "",
      priceNote: "",
      image: "",
    },
    {
      id: "4",
      titleEn: "Pan-Maharashtra Service",
      titleMr: "संपूर्ण महाराष्ट्र सेवा",
      descEn: "We deliver and set up across all of Maharashtra — from Pandharpur to Nashik, Pune to Kolhapur.",
      descMr: "संपूर्ण महाराष्ट्रभर वितरण — पंढरपूर ते नाशिक, पुणे ते कोल्हापूर.",
      price: "",
      priceNote: "",
      image: "",
    },
  ],
  contact: {
    phone: "+91 96993 71940",
    phone1: "+91 96993 71940",
    phone2: "+91 96993 71940",
    email: "shreekesharfabrication@gmail.com",
    address: "Near Main Road, Maharashtra",
    whatsapp: "919699371940",
    mapLink: "#",
  },
  hero: {
    image: "/images/hero.jpg",
  },
  shopImage: "",
  owners: {
    prabhakar: {
      nameEn: "Prabhakar Mhaske",
      nameMr: "प्रभाकर म्हसके",
      roleEn: "Founder & Master Craftsman",
      roleMr: "संस्थापक व मुख्य कारागीर",
      bioEn: "With decades of devotion and skill, Prabhakar Mhaske has built countless Rath for Viththal Dindi and Payi Yatra across Maharashtra.",
      bioMr: "अनेक दशकांच्या भक्ती आणि कौशल्याने, प्रभाकर म्हसके यांनी महाराष्ट्रभर विठ्ठल दिंडी व पायी यात्रेसाठी असंख्य रथ बांधले.",
      phone: "+91 96993 71940",
      image: "/images/owner-prabhakar.jpg",
    },
    harsh: {
      nameEn: "Harsh Mhaske",
      nameMr: "हर्ष म्हसके",
      roleEn: "Co-Owner & Next Generation",
      roleMr: "सह-मालक",
      bioEn: "Harsh Mhaske carries forward the family legacy, blending modern fabrication techniques with the sacred art of Rath building.",
      bioMr: "हर्ष म्हसके कौटुंबिक वारसा पुढे नेत आहेत — आधुनिक फॅब्रिकेशन तंत्रज्ञान आणि पवित्र रथ कला यांचा समन्वय.",
      phone: "+91 96993 71940",
      image: "/images/owner-harsh.jpg",
    },
  },
  social: {
    facebook: "#",
    instagram: "#",
    youtube: "#",
  },
}

function loadLocalData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      let gallery = DEFAULT_GALLERY_PHOTOS
      if (Array.isArray(parsed.gallery) && parsed.gallery.length > 0) {
        const validPhotos = parsed.gallery.filter(
          (img) => img && img.src && !img.src.includes("test.png")
        )
        if (validPhotos.length >= 16) {
          gallery = validPhotos
        } else if (validPhotos.length > 0) {
          const customSet = new Set(validPhotos.map((p) => p.src))
          const missingDefaults = DEFAULT_GALLERY_PHOTOS.filter((dp) => !customSet.has(dp.src))
          gallery = [...validPhotos, ...missingDefaults]
        }
      }
      return { ...defaultData, ...parsed, gallery }
    }
  } catch {
    // ignore
  }
  return defaultData
}

export function AdminProvider({ children }) {
  const [data, setData] = useState(loadLocalData)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem(AUTH_KEY) === "true"
  })
  const isInitialMount = useRef(true)

  const getAdminKey = useCallback(() => {
    return sessionStorage.getItem(KEY_STORAGE) || ""
  }, [])

  const logout = useCallback((reason = "") => {
    setIsAuthenticated(false)
    sessionStorage.removeItem(AUTH_KEY)
    sessionStorage.removeItem(KEY_STORAGE)
    if (reason === "inactivity") {
      toast.error("सुरक्षेसाठी सत्र कालबाह्य झाले. कृपया पुन्हा लॉगिन करा. (Session timed out)")
    }
  }, [])

  // Auto-logout after 30 minutes of inactivity for enhanced security
  useEffect(() => {
    if (!isAuthenticated) return

    let timer
    const resetTimer = () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        logout("inactivity")
      }, INACTIVITY_TIMEOUT_MS)
    }

    const activityEvents = ["mousedown", "mousemove", "keydown", "scroll", "touchstart"]
    activityEvents.forEach((evt) => window.addEventListener(evt, resetTimer, { passive: true }))

    resetTimer()

    return () => {
      clearTimeout(timer)
      activityEvents.forEach((evt) => window.removeEventListener(evt, resetTimer))
    }
  }, [isAuthenticated, logout])

  // Fetch live data from AWS on mount
  useEffect(() => {
    let isMounted = true
    async function fetchRemoteData() {
      try {
        const res = await fetch(API_BASE, { method: "GET" })
        if (res.ok) {
          const json = await res.json()
          if (json.data && isMounted) {
            setData((prev) => {
              let remoteGallery = DEFAULT_GALLERY_PHOTOS
              if (Array.isArray(json.data.gallery) && json.data.gallery.length > 0) {
                const validPhotos = json.data.gallery.filter(
                  (img) => img && img.src && !img.src.includes("test.png")
                )
                if (validPhotos.length >= 16) {
                  remoteGallery = validPhotos
                } else if (validPhotos.length > 0) {
                  const customSet = new Set(validPhotos.map((p) => p.src))
                  const missingDefaults = DEFAULT_GALLERY_PHOTOS.filter((dp) => !customSet.has(dp.src))
                  remoteGallery = [...validPhotos, ...missingDefaults]
                }
              }
              return {
                ...defaultData,
                ...prev,
                ...json.data,
                gallery: remoteGallery,
              }
            })
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...defaultData, ...json.data }))
          }
        }
      } catch (err) {
        console.warn("Could not reach AWS API, using local data cache:", err)
      }
    }
    fetchRemoteData()
    return () => {
      isMounted = false
    }
  }, [])

  // Sync to local storage & AWS DynamoDB when data changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))

    // Only sync writes to AWS if admin is authenticated
    if (isAuthenticated) {
      const timeout = setTimeout(async () => {
        try {
          await fetch(`${API_BASE}/data`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-admin-key": getAdminKey(),
            },
            body: JSON.stringify({ data }),
          })
        } catch (err) {
          console.error("Failed to save data to AWS:", err)
        }
      }, 500)

      return () => clearTimeout(timeout)
    }
  }, [data, isAuthenticated, getAdminKey])

  // Secure login via AWS Lambda PBKDF2 authentication
  const login = useCallback(async (password) => {
    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", password }),
      })
      if (res.ok) {
        setIsAuthenticated(true)
        sessionStorage.setItem(AUTH_KEY, "true")
        sessionStorage.setItem(KEY_STORAGE, password)
        return { success: true }
      }
      return { success: false, error: "चुकीचा पासवर्ड / Wrong password" }
    } catch {
      return { success: false, error: "सर्व्हरशी संपर्क होऊ शकला नाही. / Server connection error." }
    }
  }, [])

  // Secure change password via AWS Lambda
  const changePassword = useCallback(async (currentPassword, newPassword) => {
    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "change-password",
          currentPassword,
          newPassword,
        }),
      })
      const json = await res.json()
      if (res.ok) {
        sessionStorage.setItem(KEY_STORAGE, newPassword)
        return { success: true, message: "पासवर्ड यशस्वीरित्या बदलला! (Password updated!)" }
      }
      return { success: false, error: json.error || "Failed to change password" }
    } catch (err) {
      return { success: false, error: err.message || "Network error" }
    }
  }, [])

  // Secure password reset using Master Recovery PIN via AWS Lambda
  const resetPasswordWithPin = useCallback(async (recoveryPin, newPassword) => {
    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reset-with-pin",
          recoveryPin,
          newPassword,
        }),
      })
      const json = await res.json()
      if (res.ok) {
        return { success: true, message: json.message || "पासवर्ड रीसेट झाला! (Password reset successfully)" }
      }
      return { success: false, error: json.error || "रिकव्हरी पिन चुकीचा आहे / Failed to reset password" }
    } catch {
      return { success: false, error: "सर्व्हरशी संपर्क होऊ शकला नाही. / Network error." }
    }
  }, [])

  // Send 6-digit SMS OTP to registered mobile (+91 96993 71940) via AWS SNS
  const sendSmsOtp = useCallback(async () => {
    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send-otp" }),
      })
      const json = await res.json()
      if (res.ok) {
        return { success: true, message: json.message || "OTP पाठवला आहे!", phone: json.phone }
      }
      return { success: false, error: json.error || "OTP पाठवण्यात त्रुटी" }
    } catch {
      return { success: false, error: "सर्व्हरशी संपर्क होऊ शकला नाही. (Network error)" }
    }
  }, [])

  // Verify OTP and reset admin password via AWS Lambda & DynamoDB
  const verifyOtpAndReset = useCallback(async (otp, newPassword) => {
    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify-otp-reset",
          otp,
          newPassword,
        }),
      })
      const json = await res.json()
      if (res.ok) {
        return { success: true, message: json.message || "पासवर्ड यशस्वीरित्या बदलला!" }
      }
      return { success: false, error: json.error || "चुकीचा किंवा कालबाह्य OTP" }
    } catch {
      return { success: false, error: "सर्व्हरशी संपर्क होऊ शकला नाही. (Network error)" }
    }
  }, [])

  // Universal S3 image uploader (converts base64 to permanent S3 URL)
  const uploadImage = useCallback(async (base64Data, filename = `img_${Date.now()}.jpg`) => {
    if (!base64Data || typeof base64Data !== "string" || !base64Data.startsWith("data:image")) {
      return base64Data
    }
    try {
      const uploadRes = await fetch(`${API_BASE}/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": getAdminKey(),
        },
        body: JSON.stringify({
          action: "upload",
          filename,
          base64Data,
          contentType: "image/jpeg",
        }),
      })

      if (uploadRes.ok) {
        const uploadJson = await uploadRes.json()
        if (uploadJson.url) {
          return uploadJson.url
        }
      }
    } catch (uploadErr) {
      console.warn("S3 upload failed, keeping original:", uploadErr)
    }
    return base64Data
  }, [getAdminKey])

  // Gallery operations: Uploads image to AWS S3 & adds to gallery state
  const addGalleryImage = useCallback(async (imageData) => {
    let finalSrc = imageData.src
    if (finalSrc && finalSrc.startsWith("data:image")) {
      finalSrc = await uploadImage(finalSrc, `rath_${Date.now()}.jpg`)
    }

    setData((prev) => ({
      ...prev,
      gallery: [
        ...prev.gallery,
        {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          src: finalSrc,
          captionEn: imageData.captionEn || "Rath Work",
          captionMr: imageData.captionMr || "रथ काम",
          altEn: imageData.altEn || "Rath fabrication",
          altMr: imageData.altMr || "रथ फॅब्रिकेशन",
          createdAt: new Date().toISOString(),
        },
      ],
    }))
  }, [uploadImage])

  const removeGalleryImage = useCallback((id) => {
    setData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((img) => img.id !== id),
    }))
  }, [])

  const updateGalleryImage = useCallback(async (id, updates) => {
    let finalUpdates = { ...updates }
    if (finalUpdates.src && finalUpdates.src.startsWith("data:image")) {
      finalUpdates.src = await uploadImage(finalUpdates.src, `rath_${id}_${Date.now()}.jpg`)
    }
    setData((prev) => ({
      ...prev,
      gallery: prev.gallery.map((img) => (img.id === id ? { ...img, ...finalUpdates } : img)),
    }))
  }, [uploadImage])

  const moveGalleryItem = useCallback((index, direction) => {
    setData((prev) => {
      const targetIndex = direction === "up" ? index - 1 : index + 1
      if (targetIndex < 0 || targetIndex >= prev.gallery.length) return prev
      const newGallery = [...prev.gallery]
      const temp = newGallery[index]
      newGallery[index] = newGallery[targetIndex]
      newGallery[targetIndex] = temp
      return { ...prev, gallery: newGallery }
    })
  }, [])

  const resetGalleryToDefault = useCallback(() => {
    setData((prev) => ({
      ...prev,
      gallery: [...DEFAULT_GALLERY_PHOTOS],
    }))
  }, [])

  const importDefaultPhotos = useCallback(() => {
    setData((prev) => {
      const existingSrcs = new Set(prev.gallery.map((img) => img.src))
      const toAdd = DEFAULT_GALLERY_PHOTOS.filter((img) => !existingSrcs.has(img.src))
      return {
        ...prev,
        gallery: [...prev.gallery, ...toAdd],
      }
    })
  }, [])

  const reorderGallery = useCallback((fromIndex, toIndex) => {
    setData((prev) => {
      const newGallery = [...prev.gallery]
      const [moved] = newGallery.splice(fromIndex, 1)
      newGallery.splice(toIndex, 0, moved)
      return { ...prev, gallery: newGallery }
    })
  }, [])

  // Services operations with automatic S3 image upload
  const updateService = useCallback(async (id, updates) => {
    let finalUpdates = { ...updates }
    if (finalUpdates.image && finalUpdates.image.startsWith("data:image")) {
      finalUpdates.image = await uploadImage(finalUpdates.image, `service_${id}_${Date.now()}.jpg`)
    }
    setData((prev) => ({
      ...prev,
      services: prev.services.map((s) => (s.id === id ? { ...s, ...finalUpdates } : s)),
    }))
  }, [uploadImage])

  const addService = useCallback(async (service) => {
    let finalService = { ...service }
    if (finalService.image && finalService.image.startsWith("data:image")) {
      finalService.image = await uploadImage(finalService.image, `service_${Date.now()}.jpg`)
    }
    setData((prev) => ({
      ...prev,
      services: [...prev.services, { id: Date.now().toString(), ...finalService }],
    }))
  }, [uploadImage])

  const removeService = useCallback((id) => {
    setData((prev) => ({
      ...prev,
      services: prev.services.filter((s) => s.id !== id),
    }))
  }, [])

  // Contact operations
  const updateContact = useCallback((updates) => {
    setData((prev) => {
      const merged = { ...prev.contact, ...updates }
      if (updates.phone && !updates.phone1) merged.phone1 = updates.phone
      if (updates.phone1 && !updates.phone) merged.phone = updates.phone1
      return { ...prev, contact: merged }
    })
  }, [])

  // Hero operations
  const updateHero = useCallback(async (updates) => {
    let finalUpdates = { ...updates }
    if (finalUpdates.image && finalUpdates.image.startsWith("data:image")) {
      finalUpdates.image = await uploadImage(finalUpdates.image, `hero_${Date.now()}.jpg`)
    }
    setData((prev) => ({
      ...prev,
      hero: { ...prev.hero, ...finalUpdates },
    }))
  }, [uploadImage])

  // Shop image with automatic S3 upload
  const updateShopImage = useCallback(async (src) => {
    let finalSrc = src
    if (finalSrc && finalSrc.startsWith("data:image")) {
      finalSrc = await uploadImage(finalSrc, `shop_${Date.now()}.jpg`)
    }
    setData((prev) => ({ ...prev, shopImage: finalSrc }))
  }, [uploadImage])

  // Owner operations with automatic S3 upload
  const updateOwner = useCallback(async (key, updates) => {
    let finalUpdates = { ...updates }
    if (finalUpdates.image && finalUpdates.image.startsWith("data:image")) {
      finalUpdates.image = await uploadImage(finalUpdates.image, `owner_${key}_${Date.now()}.jpg`)
    }
    setData((prev) => ({
      ...prev,
      owners: {
        ...prev.owners,
        [key]: { ...prev.owners[key], ...finalUpdates },
      },
    }))
  }, [uploadImage])

  // Social operations
  const updateSocial = useCallback((updates) => {
    setData((prev) => ({
      ...prev,
      social: { ...prev.social, ...updates },
    }))
  }, [])

  // Reset to defaults
  const resetToDefaults = useCallback(() => {
    setData(defaultData)
  }, [])

  return (
    <AdminContext.Provider
      value={{
        data,
        isAuthenticated,
        login,
        changePassword,
        resetPasswordWithPin,
        sendSmsOtp,
        verifyOtpAndReset,
        logout,
        uploadImage,
        addGalleryImage,
        removeGalleryImage,
        updateGalleryImage,
        reorderGallery,
        moveGalleryItem,
        resetGalleryToDefault,
        importDefaultPhotos,
        updateService,
        addService,
        removeService,
        updateContact,
        updateHero,
        updateShopImage,
        updateOwner,
        updateSocial,
        resetToDefaults,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider")
  return ctx
}

// Hook for public site components to consume live admin data
export function useAdminData() {
  const { data } = useAdmin()
  return data
}

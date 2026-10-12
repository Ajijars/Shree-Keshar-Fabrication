import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react"

const AdminContext = createContext(null)

const STORAGE_KEY = "sk-admin-data"
const AUTH_KEY = "sk-admin-auth"

// Live AWS API Gateway Endpoint
const API_BASE = "https://9n5fxaqqel.execute-api.ap-southeast-2.amazonaws.com"

// Default admin password
const ADMIN_PASSWORD = "keshar2024"

const defaultData = {
  gallery: [],
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
      image: "",
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
      return { ...defaultData, ...parsed }
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

  // Fetch live data from AWS on mount
  useEffect(() => {
    let isMounted = true
    async function fetchRemoteData() {
      try {
        const res = await fetch(API_BASE, { method: "GET" })
        if (res.ok) {
          const json = await res.json()
          if (json.data && isMounted) {
            setData((prev) => ({
              ...defaultData,
              ...prev,
              ...json.data,
            }))
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
          await fetch(API_BASE, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-admin-key": ADMIN_PASSWORD,
            },
            body: JSON.stringify({ data }),
          })
        } catch (err) {
          console.error("Failed to save data to AWS:", err)
        }
      }, 500)

      return () => clearTimeout(timeout)
    }
  }, [data, isAuthenticated])

  const login = useCallback((password) => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      sessionStorage.setItem(AUTH_KEY, "true")
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    setIsAuthenticated(false)
    sessionStorage.removeItem(AUTH_KEY)
  }, [])

  // Gallery operations: Uploads image to AWS S3 & adds to gallery state
  const addGalleryImage = useCallback(async (imageData) => {
    let finalSrc = imageData.src

    // If source is base64 image data, upload directly to S3 bucket
    if (finalSrc && finalSrc.startsWith("data:image")) {
      try {
        const uploadRes = await fetch(`${API_BASE}/upload`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-key": ADMIN_PASSWORD,
          },
          body: JSON.stringify({
            action: "upload",
            filename: `rath_${Date.now()}.jpg`,
            base64Data: finalSrc,
            contentType: "image/jpeg",
          }),
        })

        if (uploadRes.ok) {
          const uploadJson = await uploadRes.json()
          if (uploadJson.url) {
            finalSrc = uploadJson.url
          }
        }
      } catch (uploadErr) {
        console.warn("S3 upload failed, keeping local preview:", uploadErr)
      }
    }

    setData((prev) => ({
      ...prev,
      gallery: [
        ...prev.gallery,
        {
          id: Date.now().toString(),
          src: finalSrc,
          captionEn: imageData.captionEn || "Rath Work",
          captionMr: imageData.captionMr || "रथ काम",
          altEn: imageData.altEn || "Rath fabrication",
          altMr: imageData.altMr || "रथ फॅब्रिकेशन",
          createdAt: new Date().toISOString(),
        },
      ],
    }))
  }, [])

  const removeGalleryImage = useCallback((id) => {
    setData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((img) => img.id !== id),
    }))
  }, [])

  const updateGalleryImage = useCallback((id, updates) => {
    setData((prev) => ({
      ...prev,
      gallery: prev.gallery.map((img) => (img.id === id ? { ...img, ...updates } : img)),
    }))
  }, [])

  const reorderGallery = useCallback((fromIndex, toIndex) => {
    setData((prev) => {
      const newGallery = [...prev.gallery]
      const [moved] = newGallery.splice(fromIndex, 1)
      newGallery.splice(toIndex, 0, moved)
      return { ...prev, gallery: newGallery }
    })
  }, [])

  // Services operations
  const updateService = useCallback((id, updates) => {
    setData((prev) => ({
      ...prev,
      services: prev.services.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }))
  }, [])

  const addService = useCallback((service) => {
    setData((prev) => ({
      ...prev,
      services: [...prev.services, { id: Date.now().toString(), ...service }],
    }))
  }, [])

  const removeService = useCallback((id) => {
    setData((prev) => ({
      ...prev,
      services: prev.services.filter((s) => s.id !== id),
    }))
  }, [])

  // Contact operations
  const updateContact = useCallback((updates) => {
    setData((prev) => ({
      ...prev,
      contact: { ...prev.contact, ...updates },
    }))
  }, [])

  // Hero operations
  const updateHero = useCallback((updates) => {
    setData((prev) => ({
      ...prev,
      hero: { ...prev.hero, ...updates },
    }))
  }, [])

  // Shop image
  const updateShopImage = useCallback((src) => {
    setData((prev) => ({ ...prev, shopImage: src }))
  }, [])

  // Owner operations
  const updateOwner = useCallback((key, updates) => {
    setData((prev) => ({
      ...prev,
      owners: {
        ...prev.owners,
        [key]: { ...prev.owners[key], ...updates },
      },
    }))
  }, [])

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
        logout,
        addGalleryImage,
        removeGalleryImage,
        updateGalleryImage,
        reorderGallery,
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

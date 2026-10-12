import { Helmet } from "react-helmet-async"
import { useTranslation } from "../i18n/LanguageContext"

export default function SEO({ title, description, image, url }) {
  const { language } = useTranslation()
  
  const siteTitle = language === "mr" ? "श्री केशर फॅब्रिकेशन" : "Shree Keshar Fabrication"
  const defaultDescription = language === "mr" 
    ? "दिंडी यात्रा आणि धार्मिक मिरवणुकीसाठी सानुकूल रथ निर्माण. पंढरपूर, आळंदी, देहू आणि संपूर्ण महाराष्ट्रात सेवा." 
    : "Custom-built temple chariots (Rath) for Dindi Yatra and religious processions across Maharashtra."
    
  const defaultImage = "/images/hero.jpg" // Using hero image as default share image
  const siteUrl = "https://www.shreekesharfabrication.in"

  const seoTitle = title ? `${title} | ${siteTitle}` : siteTitle
  const seoDescription = description || defaultDescription
  const seoImage = image ? `${siteUrl}${image}` : `${siteUrl}${defaultImage}`
  const seoUrl = url ? `${siteUrl}${url}` : siteUrl

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      
      {/* Open Graph / Facebook / WhatsApp */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:site_name" content={siteTitle} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={seoUrl} />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />
      
      {/* Language */}
      <html lang={language} />
    </Helmet>
  )
}

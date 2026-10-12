import PageBanner from "../components/PageBanner"
import Gallery from "../components/Gallery"
import { useTranslation } from "../i18n/LanguageContext"
import SEO from "../components/SEO"

export default function GalleryPage() {
  const { t } = useTranslation()

  return (
    <main>
      <SEO title={t("gallery.pageTitle")} url="/gallery" />
      <PageBanner title={t("gallery.pageTitle")} subtitle={t("gallery.pageSubtitle")} />
      <Gallery showHeading={false} />
    </main>
  )
}

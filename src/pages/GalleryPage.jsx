import PageBanner from "../components/PageBanner"
import Gallery from "../components/Gallery"
import { useTranslation } from "../i18n/LanguageContext"

export default function GalleryPage() {
  const { t } = useTranslation()

  return (
    <main>
      <PageBanner title={t("gallery.pageTitle")} subtitle={t("gallery.pageSubtitle")} />
      <Gallery showHeading={false} />
    </main>
  )
}

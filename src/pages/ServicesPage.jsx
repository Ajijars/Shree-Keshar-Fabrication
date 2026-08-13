import PageBanner from "../components/PageBanner"
import Services from "../components/Services"
import ServiceProcess from "../components/ServiceProcess"
import { useTranslation } from "../i18n/LanguageContext"

export default function ServicesPage() {
  const { t } = useTranslation()

  return (
    <main>
      <PageBanner title={t("services.pageTitle")} subtitle={t("services.pageSubtitle")} />
      <Services showHeading={false} />
      <ServiceProcess />
    </main>
  )
}

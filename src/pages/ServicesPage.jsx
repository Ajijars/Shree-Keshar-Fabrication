import PageBanner from "../components/PageBanner"
import Services from "../components/Services"
import ServiceProcess from "../components/ServiceProcess"
import { useTranslation } from "../i18n/LanguageContext"
import SEO from "../components/SEO"

export default function ServicesPage() {
  const { t } = useTranslation()

  return (
    <main>
      <SEO title={t("services.pageTitle")} url="/services" />
      <PageBanner title={t("services.pageTitle")} subtitle={t("services.pageSubtitle")} />
      <Services showHeading={false} />
      <ServiceProcess />
    </main>
  )
}

import PageBanner from "../components/PageBanner"
import About from "../components/About"
import WhyChooseUs from "../components/WhyChooseUs"
import ServiceAreas from "../components/ServiceAreas"
import { useTranslation } from "../i18n/LanguageContext"

export default function AboutPage() {
  const { t } = useTranslation()

  return (
    <main>
      <PageBanner title={t("about.pageTitle")} subtitle={t("about.pageSubtitle")} />
      <About showHeading={false} />
      <WhyChooseUs showHeading={false} />
      <ServiceAreas />
    </main>
  )
}

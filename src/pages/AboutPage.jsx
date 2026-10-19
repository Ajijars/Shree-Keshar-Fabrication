import PageBanner from "../components/PageBanner"
import About from "../components/About"
import WhyChooseUs from "../components/WhyChooseUs"
import Testimonials from "../components/Testimonials"
import FAQ from "../components/FAQ"
import ServiceAreas from "../components/ServiceAreas"
import { useTranslation } from "../i18n/LanguageContext"
import SEO from "../components/SEO"

export default function AboutPage() {
  const { t } = useTranslation()

  return (
    <main>
      <SEO title={t("about.pageTitle")} url="/about" />
      <PageBanner title={t("about.pageTitle")} subtitle={t("about.pageSubtitle")} />
      <About showHeading={false} />
      <WhyChooseUs showHeading={false} />
      <FAQ />
      <Testimonials />
      <ServiceAreas />
    </main>
  )
}

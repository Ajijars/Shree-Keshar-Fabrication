import PageBanner from "../components/PageBanner"
import ContactForm from "../components/ContactForm"
import { useTranslation } from "../i18n/LanguageContext"
import SEO from "../components/SEO"

export default function ContactPage() {
  const { t } = useTranslation()

  return (
    <main>
      <SEO title={t("contact.pageTitle")} url="/contact" />
      <PageBanner title={t("contact.pageTitle")} subtitle={t("contact.pageSubtitle")} />
      <ContactForm showHeading={false} />
    </main>
  )
}

import PageBanner from "../components/PageBanner"
import ContactForm from "../components/ContactForm"
import { useTranslation } from "../i18n/LanguageContext"

export default function ContactPage() {
  const { t } = useTranslation()

  return (
    <main>
      <PageBanner title={t("contact.pageTitle")} subtitle={t("contact.pageSubtitle")} />
      <ContactForm showHeading={false} />
    </main>
  )
}

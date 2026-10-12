import PageBanner from "../components/PageBanner"
import Owners from "../components/Owners"
import { useTranslation } from "../i18n/LanguageContext"
import SEO from "../components/SEO"

export default function OwnersPage() {
  const { t } = useTranslation()

  return (
    <main>
      <SEO title={t("owners.pageTitle")} url="/owners" />
      <PageBanner title={t("owners.pageTitle")} subtitle={t("owners.pageSubtitle")} />
      <Owners showHeading={false} />
    </main>
  )
}

import PageBanner from "../components/PageBanner"
import Owners from "../components/Owners"
import { useTranslation } from "../i18n/LanguageContext"

export default function OwnersPage() {
  const { t } = useTranslation()

  return (
    <main>
      <PageBanner title={t("owners.pageTitle")} subtitle={t("owners.pageSubtitle")} />
      <Owners showHeading={false} />
    </main>
  )
}

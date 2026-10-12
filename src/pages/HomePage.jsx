import Hero from "../components/Hero"
import HomeIntro from "../components/HomeIntro"
import HomeServicesPreview from "../components/HomeServicesPreview"
import HomeHighlights from "../components/HomeHighlights"
import HomeCTA from "../components/HomeCTA"
import SEO from "../components/SEO"

export default function HomePage() {
  return (
    <main>
      <SEO title="Home" url="/" />
      <Hero />
      <HomeIntro />
      <HomeServicesPreview />
      <HomeHighlights />
      <HomeCTA />
    </main>
  )
}

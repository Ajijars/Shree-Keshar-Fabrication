import Hero from "../components/Hero"
import HomeIntro from "../components/HomeIntro"
import HomeServicesPreview from "../components/HomeServicesPreview"
import HomeHighlights from "../components/HomeHighlights"
import HomeCTA from "../components/HomeCTA"

export default function HomePage() {
  return (
    <main>
      <Hero />
      <HomeIntro />
      <HomeServicesPreview />
      <HomeHighlights />
      <HomeCTA />
    </main>
  )
}

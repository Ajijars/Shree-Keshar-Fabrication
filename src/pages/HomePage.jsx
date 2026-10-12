import Hero from "../components/Hero"
import TrustTicker from "../components/TrustTicker"
import HomeIntro from "../components/HomeIntro"
import HomeServicesPreview from "../components/HomeServicesPreview"
import HomeEstimatorTeaser from "../components/HomeEstimatorTeaser"
import HomeHighlights from "../components/HomeHighlights"
import Testimonials from "../components/Testimonials"
import HomeCTA from "../components/HomeCTA"
import SEO from "../components/SEO"

export default function HomePage() {
  return (
    <main>
      <SEO title="Home" url="/" />
      <Hero />
      <TrustTicker />
      <HomeIntro />
      <HomeServicesPreview />
      <HomeEstimatorTeaser />
      <HomeHighlights />
      <Testimonials />
      <HomeCTA />
    </main>
  )
}


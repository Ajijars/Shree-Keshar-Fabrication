import { useState, useEffect } from "react"
import { ArrowUp } from "lucide-react"

export default function BackToTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 350)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={`fixed bottom-24 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-amber-400/40 bg-white/95 text-slate-800 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-amber-500 hover:bg-amber-50 hover:text-amber-700 hover:shadow-amber-500/20 active:scale-95 sm:bottom-6 sm:right-20 ${
        visible
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "translate-y-6 opacity-0 pointer-events-none"
      }`}
    >
      <ArrowUp className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
    </button>
  )
}

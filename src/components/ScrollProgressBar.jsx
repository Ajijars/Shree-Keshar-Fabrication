import { useState, useEffect } from "react"

export default function ScrollProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    let ticking = false

    const updateScrollProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setScrollProgress(progress)
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollProgress)
        ticking = true
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    updateScrollProgress()

    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div
      aria-hidden="true"
      className="fixed left-0 top-0 z-[60] h-1 w-full bg-slate-100/40 pointer-events-none"
    >
      <div
        className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 shadow-[0_0_12px_rgba(245,158,11,0.6)] transition-all duration-100 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  )
}

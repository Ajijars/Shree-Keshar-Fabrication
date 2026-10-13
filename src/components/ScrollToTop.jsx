import { useEffect } from "react"
import { useLocation } from "react-router-dom"

export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const timer = setTimeout(() => {
        const el = document.querySelector(hash)
        if (el) {
          el.scrollIntoView({ behavior: "smooth" })
        }
      }, 100)
      return () => clearTimeout(timer)
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])

  return null
}

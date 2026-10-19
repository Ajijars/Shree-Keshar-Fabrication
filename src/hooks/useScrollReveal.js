import { useEffect } from "react"
import { useLocation } from "react-router-dom"

/**
 * useScrollReveal:
 * Automatically observes all elements with .reveal-on-scroll,
 * .reveal-from-left, .reveal-from-right, or .reveal-zoom in the DOM.
 * When an element enters the viewport, adds the 'is-revealed' class.
 * Re-runs on route changes.
 */
export function useScrollReveal() {
  const { pathname } = useLocation()

  useEffect(() => {
    // Check if IntersectionObserver is supported
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll(".reveal-on-scroll, .reveal-from-left, .reveal-from-right, .reveal-zoom")
        .forEach((el) => el.classList.add("is-revealed"))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed")
            // Once revealed, unobserve to free memory
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    )

    // Slight delay to allow DOM render on route change
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll(
        ".reveal-on-scroll:not(.is-revealed), .reveal-from-left:not(.is-revealed), .reveal-from-right:not(.is-revealed), .reveal-zoom:not(.is-revealed)"
      )
      elements.forEach((el) => observer.observe(el))
    }, 60)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [pathname])
}

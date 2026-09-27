import { ExternalLink } from "lucide-react"
import { Link } from "react-router-dom"

/**
 * Shows the admin which website section/page they are editing.
 * Displays page name in Marathi + English with a preview link.
 */
export default function PageIndicator({ pages, description, descriptionEn }) {
  return (
    <div className="mb-6 rounded-2xl border border-saffron-500/20 bg-saffron-500/5 p-4">
      <p className="font-devanagari text-sm font-medium text-maroon-900">
        📍 हे बदल कुठे दिसतील? <span className="text-xs font-normal text-gray-400">(Where will changes appear?)</span>
      </p>

      <div className="mt-2 flex flex-wrap gap-2">
        {pages.map((page) => (
          <a
            key={page.path}
            href={page.path}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-maroon-800/15 bg-white px-3 py-1.5 text-xs font-medium text-maroon-800 shadow-sm transition hover:border-maroon-800/30 hover:shadow-md"
          >
            <span>{page.icon}</span>
            <span className="font-devanagari">{page.label}</span>
            <ExternalLink className="h-3 w-3 text-gray-400" />
          </a>
        ))}
      </div>

      {description && (
        <p className="font-devanagari mt-2 text-xs text-gray-500">
          {description}
        </p>
      )}
      {descriptionEn && (
        <p className="mt-0.5 text-xs text-gray-400">
          {descriptionEn}
        </p>
      )}
    </div>
  )
}

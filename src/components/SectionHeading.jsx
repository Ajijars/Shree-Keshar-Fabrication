export default function SectionHeading({ title, subtitle, light = false }) {
  return (
    <div className="mx-auto mb-12 max-w-2xl text-center">
      <h2
        className={`font-display text-3xl font-bold tracking-tight sm:text-4xl ${light ? "text-white" : "text-maroon-900"}`}
      >
        {title}
      </h2>
      <div className="mx-auto mt-4 flex items-center justify-center gap-2">
        <span className={`h-px w-12 ${light ? "bg-gold-500/60" : "bg-gold-500"}`} />
        <span className={`text-lg ${light ? "text-gold-400" : "text-gold-500"}`}>✦</span>
        <span className={`h-px w-12 ${light ? "bg-gold-500/60" : "bg-gold-500"}`} />
      </div>
      {subtitle && (
        <p className={`mt-4 text-base leading-relaxed ${light ? "text-white/75" : "text-gray-600"}`}>
          {subtitle}
        </p>
      )}
    </div>
  )
}

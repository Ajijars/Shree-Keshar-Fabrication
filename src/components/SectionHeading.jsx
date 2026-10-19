export default function SectionHeading({ title, subtitle, light = false }) {
  return (
    <div className="mx-auto mb-8 sm:mb-14 max-w-2xl text-center reveal-on-scroll">
      <h2
        className={`font-display text-2xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl leading-tight ${
          light ? "text-white" : "text-slate-900"
        }`}
      >
        {title}
      </h2>
      <div className="mx-auto mt-4 flex items-center justify-center gap-3">
        <span className={`h-0.5 w-12 rounded-full ${light ? "bg-gradient-to-r from-transparent to-amber-400" : "bg-gradient-to-r from-transparent to-amber-500"}`} />
        <span className={`text-base font-bold ${light ? "text-amber-300" : "text-amber-600"}`}>✦</span>
        <span className={`h-0.5 w-12 rounded-full ${light ? "bg-gradient-to-l from-transparent to-amber-400" : "bg-gradient-to-l from-transparent to-amber-500"}`} />
      </div>
      {subtitle && (
        <p className={`font-devanagari mt-4 text-sm sm:text-base leading-relaxed ${light ? "text-slate-200" : "text-slate-600"}`}>
          {subtitle}
        </p>
      )}
    </div>
  )
}


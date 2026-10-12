export default function PageBanner({ title, subtitle }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/80 via-white to-amber-50/40 pt-32 pb-16 sm:pt-36 sm:pb-20 border-b border-amber-200/50">
      <div className="pattern-overlay absolute inset-0 opacity-10" />
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <h1 className="font-display text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="font-devanagari mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            {subtitle}
          </p>
        )}
        <div className="mt-6 flex items-center gap-2">
          <span className="h-px w-12 bg-amber-500/60" />
          <span className="text-amber-600">✦</span>
          <span className="h-px w-12 bg-amber-500/60" />
        </div>
      </div>
    </section>
  )
}

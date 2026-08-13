export default function PageBanner({ title, subtitle }) {
  return (
    <section className="relative overflow-hidden bg-maroon-950 pt-28 pb-16 sm:pt-32 sm:pb-20">
      <div className="absolute inset-0 bg-gradient-to-br from-maroon-950 via-maroon-900 to-maroon-800" />
      <div className="pattern-overlay absolute inset-0 opacity-25" />
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold-500/5 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-saffron-500/5 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <h1 className="font-display text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
            {subtitle}
          </p>
        )}
        <div className="mt-6 flex items-center gap-2">
          <span className="h-px w-12 bg-gold-500/60" />
          <span className="text-gold-400">✦</span>
          <span className="h-px w-12 bg-gold-500/60" />
        </div>
      </div>
    </section>
  )
}

export default function ImagePlaceholder({
  label = "Demo Image",
  sublabel = "Replace with your photo",
  aspect = "aspect-video",
  className = "",
  variant = "default",
}) {
  const variants = {
    default: "from-maroon-900 via-maroon-800 to-maroon-950",
    hero: "from-maroon-950 via-maroon-900 to-black",
    gold: "from-maroon-800 via-maroon-900 to-maroon-950",
    devotional: "from-amber-900 via-maroon-900 to-maroon-950",
  }

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${variants[variant]} ${aspect} ${className}`}
    >
      <div className="pattern-overlay absolute inset-0 opacity-60" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-gold-500/40 bg-gold-500/10">
          <svg
            className="h-7 w-7 text-gold-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>
        </div>
        <p className="font-display text-lg font-semibold text-gold-400">{label}</p>
        <p className="max-w-xs text-sm text-white/60">{sublabel}</p>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
    </div>
  )
}

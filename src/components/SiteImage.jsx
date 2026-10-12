import { useState } from "react"
import ImagePlaceholder from "./ImagePlaceholder"

export default function SiteImage({
  src,
  alt = "",
  label,
  sublabel,
  aspect = "aspect-video",
  variant = "default",
  className = "",
  imgClassName = "object-cover",
}) {
  const [hasError, setHasError] = useState(false)

  if (src && !hasError) {
    return (
      <div className={`relative overflow-hidden ${aspect} ${className}`}>
        <img
          src={src}
          alt={alt}
          className={`h-full w-full ${imgClassName}`}
          loading="lazy"
          onError={() => setHasError(true)}
        />
      </div>
    )
  }

  return (
    <ImagePlaceholder
      label={label}
      sublabel={sublabel}
      aspect={aspect}
      variant={variant}
      className={className}
    />
  )
}

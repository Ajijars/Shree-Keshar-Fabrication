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
  if (src) {
    return (
      <div className={`relative overflow-hidden ${aspect} ${className}`}>
        <img
          src={src}
          alt={alt}
          className={`h-full w-full ${imgClassName}`}
          loading="lazy"
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

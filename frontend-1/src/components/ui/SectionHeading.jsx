import FadeIn from "./FadeIn";

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className = "",
}) {
  const alignClass = align === "center" ? "items-center text-center mx-auto" : "items-start text-left";

  return (
    <FadeIn className={`flex flex-col gap-5 ${alignClass} ${className}`}>
      {eyebrow && (
        <span className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.08em] text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          {eyebrow}
        </span>
      )}
      <h2 className="text-[32px] md:text-[40px] font-semibold tracking-[-0.02em] leading-[1.15] text-ink max-w-[640px]">
        {title}
      </h2>
      {subtitle && (
        <p className="text-[17px] leading-relaxed text-muted max-w-[560px]">
          {subtitle}
        </p>
      )}
    </FadeIn>
  );
}

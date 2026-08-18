import FadeIn from "./FadeIn";

export default function Panel({ title, description, action, children, className = "" }) {
  return (
    <FadeIn className={`card-shadow rounded-[24px] border border-line bg-white p-7 sm:p-8 ${className}`}>
      {(title || action) && (
        <div className="mb-7 flex items-start justify-between gap-6">
          <div className="min-w-0">
            {title && <h2 className="text-[16px] font-semibold leading-6 text-ink">{title}</h2>}
            {description && <p className="mt-2 text-[13.5px] leading-5 text-muted">{description}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </FadeIn>
  );
}

export function FormField({ label, error, children, hint }) {
  return (
    <label className="flex flex-col gap-2.5">
      <span className="text-[14px] font-medium text-ink">{label}</span>
      {children}
      {hint && !error && <span className="text-[12.5px] text-muted">{hint}</span>}
      {error && <span className="text-[12.5px] font-medium text-red-600">{error}</span>}
    </label>
  );
}

// h-12 (48px) gives a real, consistent input height regardless of the
// browser's default line-height math; px-4/py-[13px] keeps text off
// the border on every side.
const baseInput =
  "h-[52px] w-full rounded-xl border border-line bg-white px-4 text-[14px] leading-5 text-ink placeholder:text-muted outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/15";

export function Input({ className = "", ...props }) {
  return <input className={`${baseInput} ${className}`} {...props} />;
}

// Textarea grows with content, so no fixed height here — but the same
// horizontal/vertical padding rhythm as everything else.
export function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={`w-full rounded-xl border border-line bg-white px-4 py-3.5 text-[14px] text-ink placeholder:text-muted outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15 resize-none ${className}`}
      rows={3}
      {...props}
    />
  );
}

export function Select({ children, className = "", ...props }) {
  return (
    <select className={`${baseInput} appearance-none bg-white ${className}`} {...props}>
      {children}
    </select>
  );
}

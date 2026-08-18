export default function EmptyState({ icon: Icon, title, body, action }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-[22px] border border-dashed border-line bg-white/60 px-6 py-16 text-center">
      {Icon && (
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-tint text-primary">
          <Icon size={20} strokeWidth={2} />
        </span>
      )}
      <p className="text-[14.5px] font-semibold text-ink">{title}</p>
      {body && <p className="max-w-[320px] text-[13px] text-muted">{body}</p>}
      {action}
    </div>
  );
}

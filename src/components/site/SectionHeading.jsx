export default function SectionHeading({ eyebrow, title, description, align = 'left', action }) {
  const centered = align === 'center';
  return (
    <div
      className={`flex flex-col gap-4 ${
        centered ? 'items-center text-center' : 'sm:flex-row sm:items-end sm:justify-between'
      }`}
    >
      <div className={centered ? 'max-w-2xl' : 'max-w-2xl'}>
        {eyebrow && (
          <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
        )}
        <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
          {title}
        </h2>
        {description && (
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
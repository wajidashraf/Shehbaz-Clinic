type DemoNoticeProps = {
  description: string;
  title: string;
};

export function DemoNotice({ description, title }: DemoNoticeProps) {
  return (
    <aside className="flex gap-4 rounded-lg border border-[var(--line-strong)] bg-[var(--aqua-soft)] p-5 sm:p-6">
      <span
        aria-hidden="true"
        className="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--teal)] font-extrabold text-[var(--primary-ink)]"
      >
        i
      </span>
      <div>
        <p className="font-extrabold text-[var(--ink)]">{title}</p>
        <p className="mt-1 text-sm leading-6 text-[var(--muted-text)]">
          {description}
        </p>
      </div>
    </aside>
  );
}

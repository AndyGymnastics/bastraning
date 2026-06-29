interface SummaryCardProps {
  title: string;
  value: string;
  hint?: string;
}

export function SummaryCard({ title, value, hint }: SummaryCardProps) {
  return (
    <article className="summary-card">
      <h3>{title}</h3>
      <p className="summary-card__value">{value}</p>
      {hint ? <p className="summary-card__hint muted">{hint}</p> : null}
    </article>
  );
}

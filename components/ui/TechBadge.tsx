interface TechBadgeProps {
  label: string;
}

export function TechBadge({ label }: TechBadgeProps) {
  return (
    <span className="text-xs px-2.5 py-1 rounded-lg bg-bg-tertiary text-text-muted border border-border">
      {label}
    </span>
  );
}

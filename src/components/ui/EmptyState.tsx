export function EmptyState({
  icon,
  heading,
  subtext,
}: {
  icon: string
  heading: string
  subtext: string
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="text-4xl mb-4">{icon}</span>
      <h3 className="text-lg font-medium text-[var(--text)]">{heading}</h3>
      <p className="text-sm text-[var(--text-muted)] mt-1">{subtext}</p>
    </div>
  )
}

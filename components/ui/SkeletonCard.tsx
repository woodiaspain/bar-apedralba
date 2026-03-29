interface SkeletonCardProps {
  lines?: number
}

export default function SkeletonCard({ lines = 3 }: SkeletonCardProps) {
  return (
    <div className="animate-pulse space-y-3 rounded-xl bg-brand-offwhite p-6">
      <div className="h-5 w-2/3 rounded bg-brand-earth/20" />
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 rounded bg-brand-earth/15"
          style={{ width: `${85 - i * 10}%` }}
        />
      ))}
    </div>
  )
}

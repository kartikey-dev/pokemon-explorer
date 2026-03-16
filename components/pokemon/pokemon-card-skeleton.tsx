import { Skeleton } from '@/components/ui/skeleton'

export function PokemonCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-2xl glass-card p-4 sm:p-5">
      {/* Top accent stripe placeholder */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-muted/60 rounded-t-2xl" />

      <div className="flex flex-col items-center gap-3">
        {/* ID */}
        <div className="self-end">
          <Skeleton className="h-4 w-10 rounded-md" />
        </div>
        {/* Sprite */}
        <Skeleton className="h-28 w-28 sm:h-36 sm:w-36 rounded-full" />
        {/* Name */}
        <Skeleton className="h-4 w-20 rounded-lg" />
        {/* Type badges */}
        <div className="flex gap-1.5">
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
      </div>
    </div>
  )
}

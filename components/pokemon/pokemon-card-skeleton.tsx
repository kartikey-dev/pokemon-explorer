import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function PokemonCardSkeleton() {
  return (
    <Card className="overflow-hidden border-0 bg-card shadow-lg rounded-2xl">
      <CardContent className="p-5">
        <div className="flex flex-col items-center gap-3 relative">
          {/* ID skeleton */}
          <div className="absolute top-0 right-0">
            <Skeleton className="h-4 w-12" />
          </div>

          {/* Image skeleton */}
          <Skeleton className="h-28 w-28 sm:h-32 sm:w-32 rounded-full" />

          {/* Name skeleton */}
          <Skeleton className="h-5 w-24" />

          {/* Type badges skeleton */}
          <div className="flex gap-1.5">
            <Skeleton className="h-5 w-14 rounded-full" />
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

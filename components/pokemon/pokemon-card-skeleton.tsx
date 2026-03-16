import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function PokemonCardSkeleton() {
  return (
    <Card className="overflow-hidden border-border/50">
      <CardContent className="p-4">
        <div className="flex flex-col items-center gap-3">
          {/* ID skeleton */}
          <div className="absolute top-2 right-2">
            <Skeleton className="h-4 w-10" />
          </div>

          {/* Image skeleton */}
          <Skeleton className="h-32 w-32 rounded-full" />

          {/* Name skeleton */}
          <Skeleton className="h-6 w-24" />

          {/* Type badges skeleton */}
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

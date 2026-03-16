import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'

export function PokemonDetailsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start">
        {/* Pokemon Image */}
        <Skeleton className="h-64 w-64 rounded-full sm:h-80 sm:w-80" />

        {/* Pokemon Info */}
        <div className="flex-1 space-y-4 text-center lg:text-left">
          <div className="space-y-2">
            <Skeleton className="h-4 w-16 mx-auto lg:mx-0" />
            <Skeleton className="h-12 w-48 mx-auto lg:mx-0" />
          </div>

          {/* Types */}
          <div className="flex justify-center gap-2 lg:justify-start">
            <Skeleton className="h-7 w-20 rounded-full" />
            <Skeleton className="h-7 w-20 rounded-full" />
          </div>

          {/* Physical Info */}
          <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto lg:mx-0">
            <Card>
              <CardContent className="p-4 text-center">
                <Skeleton className="h-8 w-16 mx-auto mb-1" />
                <Skeleton className="h-4 w-12 mx-auto" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Skeleton className="h-8 w-16 mx-auto mb-1" />
                <Skeleton className="h-4 w-12 mx-auto" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Separator />

      {/* Stats Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-8" />
              </div>
              <Skeleton className="h-2 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Abilities Section */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-20" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-28 rounded-full" />
          </div>
        </CardContent>
      </Card>

      {/* Moves Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 12 }).map((_, index) => (
              <Skeleton key={index} className="h-6 w-20 rounded-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

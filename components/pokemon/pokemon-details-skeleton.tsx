import { Skeleton } from '@/components/ui/skeleton'

export function PokemonDetailsSkeleton() {
  return (
    <div className="rounded-3xl overflow-hidden bg-card shadow-xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* Left Side - Image Section */}
        <div className="relative p-6 lg:p-10 flex flex-col items-center justify-center min-h-[400px] lg:min-h-[600px]">
          {/* Name & ID */}
          <div className="absolute top-6 left-6 lg:top-10 lg:left-10 space-y-2">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-5 w-20" />
            <div className="flex gap-2 mt-3">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </div>

          {/* Image */}
          <div className="mt-16 lg:mt-12">
            <Skeleton className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full" />
          </div>
        </div>

        {/* Right Side - Info Panel */}
        <div className="bg-card/80 p-6 lg:p-10 lg:rounded-l-[3rem] border-l border-border/50">
          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <Skeleton className="h-10 w-24 rounded-lg" />
            <Skeleton className="h-10 w-24 rounded-lg" />
            <Skeleton className="h-10 w-24 rounded-lg" />
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Weaknesses */}
            <div>
              <Skeleton className="h-4 w-20 mb-3" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            </div>

            {/* Versions */}
            <div>
              <Skeleton className="h-4 w-16 mb-3" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-20 rounded-full" />
                <Skeleton className="h-8 w-20 rounded-full" />
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Skeleton className="h-20 rounded-xl" />
              <Skeleton className="h-20 rounded-xl" />
              <Skeleton className="h-20 rounded-xl col-span-2 sm:col-span-1" />
            </div>

            {/* Abilities */}
            <div>
              <Skeleton className="h-4 w-16 mb-3" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-28 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

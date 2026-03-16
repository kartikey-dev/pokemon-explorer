import { Skeleton } from '@/components/ui/skeleton'

export function PokemonDetailsSkeleton() {
  return (
    <div className="rounded-[2.5rem] overflow-hidden glass border border-border/50 shadow-2xl">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left Side Skeleton */}
        <div className="p-8 lg:p-16 flex flex-col items-center justify-center min-h-[400px] lg:min-h-[600px] border-b lg:border-b-0 lg:border-r border-border/50">
          <div className="absolute top-10 left-10 space-y-3">
             <Skeleton className="h-10 w-48 rounded-xl" />
             <Skeleton className="h-6 w-24 rounded-lg" />
             <div className="flex gap-2">
               <Skeleton className="h-6 w-16 rounded-full" />
               <Skeleton className="h-6 w-16 rounded-full" />
             </div>
          </div>
          <Skeleton className="w-64 h-64 sm:w-80 sm:h-80 rounded-full" />
        </div>
        
        {/* Right Side Skeleton */}
        <div className="p-8 lg:p-16 space-y-8">
           <div className="flex gap-4">
             <Skeleton className="h-10 flex-1 rounded-xl" />
             <Skeleton className="h-10 flex-1 rounded-xl" />
             <Skeleton className="h-10 flex-1 rounded-xl" />
           </div>
           
           <div className="space-y-6">
             <div className="grid grid-cols-3 gap-4">
               <Skeleton className="h-24 rounded-2xl" />
               <Skeleton className="h-24 rounded-2xl" />
               <Skeleton className="h-24 rounded-2xl" />
             </div>
             
             <div className="space-y-4">
               {[1, 2, 3, 4, 5, 6].map(i => (
                 <div key={i} className="flex gap-4 items-center">
                   <Skeleton className="h-4 w-24" />
                   <Skeleton className="h-2 flex-1 rounded-full" />
                   <Skeleton className="h-4 w-10" />
                 </div>
               ))}
             </div>
           </div>
        </div>
      </div>
    </div>
  )
}

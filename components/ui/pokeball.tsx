import { cn } from "@/lib/utils"

export function Pokeball({ className }: { className?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-full border-2 border-foreground/20 shadow-inner group-hover:rotate-360 transition-transform duration-700", className)}>
      {/* Top half: Red */}
      <div className="absolute top-0 inset-x-0 bottom-1/2 bg-primary" />
      {/* Bottom half: White/Light */}
      <div className="absolute bottom-0 inset-x-0 top-1/2 bg-white dark:bg-zinc-200" />
      {/* Center band */}
      <div className="absolute top-1/2 left-0 right-0 h-[3px] bg-zinc-800 -translate-y-1/2 z-10 shadow-sm" />
      {/* Center button outer */}
      <div className="absolute top-1/2 left-1/2 w-[35%] h-[35%] bg-zinc-800 rounded-full -translate-x-1/2 -translate-y-1/2 z-20 shadow-md" />
      {/* Center button inner */}
      <div className="absolute top-1/2 left-1/2 w-[20%] h-[20%] bg-white rounded-full -translate-x-1/2 -translate-y-1/2 z-30 border border-zinc-400" />
      {/* Shine effect */}
      <div className="absolute top-[10%] left-[20%] w-[15%] h-[15%] bg-white/40 rounded-full z-40" />
    </div>
  )
}

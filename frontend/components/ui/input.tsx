import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-xl border border-input bg-transparent px-3 py-2 text-base shadow-sm transition-all duration-200 ease-in-out outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus:placeholder:text-muted-foreground/60 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-1 focus-visible:shadow-[0_0_0_4px_hsl(var(--ring)/0.15)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-muted/30 disabled:border-muted/50 disabled:text-muted-foreground/50 disabled:shadow-none aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive/40 aria-invalid:focus-visible:shadow-[0_0_0_4px_hsl(var(--destructive)/0.15)] md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:disabled:border-muted/70 dark:aria-invalid:border-destructive/50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
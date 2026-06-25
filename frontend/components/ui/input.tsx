import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-xl border border-input/50 backdrop-blur-sm bg-background/60 px-3 py-2 text-base shadow-sm transition-all duration-200 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none readonly:opacity-75 readonly:cursor-default readonly:bg-muted/10 readonly:border-input/30 aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive/50 aria-invalid:focus-visible:shadow-md md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }
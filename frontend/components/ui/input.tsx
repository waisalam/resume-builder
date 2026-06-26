import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex w-full min-w-0 rounded-xl border border-input bg-background px-4 py-3 text-base shadow-none outline-none transition file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-muted/30 disabled:border-muted/50 disabled:text-muted-foreground/50 disabled:shadow-none md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }
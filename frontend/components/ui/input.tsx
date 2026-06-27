"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type InputProps = React.ComponentProps<"input"> & {
  error?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        data-slot="input"
        aria-invalid={error ? true : undefined}
        ref={ref}
        className={cn(
          "flex w-full min-w-0 rounded-xl border border-input bg-background px-4 py-3 text-base shadow-none outline-none transition file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-muted/50 disabled:border-muted disabled:text-muted-foreground/50 disabled:shadow-none md:text-sm",
          error && "border-destructive focus-visible:ring-destructive",
          className
        )}
        {...props}
      />
    )
  }
)

Input.displayName = "Input"

export { Input }
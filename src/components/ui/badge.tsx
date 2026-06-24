import * as React from "react"
import { cn } from "@/lib/utils"

const Badge = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "secondary" | "outline" | "destructive" }>(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default: "bg-primary/20 text-primary-light border-primary/20",
      secondary: "bg-white/5 text-muted border-white/10",
      outline: "border border-white/10 text-foreground",
      destructive: "bg-destructive/20 text-red-400 border-destructive/20",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
          variants[variant],
          className
        )}
        {...props}
      />
    )
  }
)
Badge.displayName = "Badge"

export { Badge }

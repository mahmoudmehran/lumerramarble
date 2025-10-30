import * as React from "react"
import { cn } from "../../lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-[var(--color-primary)] text-[var(--color-quinary)] shadow-md hover:bg-[var(--color-primary-700)] hover:shadow-lg active:scale-95":
              variant === "default",
            "bg-[var(--color-error)] text-[var(--color-quinary)] shadow-md hover:bg-[var(--color-error-700)] hover:shadow-lg active:scale-95":
              variant === "destructive",
            "border-2 border-[var(--color-primary)] bg-transparent text-[var(--color-primary)] shadow-sm hover:bg-[var(--color-primary)] hover:text-[var(--color-quinary)] active:scale-95":
              variant === "outline",
            "bg-[var(--color-secondary)] text-[var(--color-quinary)] shadow-md hover:bg-[var(--color-secondary-700)] hover:shadow-lg active:scale-95":
              variant === "secondary",
            "hover:bg-[var(--color-quinary-100)] hover:text-[var(--color-primary)] active:scale-95": 
              variant === "ghost",
            "text-[var(--color-primary)] underline-offset-4 hover:underline": 
              variant === "link",
          },
          {
            "h-10 px-4 py-2": size === "default",
            "h-9 rounded-md px-3 text-xs": size === "sm",
            "h-12 rounded-md px-8 text-base font-semibold": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }

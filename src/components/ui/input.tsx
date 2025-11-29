import * as React from "react"
import { cn } from "../../lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
  helperText?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, icon, helperText, value, ...props }, ref) => {
    // تأكد من أن القيمة دائماً string وليست null أو undefined
    const safeValue = value === null || value === undefined ? '' : value
    
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[var(--color-quaternary)] mb-2">
            {label}
            {props.required && <span className="text-[var(--color-error)] ml-1 rtl:ml-0 rtl:mr-1">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-quaternary-400)] z-10 pointer-events-none">
              {icon}
            </div>
          )}
          <input
            type={type}
            value={safeValue}
            className={cn(
              "flex h-9 w-full rounded-md border bg-[var(--color-quinary)] px-3 py-2 text-sm font-normal transition-colors text-[var(--color-quaternary)] placeholder:text-[var(--color-quaternary-400)] focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-[var(--color-secondary)] disabled:cursor-not-allowed disabled:opacity-50",
              icon ? "pl-10 pr-3 rtl:pl-3 rtl:pr-10" : "px-3",
              error 
                ? "border-[var(--color-error-300)] focus:border-[var(--color-error)] focus:ring-[var(--color-error)]" 
                : "border-[var(--color-quaternary-300)]",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-2 text-sm text-[var(--color-error)]">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-2 text-sm text-[var(--color-quaternary-500)]">{helperText}</p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }

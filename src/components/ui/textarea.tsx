import * as React from "react"
import { cn } from "../../lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, value, ...props }, ref) => {
    // تأكد من أن القيمة دائماً string وليست null أو undefined
    const safeValue = value === null || value === undefined ? '' : value
    
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-quaternary mb-2">
            {label}
            {props.required && <span className="text-[var(--color-error)] ml-1 rtl:ml-0 rtl:mr-1">*</span>}
          </label>
        )}
        <textarea
          value={safeValue}
          className={cn(
            "flex min-h-[120px] w-full rounded-md border border-quaternary-300 bg-quinary px-3 py-2 text-sm transition-colors text-[var(--color-quaternary)] placeholder:text-quaternary-400 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary disabled:cursor-not-allowed disabled:opacity-50 resize-y",
            error 
              ? "border-[var(--color-error-300)] focus:border-[var(--color-error)] focus:ring-[var(--color-error)]" 
              : "border-quaternary-300",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-2 text-sm text-[var(--color-error)]">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-2 text-sm text-quaternary-500">{helperText}</p>
        )}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }

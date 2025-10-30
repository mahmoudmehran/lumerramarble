import * as React from "react"
import { cn } from "../../lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-quaternary mb-2">
            {label}
            {props.required && <span className="text-red-500 ml-1 rtl:ml-0 rtl:mr-1">*</span>}
          </label>
        )}
        <textarea
          className={cn(
            "flex min-h-[120px] w-full rounded-md border border-quaternary-300 bg-quinary px-3 py-2 text-sm transition-colors placeholder:text-quaternary-400 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary disabled:cursor-not-allowed disabled:opacity-50 resize-y",
            error 
              ? "border-red-300 focus:border-red-500 focus:ring-red-500" 
              : "border-quaternary-300",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
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

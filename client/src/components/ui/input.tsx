import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "cn"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "y:h-8 y:w-full y:min-w-0 y:rounded-lg y:border y:border-input y:bg-transparent y:px-2.5 y:py-1 y:text-base y:transition-colors y:outline-none y:file:inline-flex y:file:h-6 y:file:border-0 y:file:bg-transparent y:file:text-sm y:file:font-medium y:file:text-foreground y:placeholder:text-muted-foreground y:focus-visible:border-ring y:focus-visible:ring-3 y:focus-visible:ring-ring/50 y:disabled:pointer-events-none y:disabled:cursor-not-allowed y:disabled:bg-input/50 y:disabled:opacity-50 y:aria-invalid:border-destructive y:aria-invalid:ring-3 y:aria-invalid:ring-destructive/20 y:md:text-sm y:dark:bg-input/30 y:dark:disabled:bg-input/80 y:dark:aria-invalid:border-destructive/50 y:dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Input }

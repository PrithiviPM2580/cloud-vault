import * as React from "react"
import { cn } from "cn"

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "y:flex y:items-center y:gap-2 y:text-sm y:leading-none y:font-medium y:select-none y:group-data-[disabled=true]:pointer-events-none y:group-data-[disabled=true]:opacity-50 y:peer-disabled:cursor-not-allowed y:peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Label }

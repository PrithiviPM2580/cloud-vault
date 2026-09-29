"use client"

import { Separator as SeparatorPrimitive } from "@base-ui/react/separator"
import { cn } from "cn"

function Separator({
  className,
  orientation = "horizontal",
  ...props
}: SeparatorPrimitive.Props) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      className={cn(
        "y:shrink-0 y:bg-border y:data-horizontal:h-px y:data-horizontal:w-full y:data-vertical:w-px y:data-vertical:self-stretch",
        className
      )}
      {...props}
    />
  )
}

export { Separator }

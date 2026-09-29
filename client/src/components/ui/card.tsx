import * as React from "react"
import { cn } from "cn"

function Card({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & { size?: "default" | "sm" }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        "y:group/card y:flex y:flex-col y:gap-(--card-spacing) y:overflow-hidden y:rounded-xl y:bg-card y:py-(--card-spacing) y:text-sm y:text-card-foreground y:ring-1 y:ring-foreground/10 y:[--card-spacing:--spacing(4)] y:has-data-[slot=card-footer]:pb-0 y:has-[>img:first-child]:pt-0 y:data-[size=sm]:[--card-spacing:--spacing(3)] y:data-[size=sm]:has-data-[slot=card-footer]:pb-0 y:*:[img:first-child]:rounded-t-xl y:*:[img:last-child]:rounded-b-xl",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "y:group/card-header y:@container/card-header y:grid y:auto-rows-min y:items-start y:gap-1 y:rounded-t-xl y:px-(--card-spacing) y:has-data-[slot=card-action]:grid-cols-[1fr_auto] y:has-data-[slot=card-description]:grid-rows-[auto_auto] y:[.border-b]:pb-(--card-spacing)",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "y: y:text-base y:leading-snug y:font-medium y:group-data-[size=sm]/card:text-sm",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("y:text-sm y:text-muted-foreground", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "y:col-start-2 y:row-span-2 y:row-start-1 y:self-start y:justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("y:px-(--card-spacing)", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "y:flex y:items-center y:rounded-b-xl y:border-t y:bg-muted/50 y:p-(--card-spacing)",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}

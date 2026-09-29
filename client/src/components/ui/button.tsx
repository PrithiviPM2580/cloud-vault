import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const buttonVariants = cva(
  "y:group/button y:inline-flex y:shrink-0 y:items-center y:justify-center y:rounded-lg y:border y:border-transparent y:bg-clip-padding y:text-sm y:font-medium y:whitespace-nowrap y:transition-all y:outline-none y:select-none y:focus-visible:border-ring y:focus-visible:ring-3 y:focus-visible:ring-ring/50 y:active:not-aria-[haspopup]:translate-y-px y:disabled:pointer-events-none y:disabled:opacity-50 y:aria-invalid:border-destructive y:aria-invalid:ring-3 y:aria-invalid:ring-destructive/20 y:dark:aria-invalid:border-destructive/50 y:dark:aria-invalid:ring-destructive/40 y:[&_svg]:pointer-events-none y:[&_svg]:shrink-0 y:[&_svg:not([class*=size-])]:size-4",
  {
    variants: {
      variant: {
        default: "y:bg-primary y:text-primary-foreground y:hover:bg-primary/80",
        outline:
          "y:border-border y:bg-background y:hover:bg-muted y:hover:text-foreground y:aria-expanded:bg-muted y:aria-expanded:text-foreground y:dark:border-input y:dark:bg-input/30 y:dark:hover:bg-input/50",
        secondary:
          "y:bg-secondary y:text-secondary-foreground y:hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] y:aria-expanded:bg-secondary y:aria-expanded:text-secondary-foreground",
        ghost:
          "y:hover:bg-muted y:hover:text-foreground y:aria-expanded:bg-muted y:aria-expanded:text-foreground y:dark:hover:bg-muted/50",
        destructive:
          "y:bg-destructive/10 y:text-destructive y:hover:bg-destructive/20 y:focus-visible:border-destructive/40 y:focus-visible:ring-destructive/20 y:dark:bg-destructive/20 y:dark:hover:bg-destructive/30 y:dark:focus-visible:ring-destructive/40",
        link: "y:text-primary y:underline-offset-4 y:hover:underline",
      },
      size: {
        default:
          "y:h-8 y:gap-1.5 y:px-2.5 y:has-data-[icon=inline-end]:pr-2 y:has-data-[icon=inline-start]:pl-2",
        xs: "y:h-6 y:gap-1 y:rounded-[min(var(--radius-md),10px)] y:px-2 y:text-xs y:in-data-[slot=button-group]:rounded-lg y:has-data-[icon=inline-end]:pr-1.5 y:has-data-[icon=inline-start]:pl-1.5 y:[&_svg:not([class*=size-])]:size-3",
        sm: "y:h-7 y:gap-1 y:rounded-[min(var(--radius-md),12px)] y:px-2.5 y:text-[0.8rem] y:in-data-[slot=button-group]:rounded-lg y:has-data-[icon=inline-end]:pr-1.5 y:has-data-[icon=inline-start]:pl-1.5 y:[&_svg:not([class*=size-])]:size-3.5",
        lg: "y:h-9 y:gap-1.5 y:px-2.5 y:has-data-[icon=inline-end]:pr-2 y:has-data-[icon=inline-start]:pl-2",
        icon: "y:size-8",
        "icon-xs":
          "y:size-6 y:rounded-[min(var(--radius-md),10px)] y:in-data-[slot=button-group]:rounded-lg y:[&_svg:not([class*=size-])]:size-3",
        "icon-sm":
          "y:size-7 y:rounded-[min(var(--radius-md),12px)] y:in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "y:size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

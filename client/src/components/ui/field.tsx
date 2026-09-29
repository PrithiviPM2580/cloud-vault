import { useMemo } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

import { Label } from "#/components/ui/label.tsx"
import { Separator } from "#/components/ui/separator.tsx"

function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn(
        "y:flex y:flex-col y:gap-4 y:has-[>[data-slot=checkbox-group]]:gap-3 y:has-[>[data-slot=radio-group]]:gap-3",
        className
      )}
      {...props}
    />
  )
}

function FieldLegend({
  className,
  variant = "legend",
  ...props
}: React.ComponentProps<"legend"> & { variant?: "legend" | "label" }) {
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn(
        "y:mb-1.5 y:font-medium y:data-[variant=label]:text-sm y:data-[variant=legend]:text-base",
        className
      )}
      {...props}
    />
  )
}

function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-group"
      className={cn(
        "y:group/field-group y:@container/field-group y:flex y:w-full y:flex-col y:gap-5 y:data-[slot=checkbox-group]:gap-3 y:*:data-[slot=field-group]:gap-4",
        className
      )}
      {...props}
    />
  )
}

const fieldVariants = cva(
  "y:group/field y:flex y:w-full y:gap-2 y:data-[invalid=true]:text-destructive",
  {
    variants: {
      orientation: {
        vertical: "y:flex-col y:*:w-full y:[&>.sr-only]:w-auto",
        horizontal:
          "y:flex-row y:items-center y:has-[>[data-slot=field-content]]:items-start y:*:data-[slot=field-label]:flex-auto y:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
        responsive:
          "y:flex-col y:*:w-full y:@md/field-group:flex-row y:@md/field-group:items-center y:@md/field-group:*:w-auto y:@md/field-group:has-[>[data-slot=field-content]]:items-start y:@md/field-group:*:data-[slot=field-label]:flex-auto y:[&>.sr-only]:w-auto y:@md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
      },
    },
    defaultVariants: {
      orientation: "vertical",
    },
  }
)

function Field({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof fieldVariants>) {
  return (
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  )
}

function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-content"
      className={cn(
        "y:group/field-content y:flex y:flex-1 y:flex-col y:gap-0.5 y:leading-snug",
        className
      )}
      {...props}
    />
  )
}

function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return (
    <Label
      data-slot="field-label"
      className={cn(
        "y:group/field-label y:peer/field-label y:flex y:w-fit y:gap-2 y:leading-snug y:group-data-[disabled=true]/field:opacity-50 y:has-data-checked:border-primary/30 y:has-data-checked:bg-primary/5 y:has-[>[data-slot=field]]:rounded-lg y:has-[>[data-slot=field]]:border y:has-[>[data-slot=field]]:not-has-[:disabled,[data-disabled]]:hover:bg-muted/50 y:has-[>[data-slot=field]]:has-[:focus-visible]:border-ring y:has-[>[data-slot=field]]:has-[:focus-visible]:ring-3 y:has-[>[data-slot=field]]:has-[:focus-visible]:ring-ring/50 y:*:data-[slot=field]:p-2.5 y:dark:has-data-checked:border-primary/20 y:dark:has-data-checked:bg-primary/10",
        "y:has-[>[data-slot=field]]:w-full y:has-[>[data-slot=field]]:flex-col",
        className
      )}
      {...props}
    />
  )
}

function FieldTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-label"
      className={cn(
        "y:flex y:w-fit y:items-center y:gap-2 y:text-sm y:font-medium y:group-data-[disabled=true]/field:opacity-50",
        className
      )}
      {...props}
    />
  )
}

function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn(
        "y:text-left y:text-sm y:leading-normal y:font-normal y:text-muted-foreground y:group-has-data-horizontal/field:text-balance y:[[data-variant=legend]+&]:-mt-1.5",
        "y:last:mt-0 y:nth-last-2:-mt-1",
        "y:[&>a]:underline y:[&>a]:underline-offset-4 y:[&>a:hover]:text-primary",
        className
      )}
      {...props}
    />
  )
}

function FieldSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  children?: React.ReactNode
}) {
  return (
    <div
      data-slot="field-separator"
      data-content={!!children}
      className={cn(
        "y:relative y:-my-2 y:h-5 y:text-sm y:group-data-[variant=outline]/field-group:-mb-2",
        className
      )}
      {...props}
    >
      <Separator className="y:absolute y:inset-0 y:top-1/2" />
      {children && (
        <span
          className="y:relative y:mx-auto y:block y:w-fit y:bg-background y:px-2 y:text-muted-foreground"
          data-slot="field-separator-content"
        >
          {children}
        </span>
      )}
    </div>
  )
}

function FieldError({
  className,
  children,
  errors,
  ...props
}: React.ComponentProps<"div"> & {
  errors?: Array<{ message?: string } | undefined>
}) {
  const content = useMemo(() => {
    if (children) {
      return children
    }

    if (!errors?.length) {
      return null
    }

    const uniqueErrors = [
      ...new Map(errors.map((error) => [error?.message, error])).values(),
    ]

    if (uniqueErrors?.length == 1) {
      return uniqueErrors[0]?.message
    }

    return (
      <ul className="y:ml-4 y:flex y:list-disc y:flex-col y:gap-1">
        {uniqueErrors.map(
          (error, index) =>
            error?.message && <li key={index}>{error.message}</li>
        )}
      </ul>
    )
  }, [children, errors])

  if (!content) {
    return null
  }

  return (
    <div
      role="alert"
      data-slot="field-error"
      className={cn("y:text-sm y:font-normal y:text-destructive", className)}
      {...props}
    >
      {content}
    </div>
  )
}

export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
}

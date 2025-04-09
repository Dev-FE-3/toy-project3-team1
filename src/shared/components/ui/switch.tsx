import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { cn } from "@/shared/model/lib/utils"

type SwitchProps = React.ComponentProps<typeof SwitchPrimitive.Root> & {
  thumbClassName?: string
}

function Switch({ className, thumbClassName, ...props }: SwitchProps) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer inline-flex items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block rounded-full bg-[#F1F5F9] transition-transform",
          thumbClassName ||
            "h-[calc(100%-4px)] w-[calc(100%-4px)] data-[state=checked]:translate-x-[calc(100%-calc(100%-4px))] data-[state=unchecked]:translate-x-0"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }

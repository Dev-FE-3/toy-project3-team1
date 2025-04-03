import * as React from 'react'

import { cn } from '@/shared/model/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'flex h-12 w-full rounded-xl bg-(--50) px-4 py-3 text-base text-white placeholder:text-white/60',
        'transition-colors outline-none',
        'focus:bg-[#1E293B]/90',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

export { Input }

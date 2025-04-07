import * as React from 'react'

import { cn } from '@/shared/model/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'bg-c300 text-c900 placeholder:text-c500 text-textR flex h-12 w-full rounded-xl px-4 py-3',
        'transition-colors outline-none',
        'focus:bg-c50',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

export { Input }

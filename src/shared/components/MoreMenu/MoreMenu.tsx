import { MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/model/lib/utils'

export interface MenuItem {
  label: string
  onClick: () => void
}

interface MoreMenuProps {
  items: MenuItem[]
  className?: string
  triggerClassName?: string
}

export default function MoreMenu({ items, className, triggerClassName }: MoreMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn('h-8 w-8 rounded-full p-0', triggerClassName)}
        >
          <MoreHorizontal className="h-5 w-5" />
          <span className="sr-only">더 보기 메뉴</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className={cn('min-w-[110px] rounded-xl bg-[#475569] p-2 text-white', className)}
      >
        {items.map((item, index) => (
          <DropdownMenuItem
            key={index}
            onClick={item.onClick}
            className="cursor-pointer rounded-lg px-4 py-2 focus:bg-[#334155] focus:text-white"
          >
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

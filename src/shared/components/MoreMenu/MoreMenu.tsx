import { useState } from 'react'
import { MoreHorizontal } from 'lucide-react'
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
} from '@/shared/components/ui/drawer'
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
  const [isOpen, setIsOpen] = useState(false)
  const [activeItem, setActiveItem] = useState<number | null>(null)

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn('h-8 w-8 rounded-full p-0', triggerClassName)}
        >
          <MoreHorizontal className="h-5 w-5" />
          <span className="sr-only">더 보기 메뉴</span>
        </Button>
      </DrawerTrigger>

      <DrawerContent className={cn('bg-c600 text-c100 mx-auto w-[440px] rounded-t-xl', className)}>
        <DrawerHeader className="p-0">
          <DrawerTitle className="sr-only">더보기 메뉴</DrawerTitle>
          <div className="flex flex-col gap-1 px-4 py-3">
            {items.map((item, index) => (
              <div
                key={index}
                className={cn(
                  'cursor-pointer rounded-lg px-4 py-3 transition-colors duration-150',
                  activeItem === index && 'bg-c700 text-c50',
                )}
                onPointerDown={() => setActiveItem(index)}
                onPointerUp={() => {
                  if (activeItem === index) {
                    item.onClick()
                    setIsOpen(false)
                  }
                  setActiveItem(null)
                }}
              >
                {item.label}
              </div>
            ))}
          </div>
        </DrawerHeader>
        <DrawerFooter className="p-0 mt-5" />
      </DrawerContent>
    </Drawer>
  )
}

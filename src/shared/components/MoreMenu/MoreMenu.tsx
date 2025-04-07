import { useRef, useState } from 'react'
import { MoreHorizontal } from 'lucide-react'
import { Drawer, DrawerTrigger, DrawerClose, DrawerPortal } from '@/shared/components/ui/drawer'
import { Drawer as DrawerPrimitive } from 'vaul'
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
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  const getTouchedIndex = (clientY: number) => {
    return itemRefs.current.findIndex((el) => {
      if (!el) return false
      const rect = el.getBoundingClientRect()
      return clientY >= rect.top && clientY <= rect.bottom
    })
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const index = getTouchedIndex(e.clientY)
    if (index !== -1 && index !== activeIndex) {
      setActiveIndex(index)
    }
  }

  const handlePointerUp = () => {
    if (activeIndex !== null) {
      items[activeIndex].onClick()
    }
    setActiveIndex(null)
    setIsOpen(false) // 클릭 후 메뉴 닫기
  }

  const resetActive = () => setActiveIndex(null)

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

      <DrawerPortal container={document.querySelector('main')}>
        {isOpen && (
          <>
            {/* 배경 오버레이 */}
            <div className="absolute inset-0 z-40 bg-black/50" onClick={() => setIsOpen(false)} />

            {/* 드로어 내용 */}
            <div
              className={cn(
                'bg-c500 text-c50 absolute bottom-0 left-1/2 z-50 w-[calc(100%-40px)] -translate-x-1/2 rounded-xl px-4 py-3 mb-5',
                className,
              )}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={resetActive}
              onPointerCancel={resetActive}
            >
              <div className="flex flex-col gap-1">
                {items.map((item, index) => (
                  <DrawerClose asChild key={index}>
                    <div
                      ref={(el) => {
                        itemRefs.current[index] = el
                      }}
                      className={cn(
                        'cursor-pointer rounded-lg px-4 py-3 transition-colors duration-150',
                        activeIndex === index && 'bg-c600 text-c50',
                      )}
                    >
                      {item.label}
                    </div>
                  </DrawerClose>
                ))}
              </div>
            </div>
          </>
        )}
      </DrawerPortal>
    </Drawer>
  )
}

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/shared/model/lib/utils'
import { Button } from '@/shared/components/ui/button'
import { Check } from 'lucide-react'

interface TabItem {
  id: string
  label: string
  checkable?: boolean
}

interface TabMenuProps {
  tabs: TabItem[]
  defaultActiveTab?: string
  onTabChange?: (tabId: string) => void
  className?: string
  completedTabs?: Set<string>
}

export default function TabMenu({
  tabs,
  defaultActiveTab,
  onTabChange,
  className,
  completedTabs = new Set(),
}: TabMenuProps) {
  const initialTab = defaultActiveTab || tabs[0]?.id
  const [activeTab, setActiveTab] = useState<string>(initialTab)
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([])
  const underlineRef = useRef<HTMLDivElement>(null)

  const handleTabClick = (tabId: string) => {
    if (tabId !== activeTab) {
      setActiveTab(tabId)
      onTabChange?.(tabId)
    }
  }

  useEffect(() => {
    const updateUnderline = () => {
      const activeIndex = tabs.findIndex((tab) => tab.id === activeTab)
      const activeTabEl = tabsRef.current[activeIndex]
      const underline = underlineRef.current

      if (activeTabEl && underline) {
        underline.style.left = `${activeTabEl.offsetLeft}px`
        underline.style.width = `${activeTabEl.offsetWidth}px`
      }
    }

    updateUnderline()
    window.addEventListener('resize', updateUnderline)
    return () => window.removeEventListener('resize', updateUnderline)
  }, [activeTab, tabs])

  return (
    <div className={cn('border-c600 relative mb-5', className)}>
      <div className="container mx-auto">
        <div className="flex">
          {tabs.map((tab, index) => {
            const isActive = activeTab === tab.id
            const isCompleted = tab.checkable && completedTabs.has(tab.id)

            return (
              <Button
                key={tab.id}
                ref={(el) => {
                  tabsRef.current[index] = el
                }}
                variant="ghost"
                className={cn(
                  '!text-h4 relative flex flex-1 items-center justify-center gap-2 rounded-none border-b-[2px] py-7 pl-7',
                  'hover:bg-transparent focus:bg-transparent',
                  isActive ? 'text-c50' : 'text-c500',
                )}
                onClick={() => handleTabClick(tab.id)}
              >
                <span>{tab.label}</span>
                {tab.checkable && (
                  <Check
                    size={16}
                    strokeWidth={2.5}
                    className={cn(
                      'flex-shrink-0 transition-opacity duration-200',
                      isCompleted ? 'text-dark-green opacity-100' : 'text-dark-green opacity-0',
                    )}
                  />
                )}
              </Button>
            )
          })}
        </div>

        <div
          ref={underlineRef}
          className="bg-c50 absolute bottom-0 h-[2px] transition-all duration-500 ease-in-out"
        />
      </div>
    </div>
  )
}

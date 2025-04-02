import { useEffect, useRef, useState } from 'react'
import { cn } from '@/shared/model/lib/utils'
import { Button } from '@/shared/components/ui/button'
import { Check } from 'lucide-react'

interface TabItem {
  id: string
  label: string
}

interface TabMenuProps {
  tabs: TabItem[]
  defaultActiveTab?: string
  onTabChange?: (tabId: string) => void
  className?: string
}

export default function TabMenu({ tabs, defaultActiveTab, onTabChange, className }: TabMenuProps) {
  const [activeTab, setActiveTab] = useState<string>(defaultActiveTab || tabs[0]?.id)
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([])
  const underlineRef = useRef<HTMLDivElement>(null)

  // 탭 클릭 핸들러
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId)
    onTabChange?.(tabId)
  }

  // 활성 탭이 변경될 때 밑줄 위치 조정
  useEffect(() => {
    const updateUnderline = () => {
      const activeTabIndex = tabs.findIndex((tab) => tab.id === activeTab)
      if (activeTabIndex === -1) return

      const activeTabElement = tabsRef.current[activeTabIndex]
      const underline = underlineRef.current

      if (activeTabElement && underline) {
        const { offsetLeft, offsetWidth } = activeTabElement
        underline.style.left = `${offsetLeft}px`
        underline.style.width = `${offsetWidth}px`
      }
    }

    updateUnderline()

    // 창 크기가 변경될 때도 밑줄 위치 업데이트
    window.addEventListener('resize', updateUnderline)
    return () => window.removeEventListener('resize', updateUnderline)
  }, [activeTab, tabs])

  return (
    <div className={cn('relative border-b border-gray-200', className)}>
      <div className="container mx-auto">
        <div className="flex">
          {tabs.map((tab, index) => (
            <Button
              key={tab.id}
              ref={(el) => {
                tabsRef.current[index] = el
              }}
              variant="ghost"
              className={cn(
                'relative flex flex-1 items-center justify-center gap-2 rounded-none px-8 py-4 text-base font-normal',
                'hover:bg-transparent focus:bg-transparent',
                activeTab === tab.id ? 'font-medium text-[#286fc7]' : 'text-gray-500',
              )}
              onClick={() => handleTabClick(tab.id)}
            >
              <span>{tab.label}</span>
              <Check
                size={16}
                className={cn(
                  'flex-shrink-0 transition-opacity duration-200',
                  activeTab === tab.id ? 'text-green-500 opacity-100' : 'opacity-0',
                )}
              />
            </Button>
          ))}
        </div>

        {/* 움직이는 밑줄 */}
        <div
          ref={underlineRef}
          className="absolute bottom-0 h-0.5 bg-[#286fc7] transition-all duration-500 ease-in-out"
        />
      </div>
    </div>
  )
}

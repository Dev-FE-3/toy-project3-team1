import { ReactNode, useState } from 'react'

import { TabItemProps } from '@/pages/PlaylistForm/model/types'

type TabItemStatus = Record<string, boolean>

interface TabsProps<T extends string = string> {
  defaultKey: T
  tabStatus: TabItemStatus
  children: (props: {
    activeKey: T
    setActiveKey: (key: T) => void
    tabStatus: TabItemStatus
  }) => ReactNode
}

export const Tabs = <T extends string = string>({
  defaultKey,
  tabStatus,
  children,
}: TabsProps<T>) => {
  const [activeKey, setActiveKey] = useState<T>(defaultKey)

  const handleSetActiveKey = (key: T) => {
    setActiveKey(key)
  }

  return children({
    activeKey,
    setActiveKey: handleSetActiveKey,
    tabStatus,
  })
}

// TabItem 컴포넌트 추가
export const TabItem = ({
  tabKey,
  label,
  isActive,
  isComplete,
  onClick,
  className = '',
}: TabItemProps) => {
  return (
    <button
      type="button"
      data-key={tabKey}
      className={`pb-3 text-center ${isActive ? 'border-b-2 border-white font-medium' : 'opacity-70'} flex items-center justify-center gap-2 ${className}`}
      onClick={onClick}
    >
      {label}
      {isComplete && <span className="h-5 w-5 text-green-500">✓</span>}
    </button>
  )
}

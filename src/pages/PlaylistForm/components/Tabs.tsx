import { ReactNode, useEffect, useState } from 'react'

import { TabItemProps } from '@/pages/PlaylistForm/model/types'

type TabItemStatus = Record<string, boolean>

interface TabsProps<T extends string = string> {
  defaultKey: T
  initialStatus?: TabItemStatus
  children: (props: {
    activeKey: T
    setActiveKey: (key: T) => void
    tabStatus: TabItemStatus
    setTabStatus: (status: TabItemStatus) => void
  }) => ReactNode
}

export const Tabs = <T extends string = string>({
  defaultKey,
  initialStatus = {},
  children,
}: TabsProps<T>) => {
  // 로컬 상태로 activeKey 관리
  const [activeKey, setActiveKey] = useState<T>(defaultKey)
  const [tabStatus, setTabStatus] = useState<TabItemStatus>(initialStatus)

  // 초기 상태 설정
  useEffect(() => {
    if (initialStatus && Object.keys(initialStatus).length > 0) {
      setTabStatus((prev) => ({ ...prev, ...initialStatus }))
    }
  }, [initialStatus])

  // 상태 업데이트 함수
  const handleSetActiveKey = (key: T) => {
    setActiveKey(key)
  }

  const handleSetTabStatus = (status: TabItemStatus) => {
    setTabStatus(status)
  }

  return children({
    activeKey,
    setActiveKey: handleSetActiveKey,
    tabStatus,
    setTabStatus: handleSetTabStatus,
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

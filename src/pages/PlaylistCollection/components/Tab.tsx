import { TabItem, TabKey } from '@/pages/PlaylistCollection/model'
interface TabProps {
  items: TabItem[]
  activeKey: TabKey
  onTabChange: (key: TabKey) => void
}

export const Tab = ({ items, activeKey, onTabChange }: TabProps) => {
  return (
    <nav
      className="text-c100 border-c600 flex justify-between border-b pt-6"
      role="tablist"
      aria-label="플레이리스트 탭"
    >
      {items.map((item) => (
        <button
          key={item.key}
          role="tab"
          aria-selected={activeKey === item.key}
          aria-controls={`${item.key}-panel`}
          className={`w-1/2 border-b-2 pb-4 text-[24px] transition-colors ${
            activeKey === item.key
              ? 'text-C100 border-white font-semibold'
              : 'border-transparent font-normal text-gray-400'
          }`}
          onClick={() => onTabChange(item.key as TabKey)}
        >
          {item.label}
        </button>
      ))}
    </nav>
  )
}

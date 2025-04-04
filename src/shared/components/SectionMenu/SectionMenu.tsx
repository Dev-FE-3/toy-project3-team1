import React from 'react'
import MoreMenu, { MenuItem } from '@/shared/components/MoreMenu/MoreMenu'
import { cn } from '@/shared/model/lib/utils'

interface SectionMenuProps {
  title: string
  subtitle?: string
  className?: string
  menuItems: MenuItem[]
}

export default function SectionMenu({ title, subtitle, className, menuItems }: SectionMenuProps) {
  return (
    <div className={cn('overflow-hidden rounded-xl bg-[#64748B] text-white', className)}>
      <div className="flex items-center justify-between p-4">
        <div className="flex flex-col">
          <h3 className="font-medium">{title}</h3>
          {subtitle && <p className="text-sm opacity-80">{subtitle}</p>}
        </div>
        <MoreMenu items={menuItems} />
      </div>
    </div>
  )
}

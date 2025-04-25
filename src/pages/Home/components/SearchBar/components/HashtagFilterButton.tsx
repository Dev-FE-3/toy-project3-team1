import React from 'react'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Hash } from 'lucide-react'
import { cn } from '@/shared/model/lib/utils'

interface Props {
  name: string
  isSelected: boolean
  onFilterTag: () => void
}

export default function HashtagFilterButton({ name, isSelected, onFilterTag }: Props) {
  return (
    <>
      <Badge
        className={cn(
          'bg-c700 text-c300 border-c500 flex items-center text-xs',
          isSelected && 'bg-c500 text-c100',
        )}
        onClick={onFilterTag}
      >
        {/* 해시태그 아이콘 */}
        <Hash size={12} />
        {/* 해시태그 이름 */}
        <Button className="px-0" onClick={onFilterTag} aria-label={`${name} 필터링`}>
          {name}
        </Button>
      </Badge>
    </>
  )
}

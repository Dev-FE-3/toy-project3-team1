import React from 'react'
import { X, GripVertical } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'

export interface VideoItemProps {
  id: string
  title: string
  index: number
  onRemove: () => void
  onDragStart: (e: React.DragEvent<HTMLDivElement>, index: number) => void
  onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void
  onDrop: (e: React.DragEvent<HTMLDivElement>, index: number) => void
}

export const VideoItem = ({
  id,
  title,
  index,
  onRemove,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
}: VideoItemProps) => {
  return (
    <div
      key={id}
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, index)}
      className="bg-c800 border-c700 relative overflow-hidden rounded-md border transition-colors"
    >
      <div className="flex h-12 items-center">
        <div
          className="flex h-full cursor-move items-center justify-center px-2"
          title="드래그하여 순서 변경"
        >
          <GripVertical size={18} className="text-c400" />
        </div>
        <div className="flex h-[32px] w-[32px] items-center justify-center">
          <svg className="h-[20px] w-[20px]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
              fill="#FF0000"
            />
          </svg>
        </div>
        <div className="flex min-w-0 flex-1 items-center">
          <p
            className="text-c100 max-w-[calc(100%-10px)] min-w-0 truncate px-3 py-2 text-sm"
            title={title}
          >
            {title || '제목 없음'}
          </p>
        </div>
        <div className="flex-shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="text-c400 hover:text-c100 mr-1 h-10 px-3"
          >
            <X size={18} />
          </Button>
        </div>
      </div>
    </div>
  )
}

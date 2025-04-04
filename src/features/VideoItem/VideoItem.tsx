import React from 'react'
import { AspectRatio } from '@/shared/components/ui/aspect-ratio'

interface VideoItemProps {
  title: string
  thumbnail: string
  views: string
  date: string
  duration: string
  onClick?: () => void
}

export default function VideoItem({
  title,
  thumbnail,
  views,
  date,
  duration,
  onClick,
}: VideoItemProps) {
  return (
    <div className="flex cursor-pointer gap-3 rounded-lg p-2 hover:bg-slate-800" onClick={onClick}>
      {/* 썸네일 */}
      <div className="relative w-32 flex-shrink-0">
        <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-lg">
          <img src={thumbnail} alt={title} className="h-full w-full object-cover" />
        </AspectRatio>
        <div className="absolute right-1 bottom-1 rounded bg-black/80 px-1 text-xs text-white">
          {duration}
        </div>
      </div>

      {/* 비디오 정보 */}
      <div className="flex flex-col justify-center">
        <h3 className="line-clamp-2 text-sm font-medium text-white">{title}</h3>
        <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
          <div className="flex items-center">
            <span>{views}</span>
          </div>
          <span>•</span>
          <span>{date}</span>
        </div>
      </div>
    </div>
  )
}

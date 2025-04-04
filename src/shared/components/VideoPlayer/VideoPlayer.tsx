import React, { useState } from 'react'
import { cn } from '@/shared/model/lib/utils'

interface VideoPlayerProps {
  videoId: string
  className?: string
  title?: string
  showControls?: boolean
}

export default function VideoPlayer({
  videoId,
  className,
  title = 'YouTube video player',
  showControls = true,
}: VideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className={cn('w-full', className)}>
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-gray-200">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500" />
          </div>
        )}
        <iframe
          src={`https://www.youtube.com/embed/${videoId}${showControls ? '' : '?controls=0'}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute top-0 left-0 h-full w-full border-0"
          onLoad={() => setIsLoading(false)}
        />
      </div>
    </div>
  )
}

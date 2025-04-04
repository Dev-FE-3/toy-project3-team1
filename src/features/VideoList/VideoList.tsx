import React from 'react'
import VideoItem from '@/features/VideoItem/VideoItem'

interface Video {
  id: string
  title: string
  thumbnail: string
  views: string
  date: string
  duration: string
}

interface VideoListProps {
  videos: Video[]
  onVideoClick?: (videoId: string) => void
  className?: string
}

export default function VideoList({ videos, onVideoClick, className }: VideoListProps) {
  return (
    <div className={`mt-4 flex-grow overflow-hidden rounded-xl bg-slate-900 ${className || ''}`}>
      <div className="h-full overflow-y-auto p-3">
        <div className="flex flex-col space-y-2">
          {/* 항상 표시되는 처음 2개 비디오 */}
          {videos.map((video) => (
            <VideoItem
              key={video.id}
              title={video.title}
              thumbnail={video.thumbnail}
              views={video.views}
              date={video.date}
              duration={video.duration}
              onClick={() => onVideoClick?.(video.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

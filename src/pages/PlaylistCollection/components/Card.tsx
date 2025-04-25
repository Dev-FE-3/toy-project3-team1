import { Lock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import PlaylistMoreMenu from './PlaylistMoreMenu'

interface CardProps {
  id: string
  title: string
  thumbnailUrl?: string
  videoCount: number
  isDragging?: boolean
  isSubscribed?: boolean
  isPublic?: boolean
  onUnsubscribe?: () => Promise<void>
}

export const Card = ({
  id,
  title,
  thumbnailUrl,
  videoCount,
  isSubscribed,
  isPublic = true,
  onUnsubscribe,
}: CardProps) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/playlist/${id}`)
  }

  const handleMoreMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <article
      className="bg-c800 hover:bg-c600 w-full overflow-hidden rounded-xl transition-transform hover:scale-105"
      onClick={handleClick}
      aria-label={`${title} 플레이리스트`}
    >
      <div className="flex flex-col">
        <figure
          className="relative aspect-video w-full cursor-pointer overflow-hidden"
          onClick={handleClick}
        >
          <img src={thumbnailUrl} alt={title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/60" />
          {!isPublic && (
            <div className="bg-c100 absolute top-2 right-2 rounded-lg p-1.5">
              <Lock className="text-c900 h-4 w-4" />
            </div>
          )}
        </figure>
        <section className="relative flex items-start justify-between p-2">
          <div className="flex-1 overflow-hidden">
            <h3 className="text-c100 text-captionM mb-1 overflow-hidden text-ellipsis whitespace-nowrap">
              {title}
            </h3>
            <p className="text-c100 text-captionS">동영상 {videoCount}개</p>
          </div>
          <div onClick={handleMoreMenuClick}>
            <PlaylistMoreMenu
              playlistId={id}
              title={title}
              className="text-white"
              isSubscribed={isSubscribed}
              onUnsubscribe={onUnsubscribe}
            />
          </div>
        </section>
      </div>
    </article>
  )
}

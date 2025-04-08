import { useLocation, useParams } from 'react-router-dom'
import { Playlist } from '@/features/Home/Playlist'
import { UserCard } from '@/shared/components/UserCard/UserCard'

interface LocationState {
  playlist: Playlist
  currentImageIndex: number
}

const DetailPage = () => {
  const { id } = useParams()
  const location = useLocation()
  const { playlist, currentImageIndex } = location.state as LocationState

  return (
    <div className="bg-c900 min-h-screen p-6">
      <div className="mx-auto max-w-[480px]">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-c50 text-2xl font-bold">{playlist.title}</h1>
          <UserCard name={playlist.user.name} imageUrl={playlist.user.imageUrl} />
        </div>

        {/* Main Image */}
        <div className="aspect-video w-full overflow-hidden rounded-lg">
          <img
            src={playlist.imageUrl[0]}
            alt={playlist.title}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Description */}
        <div className="mt-6">
          <p className="text-c200 text-base">{playlist.description}</p>
        </div>

        {/* Additional content for detail page */}
      </div>
    </div>
  )
}

export default DetailPage

// PlaylistSection.tsx
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { PlaylistContainer } from '@/pages/Home/components/PlaylistContainer'
import { useInfinitePlaylists } from '../hooks/useInfinitePlaylists'
import EmptyPlaylistCard from './PlaylistCard/EmptyPlaylistCard'

const PlaylistSection = ({ userId, category }: { userId?: string; category?: string | null }) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfinitePlaylists(
    userId,
    category,
  )
  const { ref: loadMoreRef, inView } = useInView({ threshold: 1 })

  const playlists = data.pages.flat()

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  return (
    <div className="relative flex-1">
      {playlists.length > 0 ? <PlaylistContainer playlists={playlists} /> : <EmptyPlaylistCard />}
      <div ref={loadMoreRef} style={{ height: 1 }} />
    </div>
  )
}

export default PlaylistSection

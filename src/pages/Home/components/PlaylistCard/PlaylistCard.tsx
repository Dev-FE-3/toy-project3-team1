import { useMemo } from 'react'
import { UserCard } from '@/shared/components/UserCard/UserCard'
import BookmarkIcon from '@/shared/components/stats/BookmarkIcon'
import LikeIcon from '@/shared/components/stats/LikeIcon'
import { PlaylistCardProps, VideoItem } from '@/pages/Home/model/types'
import CarouselView from './CarouselView'
import HashTag from '@/shared/components/HashTag/HashTag'
import { cn } from '@/shared/model/lib/utils'
import { getRelativeTime } from '@/shared/utils/getRelativeTime'
import EmptyPlaylistCard from './EmptyPlaylistCard'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/shared/model/api/supabase'
import { usePlaylistLike } from '../../../../shared/hooks/usePlaylistLike'
import { usePlaylistBookmark } from '../../../../shared/hooks/usePlaylistBookmark'

const PlaylistCard = ({ playlist, carouselRef, isBackground }: PlaylistCardProps) => {
  if (!playlist) {
    return (
      <div className="relative h-[440px] py-4">
        <EmptyPlaylistCard />
      </div>
    )
  }
  const { isLiked, likeCount, toggleLike, likeLoading } = usePlaylistLike(playlist.id)
  const { isBookmarked, bookmarkCount, toggleBookmark, bookmarkLoading } = usePlaylistBookmark(
    playlist.id,
  )

  const { data: videoItems = [] } = useQuery({
    queryKey: ['playlist_items', playlist.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('playlist_items')
        .select('*')
        .eq('playlist_id', playlist.id)
      if (error) {
        throw new Error('Error fetching playlists:')
      }
      return data as VideoItem[]
    },
    refetchOnWindowFocus: false,
  })

  const carouselImages = useMemo((): string[] => {
    const thumbnailUrl = Array.isArray(playlist.thumbnail_url)
      ? playlist.thumbnail_url[0]
      : playlist.thumbnail_url

    const videoThumbnails = videoItems.map((item) => item.thumbnail_url)
    if (thumbnailUrl === videoThumbnails[0]) {
      return [...videoThumbnails]
    }
    return [thumbnailUrl, ...videoThumbnails]
  }, [playlist.thumbnail_url, videoItems])

  const uploadedDate = getRelativeTime(playlist.created_at)
  return (
    <div className="relative h-[440px] py-4">
      <CarouselView
        images={carouselImages}
        title={playlist.title}
        carouselRef={carouselRef}
        isBackground={isBackground}
      />

      <div className={cn('absolute left-0 w-full px-[38px] py-2', isBackground && 'px-4')}>
        <div className="flex w-full justify-between">
          <div className="flex w-72 flex-col gap-4">
            <h3 className="text-c50 text-h3 w-full overflow-hidden overflow-ellipsis whitespace-nowrap">
              {playlist.title}
            </h3>
            <div className={cn('flex items-center gap-4', isBackground && 'opacity-0')}>
              <UserCard
                nickname={playlist.profiles.nickname}
                profileId={playlist.profile_id}
                size="small"
              />
              <p className="text-textR text-c500">{uploadedDate}</p>
            </div>
          </div>

          <div className={cn('mt-1 mr-1 flex', isBackground && 'opacity-0')}>
            <button
              type="button"
              onClick={toggleLike}
              disabled={likeLoading}
              className="flex flex-col items-center gap-1 px-2"
            >
              <LikeIcon isLiked={isLiked} size={34} />
              <span className="text-c400 text-captionM">{likeCount}</span>
            </button>

            <button
              type="button"
              onClick={toggleBookmark}
              disabled={bookmarkLoading}
              className="flex flex-col items-center gap-1 px-2"
            >
              <BookmarkIcon isBookmarked={isBookmarked} size={34} />
              <span className="text-c400 text-captionM">{bookmarkCount}</span>
            </button>
          </div>
        </div>

        <div className={cn('mt-5 flex gap-[10px]', isBackground && 'opacity-0')}>
          {playlist.hashtag?.map((tagName, index) => (
            <HashTag key={index} tag={tagName} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default PlaylistCard

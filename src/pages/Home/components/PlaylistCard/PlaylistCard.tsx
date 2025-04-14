import { useState, useMemo, useEffect } from 'react'
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
import { useGetAuthState } from '@/shared/model/contexts/AuthContext'

const PlaylistCard = ({ playlist, carouselRef, isBackground }: PlaylistCardProps) => {
  if (!playlist) {
    return (
      <div className="relative h-[440px] py-4">
        <EmptyPlaylistCard />
      </div>
    )
  }

  const [likes, setLikes] = useState(playlist.like_count)
  const [bookmarks, setBookmarks] = useState(playlist.subscriber_count)
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const { profile } = useGetAuthState()

  useEffect(() => {
    const fetchCounts = async () => {
      const { data, error } = await supabase
        .from('playlists')
        .select('like_count, subscriber_count')
        .eq('id', playlist.id)
        .single()

      if (error) {
        console.error('플레이리스트 카운트 가져오기 실패:', error)
        return
      }

      setLikes(data.like_count || 0)
      setBookmarks(data.subscriber_count || 0)
    }

    fetchCounts()
  }, [playlist.id])

  const { data: isLike } = useQuery<boolean>({
    queryKey: ['playlist_liked', playlist.id, profile?.id],
    queryFn: async () => {
      if (!profile) return false
      const { data, error } = await supabase
        .from('playlists_likes')
        .select('id')
        .eq('user_id', profile.id)
        .eq('playlist_id', playlist.id)
        .maybeSingle()

      if (error) {
        console.error('Error fetching like status:', error)
        return false
      }
      return !!data
    },
    enabled: !!profile, // profile이 있을 때만 쿼리 실행
  })

  useEffect(() => {
    if (isLike !== undefined) {
      setIsLiked(isLike) // 쿼리 결과가 변경되면 상태 업데이트
    }
  }, [isLike])

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation()

    if (!profile) {
      console.error('사용자 프로필을 찾을 수 없습니다')
      return
    }

    const prevLiked = isLiked
    const prevLikes = likes

    const nextLiked = !prevLiked
    const nextLikes = prevLiked ? prevLikes - 1 : prevLikes + 1

    // 낙관적 업데이트
    setIsLiked(nextLiked)
    setLikes(nextLikes)

    try {
      if (nextLiked) {
        await supabase.from('playlists_likes').insert({
          user_id: profile.id,
          playlist_id: playlist.id,
        })
      } else {
        await supabase
          .from('playlists_likes')
          .delete()
          .eq('user_id', profile.id)
          .eq('playlist_id', playlist.id)
      }
    } catch (err) {
      console.error('Like 처리 실패:', err)
      setIsLiked(prevLiked)
      setLikes(prevLikes)
    }
  }

  const { data: isMark } = useQuery<boolean>({
    queryKey: ['playlist_subscribed', playlist.id, profile?.id],
    queryFn: async () => {
      if (!profile) return false
      const { data, error } = await supabase
        .from('playlists_subscribers')
        .select('id')
        .eq('user_id', profile.id)
        .eq('playlist_id', playlist.id)
        .maybeSingle()

      if (error) {
        console.error('Error fetching bookmark status:', error)
        return false
      }
      return !!data
    },
    enabled: !!profile, // profile이 있을 때만 쿼리 실행
  })

  useEffect(() => {
    if (isMark !== undefined) {
      setIsBookmarked(isMark) // 쿼리 결과가 변경되면 상태 업데이트
    }
  }, [isMark])

  const handleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation()

    if (!profile) {
      console.error('사용자 프로필을 찾을 수 없습니다')
      return
    }

    const prevMarked = isBookmarked
    const prevMarks = bookmarks

    const nextMarked = !prevMarked
    const nextMarks = prevMarked ? prevMarks - 1 : prevMarks + 1

    // 낙관적 업데이트
    setIsBookmarked(nextMarked)
    setBookmarks(nextMarks)

    try {
      if (nextMarked) {
        await supabase.from('playlists_subscribers').insert({
          user_id: profile.id,
          playlist_id: playlist.id,
        })
      } else {
        await supabase
          .from('playlists_subscribers')
          .delete()
          .eq('user_id', profile.id)
          .eq('playlist_id', playlist.id)
      }
    } catch (err) {
      console.error('Bookmarked 처리 실패:', err)
      setIsBookmarked(prevMarked)
      setBookmarks(prevMarks)
    }
  }

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
              onClick={handleLike}
              className="flex flex-col items-center gap-1 px-2"
            >
              <LikeIcon isLiked={isLiked} size={34} />
              <span className="text-c400 text-captionM">{likes}</span>
            </button>

            <button
              type="button"
              onClick={handleBookmark}
              className="flex flex-col items-center gap-1 px-2"
            >
              <BookmarkIcon isBookmarked={isBookmarked} size={34} />
              <span className="text-c400 text-captionM">{bookmarks}</span>
            </button>
          </div>
        </div>

        <div className={cn('mt-5 flex gap-[10px]', isBackground && 'opacity-0')}>
          {playlist.hashtag.map((tagName, index) => (
            <HashTag key={index} tag={tagName} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default PlaylistCard

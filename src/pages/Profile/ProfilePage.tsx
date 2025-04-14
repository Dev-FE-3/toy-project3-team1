import { Button } from '@/shared/components/ui/button'
import { UserCard } from '@/shared/components/UserCard/UserCard'
import { supabase } from '@/shared/model/api/supabase'
import { useGetAuthState } from '@/shared/model/contexts/AuthContext'
import { useQuery } from '@tanstack/react-query'
import { PlaylistWithItems } from '../Home/model/types'
import { Ghost } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { getRelativeTime } from '@/shared/utils/getRelativeTime'
import HashTag from '@/shared/components/HashTag/HashTag'

const ProfilePage = () => {
  const { id: paramId } = useParams()
  const { profile } = useGetAuthState()
  const targetProfileId = paramId ?? profile?.id
  const isMyProfile = !paramId || paramId === profile?.id

  if (!profile) return null // 로그인 안했을 때는 아무것도 안 보임

  const { data: targetProfile } = useQuery({
    queryKey: ['profile', targetProfileId],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', targetProfileId)
        .maybeSingle()
      return data
    },
    enabled: !!targetProfileId, // null이면 쿼리 안 함
    refetchOnWindowFocus: false,
  })

  // 타켓 유저의 플레이리스트
  const { data: playlistsWithItems = [] } = useQuery<PlaylistWithItems[]>({
    queryKey: ['playlists_with_items', targetProfileId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('playlists')
        .select('*, playlist_items(*)')
        .eq('profile_id', targetProfileId)
        .eq('is_public', true)
        .order('created_at', { ascending: false })

      if (error) throw new Error('Error fetching playlists with items')

      return data ?? []
    },
    enabled: !!targetProfileId,
    refetchOnWindowFocus: false,
  })
  if (!targetProfile) return null

  return (
    <div className="px-[20px] pt-[20px]">
      <div>
        <UserCard
          size="medium"
          nickname={targetProfile.nickname}
          className="mb-[20px]"
          profileId={targetProfile.id}
          listCount={playlistsWithItems.length}
        />
        {isMyProfile && (
          <Button variant="outline" type="button" className="bg-c600 text-c200 h-12 w-full">
            프로필 편집
          </Button>
        )}
      </div>

      {playlistsWithItems.length > 0 ? (
        <div className="no-scrollbar mt-7 h-164 overflow-y-scroll">
          {playlistsWithItems.map((playlist) => (
            <div key={playlist.id} className="mb-10">
              <Link to={`/playlist/${playlist.id}`}>
                <img
                  src={playlist.thumbnail_url}
                  alt={playlist.title}
                  className="aspect-video h-full w-full rounded-lg object-cover"
                />
                <h3 className="text-c50 text-h3 mt-3">{playlist.title}</h3>
                <div className="text-captionM text-c500 mt-2 flex gap-3">
                  <span>좋아요 {playlist.like_count}개</span>
                  <span>영상 {playlist.playlist_items?.length}개</span>
                  <span>구독 {playlist.subscriber_count}명</span>
                  <span>{getRelativeTime(playlist.created_at)}</span>
                </div>
                <p className="text-textR text-c400 mt-1">
                  {playlist.description ?? '설명이 없습니다.'}
                </p>
                <div className="mt-4 flex gap-[10px]">
                  {!playlist.hashtag
                    ? ''
                    : playlist.hashtag.map((tagName, index) => (
                        <HashTag key={index} tag={tagName} size="small" />
                      ))}
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-[100px] flex flex-col items-center text-center">
          <Ghost size={120} className="text-c600 m-auto" />
          <p className="text-h4 text-c300 mt-5">이곳은 조용하네요..</p>
          <p className="text-captionM text-c500 mt-1">
            공개로 설정한 플레이리스트만 확인할 수 있어요.
          </p>
        </div>
      )}
    </div>
  )
}
export default ProfilePage

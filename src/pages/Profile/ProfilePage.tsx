import { Button } from '@/shared/components/ui/button'
import { UserCard } from '@/shared/components/UserCard/UserCard'
import { supabase } from '@/shared/model/api/supabase'
import { useGetAuthState } from '@/shared/model/contexts/AuthContext'
import { useQuery } from '@tanstack/react-query'
import { Playlist } from '../Home/model/types'
import { Ghost } from 'lucide-react'
import { useParams } from 'react-router-dom'

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
  const { data: playlists = [] } = useQuery<Playlist[]>({
    queryKey: ['playlists', targetProfileId],
    queryFn: async () => {
      const { data } = await supabase
        .from('playlists')
        .select('*')
        .eq('profile_id', targetProfileId)
        .eq('is_public', true)
        .order('created_at', { ascending: false })
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
          listCount={playlists.length}
        />
        {isMyProfile && (
          <Button variant="outline" type="button" className="bg-c600 text-c200 h-12 w-full">
            프로필 편집
          </Button>
        )}
      </div>

      {playlists.length > 0 ? (
        <div className="public-playlist-container">
          {playlists.map((playlist) => (
            <div key={playlist.id} className="public-playlist-item">
              <div className="playlist-title">{playlist.title}</div>
              <div className="playlist-description">
                {playlist.description ?? '설명이 없습니다.'}
              </div>
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

import { PlaylistWithItems } from '@/pages/Home/model/types'
import { Ghost } from 'lucide-react'
import TargetUserPlaylistItem from './TargetUserPlaylistItem'

const TargetUserPlaylists = ({ playlists }: { playlists: PlaylistWithItems[] }) => {
  return (
    <>
      {playlists.length > 0 ? ( // 공개로 설정한 플레이리스트가 있을 때
        <div>
          {playlists.map((playlist) => (
            <TargetUserPlaylistItem playlist={playlist} key={playlist.title} />
          ))}
        </div>
      ) : ( // 공개로 설정한 플레이리스트가 없을 때
        <div className="mt-[100px] flex flex-col items-center text-center">
          <Ghost size={120} className="text-c600 m-auto" />
          <p className="text-h4 text-c300 mt-5">이곳은 조용하네요..</p>
          <p className="text-captionM text-c500 mt-1">
            공개로 설정한 플레이리스트만 확인할 수 있어요.
          </p>
        </div>
      )}
    </>
  )
}

export default TargetUserPlaylists

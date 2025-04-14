import { Home, SquarePlus, ListVideo, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { signOut } from '@/shared/model/api/auth'
export default function BottomNav() {
  return (
    <nav className="border-c800 bg-c900 flex h-[66px] w-full justify-around border-t px-[15px]">
      <Link to={'/'} className="flex h-full w-[88px] items-center justify-center">
        <Home size={24} className="text-c50" />
      </Link>
      <Link to={'/playlist/new'} className="flex h-full w-[88px] items-center justify-center">
        <SquarePlus size={24} className="text-c50" />
      </Link>
      <Link to={'/playlists'} className="flex h-full w-[88px] items-center justify-center">
        <ListVideo size={24} className="text-c50" />
      </Link>
      <Link to={'/profile'} className="flex h-full w-[88px] items-center justify-center">
        <UserRound size={24} className="text-c50" />
      </Link>
      {/* 임시 로그아웃 */}
      {/* <div className="flex h-full w-[88px] items-center justify-center" onClick={() => signOut()}>
        <UserRound size={24} className="text-c50" />
      </div> */}
    </nav>
  )
}

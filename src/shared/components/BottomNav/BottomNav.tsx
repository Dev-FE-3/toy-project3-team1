import { Home, SquarePlus, ListVideo, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function BottomNav() {
  return (
    <nav className=" flex h-[66px] w-[480px] justify-around border-t border-c800 bg-c900 px-[15px]">
      <Link to={'/'} className="flex h-full w-[88px] items-center justify-center">
        <Home size={24} className="text-c50" />
      </Link>
      <Link to={'/create'} className="flex h-full w-[88px] items-center justify-center">
        <SquarePlus size={24} className="text-c50" />
      </Link>
      <Link to={'/feed'} className="flex h-full w-[88px] items-center justify-center">
        <ListVideo size={24} className="text-c50" />
      </Link>
      <Link to={'/profile'} className="flex h-full w-[88px] items-center justify-center">
        <UserRound size={24} className="text-c50" />
      </Link>
    </nav>
  )
}

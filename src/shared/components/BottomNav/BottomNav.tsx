import { cn } from '@/shared/model/lib/utils'
import { Home, ListVideo, Settings, SquarePlus, UserRound } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

export default function BottomNav() {
  const { pathname } = useLocation()

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/'
    }
    if (path === '/playlist/new') {
      return pathname === '/playlist/new'
    }
    return pathname.startsWith(path)
  }

  return (
    <nav className="border-c800 bg-c900 flex h-[66px] w-full justify-around border-t px-[15px]">
      <Link
        to={'/'}
        className={cn(
          'flex h-full w-[88px] items-center justify-center',
          isActive('/') && 'bg-c800',
        )}
      >
        <Home size={24} className={cn('text-c50', isActive('/') && 'text-c50')} />
      </Link>
      <Link
        to={'/playlist/new'}
        className={cn(
          'flex h-full w-[88px] items-center justify-center',
          isActive('/playlist/new') && 'bg-c800',
        )}
      >
        <SquarePlus size={24} className={cn('text-c50', isActive('/playlist/new') && 'text-c50')} />
      </Link>
      <Link
        to={'/playlists'}
        className={cn(
          'flex h-full w-[88px] items-center justify-center',
          isActive('/playlist') && !isActive('/playlist/new') && 'bg-c800',
        )}
      >
        <ListVideo
          size={24}
          className={cn(
            'text-c50',
            isActive('/playlist') && !isActive('/playlist/new') && 'text-c50',
          )}
        />
      </Link>
      <Link
        to={'/profile'}
        className={cn(
          'flex h-full w-[88px] items-center justify-center',
          isActive('/profile') && 'bg-c800',
        )}
      >
        <UserRound size={24} className={cn('text-c50', isActive('/profile') && 'text-c50')} />
      </Link>
      <Link
        to={'/settings'}
        className={cn(
          'flex h-full w-[88px] items-center justify-center',
          isActive('/settings') && 'bg-c800',
        )}
      >
        <Settings size={24} className={cn('text-c50', isActive('/settings') && 'text-c50')} />
      </Link>
    </nav>
  )
}

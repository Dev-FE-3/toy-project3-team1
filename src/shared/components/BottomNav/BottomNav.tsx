import { Button } from '@/shared/components/ui/button'
import { Home, SquarePlus, ListVideo, UserRound } from 'lucide-react'

export default function BottomNav() {
  return (
    <nav className="absolute right-0 bottom-0 left-0 z-50 h-16 border-t border-gray-800 bg-[#0F172A]">
      <div className="mx-auto flex h-full max-w-md items-center justify-around">
        <Button variant="ghost" size="icon" className="text-white">
          <Home className="h-7 w-7" />
        </Button>
        <Button variant="ghost" size="icon" className="text-white">
          <SquarePlus className="h-7 w-7" />
        </Button>
        <Button variant="ghost" size="icon" className="text-white">
          <ListVideo className="h-7 w-7" />
        </Button>
        <Button variant="ghost" size="icon" className="text-white">
          <UserRound className="h-7 w-7" />
        </Button>
      </div>
    </nav>
  )
}

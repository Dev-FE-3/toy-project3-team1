import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { House, SquarePlus, ListVideo, UserRound } from 'lucide-react'

const Layout = () => {
  return (
    <div className="relative min-h-screen bg-slate-900 p-4 pb-16 text-white">
      <header>
        <h1 className="text-h2 mb-4 font-bold">리플레이</h1>
      </header>

      <main>
        <Outlet />
      </main>

      <nav className="absolute right-0 bottom-0 left-0 flex justify-around border-t border-slate-800 bg-slate-900 py-4">
        <Link to="/" className="text-white">
          <House />
        </Link>
        <Link to="/create" className="text-white">
          <SquarePlus />
        </Link>
        <Link to="/feed" className="text-white">
          <ListVideo />
        </Link>
        <Link to="/profile" className="text-white">
          <UserRound
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          />
        </Link>
      </nav>
    </div>
  )
}

export default Layout

import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { House, SquarePlus, ListVideo, UserRound } from 'lucide-react'

const Header = () => {
  return (
    <header className="border-c800 flex h-[66px] w-[480px] items-center border-b pl-5">
      <img src="/images/logo.svg"></img>
    </header>
  )
}

const NavBar = () => {
  return (
    <nav className="border-c800 flex justify-around border-t py-4">
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
  )
}

const Layout = () => {
  return (
    <div className="">
      <Header />
      <main className="h-[calc(100vh-66px-66px)] px-[20px]">
        <Outlet />
      </main>
      <NavBar />
    </div>
  )
}

export default Layout

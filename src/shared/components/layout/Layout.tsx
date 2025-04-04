import { Outlet } from 'react-router-dom'
import BottomNav from '../BottomNav/BottomNav'

const Header = () => {
  return (
    <header className="border-c800 flex h-[66px] w-[480px] items-center border-b pl-5">
      <img src="/images/logo.svg"></img>
    </header>
  )
}

const Layout = () => {
  return (
    <>
      <Header />
      <main className="h-[calc(100vh-66px-66px)] px-[20px] overflow-y-scroll overflow-x-clip">
        <Outlet />
      </main>
      <BottomNav />
    </>
  )
}

export default Layout

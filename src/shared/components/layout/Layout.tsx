import { Outlet } from 'react-router-dom'
import BottomNav from '../BottomNav/BottomNav'

const Header = () => {
  return (
    <header className="border-c800 flex h-[66px] w-full items-center border-b pl-5">
      <img src="/images/logo.svg" />
    </header>
  )
}

const Layout = () => {
  return (
    <>
      <main id='main' className="relative h-screen">
        <Header />
        <div className="no-scrollbar h-[calc(100vh-66px-66px)] overflow-x-clip">
          <Outlet />
        </div>
        <BottomNav />
      </main>
    </>
  )
}

export default Layout

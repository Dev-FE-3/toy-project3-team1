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
      <main className='relative overflow-hidden'>
        <Header />
        <div className="h-[calc(100vh-66px-66px)] overflow-x-clip overflow-y-scroll px-[20px]">
          <Outlet />
        </div>
        <BottomNav />
      </main>
    </>
  )
}

export default Layout

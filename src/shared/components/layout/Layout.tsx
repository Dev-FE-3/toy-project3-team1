import { ToastContainer } from '@/shared/components/ui/toast/ToastContainer'
import { Outlet } from 'react-router-dom'
import BottomNav from '../BottomNav/BottomNav'

const Header = () => {
  return (
    <header className="border-c800 flex h-[50px] w-full items-center border-b pl-5">
      <img src="/images/header_logo.webp" width="130" />
    </header>
  )
}

const Layout = () => {
  return (
    <div className="relative flex min-h-[100dvh] flex-col overflow-y-hidden">
      <Header />
      <main id="main" className="no-scrollbar h-[calc(100dvh-50px-60px)] overflow-x-clip">
        <Outlet />
        <ToastContainer position="top-right" spacing={2} />
      </main>
      <BottomNav />
    </div>
  )
}

export default Layout

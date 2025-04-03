import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div>
      {/* 여기에 나중에 헤더, 네비게이션 등 공통 UI 요소를 추가할 수 있습니다 */}
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout

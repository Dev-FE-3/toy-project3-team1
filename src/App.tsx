import Login from '@/pages/Login/Login'
import DesignSystem from '@/pages/DesignSystem/DesignSystem'
function App() {
  return (
    <div className="flex min-h-screen justify-center bg-white">
      <div className="contentWrapper relative w-[480px] bg-[#0F172A]">
        <DesignSystem />
        {/* <Login /> */}
      </div>
    </div>
  )
}

export default App

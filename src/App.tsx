import { RouterProvider } from 'react-router-dom'
import router from './router'

function App() {
  return (
<<<<<<< HEAD
    <div className="flex justify-center min-h-screen bg-white">
      <div className="w-[480px]">
        <Login />
      </div>
    </div>
=======
    <RouterProvider
      router={router}
      future={{
        v7_startTransition: true,
      }}
    />
>>>>>>> e62cc37e7610c759200e6cd6e96ce7ad34d0d7c6
  )
}

export default App

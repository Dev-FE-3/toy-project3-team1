import { RouterProvider } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import router from './router'
import { queryClient } from './shared/model/lib/query-client'
import { AuthProvider } from './shared/model/contexts/AuthContext'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider
          router={router}
          future={{
            v7_startTransition: true,
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App

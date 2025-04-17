import WebVitalsMonitor from '@/shared/components/WebVitalsMonitor/WebVitalsMonitor'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider } from 'react-router-dom'
import router from './router/router'
import { AuthProvider } from './shared/model/contexts/AuthContext'
import { queryClient } from './shared/model/lib/queryClient'

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

      <ReactQueryDevtools initialIsOpen={false} />
      <WebVitalsMonitor />
    </QueryClientProvider>
  )
}

export default App

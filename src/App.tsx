import { RouterProvider } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
<<<<<<< Updated upstream
import router from './router'

const queryClient = new QueryClient()
=======
import router from './router/router'
import { AuthProvider } from './shared/model/contexts/AuthContext'
import { queryClient } from './shared/model/lib/queryClient'
>>>>>>> Stashed changes

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider
        router={router}
        future={{
          v7_startTransition: true,
        }}
      />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App

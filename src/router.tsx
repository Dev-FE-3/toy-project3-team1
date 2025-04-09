import { createBrowserRouter, RouteObject } from 'react-router-dom'

import Layout from './shared/components/layout/Layout'
import HomePage from './pages/Home/HomePage'
import PlaylistDetailPage from './pages/PlaylistDetail/PlaylistDetailPage'
import PlaylistFormPage from './pages/PlaylistForm/PlaylistFormPage'
import PlaylistCollectionPage from './pages/PlaylistCollection/PlaylistCollectionpage'
import ProfilePage from './pages/Profile/ProfilePage'
import LoginPage from './pages/Login/LoginPage'
import SignupPage from './pages/Signup/SignupPage'
import DesignSystem from './pages/DesignSystem/DesignSystem'

const routes: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: '/playlists',
        element: <PlaylistCollectionPage />,
      },
      {
        path: '/playlist/new',
        element: <PlaylistFormPage />,
      },
      {
        path: '/playlist/edit/:id',
        element: <PlaylistFormPage />,
      },
      {
        path: '/playlist/:id',
        element: <PlaylistDetailPage />,
      },
      {
        path: '/profile',
        element: <ProfilePage />,
      },
      {
        path: '/d',
        element: <DesignSystem />,
      },
    ],
  },

  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },
]

const router = createBrowserRouter(routes, {
  future: {
    v7_relativeSplatPath: true,
  },
})

export default router

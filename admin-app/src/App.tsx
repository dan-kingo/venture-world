import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from './stores/authStore'
import Layout from './components/Layout'
import Login from './pages/Login'
import Users from './pages/Users'
import Providers from './pages/Providers'
import Experiences from './pages/Experiences'
import Bookings from './pages/Bookings'
import Notifications from './pages/Notifications'
import Support from './pages/Support'
import LoadingSpinner from './components/LoadingSpinner'
import Dashboard from './pages/Dashboard'

function App() {
  const { isAuthenticated, isLoading, initializeAuth } = useAuthStore()

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <Routes>
      {!isAuthenticated ? (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      ) : (
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="providers" element={<Providers />} />
          <Route path="experiences" element={<Experiences />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="support" element={<Support />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      )}
    </Routes>
  )
}

export default App
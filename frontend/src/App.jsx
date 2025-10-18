import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { authService, supabase } from './services/supabase'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import VerifiedEmailPage from './pages/VerifiedEmailPage'
import Dashboard from './pages/Dashboard'
import FacultyForm from './pages/FacultyForm'
import FacultyList from './pages/FacultyList'
import AboutUs from './pages/AboutUs'

function AppLayout({ children }) {
  const location = useLocation()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const publicRoutes = ['/login', '/signup', '/forgot-password', '/reset-password', '/verified-email']
  const isPublicRoute = publicRoutes.includes(location.pathname)

  useEffect(() => {
    let mounted = true

    const checkUser = async () => {
      try {
        const currentUser = await authService.getCurrentUser()
        if (mounted && currentUser) {
          setUser(currentUser)
        } else if (mounted) {
          setUser(null)
        }
      } catch (error) {
        if (mounted) {
          setUser(null)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (mounted) {
        if (session?.user) {
          setUser(session.user)
        } else {
          setUser(null)
        }
      }
    })

    return () => {
      mounted = false
      subscription?.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    try {
      await authService.signOut()
      setUser(null)
      window.location.href = '/login'
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={handleLogout} onToggleSidebar={toggleSidebar} />
      
      <div className="flex">
        {!isPublicRoute && user && (
          <Sidebar isOpen={sidebarOpen} />
        )}
        
        {/* ✅ FIXED: Removed pt-20, changed to pt-0 for no spacing */}
        <main className={`flex-1 ${!isPublicRoute && user && sidebarOpen ? 'lg:ml-64' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verified-email" element={<VerifiedEmailPage />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/faculty/create" element={<FacultyForm />} />
          <Route path="/faculty/edit/:id" element={<FacultyForm />} />
          <Route path="/faculty/list" element={<FacultyList />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AppLayout>
    </Router>
  )
}

export default App

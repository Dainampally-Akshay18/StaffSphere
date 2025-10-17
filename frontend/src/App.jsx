import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { authService, supabase } from './services/supabase'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import FacultyForm from './pages/FacultyForm'
import FacultyList from './pages/FacultyList'

function AppLayout({ children }) {
  const location = useLocation()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  
  const publicRoutes = ['/login', '/signup']
  const isPublicRoute = publicRoutes.includes(location.pathname)

  // ✅ LISTEN FOR AUTH STATE CHANGES
  useEffect(() => {
    let mounted = true
    
    // Check current user immediately
    const checkUser = async () => {
      console.log('🔍 Checking authentication...')
      try {
        const currentUser = await authService.getCurrentUser()
        console.log('✅ User authenticated:', currentUser?.email)
        if (mounted && currentUser) {
          setUser(currentUser)
        } else if (mounted) {
          setUser(null)
        }
      } catch (error) {
        console.log('❌ No user:', error.message)
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

    // ✅ LISTEN TO AUTH STATE CHANGES (login/logout events)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔔 Auth state changed:', event, session?.user?.email)
      
      if (mounted) {
        if (session?.user) {
          console.log('✅ User logged in:', session.user.email)
          setUser(session.user)
        } else {
          console.log('❌ User logged out')
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

  console.log('🎯 RENDER STATE:', {
    hasUser: !!user,
    userEmail: user?.email,
    loading,
    sidebarOpen,
    isPublicRoute,
    currentPath: location.pathname,
    willShowSidebar: !isPublicRoute && !!user
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={handleLogout} onToggleSidebar={toggleSidebar} />
      
      {user && !isPublicRoute ? (
        <>
          {console.log('🎨 RENDERING SIDEBAR with isOpen=', sidebarOpen)}
          <Sidebar isOpen={sidebarOpen} user={user} />
          <div
            className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden transition-opacity ${
              sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            onClick={toggleSidebar}
          />
        </>
      ) : (
        console.log('❌ NOT rendering sidebar - user:', !!user, 'isPublicRoute:', isPublicRoute)
      )}
      
      <div className={`pt-16 min-h-screen transition-all duration-300 ${user && !isPublicRoute ? 'lg:pl-64' : ''}`}>
        {children}
      </div>
    </div>
  )
}

function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    
    const checkAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser()
        if (mounted) {
          setUser(currentUser)
          setLoading(false)
        }
      } catch (error) {
        if (mounted) {
          setUser(null)
          setLoading(false)
        }
      }
    }

    checkAuth()
    
    return () => {
      mounted = false
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
      </div>
    )
  }

  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/faculty/create" element={<ProtectedRoute><FacultyForm /></ProtectedRoute>} />
          <Route path="/faculty/list" element={<ProtectedRoute><FacultyList /></ProtectedRoute>} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AppLayout>
    </Router>
  )
}

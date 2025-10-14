import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/supabase'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser()
      if (!currentUser) {
        navigate('/login')
      } else {
        setUser(currentUser)
      }
    } catch (error) {
      console.error('Error:', error)
      navigate('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await authService.signOut()
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const stats = [
    { name: 'Total Publications', value: '12', icon: '📚', color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50' },
    { name: 'Awards Received', value: '5', icon: '🏆', color: 'from-green-500 to-green-600', bgColor: 'bg-green-50' },
    { name: 'Patents Filed', value: '3', icon: '💡', color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-50' },
    { name: 'Certifications', value: '8', icon: '🎓', color: 'from-orange-500 to-orange-600', bgColor: 'bg-orange-50' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} user={user} />

      {/* Main Content */}
      <div className="lg:pl-64 transition-all duration-300">
        {/* Navbar */}
        <Navbar 
          user={user} 
          onLogout={handleLogout}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Dashboard Content */}
        <main className="p-6 space-y-6">
          {/* Welcome Card */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-2xl shadow-xl p-8 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">
                  Welcome back, {user?.user_metadata?.first_name || 'Faculty Member'}! 👋
                </h2>
                <p className="text-blue-100 text-lg">
                  Here's what's happening with your profile today.
                </p>
              </div>
              <div className="hidden md:block">
                <svg className="w-32 h-32 opacity-20" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-14 h-14 ${stat.bgColor} rounded-xl flex items-center justify-center text-3xl shadow-md`}>
                      {stat.icon}
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                  <p className="text-sm text-gray-600 font-medium">{stat.name}</p>
                </div>
                <div className={`h-1 bg-gradient-to-r ${stat.color}`}></div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button 
                onClick={() => navigate('/faculty/form')}
                className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 hover:from-blue-100 hover:to-blue-200 rounded-xl transition-all font-semibold shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
              >
                <span className="text-2xl">📝</span>
                <span>Update Profile</span>
              </button>
              <button 
                onClick={() => navigate('/faculty/list')}
                className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 hover:from-purple-100 hover:to-purple-200 rounded-xl transition-all font-semibold shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
              >
                <span className="text-2xl">📋</span>
                <span>View Faculty List</span>
              </button>
              <button className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-green-50 to-green-100 text-green-700 hover:from-green-100 hover:to-green-200 rounded-xl transition-all font-semibold shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                <span className="text-2xl">📚</span>
                <span>Add Publication</span>
              </button>
              <button className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 hover:from-orange-100 hover:to-orange-200 rounded-xl transition-all font-semibold shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                <span className="text-2xl">📊</span>
                <span>Generate Report</span>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Recent Activity
            </h3>
            <div className="space-y-4">
              {[
                { title: 'Publication added', desc: 'New journal article submitted for review', time: '2 hours ago', icon: '📝', color: 'bg-blue-100 text-blue-600' },
                { title: 'Profile updated', desc: 'Academic qualifications updated successfully', time: '5 hours ago', icon: '👤', color: 'bg-green-100 text-green-600' },
                { title: 'Award received', desc: 'Best Researcher Award - 2025', time: '1 day ago', icon: '🏆', color: 'bg-yellow-100 text-yellow-600' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all cursor-pointer group">
                  <div className={`w-12 h-12 ${activity.color} rounded-xl flex items-center justify-center flex-shrink-0 text-xl shadow-sm group-hover:shadow-md transition-shadow`}>
                    {activity.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-600 truncate">{activity.desc}</p>
                  </div>
                  <span className="text-sm text-gray-400 whitespace-nowrap font-medium">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

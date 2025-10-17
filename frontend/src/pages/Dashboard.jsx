import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService, supabase } from '../services/supabase'

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    publications: 0,
    awards: 0,
    patents: 0,
    certifications: 0
  })

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
        // Fetch dashboard stats after user is loaded
        await fetchDashboardStats(currentUser.id)
      }
    } catch (error) {
      console.error('Error:', error)
      navigate('/login')
    } finally {
      setLoading(false)
    }
  }

  const fetchDashboardStats = async (userId) => {
    try {
      // Get faculty profile to get faculty_id
      const { data: profile, error: profileError } = await supabase
        .from('faculty_profile')
        .select('id')
        .eq('user_id', userId)
        .single()

      if (profileError) throw profileError

      const facultyId = profile.id

      // Fetch counts from all tables in parallel
      const [
        { count: journalsCount },
        { count: conferencesCount },
        { count: booksCount },
        { count: awardsCount },
        { count: patentsCount },
        { count: certificationsCount }
      ] = await Promise.all([
        supabase.from('journals').select('*', { count: 'exact', head: true }).eq('faculty_id', facultyId),
        supabase.from('conferences').select('*', { count: 'exact', head: true }).eq('faculty_id', facultyId),
        supabase.from('books').select('*', { count: 'exact', head: true }).eq('faculty_id', facultyId),
        supabase.from('awards').select('*', { count: 'exact', head: true }).eq('faculty_id', facultyId),
        supabase.from('patents').select('*', { count: 'exact', head: true }).eq('faculty_id', facultyId),
        supabase.from('certifications').select('*', { count: 'exact', head: true }).eq('faculty_id', facultyId)
      ])

      // Calculate total publications (journals + conferences + books)
      const totalPublications = (journalsCount || 0) + (conferencesCount || 0) + (booksCount || 0)

      setStats({
        publications: totalPublications,
        awards: awardsCount || 0,
        patents: patentsCount || 0,
        certifications: certificationsCount || 0
      })

    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const statsData = [
    {
      name: 'Total Publications',
      value: stats.publications,
      icon: '📚',
      color: 'blue',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-500'
    },
    {
      name: 'Awards Received',
      value: stats.awards,
      icon: '🏆',
      color: 'green',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-500'
    },
    {
      name: 'Patents Filed',
      value: stats.patents,
      icon: '💡',
      color: 'purple',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-500'
    },
    {
      name: 'Certifications',
      value: stats.certifications,
      icon: '🎓',
      color: 'orange',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-500'
    }
  ]

  const quickActions = [
    {
      title: 'Update Profile',
      description: 'Edit your personal information',
      icon: '✏️',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      onClick: () => navigate('/faculty/create')
    },
    {
      title: 'View Faculty List',
      description: 'Browse all faculty members',
      icon: '📋',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      onClick: () => navigate('/faculty/list')
    },
    {
      title: 'Add Publication',
      description: 'Submit new research work',
      icon: '📚',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      onClick: () => navigate('/faculty/create')
    },
    {
      title: 'Generate Report',
      description: 'Export your profile data',
      icon: '📊',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      onClick: () => alert('Report generation coming soon!')
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 rounded-2xl p-6 sm:p-8 mb-8 shadow-lg text-white">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            Welcome back, {user?.user_metadata?.first_name || 'Faculty Member'}! 👋
          </h1>
          <p className="text-blue-100 text-sm sm:text-base">
            Here's what's happening with your profile today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {statsData.map((stat, index) => (
            <div
              key={index}
              className={`${stat.bgColor} rounded-xl p-6 border-b-4 ${stat.borderColor} hover:shadow-lg transition-shadow cursor-pointer`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`text-4xl ${stat.bgColor} p-3 rounded-lg`}>
                  {stat.icon}
                </div>
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                </svg>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-800 mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-600 font-medium">
                  {stat.name}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>⚡</span> Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className={`${action.bgColor} rounded-xl p-6 text-left hover:shadow-lg transition-all hover:scale-105`}
              >
                <div className="text-3xl mb-3">{action.icon}</div>
                <h3 className={`font-bold ${action.textColor} mb-1`}>
                  {action.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {action.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

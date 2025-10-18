import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService, supabase } from '../services/supabase'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import toast, { Toaster } from 'react-hot-toast'

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [facultyProfile, setFacultyProfile] = useState(null)


  // ✅ GLOBAL STATS - Total across ALL users
  const [stats, setStats] = useState({
    publications: 0,
    awards: 0,
    patents: 0,
    certifications: 0
  })

  // ✅ DETAILED STATS - Breakdown by type
  const [detailedStats, setDetailedStats] = useState({
    journals: 0,
    conferences: 0,
    books: 0,
    bookChapters: 0,
    totalFaculty: 0
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

        // ✅ Fetch faculty profile to get first_name
        const { data: profile } = await supabase
          .from('faculty_profile')
          .select('first_name, last_name')
          .eq('user_id', currentUser.id)
          .single()

        if (profile) {
          setFacultyProfile(profile)
        }

        // Fetch global dashboard stats
        await fetchGlobalDashboardStats()
      }
    } catch (error) {
      console.error('Error:', error)
      navigate('/login')
    } finally {
      setLoading(false)
    }
  }


  // ========================================
  // ✅ FETCH GLOBAL STATS - ALL USERS
  // ========================================

  const fetchGlobalDashboardStats = async () => {
    try {
      // ✅ Fetch counts from ALL tables (no user filter = global data)
      const [
        { count: journalsCount },
        { count: conferencesCount },
        { count: booksCount },
        { count: bookChaptersCount },
        { count: awardsCount },
        { count: patentsCount },
        { count: certificationsCount },
        { count: facultyCount }
      ] = await Promise.all([
        supabase.from('journals').select('*', { count: 'exact', head: true }),
        supabase.from('conferences').select('*', { count: 'exact', head: true }),
        supabase.from('books').select('*', { count: 'exact', head: true }),
        supabase.from('book_chapters').select('*', { count: 'exact', head: true }),
        supabase.from('awards').select('*', { count: 'exact', head: true }),
        supabase.from('patents').select('*', { count: 'exact', head: true }),
        supabase.from('online_certifications').select('*', { count: 'exact', head: true }),
        supabase.from('faculty_profile').select('*', { count: 'exact', head: true })
      ])

      // ✅ Calculate total publications (journals + conferences + books + book chapters)
      const totalPublications =
        (journalsCount || 0) +
        (conferencesCount || 0) +
        (booksCount || 0) +
        (bookChaptersCount || 0)

      setStats({
        publications: totalPublications,
        awards: awardsCount || 0,
        patents: patentsCount || 0,
        certifications: certificationsCount || 0
      })

      setDetailedStats({
        journals: journalsCount || 0,
        conferences: conferencesCount || 0,
        books: booksCount || 0,
        bookChapters: bookChaptersCount || 0,
        totalFaculty: facultyCount || 0
      })

    } catch (error) {
      console.error('Error fetching global dashboard stats:', error)
      toast.error('Failed to load dashboard statistics')
    }
  }

  // ========================================
  // ✅ GENERATE EXCEL REPORT
  // ========================================

  const generateExcelReport = async () => {
    setExporting(true)
    const loadingToast = toast.loading('Generating Excel report...')

    try {
      // ✅ Create workbook
      const workbook = XLSX.utils.book_new()

      // ========================================
      // SHEET 1: Dashboard Summary
      // ========================================
      const summaryData = [
        ['Faculty Management System - Dashboard Report'],
        [`Generated on: ${new Date().toLocaleString()}`],
        [''],
        ['Metric', 'Count'],
        ['Total Faculty Members', detailedStats.totalFaculty],
        ['Total Publications', stats.publications],
        ['  - Journals', detailedStats.journals],
        ['  - Conferences', detailedStats.conferences],
        ['  - Books', detailedStats.books],
        ['  - Book Chapters', detailedStats.bookChapters],
        ['Total Awards', stats.awards],
        ['Total Patents', stats.patents],
        ['Total Certifications', stats.certifications]
      ]

      const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)

      // Style the summary sheet
      summarySheet['!cols'] = [{ wch: 30 }, { wch: 15 }]

      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Dashboard Summary')

      // ========================================
      // SHEET 2: Faculty List
      // ========================================
      const { data: facultyList } = await supabase
        .from('faculty_profile')
        .select('first_name, last_name, email, department, designation, mobile_number')
        .order('first_name')

      if (facultyList && facultyList.length > 0) {
        const facultyData = facultyList.map((f, index) => ({
          'S.No': index + 1,
          'Name': `${f.first_name} ${f.last_name}`,
          'Email': f.email,
          'Department': f.department || 'N/A',
          'Designation': f.designation || 'N/A',
          'Contact': f.mobile_number || 'N/A'
        }))

        const facultySheet = XLSX.utils.json_to_sheet(facultyData)
        facultySheet['!cols'] = [
          { wch: 8 },
          { wch: 25 },
          { wch: 30 },
          { wch: 20 },
          { wch: 20 },
          { wch: 15 }
        ]

        XLSX.utils.book_append_sheet(workbook, facultySheet, 'Faculty List')
      }

      // ========================================
      // SHEET 3: Publications Breakdown
      // ========================================
      const publicationsBreakdown = [
        ['Publication Type', 'Count'],
        ['Journals', detailedStats.journals],
        ['Conferences', detailedStats.conferences],
        ['Books', detailedStats.books],
        ['Book Chapters', detailedStats.bookChapters],
        ['TOTAL', stats.publications]
      ]

      const pubSheet = XLSX.utils.aoa_to_sheet(publicationsBreakdown)
      pubSheet['!cols'] = [{ wch: 20 }, { wch: 12 }]
      XLSX.utils.book_append_sheet(workbook, pubSheet, 'Publications Breakdown')

      // ========================================
      // SHEET 4: Detailed Journals (if any)
      // ========================================
      const { data: journals } = await supabase
        .from('journals')
        .select(`
          title, 
          authors, 
          journal_name, 
          year, 
          doi, 
          indexing,
          faculty_profile!inner(first_name, last_name)
        `)
        .order('year', { ascending: false })

      if (journals && journals.length > 0) {
        const journalsData = journals.map((j, index) => ({
          'S.No': index + 1,
          'Faculty': `${j.faculty_profile.first_name} ${j.faculty_profile.last_name}`,
          'Title': j.title,
          'Authors': j.authors,
          'Journal': j.journal_name,
          'Year': j.year,
          'DOI': j.doi,
          'Indexing': j.indexing
        }))

        const journalsSheet = XLSX.utils.json_to_sheet(journalsData)
        XLSX.utils.book_append_sheet(workbook, journalsSheet, 'Journals')
      }

      // ========================================
      // SHEET 5: Detailed Awards (if any)
      // ========================================
      const { data: awards } = await supabase
        .from('awards')
        .select(`
          title_of_award, 
          award_given_by, 
          year, 
          international_national,
          faculty_profile!inner(first_name, last_name)
        `)
        .order('year', { ascending: false })

      if (awards && awards.length > 0) {
        const awardsData = awards.map((a, index) => ({
          'S.No': index + 1,
          'Faculty': `${a.faculty_profile.first_name} ${a.faculty_profile.last_name}`,
          'Award Title': a.title_of_award,
          'Awarded By': a.award_given_by,
          'Year': a.year,
          'Level': a.international_national
        }))

        const awardsSheet = XLSX.utils.json_to_sheet(awardsData)
        XLSX.utils.book_append_sheet(workbook, awardsSheet, 'Awards')
      }

      // ========================================
      // SHEET 6: Detailed Patents (if any)
      // ========================================
      const { data: patents } = await supabase
        .from('patents')
        .select(`
          title_of_invention, 
          application_number, 
          application_status, 
          date_of_filing,
          country,
          faculty_profile!inner(first_name, last_name)
        `)
        .order('date_of_filing', { ascending: false })

      if (patents && patents.length > 0) {
        const patentsData = patents.map((p, index) => ({
          'S.No': index + 1,
          'Faculty': `${p.faculty_profile.first_name} ${p.faculty_profile.last_name}`,
          'Title': p.title_of_invention,
          'Application No': p.application_number,
          'Status': p.application_status,
          'Filed Date': p.date_of_filing,
          'Country': p.country
        }))

        const patentsSheet = XLSX.utils.json_to_sheet(patentsData)
        XLSX.utils.book_append_sheet(workbook, patentsSheet, 'Patents')
      }

      // ========================================
      // SHEET 7: Certifications (if any)
      // ========================================
      const { data: certifications } = await supabase
        .from('online_certifications')
        .select(`
          course_title, 
          institute_offered, 
          duration, 
          year,
          faculty_profile!inner(first_name, last_name)
        `)
        .order('year', { ascending: false })

      if (certifications && certifications.length > 0) {
        const certsData = certifications.map((c, index) => ({
          'S.No': index + 1,
          'Faculty': `${c.faculty_profile.first_name} ${c.faculty_profile.last_name}`,
          'Course': c.course_title,
          'Platform': c.institute_offered,
          'Duration': c.duration,
          'Year': c.year
        }))

        const certsSheet = XLSX.utils.json_to_sheet(certsData)
        XLSX.utils.book_append_sheet(workbook, certsSheet, 'Certifications')
      }

      // ✅ Download the Excel file
      XLSX.writeFile(workbook, `Dashboard_Report_${new Date().toISOString().split('T')[0]}.xlsx`)

      toast.dismiss(loadingToast)
      toast.success(`✅ Excel report with ${workbook.SheetNames.length} sheets downloaded!`)

    } catch (error) {
      console.error('Error generating report:', error)
      toast.dismiss(loadingToast)
      toast.error('Failed to generate Excel report')
    } finally {
      setExporting(false)
    }
  }

  // ========================================
  // ✅ RENDER UI
  // ========================================

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
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      description: 'Journals, Conferences, Books & Chapters'
    },
    {
      name: 'Awards Received',
      value: stats.awards,
      icon: '🏆',
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      description: 'National & International Awards'
    },
    {
      name: 'Patents Filed',
      value: stats.patents,
      icon: '💡',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      description: 'Patent Applications & Grants'
    },
    {
      name: 'Certifications',
      value: stats.certifications,
      icon: '📜',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      description: 'Online Learning Certifications'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Dashboard Overview 📊
          </h1>
          <p className="text-gray-600 text-lg">
            Welcome back, <span className="font-semibold text-blue-600">
              {facultyProfile?.first_name || user?.email?.split('@')[0] || 'User'}
            </span>! Here's the global system statistics.
          </p>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
            >
              <div className={`h-2 bg-gradient-to-r ${stat.color}`}></div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.bgColor} p-3 rounded-xl`}>
                    <span className="text-3xl">{stat.icon}</span>
                  </div>
                  <div className={`text-4xl font-bold ${stat.textColor}`}>
                    {stat.value}
                  </div>
                </div>
                <h3 className="text-gray-900 font-semibold text-lg mb-1">
                  {stat.name}
                </h3>
                <p className="text-gray-500 text-sm">
                  {stat.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Publications Breakdown Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span>📊</span>
            Publications Breakdown
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-xl p-4 border-l-4 border-blue-500">
              <p className="text-gray-600 text-sm mb-1">Journals</p>
              <p className="text-2xl font-bold text-blue-600">{detailedStats.journals}</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 border-l-4 border-green-500">
              <p className="text-gray-600 text-sm mb-1">Conferences</p>
              <p className="text-2xl font-bold text-green-600">{detailedStats.conferences}</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 border-l-4 border-purple-500">
              <p className="text-gray-600 text-sm mb-1">Books</p>
              <p className="text-2xl font-bold text-purple-600">{detailedStats.books}</p>
            </div>
            <div className="bg-pink-50 rounded-xl p-4 border-l-4 border-pink-500">
              <p className="text-gray-600 text-sm mb-1">Book Chapters</p>
              <p className="text-2xl font-bold text-pink-600">{detailedStats.bookChapters}</p>
            </div>
          </div>
        </div>

        {/* System Info Card */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg p-6 mb-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">System Statistics</h2>
              <p className="text-blue-100">
                Total Faculty Members: <span className="font-bold text-white text-2xl">{detailedStats.totalFaculty}</span>
              </p>
              <p className="text-blue-100 text-sm mt-1">
                Last updated: {new Date().toLocaleString()}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={fetchGlobalDashboardStats}
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Data
              </button>
            </div>
          </div>
        </div>

        {/* Generate Report Button */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>📥</span>
            Download Dashboard Report
          </h2>
          <p className="text-gray-600 mb-6">
            Generate a comprehensive Excel report containing all dashboard statistics, faculty list, publications, awards, patents, and certifications.
          </p>

          <button
            onClick={generateExcelReport}
            disabled={exporting}
            className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center gap-3"
          >
            {exporting ? (
              <>
                <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span className="text-lg">Generating Report...</span>
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-lg">Generate Excel Report</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => navigate('/faculty/create')}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all text-left group"
          >
            <div className="text-3xl mb-3">➕</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              Add New Faculty
            </h3>
            <p className="text-gray-600 text-sm">Create a new faculty profile</p>
          </button>

          <button
            onClick={() => navigate('/faculty/list')}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all text-left group"
          >
            <div className="text-3xl mb-3">👥</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              View Faculty List
            </h3>
            <p className="text-gray-600 text-sm">Browse all faculty members</p>
          </button>

          <button
            onClick={() => navigate('/faculty/create')}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all text-left group"
          >
            <div className="text-3xl mb-3">⚙️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              Manage Profile
            </h3>
            <p className="text-gray-600 text-sm">Update your information</p>
          </button>
        </div>
      </div>
    </div>
  )
}

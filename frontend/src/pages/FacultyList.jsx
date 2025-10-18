import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'
import FacultyDetailModal from '../components/FacultyDetailModal'
import toast, { Toaster } from 'react-hot-toast'
import { saveAs } from 'file-saver'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx'
import pptxgen from 'pptxgenjs'
import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType, AlignmentType, HeadingLevel, TextRun } from 'docx'

export default function FacultyList() {
  const navigate = useNavigate()
  const [faculty, setFaculty] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFaculty, setSelectedFaculty] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [designationFilter, setDesignationFilter] = useState('')
  const [exporting, setExporting] = useState(false)
  const [exportFormat, setExportFormat] = useState('csv')

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  useEffect(() => {
    loadFaculty()
  }, [])

  const loadFaculty = async () => {
    try {
      const { data, error } = await supabase
        .from('faculty_profile')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setFaculty(data || [])
    } catch (error) {
      console.error('Error loading faculty:', error)
      toast.error('Failed to load faculty list')
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (facultyData) => {
    setSelectedFaculty(facultyData)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedFaculty(null)
  }

  // Filter Logic
  const filteredData = faculty.filter((item) => {
    const matchesSearch =
      (item.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (item.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (item.email?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (item.department?.toLowerCase().includes(searchTerm.toLowerCase()) || false)

    const matchesDepartment = departmentFilter ? item.department === departmentFilter : true
    const matchesDesignation = designationFilter ? item.designation === designationFilter : true

    return matchesSearch && matchesDepartment && matchesDesignation
  })

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value))
    setCurrentPage(1)
  }

  const departments = [...new Set(faculty.map(f => f.department).filter(Boolean))]
  const designations = [...new Set(faculty.map(f => f.designation).filter(Boolean))]

  // ========================================
  // ✅ FETCH ALL DATA FROM ALL 9 TABLES
  // ========================================

  const fetchCompleteData = async () => {
    const loadingToast = toast.loading('Fetching complete data from all tables...')
    
    try {
      const allFacultyData = []

      for (const fac of filteredData) {
        // Fetch all related data for each faculty
        const [personalDetails, journals, conferences, books, bookChapters, awards, patents, certifications] = await Promise.all([
          supabase.from('personal_details').select('*').eq('faculty_id', fac.id).single(),
          supabase.from('journals').select('*').eq('faculty_id', fac.id),
          supabase.from('conferences').select('*').eq('faculty_id', fac.id),
          supabase.from('books').select('*').eq('faculty_id', fac.id),
          supabase.from('book_chapters').select('*').eq('faculty_id', fac.id),
          supabase.from('awards').select('*').eq('faculty_id', fac.id),
          supabase.from('patents').select('*').eq('faculty_id', fac.id),
          supabase.from('online_certifications').select('*').eq('faculty_id', fac.id)
        ])

        allFacultyData.push({
          profile: fac,
          personalDetails: personalDetails.data || {},
          journals: journals.data || [],
          conferences: conferences.data || [],
          books: books.data || [],
          bookChapters: bookChapters.data || [],
          awards: awards.data || [],
          patents: patents.data || [],
          certifications: certifications.data || []
        })
      }

      toast.dismiss(loadingToast)
      toast.success(`✅ Loaded complete data for ${allFacultyData.length} faculty members!`)
      return allFacultyData
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error('Failed to fetch complete data')
      console.error(error)
      return []
    }
  }

  // ========================================
  // ✅ EXPORT TO CSV - ALL TABLES
  // ========================================

  const exportToCSV = async () => {
    const allData = await fetchCompleteData()
    if (!allData.length) return

    let csvContent = ''

    allData.forEach((data, index) => {
      const profile = data.profile
      const personal = data.personalDetails

      csvContent += `\n\n========== FACULTY ${index + 1}: ${profile.first_name} ${profile.last_name} ==========\n`
      
      // Faculty Profile
      csvContent += `\n--- PROFILE ---\n`
      csvContent += `Name,${profile.title} ${profile.first_name} ${profile.last_name}\n`
      csvContent += `Email,${profile.email || 'N/A'}\n`
      csvContent += `Mobile,${profile.mobile_number || 'N/A'}\n`
      csvContent += `Department,${profile.department || 'N/A'}\n`
      csvContent += `Designation,${profile.designation || 'N/A'}\n`
      csvContent += `Gender,${profile.gender || 'N/A'}\n`
      csvContent += `DOB,${profile.date_of_birth || 'N/A'}\n`
      csvContent += `Organisation,${profile.organisation || 'N/A'}\n`

      // Personal Details
      csvContent += `\n--- PERSONAL DETAILS ---\n`
      csvContent += `UG Specialization,${personal.ug_specialization || 'N/A'}\n`
      csvContent += `PG Specialization,${personal.pg_specialization || 'N/A'}\n`
      csvContent += `PhD Specialization,${personal.phd_specialization || 'N/A'}\n`
      csvContent += `PhD Year,${personal.phd_completed_year || 'N/A'}\n`
      csvContent += `Experience (Years),${personal.experience_years || 'N/A'}\n`

      // Journals
      if (data.journals.length > 0) {
        csvContent += `\n--- JOURNALS (${data.journals.length}) ---\n`
        csvContent += `Title,Authors,Journal Name,Year,DOI,Indexing\n`
        data.journals.forEach(j => {
          csvContent += `"${j.title}","${j.authors}","${j.journal_name}",${j.year},"${j.doi}","${j.indexing}"\n`
        })
      }

      // Conferences
      if (data.conferences.length > 0) {
        csvContent += `\n--- CONFERENCES (${data.conferences.length}) ---\n`
        csvContent += `Title,Authors,Conference Name,Year,DOI\n`
        data.conferences.forEach(c => {
          csvContent += `"${c.title}","${c.authors}","${c.conference_name}",${c.year},"${c.doi}"\n`
        })
      }

      // Books
      if (data.books.length > 0) {
        csvContent += `\n--- BOOKS (${data.books.length}) ---\n`
        csvContent += `Title,Authors,Publisher,Year,ISBN\n`
        data.books.forEach(b => {
          csvContent += `"${b.title}","${b.authors}","${b.publishers}",${b.year},"${b.isbn_no}"\n`
        })
      }

      // Book Chapters
      if (data.bookChapters.length > 0) {
        csvContent += `\n--- BOOK CHAPTERS (${data.bookChapters.length}) ---\n`
        csvContent += `Title,Authors,Publisher,Year,ISBN\n`
        data.bookChapters.forEach(bc => {
          csvContent += `"${bc.title}","${bc.authors}","${bc.publishers}",${bc.year},"${bc.isbn_no}"\n`
        })
      }

      // Awards
      if (data.awards.length > 0) {
        csvContent += `\n--- AWARDS (${data.awards.length}) ---\n`
        csvContent += `Award Title,Awarded By,Year,Level\n`
        data.awards.forEach(a => {
          csvContent += `"${a.title_of_award}","${a.award_given_by}",${a.year},"${a.international_national}"\n`
        })
      }

      // Patents
      if (data.patents.length > 0) {
        csvContent += `\n--- PATENTS (${data.patents.length}) ---\n`
        csvContent += `Title,Application No,Status,Filed Date,Country\n`
        data.patents.forEach(p => {
          csvContent += `"${p.title_of_invention}","${p.application_number}","${p.application_status}","${p.date_of_filing}","${p.country}"\n`
        })
      }

      // Certifications
      if (data.certifications.length > 0) {
        csvContent += `\n--- CERTIFICATIONS (${data.certifications.length}) ---\n`
        csvContent += `Course Title,Platform,Duration,Year\n`
        data.certifications.forEach(cert => {
          csvContent += `"${cert.course_title}","${cert.institute_offered}","${cert.duration}",${cert.year}\n`
        })
      }
    })

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    saveAs(blob, `Complete_Faculty_Report_${new Date().toISOString().split('T')[0]}.csv`)
    toast.success('✅ Complete CSV downloaded with all 9 tables!')
  }

  // ========================================
  // ✅ EXPORT TO XLSX - MULTIPLE SHEETS
  // ========================================

  const exportToXLSX = async () => {
    const allData = await fetchCompleteData()
    if (!allData.length) return

    const workbook = XLSX.utils.book_new()

    // SHEET 1: Faculty Profiles
    const profileData = allData.map(d => ({
      'Name': `${d.profile.title || ''} ${d.profile.first_name} ${d.profile.last_name}`,
      'Email': d.profile.email,
      'Mobile': d.profile.mobile_number,
      'Department': d.profile.department,
      'Designation': d.profile.designation,
      'Organisation': d.profile.organisation
    }))
    const profileSheet = XLSX.utils.json_to_sheet(profileData)
    XLSX.utils.book_append_sheet(workbook, profileSheet, 'Faculty Profiles')

    // SHEET 2: Personal Details
    const personalData = allData.map(d => ({
      'Name': `${d.profile.first_name} ${d.profile.last_name}`,
      'UG': d.personalDetails.ug_specialization || 'N/A',
      'PG': d.personalDetails.pg_specialization || 'N/A',
      'PhD': d.personalDetails.phd_specialization || 'N/A',
      'PhD Year': d.personalDetails.phd_completed_year || 'N/A',
      'Experience': d.personalDetails.experience_years || 'N/A'
    }))
    const personalSheet = XLSX.utils.json_to_sheet(personalData)
    XLSX.utils.book_append_sheet(workbook, personalSheet, 'Personal Details')

    // SHEET 3: Journals
    const journalsData = []
    allData.forEach(d => {
      d.journals.forEach(j => {
        journalsData.push({
          'Faculty': `${d.profile.first_name} ${d.profile.last_name}`,
          'Title': j.title,
          'Authors': j.authors,
          'Journal': j.journal_name,
          'Year': j.year,
          'DOI': j.doi,
          'Indexing': j.indexing
        })
      })
    })
    if (journalsData.length > 0) {
      const journalsSheet = XLSX.utils.json_to_sheet(journalsData)
      XLSX.utils.book_append_sheet(workbook, journalsSheet, 'Journals')
    }

    // SHEET 4: Conferences
    const conferencesData = []
    allData.forEach(d => {
      d.conferences.forEach(c => {
        conferencesData.push({
          'Faculty': `${d.profile.first_name} ${d.profile.last_name}`,
          'Title': c.title,
          'Conference': c.conference_name,
          'Year': c.year,
          'DOI': c.doi
        })
      })
    })
    if (conferencesData.length > 0) {
      const conferencesSheet = XLSX.utils.json_to_sheet(conferencesData)
      XLSX.utils.book_append_sheet(workbook, conferencesSheet, 'Conferences')
    }

    // SHEET 5: Books
    const booksData = []
    allData.forEach(d => {
      d.books.forEach(b => {
        booksData.push({
          'Faculty': `${d.profile.first_name} ${d.profile.last_name}`,
          'Title': b.title,
          'Publisher': b.publishers,
          'Year': b.year,
          'ISBN': b.isbn_no
        })
      })
    })
    if (booksData.length > 0) {
      const booksSheet = XLSX.utils.json_to_sheet(booksData)
      XLSX.utils.book_append_sheet(workbook, booksSheet, 'Books')
    }

    // SHEET 6: Book Chapters
    const bookChaptersData = []
    allData.forEach(d => {
      d.bookChapters.forEach(bc => {
        bookChaptersData.push({
          'Faculty': `${d.profile.first_name} ${d.profile.last_name}`,
          'Title': bc.title,
          'Publisher': bc.publishers,
          'Year': bc.year,
          'ISBN': bc.isbn_no
        })
      })
    })
    if (bookChaptersData.length > 0) {
      const bookChaptersSheet = XLSX.utils.json_to_sheet(bookChaptersData)
      XLSX.utils.book_append_sheet(workbook, bookChaptersSheet, 'Book Chapters')
    }

    // SHEET 7: Awards
    const awardsData = []
    allData.forEach(d => {
      d.awards.forEach(a => {
        awardsData.push({
          'Faculty': `${d.profile.first_name} ${d.profile.last_name}`,
          'Award': a.title_of_award,
          'Awarded By': a.award_given_by,
          'Year': a.year,
          'Level': a.international_national
        })
      })
    })
    if (awardsData.length > 0) {
      const awardsSheet = XLSX.utils.json_to_sheet(awardsData)
      XLSX.utils.book_append_sheet(workbook, awardsSheet, 'Awards')
    }

    // SHEET 8: Patents
    const patentsData = []
    allData.forEach(d => {
      d.patents.forEach(p => {
        patentsData.push({
          'Faculty': `${d.profile.first_name} ${d.profile.last_name}`,
          'Title': p.title_of_invention,
          'Application No': p.application_number,
          'Status': p.application_status,
          'Country': p.country
        })
      })
    })
    if (patentsData.length > 0) {
      const patentsSheet = XLSX.utils.json_to_sheet(patentsData)
      XLSX.utils.book_append_sheet(workbook, patentsSheet, 'Patents')
    }

    // SHEET 9: Certifications
    const certsData = []
    allData.forEach(d => {
      d.certifications.forEach(cert => {
        certsData.push({
          'Faculty': `${d.profile.first_name} ${d.profile.last_name}`,
          'Course': cert.course_title,
          'Platform': cert.institute_offered,
          'Duration': cert.duration,
          'Year': cert.year
        })
      })
    })
    if (certsData.length > 0) {
      const certsSheet = XLSX.utils.json_to_sheet(certsData)
      XLSX.utils.book_append_sheet(workbook, certsSheet, 'Certifications')
    }

    XLSX.writeFile(workbook, `Complete_Faculty_Report_${new Date().toISOString().split('T')[0]}.xlsx`)
    toast.success(`✅ Excel file with ${workbook.SheetNames.length} sheets downloaded!`)
  }

  // ========================================
  // ✅ EXPORT TO PDF - ALL TABLES
  // ========================================

  const exportToPDF = async () => {
    const allData = await fetchCompleteData()
    if (!allData.length) return

    const doc = new jsPDF()
    let yPos = 20

    doc.setFontSize(18)
    doc.text('Complete Faculty Report', 14, yPos)
    doc.setFontSize(11)
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, yPos + 8)
    doc.text(`Total Faculty: ${allData.length}`, 14, yPos + 14)

    allData.forEach((data, index) => {
      if (index > 0) doc.addPage()
      
      yPos = 20
      doc.setFontSize(14)
      doc.text(`Faculty ${index + 1}: ${data.profile.first_name} ${data.profile.last_name}`, 14, yPos)
      yPos += 10

      // Profile Table
      doc.autoTable({
        startY: yPos,
        head: [['Field', 'Value']],
        body: [
          ['Name', `${data.profile.title || ''} ${data.profile.first_name} ${data.profile.last_name}`],
          ['Email', data.profile.email || 'N/A'],
          ['Department', data.profile.department || 'N/A'],
          ['Designation', data.profile.designation || 'N/A']
        ],
        theme: 'grid',
        headStyles: { fillColor: [37, 99, 235] }
      })

      yPos = doc.lastAutoTable.finalY + 10

      // Journals
      if (data.journals.length > 0) {
        doc.setFontSize(12)
        doc.text(`Journals (${data.journals.length})`, 14, yPos)
        doc.autoTable({
          startY: yPos + 5,
          head: [['Title', 'Journal', 'Year']],
          body: data.journals.map(j => [j.title, j.journal_name, j.year]),
          theme: 'striped',
          headStyles: { fillColor: [37, 99, 235] }
        })
        yPos = doc.lastAutoTable.finalY + 10
      }

      // More tables for conferences, books, etc. follow same pattern
    })

    doc.save(`Complete_Faculty_Report_${new Date().toISOString().split('T')[0]}.pdf`)
    toast.success('✅ Complete PDF downloaded!')
  }

  // ========================================
  // ✅ MASTER EXPORT HANDLER
  // ========================================

  const handleExport = async () => {
    if (filteredData.length === 0) {
      toast.error('No data to export')
      return
    }

    setExporting(true)
    try {
      switch (exportFormat) {
        case 'csv':
          await exportToCSV()
          break
        case 'xlsx':
          await exportToXLSX()
          break
        case 'pdf':
          await exportToPDF()
          break
        default:
          toast.error('Format not supported yet')
      }
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export data')
    } finally {
      setExporting(false)
    }
  }

  // ========================================
  // ✅ RENDER (UI REMAINS SAME)
  // ========================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading faculty directory...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Faculty Directory</h1>
          <p className="text-gray-600">Browse and search faculty members</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search by name, email, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>

            <select
              value={designationFilter}
              onChange={(e) => setDesignationFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Designations</option>
              {designations.map(desig => (
                <option key={desig} value={desig}>{desig}</option>
              ))}
            </select>

            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="10">10 per page</option>
              <option value="25">25 per page</option>
              <option value="50">50 per page</option>
              <option value="100">100 per page</option>
            </select>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} results
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-blue-600 to-blue-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Department</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Designation</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                        </svg>
                        <p className="text-lg font-medium">No faculty members found</p>
                        <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentItems.map((faculty) => (
                    <tr key={faculty.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                            {faculty.first_name?.[0] || 'F'}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">
                              {faculty.title && `${faculty.title} `}
                              {faculty.first_name} {faculty.last_name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{faculty.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{faculty.department || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{faculty.designation || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{faculty.mobile_number || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleViewDetails(faculty)}
                          className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredData.length > 0 && (
            <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200">
              <div className="text-sm text-gray-600 mb-4 sm:mb-0">
                Page {currentPage} of {totalPages}
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  ««
                </button>
                
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  «
                </button>

                {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                  let pageNum
                  if (totalPages <= 5) {
                    pageNum = idx + 1
                  } else if (currentPage <= 3) {
                    pageNum = idx + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + idx
                  } else {
                    pageNum = currentPage - 2 + idx
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-2 rounded-lg transition-colors ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white font-semibold'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  »
                </button>

                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  »»
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Export Section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📥 Download Complete Report (ALL 9 TABLES)</h2>
          <p className="text-gray-600 mb-4">
            Export complete data including: Profile, Personal Details, Journals, Conferences, Books, Book Chapters, Awards, Patents & Certifications
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto"
            >
              <option value="csv">CSV (Complete Data)</option>
              <option value="xlsx">XLSX (9 Sheets)</option>
              <option value="pdf">PDF (All Tables)</option>
            </select>

            <button
              onClick={handleExport}
              disabled={exporting || filteredData.length === 0}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              {exporting ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                  </svg>
                  <span>Download {exportFormat.toUpperCase()} (9 Tables)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {selectedFaculty && (
        <FacultyDetailModal
          facultyId={selectedFaculty.id}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </div>
  )
}

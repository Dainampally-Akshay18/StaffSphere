import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService, supabase } from '../services/supabase'
import toast, { Toaster } from 'react-hot-toast'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

// Import all form components
import JournalsForm from '../components/forms/JournalsForm'
import ConferencesForm from '../components/forms/ConferencesForm'
import BooksForm from '../components/forms/BooksForm'
import AwardsForm from '../components/forms/AwardsForm'
import PatentsForm from '../components/forms/PatentsForm'
import CourseraForm from '../components/forms/CourseraForm'
import NPTELForm from '../components/forms/NPTELForm'

const FORM_STORAGE_KEY = 'faculty_form_draft'

export default function FacultyForm() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)
  const [facultyId, setFacultyId] = useState(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [completedSteps, setCompletedSteps] = useState([])
  const totalSteps = 10

  // Main form data state
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem(FORM_STORAGE_KEY)
    if (savedData) {
      try {
        return JSON.parse(savedData)
      } catch (e) {
        console.error('Error parsing saved form data:', e)
      }
    }
    return {
      // Personal Information - Extended
      title: '', fullName: '', firstName: '', lastName: '', dateOfBirth: '', gender: '',
      mobileNumber: '', email: '', address: '', district: '', state: '', pinNo: '',
      
      // Academic Details (moved to Personal Info as per requirements)
      ugSpecialization: '', pgSpecialization: '', phdSpecialization: '', phdCompletedYear: '',
      pdfSpecialization: '', guideshipDetails: '', pursuingPhdDetails: '', fundedProjects: '',
      
      // Professional Information
      designation: '', department: '', school: '', organisation: '', organisationType: '',
      organisationUrl: '', workingFromMonth: '', workingFromYear: '', experienceYears: '',
      
      // Research Identifiers (moved to Personal Info)
      vidwanId: '', cmritIrinsProfileLink: '', orcidId: '', scopusId: '', 
      researcherId: '', googleScholarId: '', microsoftAcademicId: '',
      
      // Additional Details
      wosSubjectCode: '', wosSubject: '', expertiseCode: '', expertise: '', 
      briefExpertise: '', editorialMember: '', professionalBodyMemberships: '',
    }
  })

  // Dynamic array states
  const [journals, setJournals] = useState([])
  const [conferences, setConferences] = useState([])
  const [books, setBooks] = useState([])
  const [awards, setAwards] = useState([])
  const [patents, setPatents] = useState([])
  const [courseraNCourses, setCourseraNCourses] = useState([])
  const [nptelCourses, setNptelCourses] = useState([])

  const [errors, setErrors] = useState({})

  useEffect(() => {
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formData))
  }, [formData])

  useEffect(() => {
    checkUserAndLoadData()
  }, [])

  const checkUserAndLoadData = async () => {
    try {
      const currentUser = await authService.getCurrentUser()
      if (!currentUser) {
        navigate('/login')
      } else {
        setUser(currentUser)
        setFormData(prev => ({
          ...prev,
          email: prev.email || currentUser.email,
          firstName: prev.firstName || currentUser.user_metadata?.first_name || '',
          lastName: prev.lastName || currentUser.user_metadata?.last_name || ''
        }))
        
        await loadExistingData(currentUser.id)
      }
    } catch (error) {
      navigate('/login')
    }
  }

  const loadExistingData = async (userId) => {
    try {
      const { data: facultyData } = await supabase
        .from('faculty_profile')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (facultyData) {
        setFacultyId(facultyData.id)
        setIsEditMode(true)
        toast.success('📝 Editing existing profile', { duration: 3000 })
        
        setFormData({
          title: facultyData.title || '', fullName: facultyData.full_name || '',
          firstName: facultyData.first_name || '', lastName: facultyData.last_name || '',
          dateOfBirth: facultyData.date_of_birth || '', gender: facultyData.gender || '',
          mobileNumber: facultyData.mobile_number || '', email: facultyData.email || '',
          address: facultyData.address || '', district: facultyData.district || '',
          state: facultyData.state || '', pinNo: facultyData.pin_no || '',
          designation: facultyData.designation || '', department: facultyData.department || '',
          school: facultyData.school || '', organisation: facultyData.organisation || '',
          organisationType: facultyData.organisation_type || '', organisationUrl: facultyData.organisation_url || '',
          workingFromMonth: facultyData.working_from_month || '', workingFromYear: facultyData.working_from_year || '',
          orcidId: facultyData.orcid_id || '', researcherId: facultyData.researcher_id || '',
          scopusId: facultyData.scopus_id || '', googleScholarId: facultyData.google_scholar_id || '',
          microsoftAcademicId: facultyData.microsoft_academic_id || '', vidwanId: facultyData.vidwan_id || '',
          cmritIrinsProfileLink: facultyData.cmrit_irins_profile_link || '',
          wosSubjectCode: facultyData.wos_subject_code || '', wosSubject: facultyData.wos_subject || '',
          expertiseCode: facultyData.expertise_code || '', expertise: facultyData.expertise || '',
          briefExpertise: facultyData.brief_expertise || '',
          ugSpecialization: facultyData.ug_specialization || '', pgSpecialization: facultyData.pg_specialization || '',
          phdSpecialization: facultyData.phd_specialization || '', phdCompletedYear: facultyData.phd_completed_year || '',
          pdfSpecialization: facultyData.pdf_specialization || '', guideshipDetails: facultyData.guideship_details || '',
          pursuingPhdDetails: facultyData.pursuing_phd_details || '', fundedProjects: facultyData.funded_projects || '',
          experienceYears: facultyData.experience_years || '', editorialMember: facultyData.editorial_member || '',
          professionalBodyMemberships: facultyData.professional_body_memberships || '',
        })

        // Load additional sections
        const loadPromises = [
          supabase.from('journals').select('*').eq('faculty_id', facultyData.id),
          supabase.from('conferences').select('*').eq('faculty_id', facultyData.id),
          supabase.from('books').select('*').eq('faculty_id', facultyData.id),
          supabase.from('awards').select('*').eq('faculty_id', facultyData.id),
          supabase.from('patents').select('*').eq('faculty_id', facultyData.id),
          supabase.from('online_certifications').select('*').eq('faculty_id', facultyData.id)
        ]

        const [journalsData, conferencesData, booksData, awardsData, patentsData, certsData] = await Promise.all(loadPromises)

        setJournals(journalsData.data || [])
        setConferences(conferencesData.data || [])
        setBooks(booksData.data || [])
        setAwards(awardsData.data || [])
        setPatents(patentsData.data || [])

        const coursera = (certsData.data || []).filter(c => c.institute_offered?.toLowerCase().includes('coursera'))
        const nptel = (certsData.data || []).filter(c => c.institute_offered?.toLowerCase().includes('nptel'))
        setCourseraNCourses(coursera)
        setNptelCourses(nptel)

        // Mark completed steps
        updateCompletedSteps()
      }
    } catch (error) {
      console.error('Error loading existing data:', error)
      toast.error('Failed to load existing data')
    }
  }

  const updateCompletedSteps = () => {
    const completed = []
    if (formData.firstName && formData.email && formData.mobileNumber) completed.push(1)
    if (formData.ugSpecialization || formData.pgSpecialization) completed.push(2)
    if (formData.designation && formData.department) completed.push(3)
    if (formData.orcidId || formData.scopusId) completed.push(4)
    if (formData.expertise) completed.push(5)
    if (journals.length > 0) completed.push(6)
    if (conferences.length > 0) completed.push(7)
    if (books.length > 0) completed.push(8)
    if (awards.length > 0 || patents.length > 0) completed.push(9)
    if (courseraNCourses.length > 0 || nptelCourses.length > 0) completed.push(10)
    setCompletedSteps(completed)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateStep = (step) => {
    const newErrors = {}
    if (step === 1) {
      if (!formData.firstName) newErrors.firstName = 'First name is required'
      if (!formData.email) newErrors.email = 'Email is required'
      if (!formData.mobileNumber) newErrors.mobileNumber = 'Mobile number is required'
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required'
    }
    if (step === 3) {
      if (!formData.designation) newErrors.designation = 'Designation is required'
      if (!formData.department) newErrors.department = 'Department is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep])
      }
      setCurrentStep(prev => Math.min(prev + 1, totalSteps))
      window.scrollTo({ top: 0, behavior: 'smooth' })
      toast.success(`Step ${currentStep} completed! ✓`, { duration: 2000, icon: '✅' })
    } else {
      toast.error('Please fill all required fields', { duration: 3000 })
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goToStep = (stepNumber) => {
    setCurrentStep(stepNumber)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLogout = async () => {
    try {
      await authService.signOut()
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleSubmit = async () => {
    if (currentStep !== totalSteps) {
      toast.error('Please complete all steps before submitting', { duration: 3000 })
      return
    }
    
    if (!validateStep(currentStep)) return

    setLoading(true)
    const loadingToast = toast.loading('Saving your profile... Please wait')

    try {
      let currentFacultyId = facultyId

      const profilePayload = {
        title: formData.title, full_name: formData.fullName, first_name: formData.firstName,
        last_name: formData.lastName, date_of_birth: formData.dateOfBirth, gender: formData.gender,
        mobile_number: formData.mobileNumber, email: formData.email, address: formData.address,
        district: formData.district, state: formData.state, pin_no: formData.pinNo,
        designation: formData.designation, department: formData.department, school: formData.school,
        organisation: formData.organisation, organisation_type: formData.organisationType,
        organisation_url: formData.organisationUrl, working_from_month: formData.workingFromMonth,
        working_from_year: formData.workingFromYear, orcid_id: formData.orcidId,
        researcher_id: formData.researcherId, scopus_id: formData.scopusId,
        google_scholar_id: formData.googleScholarId, microsoft_academic_id: formData.microsoftAcademicId,
        vidwan_id: formData.vidwanId, cmrit_irins_profile_link: formData.cmritIrinsProfileLink,
        wos_subject_code: formData.wosSubjectCode, wos_subject: formData.wosSubject,
        expertise_code: formData.expertiseCode, expertise: formData.expertise,
        brief_expertise: formData.briefExpertise,
        ug_specialization: formData.ugSpecialization, pg_specialization: formData.pgSpecialization,
        phd_specialization: formData.phdSpecialization, phd_completed_year: formData.phdCompletedYear,
        pdf_specialization: formData.pdfSpecialization, guideship_details: formData.guideshipDetails,
        pursuing_phd_details: formData.pursuingPhdDetails, funded_projects: formData.fundedProjects,
        experience_years: formData.experienceYears, editorial_member: formData.editorialMember,
        professional_body_memberships: formData.professionalBodyMemberships,
      }

      if (isEditMode && facultyId) {
        await supabase.from('faculty_profile').update({
          ...profilePayload,
          updated_at: new Date().toISOString()
        }).eq('id', facultyId)
      } else {
        const { data: profileData, error: profileError } = await supabase
          .from('faculty_profile')
          .insert([{ ...profilePayload, user_id: user.id }])
          .select()

        if (profileError) throw profileError
        currentFacultyId = profileData[0].id
        setFacultyId(currentFacultyId)
      }

      await saveAdditionalSections(currentFacultyId)
      localStorage.removeItem(FORM_STORAGE_KEY)
      
      toast.dismiss(loadingToast)
      toast.success(
        isEditMode ? '✅ Profile updated successfully!' : '🎉 Profile created successfully!',
        { duration: 4000 }
      )
      
      setTimeout(() => navigate('/dashboard'), 1500)

    } catch (error) {
      console.error('Error saving faculty data:', error)
      toast.dismiss(loadingToast)
      toast.error(`❌ Error: ${error.message}`, { duration: 5000 })
      setErrors({ submit: error.message })
    } finally {
      setLoading(false)
    }
  }

  const saveAdditionalSections = async (facultyId) => {
    if (isEditMode) {
      await Promise.all([
        supabase.from('journals').delete().eq('faculty_id', facultyId),
        supabase.from('conferences').delete().eq('faculty_id', facultyId),
        supabase.from('books').delete().eq('faculty_id', facultyId),
        supabase.from('awards').delete().eq('faculty_id', facultyId),
        supabase.from('patents').delete().eq('faculty_id', facultyId),
        supabase.from('online_certifications').delete().eq('faculty_id', facultyId)
      ])
    }

    const insertPromises = []
    if (journals.length > 0) insertPromises.push(supabase.from('journals').insert(journals.map(j => ({ ...j, faculty_id: facultyId }))))
    if (conferences.length > 0) insertPromises.push(supabase.from('conferences').insert(conferences.map(c => ({ ...c, faculty_id: facultyId }))))
    if (books.length > 0) insertPromises.push(supabase.from('books').insert(books.map(b => ({ ...b, faculty_id: facultyId }))))
    if (awards.length > 0) insertPromises.push(supabase.from('awards').insert(awards.map(a => ({ ...a, faculty_id: facultyId }))))
    if (patents.length > 0) insertPromises.push(supabase.from('patents').insert(patents.map(p => ({ ...p, faculty_id: facultyId }))))

    const allCertifications = [...courseraNCourses, ...nptelCourses]
    if (allCertifications.length > 0) {
      insertPromises.push(supabase.from('online_certifications').insert(allCertifications.map(c => ({ ...c, faculty_id: facultyId }))))
    }

    await Promise.all(insertPromises)
  }

  const steps = [
    { number: 1, title: 'Personal Info', icon: '👤' },
    { number: 2, title: 'Academic', icon: '🎓' },
    { number: 3, title: 'Professional', icon: '💼' },
    { number: 4, title: 'Research IDs', icon: '🔬' },
    { number: 5, title: 'Expertise', icon: '📝' },
    { number: 6, title: 'Journals', icon: '📰' },
    { number: 7, title: 'Conferences', icon: '🎤' },
    { number: 8, title: 'Books', icon: '📚' },
    { number: 9, title: 'Awards & Patents', icon: '🏆' },
    { number: 10, title: 'Certifications', icon: '🎓' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { background: '#363636', color: '#fff' },
          success: { duration: 3000, iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error: { duration: 4000, iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />

      <Sidebar isOpen={sidebarOpen} user={user} />

      <div className="lg:pl-64 transition-all duration-300">
        <Navbar user={user} onLogout={handleLogout} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <button onClick={() => navigate('/dashboard')} className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
                </svg>
                Back to Dashboard
              </button>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                ✏️ {isEditMode ? 'Update' : 'Create'} Faculty Profile
              </h1>
              <p className="text-gray-600 mt-2">Complete your profile information step by step</p>
            </div>

            {isEditMode && (
              <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded-lg flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                </svg>
                <p className="text-sm text-blue-800 font-medium">📌 Updating existing profile</p>
              </div>
            )}

            {/* Progress Stepper - Clickable */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="grid grid-cols-5 md:grid-cols-10 gap-4">
                {steps.map((step) => (
                  <button
                    key={step.number}
                    onClick={() => goToStep(step.number)}
                    className={`flex flex-col items-center p-3 rounded-lg transition-all ${
                      currentStep === step.number 
                        ? 'bg-blue-100 ring-2 ring-blue-600' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold transition-all relative ${
                      currentStep === step.number
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white scale-110'
                        : completedSteps.includes(step.number)
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {completedSteps.includes(step.number) ? '✓' : step.icon}
                    </div>
                    <span className={`text-xs mt-2 font-medium text-center ${
                      currentStep === step.number ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step Counter */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Current Step</p>
                  <p className="text-2xl font-bold text-blue-600">Step {currentStep} of {totalSteps}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">Progress</p>
                  <p className="text-2xl font-bold text-green-600">{Math.round((currentStep / totalSteps) * 100)}%</p>
                </div>
              </div>
              <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-green-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Form Content */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <form onSubmit={(e) => e.preventDefault()}>
                
                {/* Step 1: Personal Information - EXTENDED */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <span className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center">🎓</span>
                      Personal Information
                    </h2>
                    
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                        <select name="title" value={formData.title} onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                          <option value="">Select</option>
                          {['Dr', 'Mr', 'Ms', 'Mrs', 'Prof'].map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange}
                          placeholder="Enter full name"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                        {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                        <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                          Date of Birth <span className="text-red-500">*</span>
                        </label>
                        <input type="date" id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                        {errors.dateOfBirth && <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                        <select name="gender" value={formData.gender} onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                          <option value="">Select</option>
                          {['Male', 'Female', 'Other'].map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-2">
                          Mobile Number <span className="text-red-500">*</span>
                        </label>
                        <input type="tel" id="mobileNumber" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange}
                          placeholder="+91 9876543210"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                        {errors.mobileNumber && <p className="mt-1 text-sm text-red-600">{errors.mobileNumber}</p>}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input type="email" id="email" name="email" value={formData.email} onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                      {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                    </div>

                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      <textarea id="address" name="address" value={formData.address} onChange={handleChange} rows="2"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Enter full address"></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-2">District</label>
                        <input type="text" id="district" name="district" value={formData.district} onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">State</label>
                        <input type="text" id="state" name="state" value={formData.state} onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                      <div>
                        <label htmlFor="pinNo" className="block text-sm font-medium text-gray-700 mb-2">Pin Code</label>
                        <input type="text" id="pinNo" name="pinNo" value={formData.pinNo} onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                    </div>

                    {/* Academic Qualifications */}
                    <div className="border-t-2 border-gray-200 pt-6 mt-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Academic Qualifications</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="ugSpecialization" className="block text-sm font-medium text-gray-700 mb-2">UG Specialization</label>
                          <input type="text" id="ugSpecialization" name="ugSpecialization" value={formData.ugSpecialization} onChange={handleChange}
                            placeholder="e.g., B.E in Computer Science"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>

                        <div>
                          <label htmlFor="pgSpecialization" className="block text-sm font-medium text-gray-700 mb-2">PG Specialization</label>
                          <input type="text" id="pgSpecialization" name="pgSpecialization" value={formData.pgSpecialization} onChange={handleChange}
                            placeholder="e.g., M.Tech in AI & ML"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="phdSpecialization" className="block text-sm font-medium text-gray-700 mb-2">PhD Specialization</label>
                            <input type="text" id="phdSpecialization" name="phdSpecialization" value={formData.phdSpecialization} onChange={handleChange}
                              placeholder="e.g., Machine Learning"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                          </div>
                          <div>
                            <label htmlFor="phdCompletedYear" className="block text-sm font-medium text-gray-700 mb-2">PhD Completion Year</label>
                            <input type="number" id="phdCompletedYear" name="phdCompletedYear" value={formData.phdCompletedYear} onChange={handleChange}
                              placeholder="2020"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="pdfSpecialization" className="block text-sm font-medium text-gray-700 mb-2">PDF (Post-Doctoral Fellowship) Specialization</label>
                          <input type="text" id="pdfSpecialization" name="pdfSpecialization" value={formData.pdfSpecialization} onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>

                        <div>
                          <label htmlFor="guideshipDetails" className="block text-sm font-medium text-gray-700 mb-2">Guideship Details</label>
                          <textarea id="guideshipDetails" name="guideshipDetails" value={formData.guideshipDetails} onChange={handleChange} rows="2"
                            placeholder="Details about students guided for PhD/M.Tech"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
                        </div>

                        <div>
                          <label htmlFor="pursuingPhdDetails" className="block text-sm font-medium text-gray-700 mb-2">Pursuing PhD Details</label>
                          <textarea id="pursuingPhdDetails" name="pursuingPhdDetails" value={formData.pursuingPhdDetails} onChange={handleChange} rows="2"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
                        </div>

                        <div>
                          <label htmlFor="fundedProjects" className="block text-sm font-medium text-gray-700 mb-2">Funded Projects</label>
                          <textarea id="fundedProjects" name="fundedProjects" value={formData.fundedProjects} onChange={handleChange} rows="2"
                            placeholder="List of funded research projects"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
                        </div>
                      </div>
                    </div>

                    {/* Experience & Memberships */}
                    <div className="border-t-2 border-gray-200 pt-6 mt-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Professional Experience</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="experienceYears" className="block text-sm font-medium text-gray-700 mb-2">Total Experience (in years)</label>
                          <input type="number" id="experienceYears" name="experienceYears" value={formData.experienceYears} onChange={handleChange}
                            placeholder="15"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>

                        <div>
                          <label htmlFor="editorialMember" className="block text-sm font-medium text-gray-700 mb-2">Editorial Memberships</label>
                          <input type="text" id="editorialMember" name="editorialMember" value={formData.editorialMember} onChange={handleChange}
                            placeholder="Journal names where you are an editorial member"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>

                        <div>
                          <label htmlFor="professionalBodyMemberships" className="block text-sm font-medium text-gray-700 mb-2">Professional Body Memberships</label>
                          <textarea id="professionalBodyMemberships" name="professionalBodyMemberships" value={formData.professionalBodyMemberships} onChange={handleChange} rows="2"
                            placeholder="e.g., IEEE, ACM, CSI"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
                        </div>
                      </div>
                    </div>

                    {/* Research Profile Links */}
                    <div className="border-t-2 border-gray-200 pt-6 mt-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Research Profile Links</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="vidwanId" className="block text-sm font-medium text-gray-700 mb-2">Vidwan ID</label>
                          <input type="text" id="vidwanId" name="vidwanId" value={formData.vidwanId} onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>

                        <div>
                          <label htmlFor="cmritIrinsProfileLink" className="block text-sm font-medium text-gray-700 mb-2">CMRIT IRINS Profile Link</label>
                          <input type="url" id="cmritIrinsProfileLink" name="cmritIrinsProfileLink" value={formData.cmritIrinsProfileLink} onChange={handleChange}
                            placeholder="https://"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>

                        <div>
                          <label htmlFor="orcidId" className="block text-sm font-medium text-gray-700 mb-2">ORCID ID Link</label>
                          <input type="url" id="orcidId" name="orcidId" value={formData.orcidId} onChange={handleChange}
                            placeholder="https://orcid.org/0000-0000-0000-0000"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>

                        <div>
                          <label htmlFor="scopusId" className="block text-sm font-medium text-gray-700 mb-2">SCOPUS ID Link</label>
                          <input type="url" id="scopusId" name="scopusId" value={formData.scopusId} onChange={handleChange}
                            placeholder="https://"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>

                        <div>
                          <label htmlFor="researcherId" className="block text-sm font-medium text-gray-700 mb-2">Researcher ID Link</label>
                          <input type="url" id="researcherId" name="researcherId" value={formData.researcherId} onChange={handleChange}
                            placeholder="https://"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>

                        <div>
                          <label htmlFor="googleScholarId" className="block text-sm font-medium text-gray-700 mb-2">Google Scholar Profile Link</label>
                          <input type="url" id="googleScholarId" name="googleScholarId" value={formData.googleScholarId} onChange={handleChange}
                            placeholder="https://scholar.google.com/"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Remaining steps stay the same as before... */}
                
                {/* Step 2 */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <span className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center">🎓</span>
                      Academic Details (Optional)
                    </h2>
                    <p className="text-gray-600">Most academic details are already captured in Personal Information. Add any additional information here.</p>
                  </div>
                )}

                {/* Step 3: Professional */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <span className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center">💼</span>
                      Professional Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="designation" className="block text-sm font-medium text-gray-700 mb-2">
                          Designation <span className="text-red-500">*</span>
                        </label>
                        <input type="text" id="designation" name="designation" value={formData.designation} onChange={handleChange}
                          placeholder="e.g., Associate Professor"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" required />
                        {errors.designation && <p className="mt-1 text-sm text-red-600">{errors.designation}</p>}
                      </div>
                      <div>
                        <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                          Department <span className="text-red-500">*</span>
                        </label>
                        <input type="text" id="department" name="department" value={formData.department} onChange={handleChange}
                          placeholder="e.g., Computer Science"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" required />
                        {errors.department && <p className="mt-1 text-sm text-red-600">{errors.department}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="school" className="block text-sm font-medium text-gray-700 mb-2">School</label>
                        <input type="text" id="school" name="school" value={formData.school} onChange={handleChange}
                          placeholder="e.g., School of Engineering"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
                      </div>
                      <div>
                        <label htmlFor="organisation" className="block text-sm font-medium text-gray-700 mb-2">Organisation</label>
                        <input type="text" id="organisation" name="organisation" value={formData.organisation} onChange={handleChange}
                          placeholder="e.g., CMRIT"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4-10 - Use existing component imports */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Research Identifiers (Already in Personal Info)</h2>
                    <p className="text-gray-600">Research IDs are already captured in the Personal Information section.</p>
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <span className="w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center">📝</span>
                      Expertise Details
                    </h2>
                    <div>
                      <label htmlFor="expertise" className="block text-sm font-medium text-gray-700 mb-2">Expertise</label>
                      <input type="text" id="expertise" name="expertise" value={formData.expertise} onChange={handleChange}
                        placeholder="e.g., Machine Learning, AI"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
                    </div>
                    <div>
                      <label htmlFor="briefExpertise" className="block text-sm font-medium text-gray-700 mb-2">Brief Expertise</label>
                      <textarea id="briefExpertise" name="briefExpertise" value={formData.briefExpertise} onChange={handleChange} rows="4"
                        placeholder="Describe your areas of expertise"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"></textarea>
                    </div>
                  </div>
                )}

                {currentStep === 6 && <JournalsForm journals={journals} setJournals={setJournals} />}
                {currentStep === 7 && <ConferencesForm conferences={conferences} setConferences={setConferences} />}
                {currentStep === 8 && <BooksForm books={books} setBooks={setBooks} />}
                {currentStep === 9 && (
                  <div className="space-y-8">
                    <AwardsForm awards={awards} setAwards={setAwards} />
                    <div className="border-t-4 border-gray-200 pt-8">
                      <PatentsForm patents={patents} setPatents={setPatents} />
                    </div>
                  </div>
                )}
                {currentStep === 10 && (
                  <div className="space-y-8">
                    <CourseraForm courses={courseraNCourses} setCourses={setCourseraNCourses} />
                    <div className="border-t-4 border-gray-200 pt-8">
                      <NPTELForm courses={nptelCourses} setCourses={setNptelCourses} />
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                  <button 
                    type="button" 
                    onClick={handlePrevious} 
                    disabled={currentStep === 1}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                    Previous
                  </button>

                  {currentStep < totalSteps ? (
                    <button 
                      type="button"  
                      onClick={handleNext}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all flex items-center gap-2"
                    >
                      Next Step ({currentStep}/{totalSteps})
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                      </svg>
                    </button>
                  ) : (
                    <button 
                      type="button" 
                      disabled={loading}
                      onClick={() => {
                        toast((t) => (
                          <div>
                            <p className="font-medium mb-2">Ready to submit?</p>
                            <p className="text-sm text-gray-600 mb-3">Make sure all information is correct.</p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  toast.dismiss(t.id)
                                  handleSubmit()
                                }}
                                className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                              >
                                Yes, Submit
                              </button>
                              <button
                                onClick={() => toast.dismiss(t.id)}
                                className="px-3 py-1 bg-gray-200 text-gray-800 rounded text-sm"
                              >
                                Review Again
                              </button>
                            </div>
                          </div>
                        ), { duration: 8000 })
                      }}
                      className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          ✅ {isEditMode ? 'Update' : 'Submit'} Complete Profile
                        </span>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService, supabase } from '../services/supabase'
import toast, { Toaster } from 'react-hot-toast'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

// Import all form components
import PersonalInfoForm from '../components/forms/PersonalInfoForm'
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
  const [updating, setUpdating] = useState(false)
  const [user, setUser] = useState(null)
  const [facultyId, setFacultyId] = useState(null)
  const [personalDetailsId, setPersonalDetailsId] = useState(null)
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
      // Faculty Profile fields
      title: '', fullName: '', firstName: '', lastName: '', dateOfBirth: '', gender: '',
      mobileNumber: '', email: '', address: '', district: '', state: '', pinNo: '',
      designation: '', department: '', school: '', organisation: '', organisationType: '',
      organisationUrl: '', workingFromMonth: '', workingFromYear: '',
      wosSubjectCode: '', wosSubject: '', expertiseCode: '', expertise: '', briefExpertise: '',
      
      // Personal Details table fields
      ugSpecialization: '', pgSpecialization: '', phdSpecialization: '', phdCompletedYear: '',
      pdfSpecialization: '', guideshipDetails: '', pursuingPhdDetails: '', fundedProjects: '',
      experienceYears: '', editorialMember: '', professionalBodyMemberships: '',
      vidwanId: '', cmritIrinsLink: '', orcidLink: '', scopusLink: '', 
      researcherLink: '', googleScholarLink: '',
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
      // Load faculty profile
      const { data: facultyData } = await supabase
        .from('faculty_profile')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (facultyData) {
        setFacultyId(facultyData.id)
        setIsEditMode(true)
        toast.success('📝 Editing existing profile', { duration: 3000 })
        
        // Load personal details from separate table
        const { data: personalData } = await supabase
          .from('personal_details')
          .select('*')
          .eq('faculty_id', facultyData.id)
          .single()

        if (personalData) {
          setPersonalDetailsId(personalData.id)
        }

        // Combine data from both tables
        setFormData({
          // From faculty_profile
          title: facultyData.title || '',
          fullName: facultyData.full_name || '',
          firstName: facultyData.first_name || '',
          lastName: facultyData.last_name || '',
          dateOfBirth: facultyData.date_of_birth || '',
          gender: facultyData.gender || '',
          mobileNumber: facultyData.mobile_number || '',
          email: facultyData.email || '',
          address: facultyData.address || '',
          district: facultyData.district || '',
          state: facultyData.state || '',
          pinNo: facultyData.pin_no || '',
          designation: facultyData.designation || '',
          department: facultyData.department || '',
          school: facultyData.school || '',
          organisation: facultyData.organisation || '',
          organisationType: facultyData.organisation_type || '',
          organisationUrl: facultyData.organisation_url || '',
          workingFromMonth: facultyData.working_from_month || '',
          workingFromYear: facultyData.working_from_year || '',
          wosSubjectCode: facultyData.wos_subject_code || '',
          wosSubject: facultyData.wos_subject || '',
          expertiseCode: facultyData.expertise_code || '',
          expertise: facultyData.expertise || '',
          briefExpertise: facultyData.brief_expertise || '',
          
          // From personal_details table
          ugSpecialization: personalData?.ug_specialization || '',
          pgSpecialization: personalData?.pg_specialization || '',
          phdSpecialization: personalData?.phd_specialization || '',
          phdCompletedYear: personalData?.phd_completed_year || '',
          pdfSpecialization: personalData?.pdf_specialization || '',
          guideshipDetails: personalData?.guideship_details || '',
          pursuingPhdDetails: personalData?.pursuing_phd_details || '',
          fundedProjects: personalData?.funded_projects || '',
          experienceYears: personalData?.experience_years || '',
          editorialMember: personalData?.editorial_member || '',
          professionalBodyMemberships: personalData?.professional_body_memberships || '',
          vidwanId: personalData?.vidwan_id || '',
          cmritIrinsLink: personalData?.cmrit_irins_link || '',
          orcidLink: personalData?.orcid_link || '',
          scopusLink: personalData?.scopus_link || '',
          researcherLink: personalData?.researcher_link || '',
          googleScholarLink: personalData?.google_scholar_link || '',
        })

        // Load publications and other data
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
    if (formData.orcidLink || formData.scopusLink) completed.push(4)
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

  // Build faculty profile payload
  const buildFacultyProfilePayload = () => {
    return {
      title: formData.title || null,
      full_name: formData.fullName || null,
      first_name: formData.firstName || null,
      last_name: formData.lastName || null,
      date_of_birth: formData.dateOfBirth || null,
      gender: formData.gender || null,
      mobile_number: formData.mobileNumber || null,
      email: formData.email || null,
      address: formData.address || null,
      district: formData.district || null,
      state: formData.state || null,
      pin_no: formData.pinNo || null,
      designation: formData.designation || null,
      department: formData.department || null,
      school: formData.school || null,
      organisation: formData.organisation || null,
      organisation_type: formData.organisationType || null,
      organisation_url: formData.organisationUrl || null,
      working_from_month: formData.workingFromMonth || null,
      working_from_year: formData.workingFromYear || null,
      wos_subject_code: formData.wosSubjectCode || null,
      wos_subject: formData.wosSubject || null,
      expertise_code: formData.expertiseCode || null,
      expertise: formData.expertise || null,
      brief_expertise: formData.briefExpertise || null,
    }
  }

  // Build personal details payload
  const buildPersonalDetailsPayload = (facultyId) => {
    return {
      faculty_id: facultyId,
      ug_specialization: formData.ugSpecialization || null,
      pg_specialization: formData.pgSpecialization || null,
      phd_specialization: formData.phdSpecialization || null,
      phd_completed_year: formData.phdCompletedYear || null,
      pdf_specialization: formData.pdfSpecialization || null,
      guideship_details: formData.guideshipDetails || null,
      pursuing_phd_details: formData.pursuingPhdDetails || null,
      funded_projects: formData.fundedProjects || null,
      editorial_member: formData.editorialMember || null,
      experience_years: formData.experienceYears || null,
      vidwan_id: formData.vidwanId || null,
      cmrit_irins_link: formData.cmritIrinsLink || null,
      orcid_link: formData.orcidLink || null,
      scopus_link: formData.scopusLink || null,
      researcher_link: formData.researcherLink || null,
      google_scholar_link: formData.googleScholarLink || null,
      professional_body_memberships: formData.professionalBodyMemberships || null,
    }
  }

  // Handle Update Current Step
  const handleUpdateCurrentStep = async () => {
    if (!validateStep(currentStep)) {
      toast.error('Please fill all required fields', { duration: 3000 })
      return
    }

    setUpdating(true)
    const loadingToast = toast.loading('Updating current step...')

    try {
      let currentFacultyId = facultyId

      // Save faculty profile
      if (isEditMode && facultyId) {
        const { error } = await supabase.from('faculty_profile').update({
          ...buildFacultyProfilePayload(),
          updated_at: new Date().toISOString()
        }).eq('id', facultyId)
        
        if (error) throw error
      } else {
        const { data: profileData, error: profileError } = await supabase
          .from('faculty_profile')
          .insert([{ ...buildFacultyProfilePayload(), user_id: user.id }])
          .select()

        if (profileError) throw profileError
        currentFacultyId = profileData[0].id
        setFacultyId(currentFacultyId)
        setIsEditMode(true)
      }

      // Save personal details to separate table
      const personalDetailsPayload = buildPersonalDetailsPayload(currentFacultyId)
      
      if (personalDetailsId) {
        // Update existing personal details
        const { error } = await supabase
          .from('personal_details')
          .update({
            ...personalDetailsPayload,
            updated_at: new Date().toISOString()
          })
          .eq('id', personalDetailsId)
        
        if (error) throw error
      } else {
        // Insert new personal details
        const { data, error } = await supabase
          .from('personal_details')
          .insert([personalDetailsPayload])
          .select()
        
        if (error) throw error
        if (data && data[0]) {
          setPersonalDetailsId(data[0].id)
        }
      }

      if (currentStep >= 6) {
        await saveAdditionalSectionsForStep(currentFacultyId, currentStep)
      }

      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep])
      }

      toast.dismiss(loadingToast)
      toast.success(`✅ Step ${currentStep} updated successfully!`, { duration: 3000 })

      if (currentStep < totalSteps) {
        setTimeout(() => {
          setCurrentStep(prev => prev + 1)
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }, 500)
      }

    } catch (error) {
      console.error('Error updating step:', error)
      toast.dismiss(loadingToast)
      toast.error(`❌ Update failed: ${error.message}`, { duration: 4000 })
    } finally {
      setUpdating(false)
    }
  }

  const saveAdditionalSectionsForStep = async (facultyId, step) => {
    if (isEditMode) {
      if (step === 6) await supabase.from('journals').delete().eq('faculty_id', facultyId)
      if (step === 7) await supabase.from('conferences').delete().eq('faculty_id', facultyId)
      if (step === 8) await supabase.from('books').delete().eq('faculty_id', facultyId)
      if (step === 9) {
        await supabase.from('awards').delete().eq('faculty_id', facultyId)
        await supabase.from('patents').delete().eq('faculty_id', facultyId)
      }
      if (step === 10) await supabase.from('online_certifications').delete().eq('faculty_id', facultyId)
    }

    const insertPromises = []
    if (step === 6 && journals.length > 0) {
      insertPromises.push(supabase.from('journals').insert(journals.map(j => ({ ...j, faculty_id: facultyId }))))
    }
    if (step === 7 && conferences.length > 0) {
      insertPromises.push(supabase.from('conferences').insert(conferences.map(c => ({ ...c, faculty_id: facultyId }))))
    }
    if (step === 8 && books.length > 0) {
      insertPromises.push(supabase.from('books').insert(books.map(b => ({ ...b, faculty_id: facultyId }))))
    }
    if (step === 9) {
      if (awards.length > 0) {
        insertPromises.push(supabase.from('awards').insert(awards.map(a => ({ ...a, faculty_id: facultyId }))))
      }
      if (patents.length > 0) {
        insertPromises.push(supabase.from('patents').insert(patents.map(p => ({ ...p, faculty_id: facultyId }))))
      }
    }
    if (step === 10) {
      const allCertifications = [...courseraNCourses, ...nptelCourses]
      if (allCertifications.length > 0) {
        insertPromises.push(supabase.from('online_certifications').insert(allCertifications.map(c => ({ ...c, faculty_id: facultyId }))))
      }
    }

    if (insertPromises.length > 0) {
      await Promise.all(insertPromises)
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

      // Save faculty profile
      if (isEditMode && facultyId) {
        const { error } = await supabase.from('faculty_profile').update({
          ...buildFacultyProfilePayload(),
          updated_at: new Date().toISOString()
        }).eq('id', facultyId)
        
        if (error) throw error
      } else {
        const { data: profileData, error: profileError } = await supabase
          .from('faculty_profile')
          .insert([{ ...buildFacultyProfilePayload(), user_id: user.id }])
          .select()

        if (profileError) throw profileError
        currentFacultyId = profileData[0].id
        setFacultyId(currentFacultyId)
      }

      // Save personal details
      const personalDetailsPayload = buildPersonalDetailsPayload(currentFacultyId)
      
      if (personalDetailsId) {
        await supabase
          .from('personal_details')
          .update({
            ...personalDetailsPayload,
            updated_at: new Date().toISOString()
          })
          .eq('id', personalDetailsId)
      } else {
        await supabase
          .from('personal_details')
          .insert([personalDetailsPayload])
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

    if (insertPromises.length > 0) {
      await Promise.all(insertPromises)
    }
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

        <main className="p-4 sm:p-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <button onClick={() => navigate('/dashboard')} className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
                </svg>
                Back to Dashboard
              </button>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                ✏️ {isEditMode ? 'Update' : 'Create'} Faculty Profile
              </h1>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">Complete your profile information step by step</p>
            </div>

            {isEditMode && (
              <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded-lg flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                </svg>
                <p className="text-sm text-blue-800 font-medium">📌 Updating existing profile</p>
              </div>
            )}

            {/* Progress Stepper and Form - keeping existing UI structure */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6 overflow-x-auto">
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 sm:gap-4 min-w-max sm:min-w-0">
                {steps.map((step) => (
                  <button
                    key={step.number}
                    onClick={() => goToStep(step.number)}
                    className={`flex flex-col items-center p-2 sm:p-3 rounded-lg transition-all ${
                      currentStep === step.number 
                        ? 'bg-blue-100 ring-2 ring-blue-600' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-lg sm:text-xl font-bold transition-all relative ${
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

            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-700">Current Step</p>
                  <p className="text-xl sm:text-2xl font-bold text-blue-600">Step {currentStep} of {totalSteps}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs sm:text-sm font-medium text-gray-700">Progress</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-600">{Math.round((currentStep / totalSteps) * 100)}%</p>
                </div>
              </div>
              <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-green-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-8">
              <form onSubmit={(e) => e.preventDefault()}>
                
                {currentStep === 1 && (
                  <PersonalInfoForm 
                    formData={formData} 
                    handleChange={handleChange} 
                    errors={errors}
                  />
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <span className="w-8 h-8 sm:w-10 sm:h-10 bg-green-600 text-white rounded-full flex items-center justify-center text-lg sm:text-xl">🎓</span>
                      Academic Details (Optional)
                    </h2>
                    <p className="text-gray-600 text-sm sm:text-base">Most academic details are already captured in Personal Information. Add any additional information here if needed.</p>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <span className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-600 text-white rounded-full flex items-center justify-center text-lg sm:text-xl">💼</span>
                      Professional Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label htmlFor="designation" className="block text-sm font-medium text-gray-700 mb-2">
                          Designation <span className="text-red-500">*</span>
                        </label>
                        <input type="text" id="designation" name="designation" value={formData.designation} onChange={handleChange}
                          placeholder="e.g., Associate Professor"
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm sm:text-base" required />
                        {errors.designation && <p className="mt-1 text-sm text-red-600">{errors.designation}</p>}
                      </div>
                      <div>
                        <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                          Department <span className="text-red-500">*</span>
                        </label>
                        <input type="text" id="department" name="department" value={formData.department} onChange={handleChange}
                          placeholder="e.g., Computer Science"
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm sm:text-base" required />
                        {errors.department && <p className="mt-1 text-sm text-red-600">{errors.department}</p>}
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Research Identifiers (Already in Personal Info)</h2>
                    <p className="text-gray-600 text-sm sm:text-base">Research IDs are already captured in the Personal Information section.</p>
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="space-y-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <span className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-600 text-white rounded-full flex items-center justify-center text-lg sm:text-xl">📝</span>
                      Expertise Details
                    </h2>
                    <div>
                      <label htmlFor="expertise" className="block text-sm font-medium text-gray-700 mb-2">Expertise</label>
                      <input type="text" id="expertise" name="expertise" value={formData.expertise} onChange={handleChange}
                        placeholder="e.g., Machine Learning, AI"
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm sm:text-base" />
                    </div>
                    <div>
                      <label htmlFor="briefExpertise" className="block text-sm font-medium text-gray-700 mb-2">Brief Expertise</label>
                      <textarea id="briefExpertise" name="briefExpertise" value={formData.briefExpertise} onChange={handleChange} rows="4"
                        placeholder="Describe your areas of expertise"
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm sm:text-base"></textarea>
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
                <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-8 pt-6 border-t border-gray-200">
                  <button type="button" onClick={handlePrevious} disabled={currentStep === 1}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                    Previous
                  </button>

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    {currentStep < totalSteps && (
                      <button type="button" onClick={handleUpdateCurrentStep} disabled={updating}
                        className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base">
                        {updating ? (
                          <>
                            <svg className="animate-spin h-4 w-4 sm:h-5 sm:h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Updating...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                            </svg>
                            Update & Next
                          </>
                        )}
                      </button>
                    )}

                    {currentStep < totalSteps ? (
                      <button type="button" onClick={handleNext}
                        className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all flex items-center justify-center gap-2 text-sm sm:text-base">
                        Next Step ({currentStep}/{totalSteps})
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                        </svg>
                      </button>
                    ) : (
                      <button type="button" disabled={loading} onClick={() => {
                        toast((t) => (
                          <div>
                            <p className="font-medium mb-2">Ready to submit?</p>
                            <p className="text-sm text-gray-600 mb-3">Make sure all information is correct.</p>
                            <div className="flex gap-2">
                              <button onClick={() => { toast.dismiss(t.id); handleSubmit() }}
                                className="px-3 py-1 bg-green-600 text-white rounded text-sm">
                                Yes, Submit
                              </button>
                              <button onClick={() => toast.dismiss(t.id)}
                                className="px-3 py-1 bg-gray-200 text-gray-800 rounded text-sm">
                                Review Again
                              </button>
                            </div>
                          </div>
                        ), { duration: 8000 })
                      }}
                        className="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-sm sm:text-base">
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4 sm:h-5 sm:h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

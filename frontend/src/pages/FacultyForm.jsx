import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService, supabase } from '../services/supabase'
import toast, { Toaster } from 'react-hot-toast'

// Import all form components
import PersonalInfoForm from '../components/forms/PersonalInfoForm'
import JournalsForm from '../components/forms/JournalsForm'
import ConferencesForm from '../components/forms/ConferencesForm'
import BooksForm from '../components/forms/BooksForm'
import AwardsForm from '../components/forms/AwardsForm'
import PatentsForm from '../components/forms/PatentsForm'
import CourseraForm from '../components/forms/CourseraForm'
import NPTELForm from '../components/forms/NPTELForm'

export default function FacultyForm() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [user, setUser] = useState(null)
  const [facultyId, setFacultyId] = useState(null)
  const [personalDetailsId, setPersonalDetailsId] = useState(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [completedSteps, setCompletedSteps] = useState([])
  const totalSteps = 10

  // ✅ FIXED: Initialize empty state - NO localStorage
  const [formData, setFormData] = useState({
    // Faculty Profile fields
    title: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    mobileNumber: '',
    email: '',
    address: '',
    district: '',
    state: '',
    pinNo: '',
    designation: '',
    department: '',
    school: '',
    organisation: '',
    organisationType: '',
    organisationUrl: '',
    workingFromMonth: '',
    workingFromYear: '',
    wosSubjectCode: '',
    wosSubject: '',
    expertiseCode: '',
    expertise: '',
    briefExpertise: '',
    orcidId: '',
    researcherId: '',
    scopusId: '',
    googleScholarId: '',
    microsoftAcademicId: '',
    // Personal Details table fields
    ugSpecialization: '',
    pgSpecialization: '',
    phdSpecialization: '',
    phdCompletedYear: '',
    pdfSpecialization: '',
    guideshipDetails: '',
    pursuingPhdDetails: '',
    fundedProjects: '',
    experienceYears: '',
    editorialMember: '',
    professionalBodyMemberships: '',
    vidwanId: '',
    cmritIrinsLink: '',
    orcidLink: '',
    scopusLink: '',
    researcherLink: '',
    googleScholarLink: '',
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

  // ✅ FIXED: Load user and data on mount
  useEffect(() => {
    checkUserAndLoadData()
  }, [])

  // ✅ FIXED: Clear form data when user changes
  useEffect(() => {
    if (user) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_OUT') {
          resetFormData()
        }
      })

      return () => {
        subscription?.unsubscribe()
      }
    }
  }, [user])

  const resetFormData = () => {
    setFormData({
      title: '', firstName: '', lastName: '', dateOfBirth: '', gender: '',
      mobileNumber: '', email: '', address: '', district: '', state: '',
      pinNo: '', designation: '', department: '', school: '', organisation: '',
      organisationType: '', organisationUrl: '', workingFromMonth: '',
      workingFromYear: '', wosSubjectCode: '', wosSubject: '', expertiseCode: '',
      expertise: '', briefExpertise: '', orcidId: '', researcherId: '',
      scopusId: '', googleScholarId: '', microsoftAcademicId: '',
      ugSpecialization: '', pgSpecialization: '', phdSpecialization: '',
      phdCompletedYear: '', pdfSpecialization: '', guideshipDetails: '',
      pursuingPhdDetails: '', fundedProjects: '', experienceYears: '',
      editorialMember: '', professionalBodyMemberships: '', vidwanId: '',
      cmritIrinsLink: '', orcidLink: '', scopusLink: '', researcherLink: '',
      googleScholarLink: '',
    })
    setJournals([])
    setConferences([])
    setBooks([])
    setAwards([])
    setPatents([])
    setCourseraNCourses([])
    setNptelCourses([])
    setFacultyId(null)
    setPersonalDetailsId(null)
    setIsEditMode(false)
  }

  const checkUserAndLoadData = async () => {
    try {
      const currentUser = await authService.getCurrentUser()
      if (!currentUser) {
        navigate('/login')
      } else {
        setUser(currentUser)
        
        // ✅ AUTO-FILL from Supabase Auth
        const authFirstName = currentUser.user_metadata?.first_name || ''
        const authLastName = currentUser.user_metadata?.last_name || ''
        const authEmail = currentUser.email || ''

        // Load existing data from database
        await loadExistingData(currentUser.id, authFirstName, authLastName, authEmail)
      }
    } catch (error) {
      navigate('/login')
    }
  }

  const loadExistingData = async (userId, authFirstName, authLastName, authEmail) => {
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

        const { data: personalData } = await supabase
          .from('personal_details')
          .select('*')
          .eq('faculty_id', facultyData.id)
          .single()

        if (personalData) {
          setPersonalDetailsId(personalData.id)
        }

        // ✅ FIXED: Set form data from DATABASE, not localStorage
        setFormData({
          title: facultyData.title || '',
          firstName: facultyData.first_name || authFirstName,
          lastName: facultyData.last_name || authLastName,
          email: facultyData.email || authEmail,
          dateOfBirth: facultyData.date_of_birth || '',
          gender: facultyData.gender || '',
          mobileNumber: facultyData.mobile_number || '',
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
          orcidId: facultyData.orcid_id || '',
          researcherId: facultyData.researcher_id || '',
          scopusId: facultyData.scopus_id || '',
          googleScholarId: facultyData.google_scholar_id || '',
          microsoftAcademicId: facultyData.microsoft_academic_id || '',
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
        const [journalsData, conferencesData, booksData, awardsData, patentsData, certsData] = await Promise.all([
          supabase.from('journals').select('*').eq('faculty_id', facultyData.id),
          supabase.from('conferences').select('*').eq('faculty_id', facultyData.id),
          supabase.from('books').select('*').eq('faculty_id', facultyData.id),
          supabase.from('awards').select('*').eq('faculty_id', facultyData.id),
          supabase.from('patents').select('*').eq('faculty_id', facultyData.id),
          supabase.from('online_certifications').select('*').eq('faculty_id', facultyData.id)
        ])

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
      } else {
        // ✅ NEW USER: Auto-fill from Supabase Auth
        setFormData(prev => ({
          ...prev,
          firstName: authFirstName,
          lastName: authLastName,
          email: authEmail
        }))
      }
    } catch (error) {
      console.error('Error loading existing data:', error)
      
      // ✅ Even on error, set auth data
      setFormData(prev => ({
        ...prev,
        firstName: authFirstName,
        lastName: authLastName,
        email: authEmail
      }))
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
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

  const buildFacultyProfilePayload = () => {
    return {
      title: formData.title || null,
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
      orcid_id: formData.orcidId || null,
      researcher_id: formData.researcherId || null,
      scopus_id: formData.scopusId || null,
      google_scholar_id: formData.googleScholarId || null,
      microsoft_academic_id: formData.microsoftAcademicId || null,
      vidwan_id: formData.vidwanId || null,
    }
  }

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

  const handleUpdateCurrentStep = async () => {
    if (!validateStep(currentStep)) {
      toast.error('Please fill all required fields', { duration: 3000 })
      return
    }

    setUpdating(true)
    const loadingToast = toast.loading('Updating current step...')

    try {
      let currentFacultyId = facultyId

      if (isEditMode && facultyId) {
        const { error } = await supabase.from('faculty_profile').update({
          ...buildFacultyProfilePayload(),
          updated_at: new Date().toISOString()
        }).eq('id', facultyId)

        if (error) throw error
      } else {
        const { data: profileData, error: profileError } = await supabase
          .from('faculty_profile')
          .insert([{
            ...buildFacultyProfilePayload(),
            user_id: user.id
          }])
          .select()

        if (profileError) throw profileError
        currentFacultyId = profileData[0].id
        setFacultyId(currentFacultyId)
        setIsEditMode(true)
      }

      const personalDetailsPayload = buildPersonalDetailsPayload(currentFacultyId)

      if (personalDetailsId) {
        const { error } = await supabase
          .from('personal_details')
          .update({
            ...personalDetailsPayload,
            updated_at: new Date().toISOString()
          })
          .eq('id', personalDetailsId)

        if (error) throw error
      } else {
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

      if (isEditMode && facultyId) {
        const { error } = await supabase.from('faculty_profile').update({
          ...buildFacultyProfilePayload(),
          updated_at: new Date().toISOString()
        }).eq('id', facultyId)

        if (error) throw error
      } else {
        const { data: profileData, error: profileError } = await supabase
          .from('faculty_profile')
          .insert([{
            ...buildFacultyProfilePayload(),
            user_id: user.id
          }])
          .select()

        if (profileError) throw profileError
        currentFacultyId = profileData[0].id
        setFacultyId(currentFacultyId)
      }

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
            {isEditMode && (
              <div className="mt-3 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-lg flex items-center gap-2">
                <span>📌</span>
                <span className="font-medium">Updating existing profile</span>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-gray-700">Current Step</span>
              <span className="text-xl font-bold text-blue-600">Step {currentStep} of {totalSteps}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-500">Progress</span>
              <span className="text-sm font-bold text-green-600">{Math.round((currentStep / totalSteps) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Step Indicators */}
          <div className="bg-white rounded-xl shadow-md p-4 mb-6 overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              {steps.map((step) => (
                <button
                  key={step.number}
                  onClick={() => goToStep(step.number)}
                  className={`flex-shrink-0 px-3 py-2 rounded-lg transition-all ${
                    currentStep === step.number
                      ? 'bg-blue-600 text-white shadow-lg scale-105'
                      : completedSteps.includes(step.number)
                      ? 'bg-green-100 text-green-700 border border-green-300'
                      : 'bg-gray-100 text-gray-600 border border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{step.icon}</span>
                    <div className="text-left">
                      <div className="text-xs font-medium">{step.title}</div>
                      <div className="text-xs opacity-75">Step {step.number}</div>
                    </div>
                    {completedSteps.includes(step.number) && (
                      <span className="text-green-500">✓</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-8">
            {/* ✅ STEP 1: Personal Info - Uses PersonalInfoForm */}
            {currentStep === 1 && (
              <PersonalInfoForm formData={formData} handleChange={handleChange} errors={errors} />
            )}

            {/* ✅ STEP 2: Academic - Inline form using PersonalInfoForm pattern */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                  <span>🎓</span> Academic Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">UG Specialization</label>
                    <input
                      type="text"
                      name="ugSpecialization"
                      value={formData.ugSpecialization}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter UG specialization"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">PG Specialization</label>
                    <input
                      type="text"
                      name="pgSpecialization"
                      value={formData.pgSpecialization}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter PG specialization"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">PhD Specialization</label>
                    <input
                      type="text"
                      name="phdSpecialization"
                      value={formData.phdSpecialization}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter PhD specialization"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">PhD Completed Year</label>
                    <input
                      type="text"
                      name="phdCompletedYear"
                      value={formData.phdCompletedYear}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 2020"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">PDF Specialization</label>
                    <input
                      type="text"
                      name="pdfSpecialization"
                      value={formData.pdfSpecialization}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Post-doctoral fellowship"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Years of Experience</label>
                    <input
                      type="number"
                      name="experienceYears"
                      value={formData.experienceYears}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter years"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">PhD Guideship Details</label>
                    <textarea
                      name="guideshipDetails"
                      value={formData.guideshipDetails}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Details about PhD students guided"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Funded Research Projects</label>
                    <textarea
                      name="fundedProjects"
                      value={formData.fundedProjects}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Details about funded projects"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Professional Body Memberships</label>
                    <textarea
                      name="professionalBodyMemberships"
                      value={formData.professionalBodyMemberships}
                      onChange={handleChange}
                      rows="2"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., IEEE, ACM, etc."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ✅ STEP 3: Professional - Inline form */}
            {currentStep === 3 && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                  <span>💼</span> Professional Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Designation <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Assistant Professor"
                    />
                    {errors.designation && (
                      <p className="text-red-500 text-sm mt-1">{errors.designation}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Department <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Computer Science"
                    />
                    {errors.department && (
                      <p className="text-red-500 text-sm mt-1">{errors.department}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">School</label>
                    <input
                      type="text"
                      name="school"
                      value={formData.school}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter school name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Organisation</label>
                    <input
                      type="text"
                      name="organisation"
                      value={formData.organisation}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter organisation"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Organisation Type</label>
                    <select
                      name="organisationType"
                      value={formData.organisationType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Type</option>
                      <option value="Government">Government</option>
                      <option value="Private">Private</option>
                      <option value="Aided">Aided</option>
                      <option value="Autonomous">Autonomous</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Organisation Website</label>
                    <input
                      type="url"
                      name="organisationUrl"
                      value={formData.organisationUrl}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Working Since (Month)</label>
                    <select
                      name="workingFromMonth"
                      value={formData.workingFromMonth}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Month</option>
                      <option value="January">January</option>
                      <option value="February">February</option>
                      <option value="March">March</option>
                      <option value="April">April</option>
                      <option value="May">May</option>
                      <option value="June">June</option>
                      <option value="July">July</option>
                      <option value="August">August</option>
                      <option value="September">September</option>
                      <option value="October">October</option>
                      <option value="November">November</option>
                      <option value="December">December</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Working Since (Year)</label>
                    <input
                      type="number"
                      name="workingFromYear"
                      value={formData.workingFromYear}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 2020"
                      min="1950"
                      max={new Date().getFullYear()}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ✅ STEP 4: Research IDs - Inline form */}
            {currentStep === 4 && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                  <span>🔬</span> Research IDs & Links
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">ORCID ID</label>
                    <input
                      type="text"
                      name="orcidId"
                      value={formData.orcidId}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0000-0000-0000-0000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">ORCID Profile Link</label>
                    <input
                      type="url"
                      name="orcidLink"
                      value={formData.orcidLink}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://orcid.org/..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Scopus Author ID</label>
                    <input
                      type="text"
                      name="scopusId"
                      value={formData.scopusId}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter Scopus ID"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Scopus Profile Link</label>
                    <input
                      type="url"
                      name="scopusLink"
                      value={formData.scopusLink}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://www.scopus.com/..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Web of Science Researcher ID</label>
                    <input
                      type="text"
                      name="researcherId"
                      value={formData.researcherId}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter Researcher ID"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">WOS Profile Link</label>
                    <input
                      type="url"
                      name="researcherLink"
                      value={formData.researcherLink}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://www.webofscience.com/..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Google Scholar ID</label>
                    <input
                      type="text"
                      name="googleScholarId"
                      value={formData.googleScholarId}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter Google Scholar ID"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Google Scholar Profile Link</label>
                    <input
                      type="url"
                      name="googleScholarLink"
                      value={formData.googleScholarLink}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://scholar.google.com/..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Microsoft Academic ID</label>
                    <input
                      type="text"
                      name="microsoftAcademicId"
                      value={formData.microsoftAcademicId}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter Microsoft Academic ID"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">VIDWAN ID</label>
                    <input
                      type="text"
                      name="vidwanId"
                      value={formData.vidwanId}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter VIDWAN ID"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">CMRIT IRINS Profile Link</label>
                    <input
                      type="url"
                      name="cmritIrinsLink"
                      value={formData.cmritIrinsLink}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://irins.org/..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ✅ STEP 5: Expertise - Inline form */}
            {currentStep === 5 && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                  <span>📝</span> Expertise & Research Areas
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">WOS Subject Code</label>
                    <input
                      type="text"
                      name="wosSubjectCode"
                      value={formData.wosSubjectCode}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter WOS subject code"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">WOS Subject</label>
                    <input
                      type="text"
                      name="wosSubject"
                      value={formData.wosSubject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter WOS subject"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Expertise Code</label>
                    <input
                      type="text"
                      name="expertiseCode"
                      value={formData.expertiseCode}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter expertise code"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Primary Expertise</label>
                    <input
                      type="text"
                      name="expertise"
                      value={formData.expertise}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Machine Learning, AI"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Brief Description of Expertise</label>
                    <textarea
                      name="briefExpertise"
                      value={formData.briefExpertise}
                      onChange={handleChange}
                      rows="5"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe your areas of expertise..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Steps 6-10: Use existing form components */}
            {currentStep === 6 && <JournalsForm journals={journals} setJournals={setJournals} />}
            {currentStep === 7 && <ConferencesForm conferences={conferences} setConferences={setConferences} />}
            {currentStep === 8 && <BooksForm books={books} setBooks={setBooks} />}
            {currentStep === 9 && (
              <div>
                <AwardsForm awards={awards} setAwards={setAwards} />
                <div className="mt-8">
                  <PatentsForm patents={patents} setPatents={setPatents} />
                </div>
              </div>
            )}
            {currentStep === 10 && (
              <div>
                <CourseraForm courseraNCourses={courseraNCourses} setCourseraNCourses={setCourseraNCourses} />
                <div className="mt-8">
                  <NPTELForm nptelCourses={nptelCourses} setNptelCourses={setNptelCourses} />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                ← Previous
              </button>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleUpdateCurrentStep}
                  disabled={updating}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors font-medium shadow-md"
                >
                  {updating ? 'Updating...' : '💾 Update Current Step'}
                </button>

                {currentStep < totalSteps ? (
                  <button
                    onClick={handleNext}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors font-medium shadow-md"
                  >
                    {loading ? 'Submitting...' : '✨ Submit Profile'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

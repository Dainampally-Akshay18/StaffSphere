const express = require('express')
const serverless = require('serverless-http')
const cors = require('cors')
require('dotenv').config()

const { supabase } = require('./config/supabase')
const { authenticate } = require('./middleware/auth')

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
const router = express.Router()

// Health check
router.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Faculty Management API is running',
    timestamp: new Date().toISOString()
  })
})

// ============= FACULTY ROUTES =============

// GET all faculty (with filters)
router.get('/faculty', authenticate, async (req, res) => {
  try {
    const { department, designation, search, page = 1, limit = 10 } = req.query
    
    let query = supabase
      .from('faculty_profile')
      .select('*', { count: 'exact' })
    
    // Apply filters
    if (department) {
      query = query.eq('department', department)
    }
    
    if (designation) {
      query = query.eq('designation', designation)
    }
    
    if (search) {
      query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`)
    }
    
    // Pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to).order('created_at', { ascending: false })
    
    const { data, error, count } = await query
    
    if (error) throw error
    
    res.json({
      success: true,
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching faculty:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching faculty data',
      error: error.message 
    })
  }
})

// GET single faculty by ID
router.get('/faculty/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params
    
    const { data: faculty, error: facultyError } = await supabase
      .from('faculty_profile')
      .select('*')
      .eq('id', id)
      .single()
    
    if (facultyError) throw facultyError
    
    // Get personal details
    const { data: personalDetails, error: personalError } = await supabase
      .from('personal_details')
      .select('*')
      .eq('faculty_id', id)
      .single()
    
    res.json({
      success: true,
      data: {
        ...faculty,
        personal_details: personalDetails
      }
    })
  } catch (error) {
    console.error('Error fetching faculty:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching faculty data',
      error: error.message 
    })
  }
})

// POST create new faculty profile
router.post('/faculty', authenticate, async (req, res) => {
  try {
    const facultyData = req.body
    
    // Insert faculty profile
    const { data: profileData, error: profileError } = await supabase
      .from('faculty_profile')
      .insert([{
        user_id: req.user.sub, // JWT subject (user ID)
        title: facultyData.title,
        first_name: facultyData.firstName,
        last_name: facultyData.lastName,
        date_of_birth: facultyData.dateOfBirth,
        gender: facultyData.gender,
        mobile_number: facultyData.mobileNumber,
        email: facultyData.email,
        address: facultyData.address,
        district: facultyData.district,
        state: facultyData.state,
        pin_no: facultyData.pinNo,
        designation: facultyData.designation,
        department: facultyData.department,
        school: facultyData.school,
        organisation: facultyData.organisation,
        organisation_type: facultyData.organisationType,
        organisation_url: facultyData.organisationUrl,
        working_from_month: facultyData.workingFromMonth,
        working_from_year: facultyData.workingFromYear,
        orcid_id: facultyData.orcidId,
        researcher_id: facultyData.researcherId,
        scopus_id: facultyData.scopusId,
        google_scholar_id: facultyData.googleScholarId,
        microsoft_academic_id: facultyData.microsoftAcademicId,
        vidwan_id: facultyData.vidwanId,
        wos_subject_code: facultyData.wosSubjectCode,
        wos_subject: facultyData.wosSubject,
        expertise_code: facultyData.expertiseCode,
        expertise: facultyData.expertise,
        brief_expertise: facultyData.briefExpertise,
      }])
      .select()
    
    if (profileError) throw profileError
    
    const facultyId = profileData[0].id
    
    // Insert personal details
    const { error: personalError } = await supabase
      .from('personal_details')
      .insert([{
        faculty_id: facultyId,
        ug_specialization: facultyData.ugSpecialization,
        pg_specialization: facultyData.pgSpecialization,
        phd_specialization: facultyData.phdSpecialization,
        phd_completed_year: facultyData.phdCompletedYear ? parseInt(facultyData.phdCompletedYear) : null,
        pdf_specialization: facultyData.pdfSpecialization,
        guideship_details: facultyData.guideshipDetails,
        pursuing_phd_details: facultyData.pursuingPhdDetails,
        funded_projects: facultyData.fundedProjects,
        editorial_member: facultyData.editorialMember,
        experience_years: facultyData.experienceYears ? parseInt(facultyData.experienceYears) : null,
        professional_body_memberships: facultyData.professionalBodyMemberships,
      }])
    
    if (personalError) throw personalError
    
    res.status(201).json({
      success: true,
      message: 'Faculty profile created successfully',
      data: profileData[0]
    })
  } catch (error) {
    console.error('Error creating faculty:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Error creating faculty profile',
      error: error.message 
    })
  }
})

// PUT update faculty profile
router.put('/faculty/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params
    const facultyData = req.body
    
    // Update faculty profile
    const { data, error } = await supabase
      .from('faculty_profile')
      .update({
        title: facultyData.title,
        first_name: facultyData.firstName,
        last_name: facultyData.lastName,
        date_of_birth: facultyData.dateOfBirth,
        gender: facultyData.gender,
        mobile_number: facultyData.mobileNumber,
        designation: facultyData.designation,
        department: facultyData.department,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', req.user.sub) // Ensure user owns this profile
      .select()
    
    if (error) throw error
    
    if (!data || data.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to update this profile'
      })
    }
    
    res.json({
      success: true,
      message: 'Faculty profile updated successfully',
      data: data[0]
    })
  } catch (error) {
    console.error('Error updating faculty:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Error updating faculty profile',
      error: error.message 
    })
  }
})

// DELETE faculty profile
router.delete('/faculty/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params
    
    const { error } = await supabase
      .from('faculty_profile')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.sub) // Ensure user owns this profile
    
    if (error) throw error
    
    res.json({
      success: true,
      message: 'Faculty profile deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting faculty:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting faculty profile',
      error: error.message 
    })
  }
})

// ============= PUBLICATIONS ROUTES =============

// POST add publication
router.post('/publications', authenticate, async (req, res) => {
  try {
    const { type, ...publicationData } = req.body
    
    let tableName
    switch(type) {
      case 'journal':
        tableName = 'journals'
        break
      case 'conference':
        tableName = 'conferences'
        break
      case 'book':
        tableName = 'books'
        break
      case 'book_chapter':
        tableName = 'book_chapters'
        break
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid publication type'
        })
    }
    
    const { data, error } = await supabase
      .from(tableName)
      .insert([publicationData])
      .select()
    
    if (error) throw error
    
    res.status(201).json({
      success: true,
      message: 'Publication added successfully',
      data: data[0]
    })
  } catch (error) {
    console.error('Error adding publication:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Error adding publication',
      error: error.message 
    })
  }
})

// GET publications by faculty ID
router.get('/publications/:facultyId', authenticate, async (req, res) => {
  try {
    const { facultyId } = req.params
    
    // Fetch all publication types
    const [journals, conferences, books, bookChapters] = await Promise.all([
      supabase.from('journals').select('*').eq('faculty_id', facultyId),
      supabase.from('conferences').select('*').eq('faculty_id', facultyId),
      supabase.from('books').select('*').eq('faculty_id', facultyId),
      supabase.from('book_chapters').select('*').eq('faculty_id', facultyId)
    ])
    
    res.json({
      success: true,
      data: {
        journals: journals.data || [],
        conferences: conferences.data || [],
        books: books.data || [],
        book_chapters: bookChapters.data || []
      }
    })
  } catch (error) {
    console.error('Error fetching publications:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching publications',
      error: error.message 
    })
  }
})

// ============= AWARDS ROUTES =============

// POST add award
router.post('/awards', authenticate, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('awards')
      .insert([req.body])
      .select()
    
    if (error) throw error
    
    res.status(201).json({
      success: true,
      message: 'Award added successfully',
      data: data[0]
    })
  } catch (error) {
    console.error('Error adding award:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Error adding award',
      error: error.message 
    })
  }
})

// ============= PATENTS ROUTES =============

// POST add patent
router.post('/patents', authenticate, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('patents')
      .insert([req.body])
      .select()
    
    if (error) throw error
    
    res.status(201).json({
      success: true,
      message: 'Patent added successfully',
      data: data[0]
    })
  } catch (error) {
    console.error('Error adding patent:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Error adding patent',
      error: error.message 
    })
  }
})

// Mount router
app.use('/.netlify/functions/api', router)

// Export handler
module.exports.handler = serverless(app)

import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/.netlify/functions/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('supabase.auth.token')
    if (token) {
      try {
        const authData = JSON.parse(token)
        if (authData?.currentSession?.access_token) {
          config.headers.Authorization = `Bearer ${authData.currentSession.access_token}`
        }
      } catch (e) {
        console.error('Error parsing auth token:', e)
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Faculty API
export const facultyAPI = {
  // Get all faculty
  getAll: (params) => api.get('/faculty', { params }),
  
  // Get single faculty
  getById: (id) => api.get(`/faculty/${id}`),
  
  // Create faculty
  create: (data) => api.post('/faculty', data),
  
  // Update faculty
  update: (id, data) => api.put(`/faculty/${id}`, data),
  
  // Delete faculty
  delete: (id) => api.delete(`/faculty/${id}`)
}

// Publications API
export const publicationsAPI = {
  // Get publications by faculty ID
  getByFacultyId: (facultyId) => api.get(`/publications/${facultyId}`),
  
  // Add publication
  add: (data) => api.post('/publications', data)
}

// Awards API
export const awardsAPI = {
  // Add award
  add: (data) => api.post('/awards', data)
}

// Patents API
export const patentsAPI = {
  // Add patent
  add: (data) => api.post('/patents', data)
}

export default api

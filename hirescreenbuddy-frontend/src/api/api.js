import axios from 'axios'

/**
 * Axios instance for API calls.
 * Configured with backend base URL.
 */
const API = axios.create({
    baseURL: 'http://localhost:8080/api'
})

/**
 * Request interceptor - Automatically attach JWT token to every request
 * Retrieves token from localStorage and adds it to Authorization header
 */
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

/**
 * Response interceptor - Handle authentication errors
 * If token expires (401 response), redirect to login
 */
API.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            // Clear stored auth data and redirect to login
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

// ==================== AUTH ENDPOINTS ====================
export const registerUser = (data) => API.post('/auth/register', data)
export const loginUser = (data) => API.post('/auth/login', data)

// ==================== RESUME ENDPOINTS ====================
export const uploadResume = (formData) => API.post('/resumes/upload', formData)
export const uploadMultipleResumes = (formData) => API.post('/resumes/upload-multiple', formData)
export const getAllResumes = () => API.get('/resumes')

// ==================== JOB ENDPOINTS ====================
export const createJob = (job) => API.post('/jobs', job)
export const getAllJobs = () => API.get('/jobs')
export const updateJobStatus = (id, status) => API.patch(`/jobs/${id}/status`, { status })

// ==================== SCREENING ENDPOINTS ====================
export const screenResumes = (jobId) => API.post(`/screen/${jobId}`)
export const getResults = (jobId) => API.get(`/screen/${jobId}/results`)
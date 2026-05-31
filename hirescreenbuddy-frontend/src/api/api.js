import axios from 'axios'

const API = axios.create({
    baseURL: 'http://localhost:8080/api'
})

// Automatically attach JWT token to every request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// If token expires redirect to login
API.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

// Auth
export const registerUser = (data) => API.post('/auth/register', data)
export const loginUser = (data) => API.post('/auth/login', data)

// Resumes
export const uploadResume = (formData) => API.post('/resumes/upload', formData)
export const uploadMultipleResumes = (formData) => API.post('/resumes/upload-multiple', formData)
export const getAllResumes = () => API.get('/resumes')

// Jobs
export const createJob = (job) => API.post('/jobs', job)
export const getAllJobs = () => API.get('/jobs')
export const updateJobStatus = (id, status) => API.patch(`/jobs/${id}/status`, { status })

// Screening
export const screenResumes = (jobId) => API.post(`/screen/${jobId}`)
export const getResults = (jobId) => API.get(`/screen/${jobId}/results`)
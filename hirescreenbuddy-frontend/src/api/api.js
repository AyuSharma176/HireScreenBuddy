import axios from 'axios'

const API = axios.create({
    baseURL: 'http://localhost:8080/api'
})

export const uploadResume = (formData) => API.post('/resumes/upload', formData)
export const getAllResumes = () => API.get('/resumes')

export const createJob = (job) => API.post('/jobs', job)
export const getAllJobs = () => API.get('/jobs')

export const screenResumes = (jobId) => API.post(`/screen/${jobId}`)
export const getResults = (jobId) => API.get(`/screen/${jobId}/results`)
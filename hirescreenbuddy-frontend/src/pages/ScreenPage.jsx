import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllJobs, screenResumes, getAllResumes } from '../api/api'

/**
 * ScreenPage component - Allows users to select a job and run AI screening on all resumes.
 * Shows available jobs and resumes, then runs screening on selection.
 */
export default function ScreenPage() {
    const navigate = useNavigate()
    
    // State management
    const [jobs, setJobs] = useState([])
    const [resumes, setResumes] = useState([])
    const [selectedJobId, setSelectedJobId] = useState(null)
    const [loading, setLoading] = useState(true)
    const [screening, setScreening] = useState(false)
    const [error, setError] = useState('')

    // Load jobs and resumes on component mount
    useEffect(() => {
        fetchData()
    }, [])

    /**
     * Fetch all jobs and resumes from backend
     */
    const fetchData = async () => {
        try {
            setLoading(true)
            const jobsResponse = await getAllJobs()
            const resumesResponse = await getAllResumes()
            setJobs(jobsResponse.data)
            setResumes(resumesResponse.data)
            setError('')
        } catch (err) {
            setError('Failed to load data')
        } finally {
            setLoading(false)
        }
    }

    /**
     * Handle screening button click - Run AI screening on all resumes for selected job
     * Redirects to results page on success
     */
    const handleScreenClick = async () => {
        if (!selectedJobId) return

        try {
            setScreening(true)
            setError('')
            await screenResumes(selectedJobId)
            // Redirect to results page after screening completes
            navigate(`/dashboard/results/${selectedJobId}`)
        } catch (err) {
            setError(err.response?.data?.message || 'Screening failed. Please try again.')
            setScreening(false)
        }
    }

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 text-white p-8 flex items-center justify-center">
                <div className="animate-spin inline-block w-8 h-8 border-4 border-gray-700 border-t-violet-500 rounded-full"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white p-8">
            <div className="max-w-4xl mx-auto">
                {/* Page Header */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-violet-300 bg-clip-text text-transparent">Screen Candidates</h1>
                    <p className="text-gray-400 text-lg mb-8">Select a job and run AI screening on all uploaded resumes</p>
                    
                    {/* Resume count info */}
                    <div className="flex items-center gap-4 text-sm font-medium text-gray-300 bg-gradient-to-r from-violet-600/10 to-violet-500/5 border border-violet-500/20 rounded-xl p-4 backdrop-blur-sm">
                        <span>{resumes.length} resume{resumes.length !== 1 ? 's' : ''} available</span>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-8 bg-red-900/20 border border-red-700/50 rounded-xl p-4 text-red-300 text-sm font-medium backdrop-blur-sm">
                        {error}
                    </div>
                )}

                {/* Jobs Grid */}
                {jobs.length === 0 ? (
                    <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/40 border border-violet-500/20 rounded-2xl p-12 text-center mb-8">
                        <p className="text-gray-400 mb-2 text-lg">No jobs created yet</p>
                        <p className="text-gray-500 text-sm">Create a job description first to start screening</p>
                    </div>
                ) : (
                    <div className="mb-12">
                        <h2 className="text-lg font-semibold mb-6">Available Jobs</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {jobs.map(job => (
                                <div
                                    key={job.id}
                                    onClick={() => setSelectedJobId(job.id)}
                                    className={`p-6 rounded-xl border cursor-pointer transition-all group ${
                                        selectedJobId === job.id
                                            ? 'bg-gradient-to-br from-violet-600/20 to-violet-500/10 border-violet-500 shadow-lg shadow-violet-500/25'
                                            : 'bg-gradient-to-br from-gray-900/60 to-gray-800/30 border-violet-500/20 hover:border-violet-500/40 hover:shadow-lg hover:shadow-violet-500/10 hover:-translate-y-1'
                                    }`}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-violet-300 transition-colors">{job.title}</h3>
                                            <p className="text-gray-400 text-sm">{job.company}</p>
                                        </div>
                                        {selectedJobId === job.id && (
                                            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-violet-500 to-violet-400 flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-500/50">
                                                <span className="text-white text-sm font-bold">✓</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Skills Preview */}
                                    <div>
                                        <p className="text-gray-500 text-xs font-semibold mb-2">REQUIRED SKILLS</p>
                                        <div className="flex flex-wrap gap-2">
                                            {job.requiredSkills
                                                .split(',')
                                                .map(s => s.trim())
                                                .slice(0, 3)
                                                .map((skill, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="bg-gradient-to-r from-violet-600/30 to-violet-500/20 border border-violet-500/50 text-violet-300 text-xs px-3 py-1 rounded-lg font-medium"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            {job.requiredSkills.split(',').length > 3 && (
                                                <span className="text-gray-500 text-xs px-3 py-1 font-medium">
                                                    +{job.requiredSkills.split(',').length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Screening Button */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleScreenClick}
                        disabled={!selectedJobId || screening || resumes.length === 0}
                        className="flex-1 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold text-lg transition-all hover:shadow-lg hover:shadow-violet-500/30 transform hover:scale-[1.02] flex items-center justify-center gap-3"
                    >
                        {screening ? (
                            <>
                                <div className="animate-spin inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></div>
                                <span>AI is analyzing resumes...</span>
                            </>
                        ) : (
                            <span>Run AI Screening</span>
                        )}
                    </button>
                </div>

                {/* Helper Text */}
                {resumes.length === 0 && (
                    <p className="text-gray-500 text-sm text-center mt-6">
                        Upload resumes first to start screening
                    </p>
                )}
            </div>
        </div>
    )
}
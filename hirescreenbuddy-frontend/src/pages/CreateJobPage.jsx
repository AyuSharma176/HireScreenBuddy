import { useState, useEffect } from 'react'
import { createJob, getAllJobs, updateJobStatus } from '../api/api'

const STATUS_STYLES = {
    OPEN:   { badge: 'bg-green-900/30 border-green-700/50 text-green-400',    dot: 'bg-green-400',   label: 'Open'   },
    CLOSED: { badge: 'bg-red-900/30 border-red-700/50 text-red-400',          dot: 'bg-red-400',     label: 'Closed' },
    DRAFT:  { badge: 'bg-yellow-900/30 border-yellow-700/50 text-yellow-400', dot: 'bg-yellow-400',  label: 'Draft'  },
}

export default function CreateJobPage() {
    const [form, setForm] = useState({ title: '', company: '', description: '', requiredSkills: '' })
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [jobs, setJobs] = useState([])
    const [fetchingJobs, setFetchingJobs] = useState(true)
    const [updatingStatus, setUpdatingStatus] = useState(null)

    useEffect(() => {
        fetchJobs()
    }, [])

    const fetchJobs = async () => {
        try {
            setFetchingJobs(true)
            const response = await getAllJobs()
            setJobs(response.data)
        } catch (error) {
            console.error('Failed to fetch jobs')
        } finally {
            setFetchingJobs(false)
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setForm({ ...form, [name]: value })
    }

    const handleSubmit = async () => {
        if (!form.title.trim() || !form.company.trim() || !form.description.trim() || !form.requiredSkills.trim()) {
            setMessage({ type: 'error', text: 'Please fill all fields' })
            return
        }
        try {
            setLoading(true)
            setMessage({ type: '', text: '' })
            await createJob(form)
            setMessage({ type: 'success', text: `Successfully created job: ${form.title}` })
            setForm({ title: '', company: '', description: '', requiredSkills: '' })
            fetchJobs()
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to create job' })
        } finally {
            setLoading(false)
        }
    }

    const handleStatusChange = async (jobId, newStatus) => {
        try {
            setUpdatingStatus(jobId)
            await updateJobStatus(jobId, newStatus)
            setJobs(prev => prev.map(j =>
                j.id === jobId ? { ...j, status: newStatus } : j
            ))
        } catch (err) {
            console.error('Failed to update status')
        } finally {
            setUpdatingStatus(null)
        }
    }

    const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
    })

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white p-8">
            <div className="max-w-6xl mx-auto">

                {/* Form Section */}
                <div className="mb-16">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-violet-300 bg-clip-text text-transparent">
                            Create Job Description
                        </h1>
                        <p className="text-gray-400 text-lg">Add a new job opening for AI screening</p>
                    </div>

                    <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/40 border border-violet-500/20 rounded-2xl p-10 max-w-2xl shadow-xl shadow-violet-500/5">
                        <div className="flex flex-col gap-6">
                            <div>
                                <label className="text-sm font-semibold text-gray-300 mb-3 block">Job Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={form.title}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Senior React Developer"
                                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-5 py-3 text-white text-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-300 mb-3 block">Company Name</label>
                                <input
                                    type="text"
                                    name="company"
                                    value={form.company}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Tech Corp Inc"
                                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-5 py-3 text-white text-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-300 mb-3 block">Job Description</label>
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleInputChange}
                                    placeholder="Paste the full job description here..."
                                    rows="8"
                                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-5 py-3 text-white text-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all resize-none"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-300 mb-3 block">Required Skills (comma separated)</label>
                                <input
                                    type="text"
                                    name="requiredSkills"
                                    value={form.requiredSkills}
                                    onChange={handleInputChange}
                                    placeholder="e.g., React, TypeScript, Node.js, SQL"
                                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-5 py-3 text-white text-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                                />
                            </div>

                            {message.text && (
                                <div className={`px-5 py-4 rounded-xl text-sm font-medium ${
                                    message.type === 'success'
                                        ? 'bg-green-900/20 border border-green-700/50 text-green-300'
                                        : 'bg-red-900/20 border border-red-700/50 text-red-300'
                                }`}>
                                    {message.text}
                                </div>
                            )}

                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-violet-500/30 transform hover:scale-[1.02]"
                            >
                                {loading ? 'Creating...' : 'Create Job'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Jobs List */}
                <div>
                    <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-violet-300 bg-clip-text text-transparent">
                        Job Descriptions
                    </h2>
                    <p className="text-gray-400 mb-8">
                        Manage your open positions
                        <span className="ml-2 text-violet-400">({jobs.length} total)</span>
                    </p>

                    {fetchingJobs ? (
                        <div className="flex items-center justify-center py-16">
                            <div className="animate-spin w-10 h-10 border-4 border-gray-700 border-t-violet-500 rounded-full"></div>
                        </div>
                    ) : jobs.length === 0 ? (
                        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/40 border border-violet-500/20 rounded-2xl p-16 text-center">
                            <div className="text-5xl mb-4">💼</div>
                            <p className="text-gray-400 text-lg">No jobs created yet. Create your first job above!</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-6">
                            {jobs.map(job => {
                                const skills = job.requiredSkills?.split(',').map(s => s.trim())
                                const style = STATUS_STYLES[job.status] || STATUS_STYLES.OPEN

                                return (
                                    <div key={job.id} className="bg-gradient-to-br from-gray-900/60 to-gray-800/30 border border-violet-500/20 rounded-xl p-6 hover:border-violet-500/40 transition-all group hover:shadow-lg hover:shadow-violet-500/10 hover:-translate-y-1">

                                        {/* Top row */}
                                        <div className="flex items-start justify-between mb-1">
                                            <h3 className="text-white font-semibold group-hover:text-violet-300 transition-colors">
                                                {job.title}
                                            </h3>
                                            {/* Status Badge */}
                                            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-semibold ${style.badge}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></div>
                                                {style.label}
                                            </div>
                                        </div>

                                        <p className="text-gray-400 text-sm mb-4">{job.company}</p>

                                        {/* Skills */}
                                        <div className="mb-4">
                                            <p className="text-gray-500 text-xs font-semibold mb-3">REQUIRED SKILLS</p>
                                            <div className="flex flex-wrap gap-2">
                                                {skills?.slice(0, 4).map((skill, idx) => (
                                                    <span key={idx} className="bg-gradient-to-r from-violet-600/30 to-violet-500/20 border border-violet-500/50 text-violet-300 text-xs px-3 py-1 rounded-lg font-medium">
                                                        {skill}
                                                    </span>
                                                ))}
                                                {skills?.length > 4 && (
                                                    <span className="text-gray-500 text-xs px-3 py-1 font-medium">
                                                        +{skills.length - 4} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Bottom row */}
                                        <div className="flex items-center justify-between pt-3 border-t border-gray-700/50">
                                            <p className="text-gray-500 text-xs">Created: {formatDate(job.createdAt)}</p>

                                            {/* Status Buttons */}
                                            <div className="flex items-center gap-1.5">
                                                {['OPEN', 'DRAFT', 'CLOSED'].map(s => (
                                                    <button
                                                        key={s}
                                                        onClick={() => handleStatusChange(job.id, s)}
                                                        disabled={job.status === s || updatingStatus === job.id}
                                                        className={`text-xs px-2.5 py-1 rounded-lg border transition-all font-medium ${
                                                            job.status === s
                                                                ? STATUS_STYLES[s].badge + ' cursor-default'
                                                                : 'border-gray-700 text-gray-500 hover:border-gray-500 hover:text-white'
                                                        }`}
                                                    >
                                                        {updatingStatus === job.id ? '...' : s.charAt(0) + s.slice(1).toLowerCase()}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
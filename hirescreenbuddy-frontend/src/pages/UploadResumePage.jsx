import { useState, useEffect } from 'react'
import { uploadResume, getAllResumes } from '../api/api'

export default function UploadResumePage() {
    const [form, setForm] = useState({
        candidateName: '',
        email: '',
        file: null
    })
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [resumes, setResumes] = useState([])
    const [fetchingResumes, setFetchingResumes] = useState(true)
    const [fileName, setFileName] = useState('')

    useEffect(() => {
        fetchResumes()
    }, [])

    const fetchResumes = async () => {
        try {
            setFetchingResumes(true)
            const response = await getAllResumes()
            setResumes(response.data)
            setMessage({ type: '', text: '' })
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to fetch resumes' })
        } finally {
            setFetchingResumes(false)
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setFileName(file.name)
            setForm({ ...form, file })
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setForm({ ...form, [name]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!form.candidateName.trim() || !form.email.trim() || !form.file) {
            setMessage({ type: 'error', text: 'Please fill all fields' })
            return
        }

        try {
            setLoading(true)
            const formData = new FormData()
            formData.append('file', form.file)
            formData.append('candidateName', form.candidateName)
            formData.append('email', form.email)

            await uploadResume(formData)
            setMessage({ type: 'success', text: `Successfully uploaded resume for ${form.candidateName}` })
            setForm({ candidateName: '', email: '', file: null })
            setFileName('')
            await fetchResumes()
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Upload failed' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white p-8">
            <div className="max-w-6xl mx-auto">
                {/* Form Section */}
                <div className="mb-16">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-violet-300 bg-clip-text text-transparent">Upload Resume</h1>
                        <p className="text-gray-400 text-lg">Add candidate resumes to your screening pool</p>
                    </div>

                    <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/40 border border-violet-500/20 rounded-2xl p-10 max-w-2xl shadow-xl shadow-violet-500/5">
                        <div className="flex flex-col gap-6">
                            {/* Candidate Name */}
                            <div>
                                <label className="text-sm font-semibold text-gray-300 mb-3 block">Candidate Name</label>
                                <input
                                    type="text"
                                    name="candidateName"
                                    value={form.candidateName}
                                    onChange={handleInputChange}
                                    placeholder="John Doe"
                                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-5 py-3 text-white text-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all backdrop-blur"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="text-sm font-semibold text-gray-300 mb-3 block">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleInputChange}
                                    placeholder="john@example.com"
                                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-5 py-3 text-white text-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all backdrop-blur"
                                />
                            </div>

                            {/* File Upload */}
                            <div>
                                <label className="text-sm font-semibold text-gray-300 mb-3 block">Resume File (PDF or DOCX)</label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept=".pdf,.docx"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <div className="bg-gray-800/30 border-2 border-dashed border-gray-700/50 rounded-xl px-6 py-6 text-center cursor-pointer hover:border-violet-500/50 transition-all hover:bg-violet-500/5">
                                        {fileName ? (
                                            <p className="text-white text-sm font-semibold">{fileName}</p>
                                        ) : (
                                            <div>
                                                <p className="text-gray-300 text-sm font-medium">Click to select or drag & drop</p>
                                                <p className="text-gray-500 text-xs mt-1">PDF or DOCX files only</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Message Display */}
                            {message.text && (
                                <div className={`px-5 py-4 rounded-xl text-sm font-medium backdrop-blur-sm ${
                                    message.type === 'success'
                                        ? 'bg-green-900/20 border border-green-700/50 text-green-300'
                                        : 'bg-red-900/20 border border-red-700/50 text-red-300'
                                }`}>
                                    {message.text}
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-violet-500/30 transform hover:scale-[1.02]"
                            >
                                {loading ? 'Uploading...' : 'Upload Resume'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Resumes List Section */}
                <div>
                    <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-violet-300 bg-clip-text text-transparent">Uploaded Resumes</h2>
                    <p className="text-gray-400 mb-8">Manage your candidate resume pool</p>

                    {fetchingResumes ? (
                        <div className="flex items-center justify-center py-16">
                            <div className="animate-spin inline-block w-10 h-10 border-4 border-gray-700 border-t-violet-500 rounded-full"></div>
                        </div>
                    ) : resumes.length === 0 ? (
                        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/40 border border-violet-500/20 rounded-2xl p-16 text-center">
                            <p className="text-gray-400 text-lg">No resumes uploaded yet. Upload your first resume above!</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {resumes.map(resume => {
                                const fileType = resume.fileName.endsWith('.pdf') ? 'PDF' : 'DOCX'
                                const uploadDate = new Date(resume.uploadedAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                })

                                return (
                                    <div key={resume.id} className="bg-gradient-to-br from-gray-900/60 to-gray-800/30 border border-violet-500/20 rounded-xl p-6 hover:border-violet-500/40 transition-all group hover:shadow-lg hover:shadow-violet-500/10 hover:-translate-y-1">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <h3 className="text-white font-semibold mb-1 group-hover:text-violet-300 transition-colors">{resume.candidateName}</h3>-violet-300 text-xs px-3 py-1 rounded-lg font-semibol
                                                <p className="text-gray-400 text-sm">{resume.email}</p>
                                            </div>
                                            <span className="bg-violet-600/20 border border-violet-500/50 text-violet-300 text-xs px-2 py-1 rounded">
                                                {fileType}
                                            </span>
                                        </div>
                                        <p className="text-gray-500 text-xs">Uploaded: {uploadDate}</p>
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
import { useState, useEffect } from 'react'
import { uploadMultipleResumes, getAllResumes } from '../api/api'

export default function UploadResumePage() {
    const [files, setFiles] = useState([])
    const [resumes, setResumes] = useState([])
    const [loading, setLoading] = useState(false)
    const [fetchingResumes, setFetchingResumes] = useState(true)
    const [message, setMessage] = useState({ type: '', text: '' })

    useEffect(() => {
        fetchResumes()
    }, [])

    const fetchResumes = async () => {
        try {
            setFetchingResumes(true)
            const res = await getAllResumes()
            setResumes(res.data)
        } catch (err) {
            console.error('Failed to fetch resumes')
        } finally {
            setFetchingResumes(false)
        }
    }

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files)
        const fileObjects = selectedFiles.map(file => ({
            file,
            candidateName: '',
            email: '',
            id: Math.random().toString(36).substr(2, 9)
        }))
        setFiles(prev => [...prev, ...fileObjects])
    }

    const updateFileInfo = (id, field, value) => {
        setFiles(prev => prev.map(f =>
            f.id === id ? { ...f, [field]: value } : f
        ))
    }

    const removeFile = (id) => {
        setFiles(prev => prev.filter(f => f.id !== id))
    }

    const handleUpload = async () => {
        if (files.length === 0) {
            setMessage({ type: 'error', text: 'Please select at least one file' })
            return
        }
        const incomplete = files.find(f => !f.candidateName || !f.email)
        if (incomplete) {
            setMessage({ type: 'error', text: 'Please fill in name and email for all candidates' })
            return
        }
        try {
            setLoading(true)
            setMessage({ type: '', text: '' })
            const formData = new FormData()
            files.forEach(f => {
                formData.append('files', f.file)
                formData.append('candidateNames', f.candidateName)
                formData.append('emails', f.email)
            })
            await uploadMultipleResumes(formData)
            setMessage({ type: 'success', text: `${files.length} resume${files.length > 1 ? 's' : ''} uploaded successfully!` })
            setFiles([])
            fetchResumes()
        } catch (err) {
            setMessage({ type: 'error', text: 'Upload failed. Please try again.' })
        } finally {
            setLoading(false)
        }
    }

    const getFileType = (fileName) => fileName?.endsWith('.pdf') ? 'PDF' : 'DOCX'

    const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
    })

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white p-8">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-violet-300 bg-clip-text text-transparent">
                        Upload Resumes
                    </h1>
                    <p className="text-gray-400 text-lg">Upload multiple resumes at once and screen them against any job.</p>
                </div>

                {/* Upload Card */}
                <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/40 border border-violet-500/20 rounded-2xl p-8 mb-12 shadow-xl shadow-violet-500/5">

                    {/* Drop Zone */}
                    <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-700/50 hover:border-violet-500/50 rounded-xl cursor-pointer transition-all hover:bg-violet-500/5 mb-6">
                        <div className="text-4xl mb-2">📁</div>
                        <p className="text-gray-300 text-sm font-medium">Click to select PDF or DOCX files</p>
                        <p className="text-gray-500 text-xs mt-1">You can select multiple files at once</p>
                        <input
                            type="file"
                            multiple
                            accept=".pdf,.docx,.doc"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </label>

                    {/* File List */}
                    {files.length > 0 && (
                        <div className="flex flex-col gap-4 mb-6">
                            <p className="text-sm text-gray-400 font-medium">
                                {files.length} file{files.length > 1 ? 's' : ''} selected — fill in candidate details:
                            </p>
                            {files.map(f => (
                                <div key={f.id} className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs bg-violet-600/20 border border-violet-500/50 text-violet-300 px-2 py-0.5 rounded">
                                                {getFileType(f.file.name)}
                                            </span>
                                            <span className="text-sm text-gray-300 truncate max-w-xs">
                                                {f.file.name}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => removeFile(f.id)}
                                            className="text-gray-500 hover:text-red-400 transition-colors text-lg leading-none"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <input
                                            type="text"
                                            placeholder="Candidate Name"
                                            value={f.candidateName}
                                            onChange={e => updateFileInfo(f.id, 'candidateName', e.target.value)}
                                            className="bg-gray-900/50 border border-gray-600/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                                        />
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            value={f.email}
                                            onChange={e => updateFileInfo(f.id, 'email', e.target.value)}
                                            className="bg-gray-900/50 border border-gray-600/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Message */}
                    {message.text && (
                        <div className={`px-5 py-4 rounded-xl text-sm font-medium mb-4 ${
                            message.type === 'success'
                                ? 'bg-green-900/20 border border-green-700/50 text-green-300'
                                : 'bg-red-900/20 border border-red-700/50 text-red-300'
                        }`}>
                            {message.text}
                        </div>
                    )}

                    {/* Upload Button */}
                    <button
                        onClick={handleUpload}
                        disabled={loading || files.length === 0}
                        className="w-full bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-violet-500/30 transform hover:scale-[1.02]"
                    >
                        {loading
                            ? `Uploading ${files.length} resume${files.length > 1 ? 's' : ''}...`
                            : `Upload ${files.length > 0 ? files.length : ''} Resume${files.length !== 1 ? 's' : ''}`
                        }
                    </button>
                </div>

                {/* Uploaded Resumes List */}
                <div>
                    <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-violet-300 bg-clip-text text-transparent">
                        Uploaded Resumes
                    </h2>
                    <p className="text-gray-400 mb-8">
                        Manage your candidate resume pool
                        <span className="ml-2 text-violet-400">({resumes.length} total)</span>
                    </p>

                    {fetchingResumes ? (
                        <div className="flex items-center justify-center py-16">
                            <div className="animate-spin w-10 h-10 border-4 border-gray-700 border-t-violet-500 rounded-full"></div>
                        </div>
                    ) : resumes.length === 0 ? (
                        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/40 border border-violet-500/20 rounded-2xl p-16 text-center">
                            <div className="text-5xl mb-4">📭</div>
                            <p className="text-gray-400 text-lg">No resumes uploaded yet. Upload your first resume above!</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {resumes.map(resume => (
                                <div key={resume.id} className="bg-gradient-to-br from-gray-900/60 to-gray-800/30 border border-violet-500/20 rounded-xl p-6 hover:border-violet-500/40 transition-all group hover:shadow-lg hover:shadow-violet-500/10 hover:-translate-y-1">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-violet-900/50 border border-violet-700/50 flex items-center justify-center text-violet-300 font-bold">
                                                {resume.candidateName?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="text-white font-semibold group-hover:text-violet-300 transition-colors">
                                                    {resume.candidateName}
                                                </h3>
                                                <p className="text-gray-400 text-sm">{resume.email}</p>
                                            </div>
                                        </div>
                                        <span className="bg-violet-600/20 border border-violet-500/50 text-violet-300 text-xs px-2 py-1 rounded">
                                            {getFileType(resume.fileName)}
                                        </span>
                                    </div>
                                    <p className="text-gray-500 text-xs">Uploaded: {formatDate(resume.uploadedAt)}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
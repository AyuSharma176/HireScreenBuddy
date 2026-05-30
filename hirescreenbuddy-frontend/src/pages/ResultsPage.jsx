import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getResults } from '../api/api'

const getRankColor = (rank) => {
    if (rank === 1) return 'from-yellow-500 to-yellow-600'
    if (rank === 2) return 'from-gray-300 to-gray-400'
    if (rank === 3) return 'from-orange-500 to-orange-600'
    return 'from-violet-500 to-violet-600'
}

const getRankMedal = (rank) => {
    return `#${rank}`
}

const getScoreColor = (score) => {
    if (score >= 70) return 'bg-green-900/20 border-green-700/50 text-green-300'
    if (score >= 40) return 'bg-yellow-900/20 border-yellow-700/50 text-yellow-300'
    return 'bg-red-900/20 border-red-700/50 text-red-300'
}

export default function ResultsPage() {
    const { jobId } = useParams()
    const navigate = useNavigate()
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchResults()
    }, [jobId])

    const fetchResults = async () => {
        try {
            setLoading(true)
            const response = await getResults(jobId)
            setResults(response.data)
            setError('')
        } catch (err) {
            setError('Failed to fetch screening results')
            setResults([])
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 text-white p-8 flex items-center justify-center">
                <div className="animate-spin inline-block w-8 h-8 border-4 border-gray-700 border-t-violet-500 rounded-full"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-950 text-white p-8">
                <div className="max-w-4xl mx-auto">
                    <button
                        onClick={() => navigate('/dashboard/screen')}
                        className="text-violet-400 hover:text-violet-300 text-sm font-medium mb-8 flex items-center gap-2"
                    >
                        ← Back to Screening
                    </button>
                    <div className="bg-red-900/20 border border-red-700/50 rounded-xl p-8 text-center">
                        <p className="text-red-300">{error}</p>
                    </div>
                </div>
            </div>
        )
    }

    const jobTitle = results.length > 0 ? results[0].job.title : 'Job'
    const jobCompany = results.length > 0 ? results[0].job.company : ''

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <button
                    onClick={() => navigate('/dashboard/screen')}
                    className="text-violet-300 hover:text-violet-200 text-sm font-semibold mb-8 flex items-center gap-2 transition-colors"
                >
                    Back to Screening
                </button>

                <div className="mb-10">
                    <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-violet-300 bg-clip-text text-transparent">{jobTitle}</h1>
                    <p className="text-gray-400 mb-6 text-lg">{jobCompany}</p>
                    <div className="flex items-center gap-4 text-sm font-medium text-gray-300 bg-gradient-to-r from-violet-600/10 to-violet-500/5 border border-violet-500/20 rounded-xl p-4 w-fit backdrop-blur-sm">
                        <span>{results.length} candidate{results.length !== 1 ? 's' : ''} screened</span>
                    </div>
                </div>

                {/* Results */}
                {results.length === 0 ? (
                    <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/40 border border-violet-500/20 rounded-2xl p-12 text-center">
                        <p className="text-gray-400 text-lg">No screening results available</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {results.map((result, index) => {
                            const rank = index + 1
                            const matchedSkills = result.matchedSkills.split(',').map(s => s.trim()).filter(s => s)
                            const missingSkills = result.missingSkills.split(',').map(s => s.trim()).filter(s => s)
                            const screenedDate = new Date(result.screenedAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                            })
                            const isTopThree = rank <= 3

                            return (
                                <div
                                    key={result.id}
                                    className={`rounded-xl border transition-all group ${
                                        isTopThree
                                            ? 'bg-gradient-to-br from-violet-600/20 to-violet-500/10 border-violet-500/40 shadow-lg shadow-violet-500/20'
                                            : 'bg-gradient-to-br from-gray-900/60 to-gray-800/30 border-violet-500/20 hover:border-violet-500/40 hover:shadow-lg hover:shadow-violet-500/10'
                                    }`}
                                >
                                    <div className="p-6">
                                        {/* Rank and Info */}
                                        <div className="flex items-start justify-between mb-6">
                                            <div className="flex items-start gap-4">
                                                <div className={`flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br ${getRankColor(rank)} font-bold text-lg shadow-lg shadow-violet-500/30`}>
                                                    #{rank}
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-semibold text-white group-hover:text-violet-300 transition-colors">{result.resume.candidateName}</h3>
                                                    <p className="text-gray-400 text-sm">{result.resume.email}</p>
                                                </div>
                                            </div>
                                            <div className={`px-6 py-4 rounded-lg border text-center ${getScoreColor(result.score)} font-semibold backdrop-blur-sm`}>
                                                <div className="text-3xl font-bold">{result.score}</div>
                                                <div className="text-xs">Match Score</div>
                                            </div>
                                        </div>

                                        {/* Skills */}
                                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                                            {/* Matched Skills */}
                                            <div>
                                                <p className="text-gray-400 text-xs font-semibold mb-3">✓ MATCHED SKILLS</p>
                                                {matchedSkills.length > 0 ? (
                                                    <div className="flex flex-wrap gap-2">
                                                        {matchedSkills.map((skill, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="bg-green-900/20 border border-green-700/50 text-green-300 text-xs px-3 py-1 rounded-full"
                                                            >
                                                                {skill}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-gray-500 text-sm">No matched skills</p>
                                                )}
                                            </div>

                                            {/* Missing Skills */}
                                            <div>
                                                <p className="text-gray-400 text-xs font-semibold mb-3">✗ MISSING SKILLS</p>
                                                {missingSkills.length > 0 ? (
                                                    <div className="flex flex-wrap gap-2">
                                                        {missingSkills.map((skill, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="bg-red-900/20 border border-red-700/50 text-red-300 text-xs px-3 py-1 rounded-full"
                                                            >
                                                                {skill}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-gray-500 text-sm">No missing skills</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* AI Explanation */}
                                        <div className="bg-gray-800/50 border border-violet-500/20 rounded-xl p-4 mb-4 backdrop-blur-sm">
                                            <p className="text-gray-400 text-xs font-semibold mb-2">AI ANALYSIS</p>
                                            <p className="text-gray-300 text-sm leading-relaxed">{result.aiExplanation}</p>
                                        </div>

                                        {/* Footer */}
                                        <p className="text-gray-500 text-xs">Screened: {screenedDate}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
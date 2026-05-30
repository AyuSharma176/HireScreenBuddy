import { Link } from 'react-router-dom'

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-950 to-gray-900 text-white overflow-hidden">

            {/* Navbar */}
            <nav className="px-6 py-4 flex items-center justify-between border-b border-violet-500/10 backdrop-blur-sm">
        <span className="text-2xl font-bold bg-gradient-to-r from-white to-violet-300 bg-clip-text text-transparent">
          Hire<span className="text-violet-400">Screen</span>Buddy
        </span>
                <div className="flex gap-4">
                    <Link to="/login" className="text-sm text-gray-400 hover:text-white transition-colors font-medium">
                        Login
                    </Link>
                    <Link to="/signup" className="text-sm bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 px-6 py-2 rounded-lg transition-all font-semibold shadow-lg shadow-violet-500/25">
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* Hero */}
            <section className="flex flex-col items-center justify-center text-center px-6 py-36 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-transparent to-violet-500/5 pointer-events-none"></div>
                <div className="relative z-10">
                    <div className="inline-block bg-gradient-to-r from-violet-600/20 to-violet-500/20 border border-violet-500/30 text-violet-300 text-xs px-4 py-2 rounded-full mb-8 font-semibold backdrop-blur">
                        Next-Gen AI Resume Screening
                    </div>
                    <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight bg-gradient-to-r from-white via-white to-violet-300 bg-clip-text text-transparent">
                        Hire Smarter,<br />
                        <span>Screen Faster</span>
                    </h1>
                    <p className="text-gray-300 text-lg max-w-2xl mb-12 leading-relaxed">
                        Upload resumes, define your job requirements, and let advanced AI rank your
                        candidates instantly with precise skill matching and detailed insights.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link
                            to="/signup"
                            className="bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 px-8 py-4 rounded-lg font-semibold transition-all hover:shadow-lg hover:shadow-violet-500/30 transform hover:scale-105"
                        >
                            Start Screening Free
                        </Link>
                        <Link
                            to="/login"
                            className="border-2 border-violet-500/30 hover:border-violet-500/60 px-8 py-4 rounded-lg font-semibold text-white transition-all hover:bg-violet-500/10"
                        >
                            Login
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="px-6 py-24 max-w-5xl mx-auto">
                <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-white to-violet-300 bg-clip-text text-transparent">
                    Everything you need to find the <span className="text-violet-400">right candidate</span>
                </h2>
                <p className="text-center text-gray-400 mb-16 text-lg">Powerful features designed for modern recruiting</p>
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            title: 'Smart Resume Parsing',
                            desc: 'Upload PDF or DOCX resumes and extract skills automatically using advanced NLP technology.'
                        },
                        {
                            title: 'AI Scoring',
                            desc: 'Powered by LLaMA AI to score each candidate against your job description with precision.'
                        },
                        {
                            title: 'Ranked Results',
                            desc: 'Get a ranked list of candidates with matched and missing skills explained with AI insights.'
                        },
                    ].map((f, i) => (
                        <div key={i} className="bg-gradient-to-br from-gray-900/80 to-gray-800/40 border border-violet-500/20 rounded-2xl p-8 hover:border-violet-500/40 transition-all group hover:shadow-lg hover:shadow-violet-500/10 hover:-translate-y-1">
                            <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-violet-500 rounded-lg mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="text-xl font-bold">✦</span>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white group-hover:text-violet-300 transition-colors">{f.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Steps */}
            <section className="px-6 py-24 bg-gradient-to-b from-transparent via-violet-500/5 to-transparent">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-violet-300 bg-clip-text text-transparent">How it works</h2>
                    <p className="text-gray-400 mb-16 text-lg">Simple 4-step process to screen candidates</p>
                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { step: '01', label: 'Create a Job', desc: 'Define your job requirements' },
                            { step: '02', label: 'Upload Resumes', desc: 'Add candidate resumes' },
                            { step: '03', label: 'Run AI Screen', desc: 'Let AI analyze matches' },
                            { step: '04', label: 'View Rankings', desc: 'See ranked results' },
                        ].map((s, i) => (
                            <div key={i} className="flex flex-col items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-600 to-violet-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-violet-500/30 hover:scale-110 transition-transform">
                                    {s.step}
                                </div>
                                <div>
                                    <p className="text-sm text-white font-semibold">{s.label}</p>
                                    <p className="text-xs text-gray-400 mt-1">{s.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="text-center py-8 text-gray-600 text-sm border-t border-gray-800">
                © 2026 HireScreenBuddy — Built with Spring Boot + React + AI
            </footer>
        </div>
    )
}
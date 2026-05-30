import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function LoginPage() {
    const [form, setForm] = useState({ email: '', password: '' })

    const handleSubmit = (e) => {
        e.preventDefault()
        // TODO: connect to auth API
        window.location.href = '/dashboard/screen'
    }

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-8">
                <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
                <p className="text-gray-400 text-sm mb-8">Login to your HireScreenBuddy account</p>

                <div className="flex flex-col gap-4">
                    <div>
                        <label className="text-sm text-gray-400 mb-1 block">Email</label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={e => setForm({...form, email: e.target.value})}
                            placeholder="you@example.com"
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-400 mb-1 block">Password</label>
                        <input
                            type="password"
                            value={form.password}
                            onChange={e => setForm({...form, password: e.target.value})}
                            placeholder="••••••••"
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500 transition-colors"
                        />
                    </div>
                    <button
                        onClick={handleSubmit}
                        className="w-full bg-violet-600 hover:bg-violet-500 text-white py-3 rounded-lg font-medium transition-colors mt-2"
                    >
                        Login
                    </button>
                </div>

                <p className="text-center text-gray-500 text-sm mt-6">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-violet-400 hover:text-violet-300">Sign up</Link>
                </p>
            </div>
        </div>
    )
}
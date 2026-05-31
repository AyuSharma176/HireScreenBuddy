import { Link, useLocation, useNavigate } from 'react-router-dom'

const navLinks = [
    { path: '/dashboard/upload', label: 'Upload Resume' },
    { path: '/dashboard/create-job', label: 'Create Job' },
    { path: '/dashboard/screen', label: 'Screen' },
]

export default function Navbar() {
    const location = useLocation()
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('user') || '{}')

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login')
    }

    return (
        <nav className="bg-gradient-to-r from-gray-900 via-gray-900 to-gray-800 border-b border-violet-500/20 backdrop-blur-sm px-8 py-5 flex items-center justify-between sticky top-0 z-50 shadow-lg shadow-violet-500/5">
            {/* Logo */}
            <Link
                to="/"
                className="text-2xl font-bold bg-gradient-to-r from-white via-white to-violet-300 bg-clip-text text-transparent hover:to-violet-200 transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
                Hire<span className="text-violet-400">Screen</span>Buddy
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center gap-1">
                {navLinks.map(link => {
                    const isActive = location.pathname === link.path
                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`relative px-4 py-2 text-sm font-semibold transition-all duration-300 flex items-center gap-2 rounded-lg group ${
                                isActive
                                    ? 'text-violet-300'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            <span>{link.label}</span>
                            {isActive && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-violet-400 rounded-full"></div>
                            )}
                            {!isActive && (
                                <div className="absolute inset-0 bg-violet-600/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                            )}
                        </Link>
                    )
                })}
            </div>

            {/* Right side - user name + logout */}
            <div className="flex items-center gap-4">
                {user.name && (
                    <span className="text-sm text-gray-400">
                        👋 {user.name}
                    </span>
                )}
                <button
                    onClick={handleLogout}
                    className="px-5 py-2 text-sm font-semibold bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-red-500/30 active:scale-95"
                >
                    Logout
                </button>
            </div>
        </nav>
    )
}
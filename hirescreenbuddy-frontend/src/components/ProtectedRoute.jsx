import { Navigate } from 'react-router-dom'

/**
 * ProtectedRoute component - Guards routes that require authentication.
 * Checks for JWT token in localStorage and redirects to login if not found.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @returns {React.ReactNode} Child components or redirect to login
 */
export default function ProtectedRoute({ children }) {
    const token = localStorage.getItem('token')
    
    // Redirect to login if no token found
    if (!token) {
        return <Navigate to="/login" replace />
    }
    
    // Render protected content if authenticated
    return children
}
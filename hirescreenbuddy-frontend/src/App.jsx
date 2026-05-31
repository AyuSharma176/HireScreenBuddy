import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import UploadResumePage from './pages/UploadResumePage'
import CreateJobPage from './pages/CreateJobPage'
import ScreenPage from './pages/ScreenPage'
import ResultsPage from './pages/ResultsPage'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'

/**
 * Main App component - Defines all application routes.
 * Public routes: landing, login, signup
 * Protected routes: upload, create-job, screen, results (require authentication)
 */
function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />

                {/* Protected Routes - Require JWT authentication */}
                <Route path="/dashboard/upload" element={
                    <ProtectedRoute><Navbar /><UploadResumePage /></ProtectedRoute>
                } />
                <Route path="/dashboard/create-job" element={
                    <ProtectedRoute><Navbar /><CreateJobPage /></ProtectedRoute>
                } />
                <Route path="/dashboard/screen" element={
                    <ProtectedRoute><Navbar /><ScreenPage /></ProtectedRoute>
                } />
                <Route path="/dashboard/results/:jobId" element={
                    <ProtectedRoute><Navbar /><ResultsPage /></ProtectedRoute>
                } />
            </Routes>
        </BrowserRouter>
    )
}

export default App
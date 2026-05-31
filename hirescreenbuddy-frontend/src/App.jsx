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

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
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
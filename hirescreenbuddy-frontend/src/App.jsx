import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import UploadResumePage from './pages/UploadResumePage'
import CreateJobPage from './pages/CreateJobPage'
import ScreenPage from './pages/ScreenPage'
import ResultsPage from './pages/ResultsPage'
import Navbar from './components/Navbar'

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard/upload" element={<><Navbar /><UploadResumePage /></>} />
          <Route path="/dashboard/create-job" element={<><Navbar /><CreateJobPage /></>} />
          <Route path="/dashboard/screen" element={<><Navbar /><ScreenPage /></>} />
          <Route path="/dashboard/results/:jobId" element={<><Navbar /><ResultsPage /></>} />
        </Routes>
      </BrowserRouter>
  )
}

export default App
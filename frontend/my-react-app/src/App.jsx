import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './styles/main.css'

// Layout Components
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import ScrollToTop from './components/common/ScrollToTop'

// Pages
import Home from './pages/Home'
import About from './pages/About'
import Colleges from './pages/Colleges'
import CollegeDetail from './pages/CollegeDetail'
import Courses from './pages/Courses'
import CourseDetail from './pages/CourseDetail'
import ApplicationForm from './pages/ApplicationForm'
import MyApplications from './pages/MyApplications'
import ApplicationDetail from './pages/ApplicationDetail'
import Contact from './pages/Contact'
import FAQ from './pages/FAQ'
import Scholarship from './pages/Scholarship'
import Dashboard from './pages/Dashboard'

// Context
import { AppProvider } from './context/AppContext'
import { ThemeProvider } from './context/ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <Router>
          <ScrollToTop />
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/colleges" element={<Colleges />} />
                <Route path="/colleges/:slug" element={<CollegeDetail />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/courses/:id" element={<CourseDetail />} />
                <Route path="/apply" element={<ApplicationForm />} />
                <Route path="/applications" element={<MyApplications />} />
                <Route path="/applications/:id" element={<ApplicationDetail />} />
                <Route path="/scholarship" element={<Scholarship />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/dashboard" element={<Dashboard />} />
              </Routes>
            </main>
            <Footer />
          </div>

          {/* Floating WhatsApp */}
          <a
            href="https://wa.me/919941489330"
            className="float-whatsapp"
            target="_blank"
            rel="noreferrer"
            aria-label="Chat on WhatsApp"
            title="Chat on WhatsApp"
          >
            💬
          </a>

          <ToastContainer position="bottom-right" theme="dark" />
        </Router>
      </AppProvider>
    </ThemeProvider>
  )
}

export default App
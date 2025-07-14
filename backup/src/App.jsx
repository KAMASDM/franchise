import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Brands from './pages/Brands'
import BrandDetailPage from './pages/brand/BrandDetailPage'
import Blogs from './pages/Blogs'
import FAQ from './pages/FAQ'
import Contact from './pages/Contact'
import LeadCaptureModal from './components/common/LeadCaptureModal'
import Chatbot from './components/chat/Chatbot'
import BlogDetail from './pages/BlogDetail'

function App() {
  const [showLeadCapture, setShowLeadCapture] = useState(false)

  useEffect(() => {
    // Show lead capture modal after 30 seconds or on scroll
    const timer = setTimeout(() => {
      if (!localStorage.getItem('userCaptured')) {
        setShowLeadCapture(true)
      }
    }, 30000)

    const handleScroll = () => {
      if (window.scrollY > 500 && !localStorage.getItem('userCaptured')) {
        setShowLeadCapture(true)
      }
    }

    window.addEventListener('scroll', handleScroll)
    
    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/brand/:id" element={<BrandDetailPage />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Layout>
      
      <LeadCaptureModal 
        open={showLeadCapture}
        onClose={() => setShowLeadCapture(false)}
      />
      
      <Chatbot />
    </>
  )
}

export default App
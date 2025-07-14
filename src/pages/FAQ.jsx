// src/pages/FAQ.jsx
import React from 'react'
import FAQSection from '../components/common/FAQSection'
import { portalFAQs } from '../data/faqData'

const FAQ = () => {
  return <FAQSection faqs={portalFAQs} />
}

export default FAQ

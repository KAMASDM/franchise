// src/components/common/FAQSection.jsx
import React from 'react'
import {
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box
} from '@mui/material'
import { ExpandMore } from '@mui/icons-material'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)

const FAQSection = ({ faqs, title = "Frequently Asked Questions" }) => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <MotionBox
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        sx={{ textAlign: 'center', mb: 6 }}
      >
        <Typography
          variant="h3"
          component="h2"
          fontWeight="bold"
          sx={{ mb: 3, color: 'text.primary' }}
        >
          {title}
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}
        >
          Find answers to common questions about franchise opportunities and our services.
        </Typography>
      </MotionBox>

      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        {faqs.map((faq, index) => (
          <MotionBox
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            sx={{ mb: 2 }}
          >
            <Accordion
              sx={{
                borderRadius: 2,
                '&:before': { display: 'none' },
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                sx={{
                  backgroundColor: 'grey.50',
                  borderRadius: '8px 8px 0 0',
                  '&.Mui-expanded': {
                    borderRadius: '8px 8px 0 0'
                  }
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 3 }}>
                <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          </MotionBox>
        ))}
      </Box>
    </Container>
  )
}

export default FAQSection
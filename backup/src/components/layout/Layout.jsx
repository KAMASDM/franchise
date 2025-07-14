// src/components/layout/Layout.jsx
import React from 'react'
import { Box } from '@mui/material'
import Header from './Header'
import Footer from './Footer'

const Layout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: { xs: 7, md: 8 }, // Account for fixed header
          minHeight: 'calc(100vh - 64px)'
        }}
      >
        {children}
      </Box>
      <Footer />
    </Box>
  )
}

export default Layout
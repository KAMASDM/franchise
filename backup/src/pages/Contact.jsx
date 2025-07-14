// src/pages/Contact.jsx
import React from 'react'
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Box,
  Button,
  TextField,
  Avatar
} from '@mui/material'
import {
  Phone,
  Email,
  LocationOn,
  Schedule,
  Send
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'

const MotionCard = motion(Card)

const Contact = () => {
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = (data) => {
    console.log('Contact form submitted:', data)
    // Handle form submission
  }

  const contactMethods = [
    {
      icon: <Phone />,
      title: 'Phone',
      description: 'Speak with a franchise specialist',
      contact: '+1 (555) 123-4567',
      action: 'Call Now'
    },
    {
      icon: <Email />,
      title: 'Email',
      description: 'Send us your questions',
      contact: 'info@franchisehub.com',
      action: 'Email Us'
    },
    {
      icon: <LocationOn />,
      title: 'Office',
      description: 'Visit our headquarters',
      contact: '123 Business Ave, Suite 100, New York, NY 10001',
      action: 'Get Directions'
    },
    {
      icon: <Schedule />,
      title: 'Hours',
      description: 'Our operating hours',
      contact: 'Mon-Fri: 9AM-6PM EST',
      action: 'Schedule Call'
    }
  ]

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography variant="h2" fontWeight="bold" sx={{ mb: 3 }}>
          Contact Our Franchise Experts
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Ready to start your franchise journey? Get in touch with our team of experienced franchise consultants.
        </Typography>
      </Box>

      <Grid container spacing={4} sx={{ mb: 8 }}>
        {contactMethods.map((method, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <MotionCard
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              sx={{
                textAlign: 'center',
                p: 3,
                height: '100%',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }}
            >
              <CardContent>
                <Avatar
                  sx={{
                    backgroundColor: 'primary.main',
                    width: 60,
                    height: 60,
                    mx: 'auto',
                    mb: 2
                  }}
                >
                  {method.icon}
                </Avatar>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                  {method.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {method.description}
                </Typography>
                <Typography variant="body1" fontWeight="bold" sx={{ mb: 2 }}>
                  {method.contact}
                </Typography>
                <Button variant="outlined" size="small">
                  {method.action}
                </Button>
              </CardContent>
            </MotionCard>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={6}>
        <Grid item xs={12} md={6}>
          <MotionCard
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            sx={{ p: 4, borderRadius: 3 }}
          >
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
              Send Us a Message
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    {...register('firstName', { required: 'First name is required' })}
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    {...register('lastName', { required: 'Last name is required' })}
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    {...register('email', { required: 'Email is required' })}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    {...register('phone')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Message"
                    multiline
                    rows={6}
                    {...register('message', { required: 'Message is required' })}
                    error={!!errors.message}
                    helperText={errors.message?.message}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    startIcon={<Send />}
                    sx={{
                      borderRadius: 25,
                      px: 4,
                      py: 1.5,
                      fontWeight: 'bold'
                    }}
                  >
                    Send Message
                  </Button>
                </Grid>
              </Grid>
            </form>
          </MotionCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ height: '100%', minHeight: 400 }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.2412648650147!2d-73.98731368459418!3d40.75889787932681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1642609443707!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0, borderRadius: 12 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="FranchiseHub Office Location"
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Contact
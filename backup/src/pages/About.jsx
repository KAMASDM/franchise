// src/pages/About.jsx
import React from 'react'
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Button,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material'
import {
  Business,
  TrendingUp,
  Support,
  Verified,
  CheckCircle,
  Timeline,
  People,
  Star
} from '@mui/icons-material'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)
const MotionCard = motion(Card)

const About = () => {
  const stats = [
    { number: '500+', label: 'Franchise Brands', icon: <Business /> },
    { number: '5,000+', label: 'Successful Placements', icon: <TrendingUp /> },
    { number: '95%', label: 'Client Satisfaction', icon: <Star /> },
    { number: '15+', label: 'Years Experience', icon: <Timeline /> }
  ]

  const values = [
    {
      title: 'Transparency',
      description: 'We provide honest, accurate information about every franchise opportunity.',
      icon: <Verified />
    },
    {
      title: 'Expert Guidance',
      description: 'Our experienced consultants offer personalized advice throughout your journey.',
      icon: <Support />
    },
    {
      title: 'Proven Results',
      description: 'Our track record speaks for itself with thousands of successful franchisees.',
      icon: <TrendingUp />
    },
    {
      title: 'Long-term Partnership',
      description: 'We support you beyond the initial investment with ongoing guidance.',
      icon: <People />
    }
  ]

  const teamMembers = [
    {
      name: 'Sarah Johnson',
      position: 'CEO & Founder',
      experience: '20+ years in franchising',
      avatar: 'SJ'
    },
    {
      name: 'Michael Chen',
      position: 'VP of Business Development',
      experience: 'Former franchise owner',
      avatar: 'MC'
    },
    {
      name: 'Lisa Rodriguez',
      position: 'Senior Franchise Consultant',
      experience: '15+ years consulting',
      avatar: 'LR'
    },
    {
      name: 'David Thompson',
      position: 'Financial Advisor',
      experience: 'Franchise financing expert',
      avatar: 'DT'
    }
  ]

  const achievements = [
    'Recognized as "Best Franchise Consultant" by Franchise Times',
    'Member of International Franchise Association (IFA)',
    'Certified Franchise Executive (CFE) designation',
    'BBB A+ Rating with 5-star customer reviews',
    'Featured in Entrepreneur Magazine and Forbes'
  ]

  return (
    <Container maxWidth="xl" sx={{ py: 8 }}>
      {/* Hero Section */}
      <MotionBox
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        sx={{ textAlign: 'center', mb: 8 }}
      >
        <Typography
          variant="h2"
          component="h1"
          fontWeight="bold"
          sx={{ mb: 3, color: 'text.primary' }}
        >
          About FranchiseHub
        </Typography>
        <Typography
          variant="h5"
          color="text.secondary"
          sx={{ maxWidth: 800, mx: 'auto', lineHeight: 1.6, mb: 4 }}
        >
          We're the leading franchise consulting firm dedicated to helping entrepreneurs 
          find and succeed with the perfect restaurant franchise opportunity.
        </Typography>
      </MotionBox>

      {/* Stats Section */}
      <Grid container spacing={4} sx={{ mb: 8 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <MotionCard
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              sx={{
                textAlign: 'center',
                p: 4,
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white'
              }}
            >
              <Avatar
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  width: 60,
                  height: 60,
                  mx: 'auto',
                  mb: 2
                }}
              >
                {stat.icon}
              </Avatar>
              <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                {stat.number}
              </Typography>
              <Typography variant="h6">
                {stat.label}
              </Typography>
            </MotionCard>
          </Grid>
        ))}
      </Grid>

      {/* Mission & Story */}
      <Grid container spacing={6} sx={{ mb: 8 }}>
        <Grid item xs={12} md={6}>
          <MotionBox
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Typography variant="h3" fontWeight="bold" sx={{ mb: 3 }}>
              Our Mission
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8, fontSize: '1.1rem' }}>
              At FranchiseHub, our mission is to democratize franchise ownership by providing 
              transparent access to proven business opportunities. We believe that everyone 
              deserves the chance to build wealth through franchise ownership, and we're here 
              to make that dream accessible and achievable.
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, fontSize: '1.1rem' }}>
              Founded in 2008, we've helped thousands of entrepreneurs find their perfect 
              franchise match. Our comprehensive approach combines cutting-edge technology 
              with personalized human guidance to deliver exceptional results.
            </Typography>
          </MotionBox>
        </Grid>

        <Grid item xs={12} md={6}>
          <MotionBox
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Paper
              sx={{
                p: 4,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
                Why Choose Us?
              </Typography>
              <List>
                {achievements.map((achievement, index) => (
                  <ListItem key={index} sx={{ py: 1, px: 0 }}>
                    <ListItemIcon>
                      <CheckCircle sx={{ color: 'white' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={achievement}
                      primaryTypographyProps={{
                        color: 'white',
                        fontWeight: 500
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </MotionBox>
        </Grid>
      </Grid>

      {/* Values Section */}
      <MotionBox
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        sx={{ mb: 8 }}
      >
        <Typography
          variant="h3"
          component="h2"
          fontWeight="bold"
          sx={{ textAlign: 'center', mb: 6 }}
        >
          Our Core Values
        </Typography>

        <Grid container spacing={4}>
          {values.map((value, index) => (
            <Grid item xs={12} md={6} key={index}>
              <MotionCard
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  height: '100%',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                  <Avatar
                    sx={{
                      backgroundColor: 'primary.main',
                      width: 60,
                      height: 60
                    }}
                  >
                    {value.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
                      {value.title}
                    </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                      {value.description}
                    </Typography>
                  </Box>
                </Box>
              </MotionCard>
            </Grid>
          ))}
        </Grid>
      </MotionBox>

      {/* Team Section */}
      <MotionBox
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        sx={{ mb: 8 }}
      >
        <Typography
          variant="h3"
          component="h2"
          fontWeight="bold"
          sx={{ textAlign: 'center', mb: 6 }}
        >
          Meet Our Expert Team
        </Typography>

        <Grid container spacing={4}>
          {teamMembers.map((member, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <MotionCard
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                sx={{
                  textAlign: 'center',
                  p: 4,
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}
              >
                <Avatar
                  sx={{
                    backgroundColor: 'primary.main',
                    width: 80,
                    height: 80,
                    mx: 'auto',
                    mb: 2,
                    fontSize: '1.5rem'
                  }}
                >
                  {member.avatar}
                </Avatar>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                  {member.name}
                </Typography>
                <Typography variant="subtitle1" color="primary.main" sx={{ mb: 1 }}>
                  {member.position}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {member.experience}
                </Typography>
              </MotionCard>
            </Grid>
          ))}
        </Grid>
      </MotionBox>

      {/* CTA Section */}
      <MotionBox
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        sx={{
          textAlign: 'center',
          p: 6,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}
      >
        <Typography variant="h3" fontWeight="bold" sx={{ mb: 3 }}>
          Ready to Start Your Franchise Journey?
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
          Let our experienced team guide you to the perfect franchise opportunity.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            href="/brands"
            sx={{
              backgroundColor: '#FFD700',
              color: 'black',
              fontWeight: 'bold',
              px: 4,
              py: 1.5,
              borderRadius: 25,
              '&:hover': { backgroundColor: '#FFC107' }
            }}
          >
            Browse Franchises
          </Button>
          <Button
            variant="outlined"
            size="large"
            href="/contact"
            sx={{
              borderColor: 'white',
              color: 'white',
              fontWeight: 'bold',
              px: 4,
              py: 1.5,
              borderRadius: 25,
              '&:hover': {
                backgroundColor: 'white',
                color: 'primary.main'
              }
            }}
          >
            Contact Us
          </Button>
        </Box>
      </MotionBox>
    </Container>
  )
}

export default About
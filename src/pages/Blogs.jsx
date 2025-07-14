// src/pages/Blogs.jsx
import React, { useState } from 'react'
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Box,
  Chip,
  Button,
  Avatar,
  TextField,
  InputAdornment
} from '@mui/material'
import { Search, CalendarToday, Person, ArrowForward } from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { blogPostsData } from '../data/blogData'

const MotionCard = motion(Card)

const Blogs = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = ['All', 'Investment Tips', 'Financing', 'Market Analysis', 'Success Tips', 'Industry Trends', 'Operations']

  const filteredPosts = blogPostsData.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const featuredPost = blogPostsData[0]

  return (
    <Container maxWidth="xl" sx={{ py: 8 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography
          variant="h2"
          component="h1"
          fontWeight="bold"
          sx={{ mb: 3, color: 'text.primary' }}
        >
          Franchise Insights & Tips
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ maxWidth: 600, mx: 'auto', lineHeight: 1.6, mb: 4 }}
        >
          Stay informed with the latest franchise trends, investment tips, and success stories from industry experts.
        </Typography>

        {/* Search and Filter */}
        <Box sx={{ maxWidth: 800, mx: 'auto', mb: 4 }}>
          <TextField
            fullWidth
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              )
            }}
            sx={{ mb: 3 }}
          />

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
            {categories.map((category) => (
              <Chip
                key={category}
                label={category}
                onClick={() => setSelectedCategory(category)}
                color={selectedCategory === category ? 'primary' : 'default'}
                variant={selectedCategory === category ? 'filled' : 'outlined'}
                sx={{ fontWeight: selectedCategory === category ? 'bold' : 'normal' }}
              />
            ))}
          </Box>
        </Box>
      </Box>

      {/* Featured Post */}
      <MotionCard
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        sx={{ mb: 8, borderRadius: 3, overflow: 'hidden', cursor: 'pointer' }}
        onClick={() => navigate(`/blog/${featuredPost.id}`)}
      >
        <Grid container>
          <Grid item xs={12} md={6}>
            <CardMedia
              component="img"
              height="350"
              image={featuredPost.image}
              alt={featuredPost.title}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Chip
                label="Featured"
                color="primary"
                size="small"
                sx={{ alignSelf: 'flex-start', mb: 2, fontWeight: 'bold' }}
              />
              <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
                {featuredPost.title}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                {featuredPost.excerpt}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar sx={{ width: 32, height: 32, backgroundColor: 'primary.main' }}>
                  <Person />
                </Avatar>
                <Typography variant="body2">{featuredPost.author}</Typography>
                <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {new Date(featuredPost.date).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {featuredPost.readTime}
                </Typography>
              </Box>
              <Button
                variant="contained"
                endIcon={<ArrowForward />}
                sx={{
                  alignSelf: 'flex-start',
                  borderRadius: 25,
                  px: 3,
                  fontWeight: 'bold'
                }}
              >
                Read Full Article
              </Button>
            </CardContent>
          </Grid>
        </Grid>
      </MotionCard>

      {/* Blog Grid */}
      <Grid container spacing={4}>
        {filteredPosts.slice(1).map((post, index) => (
          <Grid item xs={12} md={6} lg={4} key={post.id}>
            <MotionCard
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onClick={() => navigate(`/blog/${post.id}`)}
            >
              <CardMedia
                component="img"
                height="200"
                image={post.image}
                alt={post.title}
              />
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Chip
                  label={post.category}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                  {post.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3, lineHeight: 1.6 }}
                >
                  {post.excerpt}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Avatar sx={{ width: 24, height: 24, backgroundColor: 'primary.main', fontSize: '0.75rem' }}>
                    {post.author.split(' ').map(n => n[0]).join('')}
                  </Avatar>
                  <Typography variant="caption">{post.author}</Typography>
                  <Typography variant="caption" color="text.secondary">•</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(post.date).toLocaleDateString()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">•</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {post.readTime}
                  </Typography>
                </Box>
                <Button
                  variant="text"
                  endIcon={<ArrowForward />}
                  sx={{ fontWeight: 'bold', p: 0 }}
                >
                  Read More
                </Button>
              </CardContent>
            </MotionCard>
          </Grid>
        ))}
      </Grid>

      {/* Newsletter Signup */}
      <Box
        sx={{
          mt: 8,
          p: 6,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
          Stay Updated
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
          Subscribe to our newsletter for the latest franchise insights and opportunities.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, maxWidth: 400, mx: 'auto' }}>
          <TextField
            fullWidth
            placeholder="Enter your email"
            size="small"
            sx={{
              backgroundColor: 'white',
              borderRadius: 25,
              '& .MuiOutlinedInput-root': {
                borderRadius: 25
              }
            }}
          />
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#FFD700',
              color: 'black',
              fontWeight: 'bold',
              borderRadius: 25,
              px: 3,
              '&:hover': { backgroundColor: '#FFC107' }
            }}
          >
            Subscribe
          </Button>
        </Box>
      </Box>
    </Container>
  )
}

export default Blogs
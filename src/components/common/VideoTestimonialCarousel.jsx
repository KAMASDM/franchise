import React, { useState, useRef } from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  Avatar, 
  Container, 
  useTheme, 
  useMediaQuery,
  Dialog,
  DialogContent,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  alpha,
  Button
} from '@mui/material';
import { 
  ChevronLeft, 
  ChevronRight, 
  Close, 
  PlayCircleOutline, 
  NavigateBefore, 
  NavigateNext,
  ArrowForward 
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

/**
 * Custom Arrow Components (matching FeaturedBrandsCarousel style)
 */
const PrevArrow = ({ onClick }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: 'absolute',
      left: { xs: -16, md: -24 },
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 2,
      bgcolor: 'background.paper',
      boxShadow: 3,
      '&:hover': { bgcolor: 'primary.main', color: 'white' },
      display: { xs: 'none', md: 'flex' },
    }}
  >
    <NavigateBefore />
  </IconButton>
);

const NextArrow = ({ onClick }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: 'absolute',
      right: { xs: -16, md: -24 },
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 2,
      bgcolor: 'background.paper',
      boxShadow: 3,
      '&:hover': { bgcolor: 'primary.main', color: 'white' },
      display: { xs: 'none', md: 'flex' },
    }}
  >
    <NavigateNext />
  </IconButton>
);

/**
 * Video Testimonial Card (matching FeaturedBrandsCarousel style)
 */
const TestimonialCard = ({ testimonial, onClick }) => {
  const theme = useTheme();

  return (
    <Box sx={{ px: 1.5 }}>
      <MotionCard
        whileHover={{ y: -8, scale: 1.02 }}
        onClick={onClick}
        sx={{
          cursor: 'pointer',
          height: '100%',
          borderRadius: 3,
          overflow: 'hidden',
          border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            borderColor: theme.palette.primary.main,
            boxShadow: `0 12px 32px ${alpha(theme.palette.primary.main, 0.25)}`,
            '& .testimonial-thumbnail': {
              transform: 'scale(1.15)',
            },
          },
        }}
      >
        {/* Video Thumbnail */}
        <Box
          sx={{
            position: 'relative',
            height: 200,
            overflow: 'hidden',
            bgcolor: alpha(theme.palette.primary.main, 0.05),
          }}
        >
          <CardMedia
            component="img"
            image={testimonial.thumbnailUrl || '/placeholder-video.jpg'}
            alt={`${testimonial.authorName} testimonial`}
            className="testimonial-thumbnail"
            sx={{
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
          
          {/* Play Button Overlay */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0, 0, 0, 0.3)',
              transition: 'all 0.3s',
            }}
          >
            <PlayCircleOutline 
              sx={{ 
                fontSize: 72, 
                color: 'white',
                filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))',
                transition: 'all 0.3s',
              }} 
            />
          </Box>

          {/* Featured Badge */}
          {testimonial.featured && (
            <Chip
              label="Featured"
              size="small"
              color="secondary"
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                fontWeight: 600,
              }}
            />
          )}
        </Box>

        {/* Testimonial Info */}
        <CardContent sx={{ p: 2.5 }}>
          {/* Author Info */}
          <Box display="flex" alignItems="center" gap={1.5} mb={2}>
            <Avatar
              src={testimonial.authorAvatar}
              alt={testimonial.authorName}
              sx={{ width: 48, height: 48 }}
            >
              {testimonial.authorName?.[0] || 'U'}
            </Avatar>
            <Box flex={1}>
              <Typography 
                variant="subtitle1" 
                fontWeight="bold"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {testimonial.authorName || 'Anonymous'}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {testimonial.authorCompany || 'Franchise Owner'}
              </Typography>
            </Box>
          </Box>

          {/* Testimonial Text */}
          {testimonial.text && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 2,
                height: 40,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              "{testimonial.text}"
            </Typography>
          )}

          <Button
            variant="contained"
            startIcon={<PlayCircleOutline />}
            fullWidth
            sx={{ mt: 1, borderRadius: 2, fontWeight: 600 }}
            onClick={onClick}
          >
            Watch Video
          </Button>
        </CardContent>
      </MotionCard>
    </Box>
  );
};

/**
 * VideoTestimonialCarousel - Matches FeaturedBrandsCarousel design
 * Fetches testimonials from Firestore and displays them in a carousel
 */
const VideoTestimonialCarousel = ({ testimonials = [] }) => {
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const videoRef = useRef(null);
  const sliderRef = useRef(null);

  // Slider settings (matching FeaturedBrandsCarousel)
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 1536,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 2,
          arrows: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          arrows: false,
        },
      },
    ],
  };

  const handleOpenDialog = (testimonial) => {
    setSelectedTestimonial(testimonial);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setTimeout(() => setSelectedTestimonial(null), 300);
  };

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
        bgcolor: alpha(theme.palette.background.default, 0.5),
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="xl">
        {/* Section Header (matching FeaturedBrandsCarousel style) */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          sx={{ textAlign: 'center', mb: 6 }}
        >
          <Typography
            variant="h3"
            fontWeight="bold"
            gutterBottom
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Success Stories
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 700, mx: 'auto', mb: 2 }}
          >
            Hear from successful franchise owners who transformed their dreams into reality
          </Typography>
        </MotionBox>

        {/* Carousel */}
        <Box
          sx={{
            position: 'relative',
            px: { xs: 0, md: 4 },
            '& .slick-slider': {
              display: 'block',
            },
            '& .slick-list': {
              overflow: 'hidden',
              margin: '0 -12px',
            },
            '& .slick-track': {
              display: 'flex !important',
              alignItems: 'stretch',
            },
            '& .slick-slide': {
              height: 'auto',
              '& > div': {
                height: '100%',
              },
            },
            '& .slick-dots': {
              bottom: -45,
              '& li button:before': {
                fontSize: 12,
                color: theme.palette.primary.main,
              },
              '& li.slick-active button:before': {
                color: theme.palette.primary.main,
              },
            },
          }}
        >
          <Slider ref={sliderRef} {...sliderSettings}>
            {testimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                onClick={() => handleOpenDialog(testimonial)}
              />
            ))}
          </Slider>
        </Box>
      </Container>

      {/* Video Player Dialog */}
      <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              overflow: 'hidden'
            }
          }}
        >
          <IconButton
            onClick={handleCloseDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              zIndex: 1,
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.7)',
              }
            }}
          >
            <Close />
          </IconButton>

          <DialogContent sx={{ p: 0 }}>
            {selectedTestimonial && (
              <Box>
                {/* Video Player */}
                <Box sx={{ position: 'relative', paddingTop: '56.25%', bgcolor: 'black' }}>
                  <video
                    ref={videoRef}
                    src={selectedTestimonial.videoUrl}
                    poster={selectedTestimonial.thumbnailUrl}
                    controls
                    autoPlay
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                    }}
                  />
                </Box>

                {/* Testimonial Details */}
                <Box sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Avatar
                      src={selectedTestimonial.authorAvatar}
                      alt={selectedTestimonial.authorName}
                      sx={{ width: 64, height: 64 }}
                    >
                      {selectedTestimonial.authorName?.[0] || 'U'}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {selectedTestimonial.authorName || 'Anonymous'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedTestimonial.authorCompany || 'Franchise Owner'}
                      </Typography>
                    </Box>
                  </Box>

                  {selectedTestimonial.text && (
                    <Typography variant="body1" color="text.secondary">
                      "{selectedTestimonial.text}"
                    </Typography>
                  )}
                </Box>
              </Box>
            )}
          </DialogContent>
        </Dialog>
    </Box>
  );
};

export default VideoTestimonialCarousel;

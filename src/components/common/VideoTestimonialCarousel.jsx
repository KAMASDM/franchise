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
  Stack
} from '@mui/material';
import { ChevronLeft, ChevronRight, Close, PlayCircleOutline } from '@mui/icons-material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

/**
 * VideoTestimonialCarousel - Compact video testimonial cards with popup player
 * Fetches testimonials from Firestore and displays them in a carousel
 */
const VideoTestimonialCarousel = ({ testimonials = [] }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const videoRef = useRef(null);
  const sliderRef = useRef(null);

  // Slider settings
  const settings = {
    dots: true,
    infinite: testimonials.length > 1,
    speed: 500,
    slidesToShow: isMobile ? 1 : Math.min(3, testimonials.length),
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    arrows: false,
    centerMode: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(2, testimonials.length),
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
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
        background: 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background decoration */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.03,
          backgroundImage: 'radial-gradient(circle, #667eea 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Section Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '2rem', md: '3rem' },
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}
          >
            Success Stories
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              maxWidth: '700px',
              mx: 'auto',
              fontSize: { xs: '1rem', md: '1.25rem' }
            }}
          >
            Hear from successful franchise owners who transformed their dreams into reality
          </Typography>
        </Box>

        {/* Carousel Navigation Buttons */}
        {testimonials.length > (isMobile ? 1 : 3) && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
              mb: 4
            }}
          >
            <IconButton
              onClick={() => sliderRef.current?.slickPrev()}
              sx={{
                bgcolor: 'white',
                boxShadow: 2,
                '&:hover': {
                  bgcolor: 'primary.main',
                  color: 'white',
                  transform: 'scale(1.1)'
                },
                transition: 'all 0.3s'
              }}
            >
              <ChevronLeft />
            </IconButton>
            <IconButton
              onClick={() => sliderRef.current?.slickNext()}
              sx={{
                bgcolor: 'white',
                boxShadow: 2,
                '&:hover': {
                  bgcolor: 'primary.main',
                  color: 'white',
                  transform: 'scale(1.1)'
                },
                transition: 'all 0.3s'
              }}
            >
              <ChevronRight />
            </IconButton>
          </Box>
        )}

        {/* Video Testimonials Carousel */}
        <Slider ref={sliderRef} {...settings}>
          {testimonials.map((testimonial) => (
            <Box key={testimonial.id} sx={{ px: 2 }}>
              <Card
                onClick={() => handleOpenDialog(testimonial)}
                sx={{
                  cursor: 'pointer',
                  borderRadius: 3,
                  overflow: 'hidden',
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6,
                  }
                }}
              >
                {/* Thumbnail with Play Button Overlay */}
                <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
                  <CardMedia
                    component="img"
                    image={testimonial.thumbnailUrl || '/placeholder-video.jpg'}
                    alt={`${testimonial.authorName} testimonial`}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
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
                      '&:hover': {
                        background: 'rgba(0, 0, 0, 0.5)',
                      }
                    }}
                  >
                    <PlayCircleOutline 
                      sx={{ 
                        fontSize: 64, 
                        color: 'white',
                        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                      }} 
                    />
                  </Box>
                </Box>

                {/* Card Content */}
                <CardContent sx={{ p: 2.5 }}>
                  <Stack spacing={1.5}>
                    {/* Author Info */}
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <Avatar
                        src={testimonial.authorAvatar}
                        alt={testimonial.authorName}
                        sx={{ width: 48, height: 48 }}
                      >
                        {testimonial.authorName?.[0] || 'U'}
                      </Avatar>
                      <Box flex={1}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {testimonial.authorName || 'Anonymous'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
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
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        "{testimonial.text}"
                      </Typography>
                    )}

                    {/* Watch Now Chip */}
                    <Chip
                      icon={<PlayCircleOutline />}
                      label="Watch Video"
                      size="small"
                      color="primary"
                      sx={{ alignSelf: 'flex-start' }}
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Slider>

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
      </Container>
    </Box>
  );
};

export default VideoTestimonialCarousel;

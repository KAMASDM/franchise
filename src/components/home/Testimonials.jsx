import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Container,
  Avatar,
  useTheme,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Star } from "@mui/icons-material";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import { useTestimonials } from "../../hooks/useTestimonials";

const MotionBox = motion(Box);

const Testimonials = () => {
  const theme = useTheme();
  const { testimonials, loading, error } = useTestimonials();

  const getInitials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Alert severity="error">
          Failed to load testimonials: {error.message}
        </Alert>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        background: `linear-gradient(to bottom, ${theme.palette.primary[50]}, ${theme.palette.background.paper}, ${theme.palette.secondary[50]})`,
        color: "text.primary",
        py: { xs: 6, md: 10 },
      }}
    >
      <Container maxWidth="xl">
        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
          sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}
        >
          <Typography
            variant="h2"
            component="h2"
            sx={{
              fontWeight: 600,
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
              mb: 2,
              color: "text.primary",
            }}
          >
            Success Stories
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "text.secondary",
              maxWidth: "700px",
              mx: "auto",
              lineHeight: 1.6,
              fontWeight: 300,
            }}
          >
            Hear from successful franchisees who found their perfect opportunity
            through us.
          </Typography>
        </MotionBox>

        <Box
          sx={{
            px: { xs: 0, md: 4 },
            ".swiper-pagination-bullet": {
              backgroundColor: theme.palette.primary[200],
            },
            ".swiper-pagination-bullet-active": {
              backgroundColor: theme.palette.primary.main,
            },
          }}
        >
          {testimonials.length > 0 ? (
            <Swiper
              modules={[Pagination, Autoplay]}
              slidesPerView={1}
              spaceBetween={30}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              loop={testimonials.length > 3}
              pagination={{ clickable: true }}
              breakpoints={{
                600: { slidesPerView: testimonials.length >= 2 ? 2 : 1 },
                900: {
                  slidesPerView:
                    testimonials.length >= 3
                      ? 3
                      : testimonials.length >= 2
                      ? 2
                      : 1,
                },
              }}
            >
              {testimonials.map((testimonial) => (
                <SwiperSlide
                  key={testimonial.id}
                  style={{ height: "auto", paddingBottom: 40 }}
                >
                  <Card
                    component={motion.div}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    viewport={{ once: true }}
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      mx: { xs: 2, sm: 0 },
                      boxShadow: theme.shadows[2],
                      "&:hover": {
                        boxShadow: theme.shadows[6],
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        p: { xs: 2.5, md: 3 },
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Box sx={{ display: "flex", mb: 2 }}>
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            sx={{ color: "warning.main", fontSize: 22 }}
                          />
                        ))}
                      </Box>

                      <Typography
                        variant="body1"
                        sx={{
                          mb: 3,
                          fontStyle: "italic",
                          lineHeight: 1.7,
                          flexGrow: 1,
                          color: "text.secondary",
                        }}
                      >
                        "{testimonial.content}"
                      </Typography>

                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                          sx={{
                            mr: 2,
                            bgcolor: "primary.main",
                            width: 48,
                            height: 48,
                            fontSize: "1rem",
                          }}
                        >
                          {getInitials(testimonial.userName)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {testimonial.userName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {testimonial.brand} Franchisee
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            !loading && (
              <Typography textAlign="center" color="text.secondary">
                No testimonials available yet.
              </Typography>
            )
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default Testimonials;

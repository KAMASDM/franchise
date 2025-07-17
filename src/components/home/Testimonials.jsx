import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Container,
  Avatar,
  useTheme,
} from "@mui/material";
import { Star } from "@mui/icons-material";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";

const testimonials = [
  {
    name: "Sarah Johnson",
    business: "Pizza Palace Franchisee",
    content:
      "FranchiseHub connected me with the perfect opportunity. The support throughout the process was exceptional.",
    rating: 5,
    avatar: "SJ",
  },
  {
    name: "Mike Chen",
    business: "Burger Barn Owner",
    content:
      "Thanks to FranchiseHub, I found a franchise that exceeded my ROI expectations. Highly recommended!",
    rating: 5,
    avatar: "MC",
  },
  {
    name: "Lisa Rodriguez",
    business: "Taco Fiesta Franchisee",
    content:
      "The detailed information and expert guidance helped me make an informed decision. Great experience!",
    rating: 5,
    avatar: "LR",
  },
  {
    name: "David Lee",
    business: "Coffee Corner Owner",
    content:
      "A seamless and professional experience from start to finish. I couldn't be happier with my new venture.",
    rating: 5,
    avatar: "DL",
  },
];

const MotionBox = motion(Box);

const Testimonials = () => {
  const theme = useTheme();

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
            px: { xs: 2, md: 4 },
            ".swiper-pagination-bullet": {
              backgroundColor: theme.palette.primary[200],
            },
            ".swiper-pagination-bullet-active": {
              backgroundColor: theme.palette.primary.main,
            },
          }}
        >
          <Swiper
            modules={[Pagination, Autoplay]}
            slidesPerView={1}
            spaceBetween={30}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={index} style={{ height: "auto" }}>
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
                  }}
                >
                  <CardContent
                    sx={{
                      p: { xs: 2, md: 3 },
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Box sx={{ display: "flex", mb: 2 }}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          sx={{ color: "accent.main", fontSize: 22 }}
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
                      <Avatar sx={{ mr: 2, bgcolor: "primary.main" }}>
                        {testimonial.avatar}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {testimonial.business}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      </Container>
    </Box>
  );
};

export default Testimonials;

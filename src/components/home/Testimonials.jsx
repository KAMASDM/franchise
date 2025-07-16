import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
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
];

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const Testimonials = () => {

  return (
    <Box component="section" sx={{ py: { xs: 6, md: 10 }, px: 2 }}>
      <MotionBox
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        textAlign="center"
        mb={6}
      >
        <Typography
          variant="h3"
          fontWeight="bold"
          gutterBottom
          color="text.primary"
        >
          Success Stories
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          maxWidth={600}
          mx="auto"
        >
          Hear from successful franchisees who found their perfect opportunity
          through FranchiseHub.
        </Typography>
      </MotionBox>

      <Swiper
        modules={[Pagination, Autoplay]}
        slidesPerView={1}
        spaceBetween={30}
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop
        breakpoints={{
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {testimonials.map((testimonial, index) => (
          <SwiperSlide key={index}>
            <MotionCard
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              sx={{
                height: "100%",
                p: 3,
                borderRadius: 3,
                boxShadow: 3,
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", mb: 2 }}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} sx={{ color: "#FFD700", fontSize: 20 }} />
                  ))}
                </Box>

                <Typography
                  variant="body1"
                  sx={{ mb: 3, fontStyle: "italic", lineHeight: 1.6 }}
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
            </MotionCard>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default Testimonials;

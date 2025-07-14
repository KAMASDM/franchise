import React from "react";
import Hero from "../components/home/Hero";
import { Box, Container } from "@mui/material";
import WhyChooseUs from "../components/home/WhyChooseUs";
import Testimonials from "../components/home/Testimonials";
import FeaturedFranchise from "../components/home/FeaturedFranchise";

const Home = () => {
  return (
    <Box>
      <Hero />
      <Container maxWidth="xl">
        <FeaturedFranchise />
      </Container>
      <Container maxWidth="xl">
        <WhyChooseUs />
      </Container>
      <Container maxWidth="xl">
        <Testimonials />
      </Container>
    </Box>
  );
};

export default Home;

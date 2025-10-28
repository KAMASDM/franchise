import React, { lazy, Suspense } from "react";
import { CircularProgress, Box } from "@mui/material";
import { useDevice } from "../hooks/useDevice";
import Hero from "../components/home/Hero";
import WhyChooseUs from "../components/home/WhyChooseUs";
import Testimonials from "../components/home/Testimonials";
import FeaturedFranchise from "../components/home/FeaturedFranchise";

// Lazy load mobile version
const HomeMobile = lazy(() => import("./HomeMobile"));

const Home = () => {
  const { isMobile } = useDevice();

  // Mobile version
  if (isMobile) {
    return (
      <Suspense 
        fallback={
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <CircularProgress />
          </Box>
        }
      >
        <HomeMobile />
      </Suspense>
    );
  }

  // Desktop version
  return (
    <>
      <Hero />
      <FeaturedFranchise />
      <WhyChooseUs />
      <Testimonials />
    </>
  );
};

export default Home;

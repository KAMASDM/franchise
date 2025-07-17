import React from "react";
import Hero from "../components/home/Hero";
import WhyChooseUs from "../components/home/WhyChooseUs";
import Testimonials from "../components/home/Testimonials";
import FeaturedFranchise from "../components/home/FeaturedFranchise";

const Home = () => {
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

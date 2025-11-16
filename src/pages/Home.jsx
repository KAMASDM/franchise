import React, { lazy, Suspense } from "react";
import { CircularProgress, Box } from "@mui/material";
import { useDevice } from "../hooks/useDevice";
import { useVideoTestimonials } from "../hooks/useVideoTestimonials";
// Enhanced Components
import EnhancedHero from "../components/home/EnhancedHero";
import InteractiveHomepageElements from "../components/home/InteractiveHomepageElements";
import FeaturedBrandsCarousel from "../components/home/FeaturedBrandsCarousel";
import ModernTestimonials from "../components/home/ModernTestimonials";
import VideoTestimonialCarousel from "../components/common/VideoTestimonialCarousel";
import SEO from "../components/common/SEO";
// New Informative Sections
import IndustryInsights from "../components/home/IndustryInsights";
import PopularCategories from "../components/home/PopularCategories";
import InvestmentGuide from "../components/home/InvestmentGuide";
import FinancingOptions from "../components/home/FinancingOptions";
// Original Components (keeping as fallback)
import WhyChooseUs from "../components/home/WhyChooseUs";

// Lazy load mobile version
const HomeMobile = lazy(() => import("./HomeMobile"));

const Home = () => {
  const { isMobile } = useDevice();
  const { testimonials, loading: testimonialsLoading } = useVideoTestimonials();

  // Debug logging
  React.useEffect(() => {
    console.log('Video Testimonials:', { 
      count: testimonials?.length || 0, 
      loading: testimonialsLoading,
      testimonials: testimonials 
    });
  }, [testimonials, testimonialsLoading]);

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
        <SEO />
        <HomeMobile />
      </Suspense>
    );
  }

  // Desktop version with modern components
  return (
    <>
      <SEO 
        title="ikama - Franchise Hub | Find Your Perfect Franchise Opportunity"
        description="Discover top franchise opportunities across industries. Connect with successful brands, explore investment options, and start your entrepreneurial journey with ikama."
        keywords="franchise opportunities, franchise business, franchise investment, business opportunities, franchising, brand partnerships, franchise portal"
      />
      <EnhancedHero />
      <IndustryInsights />
      <FeaturedBrandsCarousel />
      <PopularCategories />
      <InteractiveHomepageElements />
      <InvestmentGuide />
      <FinancingOptions />
      <WhyChooseUs />
      {!testimonialsLoading && testimonials.length > 0 && (
        <VideoTestimonialCarousel testimonials={testimonials} />
      )}
      <ModernTestimonials />
    </>
  );
};

export default Home;

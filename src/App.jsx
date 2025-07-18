import React, { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";
import { Box } from "@mui/material";
import FAQ from "./pages/FAQ";
import Home from "./pages/Home";
import Blog from "./pages/Blogs";
import About from "./pages/About";
import Brands from "./pages/Brands";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashborad";
import BlogDetail from "./pages/BlogDetail";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Chatbot from "./components/chat/Chatbot";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import BrandDetail from "./components/brand/BrandDetail";
import TermsAndConditions from "./pages/TermsAndConditions";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        Loading authentication...
      </Box>
    );
  }

  return user ? children : null;
};

function App() {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith("/dashboard");

  return (
    <AuthContextProvider>
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        {!isDashboardRoute && <Header />}
        <Box component="main" sx={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/brands" element={<Brands />} />
            <Route path="/brand/:id" element={<BrandDetail />} />
            <Route path="/blogs" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route
              path="/terms-and-conditions"
              element={<TermsAndConditions />}
            />
          </Routes>
        </Box>
        {!isDashboardRoute && <Footer />}
        {!isDashboardRoute && <Chatbot />}
      </Box>
    </AuthContextProvider>
  );
}

export default App;
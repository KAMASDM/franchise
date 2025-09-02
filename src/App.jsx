import React, { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { AuthContextProvider, useAuth } from "./context/AuthContext";
import { Box, CircularProgress } from "@mui/material";
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
import { useAdminStatus } from "./hooks/useAdminStatus";
import AdminDashboard from "./pages/AdminDashboard";

// This component protects routes that require a user to be logged in.
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/"); // Redirect to home if not logged in
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return user ? children : null;
};

// This component protects routes that require the user to be an admin.
const AdminRoute = ({ children }) => {
    const { isAdmin, loading } = useAdminStatus();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !isAdmin) {
            navigate('/dashboard'); // Redirect non-admins to their standard dashboard
        }
    }, [isAdmin, loading, navigate]);

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;
    }

    return isAdmin ? children : null;
};


function App() {
  const location = useLocation();
  // Determine if the current route is part of any dashboard to hide public Header/Footer
  const isDashboardRoute = location.pathname.startsWith("/dashboard");
<<<<<<< HEAD
  const isAdminRoute = location.pathname.startsWith("/admin");
  const showPublicLayout = !isDashboardRoute && !isAdminRoute;
=======
  const isHomePage = location.pathname === "/";
>>>>>>> 26922e07c3c25e255c880ae07fc5d5dcac8cb5fd

  return (
    <AuthContextProvider>
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {showPublicLayout && <Header />}
        <Box component="main" sx={{ flex: 1 }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/brands" element={<Brands />} />
            <Route path="/brand/:slug" element={<BrandDetail />} />
            <Route path="/blogs" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            
            {/* Protected User Dashboard Route */}
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            
            {/* Protected Admin Dashboard Route */}
            <Route
                path="/admin/*"
                element={
                    <AdminRoute>
                        <AdminDashboard />
                    </AdminRoute>
                }
            />
          </Routes>
        </Box>
<<<<<<< HEAD
        {showPublicLayout && <Footer />}
        {showPublicLayout && <Chatbot />}
=======
        {isHomePage && <Footer />}
        {!isDashboardRoute && <Chatbot />}
>>>>>>> 26922e07c3c25e255c880ae07fc5d5dcac8cb5fd
      </Box>
    </AuthContextProvider>
  );
}

export default App;

import React, { Suspense, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { AuthContextProvider, useAuth } from "./context/AuthContext";
import { Box, CircularProgress } from "@mui/material";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Chatbot from "./components/chat/Chatbot";
import { useAdminStatus } from "./hooks/useAdminStatus";

// --- Lazy Load Pages ---
const Home = React.lazy(() => import("./pages/Home"));
const About = React.lazy(() => import("./pages/About"));
const Brands = React.lazy(() => import("./pages/Brands"));
const BrandDetail = React.lazy(() => import("./components/brand/BrandDetail"));
const Blog = React.lazy(() => import("./pages/Blogs"));
const BlogDetail = React.lazy(() => import("./pages/BlogDetail"));
const Contact = React.lazy(() => import("./pages/Contact"));
const FAQ = React.lazy(() => import("./pages/FAQ"));
const PrivacyPolicy = React.lazy(() => import("./pages/PrivacyPolicy"));
const TermsAndConditions = React.lazy(() => import("./pages/TermsAndConditions"));
const Dashboard = React.lazy(() => import("./pages/Dashborad"));
const AdminDashboard = React.lazy(() => import("./pages/AdminDashboard"));

const LoadingFallback = () => (
  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
    <CircularProgress />
  </Box>
);

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <LoadingFallback />;
  }

  return user ? children : null;
};

const AdminRoute = ({ children }) => {
    const { isAdmin, loading } = useAdminStatus();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !isAdmin) {
            navigate('/dashboard');
        }
    }, [isAdmin, loading, navigate]);

    if (loading) {
        return <LoadingFallback />;
    }

    return isAdmin ? children : null;
};


function App() {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith("/dashboard");
  const isAdminRoute = location.pathname.startsWith("/admin");
  const showPublicLayout = !isDashboardRoute && !isAdminRoute;

  return (
    <AuthContextProvider>
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {showPublicLayout && <Header />}
        <Box component="main" sx={{ flex: 1 }}>
          <Suspense fallback={<LoadingFallback />}>
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
          </Suspense>
        </Box>
        {showPublicLayout && <Footer />}
        {showPublicLayout && <Chatbot />}
      </Box>
    </AuthContextProvider>
  );
}

export default App;
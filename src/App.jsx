import React, { Suspense, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { AuthContextProvider, useAuth } from "./context/AuthContext";
import { Box, CircularProgress } from "@mui/material";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import MobileAppLayout from "./components/layout/MobileAppLayout";
import Chatbot from "./components/chat/Chatbot";
import LiveChat from "./components/chat/LiveChat";
import InstallPrompt from "./components/common/InstallPrompt";
import OfflineIndicator from "./components/common/OfflineIndicator";
import { useAdminStatus } from "./hooks/useAdminStatus";
import { useDevice } from "./hooks/useDevice";

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
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const AdminDashboard = React.lazy(() => import("./pages/AdminDashboard"));
const CreateBrandProfile = React.lazy(() => import("./pages/CreateBrandProfile"));
const BrandDebugger = React.lazy(() => import("./components/debug/BrandDebugger"));

// Only load debug component in development
const FirestoreTest = import.meta.env.DEV 
  ? React.lazy(() => import("./components/debug/FirestoreTest"))
  : null;

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
  const { isMobile } = useDevice();
  const isDashboardRoute = location.pathname.startsWith("/dashboard");
  const isAdminRoute = location.pathname.startsWith("/admin");
  const showPublicLayout = !isDashboardRoute && !isAdminRoute;

  // Public routes content
  const PublicRoutes = () => (
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
      
      {/* Brand Registration */}
      <Route path="/create-brand-profile" element={<CreateBrandProfile />} />
      
      {/* Debug Route - Remove in production */}
      <Route path="/debug-brands" element={<BrandDebugger />} />
      
      {/* Debug route - only available in development */}
      {import.meta.env.DEV && FirestoreTest && (
        <Route path="/test-firestore" element={<FirestoreTest />} />
      )}
    </Routes>
  );

  return (
    <AuthContextProvider>
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {showPublicLayout && !isMobile && <Header />}
        <Box component="main" sx={{ flex: 1 }}>
          <Suspense fallback={<LoadingFallback />}>
            {showPublicLayout ? (
              // Wrap public routes in MobileAppLayout for mobile, use regular layout for desktop
              isMobile ? (
                <MobileAppLayout>
                  <PublicRoutes />
                </MobileAppLayout>
              ) : (
                <PublicRoutes />
              )
            ) : (
              // Dashboard and Admin routes (no mobile layout wrapper)
              <Routes>
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
            )}
          </Suspense>
        </Box>
        {showPublicLayout && !isMobile && <Footer />}
        {showPublicLayout && <Chatbot />}
        <LiveChat />
        <InstallPrompt />
        <OfflineIndicator />
      </Box>
    </AuthContextProvider>
  );
}

export default App;
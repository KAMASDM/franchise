import React, { Suspense, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { AuthContextProvider, useAuth } from "./context/AuthContext";
import { DarkModeProvider } from "./context/DarkModeContext";
import { Box, CircularProgress } from "@mui/material";
import { Toaster } from 'react-hot-toast';
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import MobileAppLayout from "./components/layout/MobileAppLayout";
import Chatbot from "./components/chat/Chatbot";
import LiveChat from "./components/chat/LiveChat";
import InstallPrompt from "./components/common/InstallPrompt";
import OfflineIndicator from "./components/common/OfflineIndicator";
import PWAUpdatePrompt from "./components/common/PWAUpdatePrompt";
import ComparisonBar from "./components/brand/ComparisonBar";
import { useAdminStatus } from "./hooks/useAdminStatus";
import { useDevice } from "./hooks/useDevice";
import { usePageProgress } from "./hooks/usePageProgress";
import '../src/styles/nprogress-custom.css';

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
const InvestorPitchDeck = React.lazy(() => import("./pages/InvestorPitchDeck"));
const FavoritesPage = React.lazy(() => import("./components/favorites/FavoritesPage"));
const ChatHistoryPage = React.lazy(() => import("./components/chat/ChatHistoryViewer"));
const AuthPage = React.lazy(() => import("./pages/AuthPage"));
const ForgotPasswordPage = React.lazy(() => import("./pages/ForgotPasswordPage"));

// Only load debug component in development
const FirestoreTest = import.meta.env.DEV 
  ? React.lazy(() => import("./components/debug/FirestoreTest"))
  : null;

const TestimonialDebugger = import.meta.env.DEV
  ? React.lazy(() => import("./components/debug/TestimonialDebugger"))
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
  usePageProgress(); // Add page transition loading bar
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
      
      {/* Authentication */}
      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      
      {/* Favorites and Chat History */}
      <Route path="/favorites" element={<FavoritesPage />} />
      <Route path="/chat-history" element={<ChatHistoryPage standalone={true} />} />
      
      {/* Investor Pitch Deck */}
      <Route path="/investors" element={<InvestorPitchDeck />} />
      
      {/* Brand Registration */}
      <Route path="/create-brand-profile" element={<CreateBrandProfile />} />
      
      {/* Debug Route - Remove in production */}
      <Route path="/debug-brands" element={<BrandDebugger />} />
      
      {/* Debug route - only available in development */}
      {import.meta.env.DEV && FirestoreTest && (
        <Route path="/test-firestore" element={<FirestoreTest />} />
      )}
      
      {/* Testimonials Debug - only in development */}
      {import.meta.env.DEV && TestimonialDebugger && (
        <Route path="/debug-testimonials" element={<TestimonialDebugger />} />
      )}
    </Routes>
  );

  return (
    <DarkModeProvider>
      <AuthContextProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: '12px',
              padding: '16px',
              fontSize: '14px',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
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
          <PWAUpdatePrompt />
          <ComparisonBar />
        </Box>
      </AuthContextProvider>
    </DarkModeProvider>
  );
}

export default App;
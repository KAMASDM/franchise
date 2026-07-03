import React, { useEffect, useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
  CssBaseline,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  IconButton,
  CircularProgress,
  Avatar,
  SwipeableDrawer,
  Stack,
  Divider,
  Chip,
  Button,
  Fab,
  alpha,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Home as HomeIcon,
  Store as MyBrandsIcon,
  Settings as SettingsIcon,
  HelpOutline as HelpIcon,
  AppRegistration as AppRegistrationIcon,
  ExitToApp as LogoutIcon,
  MyLocation as MyLocationIcon,
  Leaderboard as LeaderboardIcon,
  Palette as RestaurantIcon,
  Reviews as ReviewsIcon,
  Quiz as QuizIcon,
  PictureAsPdf as MarketingIcon,
  TravelExplore as LocationAnalysisIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  AddCircle,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import {
  Route,
  Routes,
  Link as RouterLink,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { motion } from "framer-motion";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import logger from "../utils/logger";
import Help from "../components/dashboard/Help";
import Overview from "../components/dashboard/Overview";
import Brands from "../components/dashboard/Brands";
import Settings from "../components/dashboard/Settings";
import Leads from "../components/dashboard/Leads";
import Locations from "../components/dashboard/Locations";
import BrandRegistration from "../components/forms/BrandRegistrationNew";
import BrandRegistrationMobile from "../components/forms/BrandRegistrationMobile";
import BrandDetail from "../components/dashboard/BrandDetail";
import NotificationCenter from "../components/common/NotificationCenter";
import Review from "../components/dashboard/Review";
import FAQs from "../components/dashboard/FAQs";
import MarketingMaterials from "../components/dashboard/MarketingMaterials";
import { useAdminStatus } from "../hooks/useAdminStatus";
import { useAuth } from "../context/AuthContext";

const drawerWidth = 240;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: drawerWidth,
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.contrastText,
  },
}));

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: theme.shadows[1],
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

/**
 * Single responsive dashboard shell.
 * - md+ : permanent drawer + top app bar
 * - <md : app-style chrome — top bar, bottom navigation, FAB, "More" drawer
 * Content routes are defined once and shared by both layouts.
 */
const Dashboard = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { isAdmin, loading: adminLoading } = useAdminStatus();
  const [moreDrawerOpen, setMoreDrawerOpen] = useState(false);

  // Admin users belong in /admin.
  useEffect(() => {
    if (!adminLoading && isAdmin) {
      navigate('/admin', { replace: true });
    }
  }, [isAdmin, adminLoading, navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      logger.error("Logout Failed:", error);
    }
  };

  const dashboardNavItems = [
    { text: "Home", path: "/", icon: <HomeIcon /> },
    { text: "Overview", path: "/dashboard", icon: <DashboardIcon /> },
    {
      text: "Register Brand",
      path: "/dashboard/register-brand",
      icon: <AppRegistrationIcon />,
    },
    { text: "Brands", path: "/dashboard/brands", icon: <MyBrandsIcon /> },
    {
      text: "Marketing Materials",
      path: "/dashboard/marketing",
      icon: <MarketingIcon />,
    },
    {
      text: "Locations",
      path: "/dashboard/locations",
      icon: <MyLocationIcon />,
    },
    {
      text: "Location Finder",
      path: "/location-analysis-enhanced",
      icon: <LocationAnalysisIcon />,
      badge: "AI",
    },
    {
      text: "Leads Acquired",
      path: "/dashboard/leads",
      icon: <LeaderboardIcon />,
    },
    { text: "Review", path: "/dashboard/reviews", icon: <ReviewsIcon /> },
    { text: "FAQs", path: "/dashboard/faqs", icon: <QuizIcon /> },
    { text: "Settings", path: "/dashboard/settings", icon: <SettingsIcon /> },
    { text: "Help & Support", path: "/dashboard/help", icon: <HelpIcon /> },
  ];

  // Bottom navigation (mobile): the four highest-traffic destinations + More
  const bottomNavItems = [
    { label: "Overview", icon: <DashboardIcon />, path: "/dashboard", value: "overview" },
    { label: "Brands", icon: <MyBrandsIcon />, path: "/dashboard/brands", value: "brands" },
    { label: "Leads", icon: <LeaderboardIcon />, path: "/dashboard/leads", value: "leads" },
    { label: "Marketing", icon: <MarketingIcon />, path: "/dashboard/marketing", value: "marketing" },
    { label: "More", icon: <MenuIcon />, action: () => setMoreDrawerOpen(true), value: "more" },
  ];

  const moreMenuItems = [
    { label: "Home", icon: <HomeIcon />, path: "/" },
    { label: "Locations", icon: <MyLocationIcon />, path: "/dashboard/locations" },
    { label: "Location Finder", icon: <LocationAnalysisIcon />, path: "/location-analysis-enhanced", badge: "AI" },
    { label: "Reviews", icon: <ReviewsIcon />, path: "/dashboard/reviews" },
    { label: "FAQs", icon: <QuizIcon />, path: "/dashboard/faqs" },
    { label: "Settings", icon: <SettingsIcon />, path: "/dashboard/settings" },
    { label: "Help & Support", icon: <HelpIcon />, path: "/dashboard/help" },
  ];

  const getBottomNavValue = () => {
    const currentPath = location.pathname;
    // Exact match for the root so "/dashboard" doesn't shadow every other route
    if (currentPath === "/dashboard" || currentPath === "/dashboard/") return "overview";
    const found = bottomNavItems.find(
      (item) => item.path && item.path !== "/dashboard" && currentPath.startsWith(item.path)
    );
    return found?.value ?? false;
  };

  const handleBottomNavChange = (event, newValue) => {
    const item = bottomNavItems.find((i) => i.value === newValue);
    if (item?.action) {
      item.action();
    } else if (item?.path) {
      navigate(item.path);
    }
  };

  // Content routes — defined once, rendered by both layouts.
  // Registration keeps its dedicated mobile flow (swipe wizard vs stepper).
  const routedContent = (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: isMobile ? 0.2 : 0.5 }}
    >
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route
          path="register-brand"
          element={isMobile ? <BrandRegistrationMobile /> : <BrandRegistration />}
        />
        <Route path="brands" element={<Brands />} />
        <Route path="brand-details/:id" element={<BrandDetail />} />
        <Route path="marketing" element={<MarketingMaterials />} />
        <Route path="locations" element={<Locations />} />
        <Route path="leads" element={<Leads />} />
        <Route path="reviews" element={<Review />} />
        <Route path="faqs" element={<FAQs />} />
        <Route path="settings" element={<Settings />} />
        <Route path="help" element={<Help />} />
      </Routes>
    </motion.div>
  );

  // While checking for admin status, show a loader to prevent flicker.
  // If the user is an admin, this component will redirect, so we render nothing.
  if (adminLoading || isAdmin) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // ---------- Mobile layout: app bar + bottom nav + FAB + More drawer ----------
  if (isMobile) {
    const onRegisterScreen = location.pathname.includes("/register-brand");

    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default", pb: 9 }}>
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: "background.paper",
            color: "text.primary",
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Toolbar sx={{ minHeight: 64, px: 2 }}>
            <Box flex={1} sx={{ minWidth: 0 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
                Welcome back,
              </Typography>
              <Typography variant="h6" fontWeight="bold" noWrap>
                {user?.displayName || "Dashboard"}
              </Typography>
            </Box>
            <NotificationCenter />
            <Avatar
              src={user?.photoURL}
              alt={user?.displayName || "User"}
              sx={{ width: 40, height: 40, bgcolor: "primary.main", cursor: "pointer", ml: 1 }}
              onClick={() => setMoreDrawerOpen(true)}
            >
              {user?.displayName?.[0] || user?.email?.[0] || "U"}
            </Avatar>
          </Toolbar>
        </AppBar>

        {routedContent}

        {!onRegisterScreen && (
          <Fab
            color="primary"
            aria-label="Register a brand"
            onClick={() => navigate("/dashboard/register-brand")}
            sx={{
              position: "fixed",
              bottom: 84,
              right: 16,
              zIndex: theme.zIndex.appBar,
              boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.4)}`,
            }}
          >
            <AddCircle sx={{ fontSize: 30 }} />
          </Fab>
        )}

        {!onRegisterScreen && (
          <Paper
            sx={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: theme.zIndex.appBar,
              borderTop: 1,
              borderColor: "divider",
            }}
            elevation={8}
          >
            <BottomNavigation
              value={getBottomNavValue()}
              onChange={handleBottomNavChange}
              showLabels
              sx={{
                height: 64,
                bgcolor: "background.paper",
                "& .MuiBottomNavigationAction-root": {
                  minWidth: 0,
                  minHeight: 48,
                  color: "text.secondary",
                  "&.Mui-selected": { color: "primary.main" },
                },
                "& .MuiBottomNavigationAction-label": {
                  fontSize: "0.7rem",
                  "&.Mui-selected": { fontSize: "0.75rem", fontWeight: 600 },
                },
              }}
            >
              {bottomNavItems.map((item) => (
                <BottomNavigationAction
                  key={item.value}
                  label={item.label}
                  value={item.value}
                  icon={item.icon}
                />
              ))}
            </BottomNavigation>
          </Paper>
        )}

        <SwipeableDrawer
          anchor="right"
          open={moreDrawerOpen}
          onClose={() => setMoreDrawerOpen(false)}
          onOpen={() => setMoreDrawerOpen(true)}
          sx={{ "& .MuiDrawer-paper": { width: "85%", maxWidth: 320 } }}
        >
          <Box sx={{ overflow: "auto", height: "100%", display: "flex", flexDirection: "column" }}>
            <Box
              sx={{
                p: 3,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                color: "white",
              }}
            >
              <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h6" fontWeight="bold">
                  Menu
                </Typography>
                <IconButton
                  onClick={() => setMoreDrawerOpen(false)}
                  aria-label="Close menu"
                  sx={{ color: "white", minWidth: 44, minHeight: 44 }}
                >
                  <CloseIcon />
                </IconButton>
              </Stack>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar src={user?.photoURL} sx={{ width: 56, height: 56 }}>
                  {user?.displayName?.[0] || "U"}
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="subtitle1" fontWeight={600} noWrap>
                    {user?.displayName || "User"}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.9 }} noWrap>
                    {user?.email}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <List sx={{ flex: 1, px: 1, py: 2 }}>
              {moreMenuItems.map((item) => (
                <ListItemButton
                  key={item.label}
                  onClick={() => {
                    navigate(item.path);
                    setMoreDrawerOpen(false);
                  }}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    minHeight: 48,
                    "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.08) },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ fontWeight: 500, fontSize: "0.9rem" }}
                  />
                  {item.badge && (
                    <Chip
                      label={item.badge}
                      size="small"
                      color="secondary"
                      sx={{ fontWeight: 700, fontSize: "0.65rem" }}
                    />
                  )}
                </ListItemButton>
              ))}
            </List>

            <Divider />
            <Box sx={{ p: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                color="error"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{ minHeight: 48, borderRadius: 2, fontWeight: 600 }}
              >
                Logout
              </Button>
            </Box>
          </Box>
        </SwipeableDrawer>
      </Box>
    );
  }

  // ---------- Desktop layout: permanent drawer + top app bar ----------
  const drawerContent = (
    <>
      <Box sx={{ display: "flex", alignItems: "center", p: 2 }}>
        <IconButton
          component={RouterLink}
          to="/"
          sx={{ color: "inherit", mr: 2 }}
          aria-label="Go to home page"
        >
          <RestaurantIcon />
        </IconButton>
        <Typography variant="h6">iKama</Typography>
      </Box>
      <List sx={{ px: 1 }}>
        {dashboardNavItems.map((item) => (
          <ListItemButton
            key={item.text}
            component={RouterLink}
            to={item.path}
            selected={location.pathname === item.path}
            sx={{
              borderRadius: 2,
              mb: 1,
              color: "inherit",
              "&:hover": {
                backgroundColor: theme.palette.primary.light,
              },
              "&.Mui-selected": {
                backgroundColor: theme.palette.primary.main,
                "&:hover": {
                  backgroundColor: theme.palette.primary.main,
                },
              },
            }}
          >
            <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
            {item.badge && (
              <Chip
                label={item.badge}
                size="small"
                color="secondary"
                sx={{ fontWeight: 700, fontSize: "0.65rem" }}
              />
            )}
          </ListItemButton>
        ))}
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            mt: 4,
            color: "inherit",
            "&:hover": {
              backgroundColor: theme.palette.primary.light,
            },
          }}
        >
          <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <CssBaseline />
      <StyledAppBar>
        <Toolbar>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <IconButton component={RouterLink} to="/" sx={{ color: "inherit" }} aria-label="Go to home page">
              <RestaurantIcon sx={{ mr: 1 }} />
              <Typography variant="h6">iKama</Typography>
            </IconButton>
            <NotificationCenter />
          </Box>
        </Toolbar>
      </StyledAppBar>

      <StyledDrawer variant="permanent">{drawerContent}</StyledDrawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: "64px",
        }}
      >
        {routedContent}
      </Box>
    </Box>
  );
};

export default Dashboard;

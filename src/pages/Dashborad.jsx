import React from "react";
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
  Restaurant as RestaurantIcon,
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
import Help from "../components/dashboard/Help";
import Overview from "../components/dashboard/Overview";
import Brands from "../components/dashboard/Brands";
import Settings from "../components/dashboard/Settings";
import Leads from "../components/dashboard/Leads";
import Locations from "../components/dashboard/Locations";
import BrandRegistration from "../components/forms/BrandRegistration";
import BrandDetail from "../components/dashboard/BrandDetail";
import Notifications from "../components/dashboard/Notification/Notification";

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

const Dashboard = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout Failed:", error);
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
      text: "Locations",
      path: "/dashboard/locations",
      icon: <MyLocationIcon />,
    },
    {
      text: "Leads Acquired",
      path: "/dashboard/leads",
      icon: <LeaderboardIcon />,
    },
    { text: "Settings", path: "/dashboard/settings", icon: <SettingsIcon /> },
    { text: "Help & Support", path: "/dashboard/help", icon: <HelpIcon /> },
  ];

  const mobileNavItems = [
    {
      text: "Register Brand",
      path: "/dashboard/register-brand",
      icon: <AppRegistrationIcon />,
    },
    { text: "Brands", path: "/dashboard/brands", icon: <MyBrandsIcon /> },
    {
      text: "Locations",
      path: "/dashboard/locations",
      icon: <MyLocationIcon />,
    },
    {
      text: "Leads Acquired",
      path: "/dashboard/leads",
      icon: <LeaderboardIcon />,
    },
  ];

  const drawerContent = (
    <>
      <Box sx={{ display: "flex", alignItems: "center", p: 2 }}>
        <IconButton
          component={RouterLink}
          to="/"
          sx={{ color: "inherit", mr: 2 }}
        >
          <RestaurantIcon />
        </IconButton>
        <Typography variant="h6">FranchiseHub</Typography>
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
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "grey.50" }}>
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
            <IconButton component={RouterLink} to="/" sx={{ color: "inherit" }}>
              <RestaurantIcon sx={{ mr: 1 }} />
              <Typography variant="h6">FranchiseHub</Typography>
            </IconButton>
            <Notifications />
          </Box>
        </Toolbar>
      </StyledAppBar>

      {!isMobile && (
        <StyledDrawer variant="permanent">{drawerContent}</StyledDrawer>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          pb: isMobile ? 8 : 3,
          mt: "64px",
        }}
      >
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="register-brand" element={<BrandRegistration />} />
            <Route path="brands" element={<Brands />} />
            <Route path="brand-details/:id" element={<BrandDetail />} />
            <Route path="locations" element={<Locations />} />
            <Route path="leads" element={<Leads />} />
            <Route path="settings" element={<Settings />} />
            <Route path="help" element={<Help />} />
          </Routes>
        </motion.div>
      </Box>

      {isMobile && (
        <Paper
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: theme.zIndex.appBar,
          }}
          elevation={3}
        >
          <BottomNavigation
            showLabels
            value={mobileNavItems.findIndex(
              (item) => item.path === location.pathname
            )}
            onChange={(event, newValue) => {
              navigate(mobileNavItems[newValue].path);
            }}
          >
            {mobileNavItems.map((item) => (
              <BottomNavigationAction
                key={item.text}
                label={item.text}
                icon={item.icon}
                component={RouterLink}
                to={item.path}
              />
            ))}
          </BottomNavigation>
        </Paper>
      )}
    </Box>
  );
};

export default Dashboard;

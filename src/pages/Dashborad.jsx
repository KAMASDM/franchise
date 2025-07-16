import React, { useState, useEffect } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
  CssBaseline,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Home as HomeIcon,
  Store as MyBrandsIcon,
  Settings as SettingsIcon,
  HelpOutline as HelpIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  AppRegistration as AppRegistrationIcon,
  ExitToApp as LogoutIcon,
  MyLocation as MyLocationIcon,
  Leaderboard as LeaderboardIcon,
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

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": {
      ...openedMixin(theme),
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "#ffffff",
    },
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": {
      ...closedMixin(theme),
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "#ffffff",
    },
  }),
}));

const Dashboard = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = useState(!isMobile);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout Failed:", error);
    }
  };

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setOpen(!open);
    }
  };

  useEffect(() => {
    if (isMobile && mobileOpen) {
      setMobileOpen(false);
    }
    if (!isMobile) {
      setOpen(true);
    }
  }, [location, isMobile, mobileOpen]);

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
      text: "Leads Aquired",
      path: "/dashboard/leads",
      icon: <LeaderboardIcon />,
    },
    { text: "Settings", path: "/dashboard/settings", icon: <SettingsIcon /> },
    { text: "Help & Support", path: "/dashboard/help", icon: <HelpIcon /> },
  ];

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          width: {
            md: `calc(100% - ${open ? drawerWidth : theme.spacing(7) + 1}px)`,
          },
          ml: { md: `${open ? drawerWidth : theme.spacing(7) + 1}px` },
          transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      <StyledDrawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : open}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerToggle} sx={{ color: "white" }}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <List>
          {dashboardNavItems.map((item) => (
            <ListItem
              button
              key={item.text}
              component={RouterLink}
              to={item.path}
              selected={
                location.pathname === item.path ||
                (item.path === "/dashboard" &&
                  location.pathname === "/dashboard/")
              }
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  color: "white",
                },
                "&.Mui-selected": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  color: "white",
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.3)",
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: "inherit" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
          <ListItem
            button
            onClick={handleLogout}
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                color: "white",
              },
            }}
          >
            <ListItemIcon sx={{ color: "inherit" }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </StyledDrawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: {
            md: `calc(100% - ${open ? drawerWidth : theme.spacing(7) + 1}px)`,
          },
          mt: 8,
          transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Routes>
            <Route index element={<Overview />} />
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
    </Box>
  );
};

export default Dashboard;

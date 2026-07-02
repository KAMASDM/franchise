import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Box,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Info as AboutIcon,
  Store as BrandsIcon,
  Article as BlogIcon,
  ContactMail as ContactIcon,
  Help as FaqIcon,
  Business as BrandIcon,
  Palette as RestaurantIcon,
  ExitToApp as LogoutIcon,
  Dashboard as DashboardIcon,
  Login as LoginIcon,
  TrendingUp as InvestorIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider, db } from "../../firebase/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import DarkModeToggleIcon from "../common/DarkModeToggle";
import LanguageSelector from "../common/LanguageSelector";
import FranchiseHubLogo from "../common/FranchiseHubLogo";
import logger from "../../utils/logger";
import { sendWelcomeEmail } from "../../services/emailServiceNew";

const MotionButton = (props) => (
  <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
    <Button {...props} />
  </motion.div>
);

// Desktop nav: tight, product-first. Home lives on the logo;
// Investors is the standalone CTA button, not a nav item.
const navItems = [
  { text: "Brands", path: "/brands", icon: <BrandsIcon /> },
  { text: "Blog", path: "/blogs", icon: <BlogIcon /> },
  { text: "About", path: "/about", icon: <AboutIcon /> },
  { text: "FAQs", path: "/faq", icon: <FaqIcon /> },
  { text: "Contact", path: "/contact", icon: <ContactIcon /> },
];

// Mobile drawer keeps the full list, including Home and Investors
const drawerNavItems = [
  { text: "Home", path: "/", icon: <HomeIcon /> },
  ...navItems,
  { text: "Investors", path: "/investors", icon: <InvestorIcon /> },
];

const Header = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const isActivePath = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const openCommandPalette = () => {
    window.dispatchEvent(new CustomEvent("open-command-palette"));
  };

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);

  const handleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleUserMenu = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setUserMenuAnchor(null);
  };

  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if user already exists
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      const isNewUser = !userDoc.exists();
      
      await setDoc(
        userDocRef,
        {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          lastLogin: new Date(),
          createdAt: isNewUser ? new Date() : userDoc.data()?.createdAt,
        },
        { merge: true }
      );
      
      // Send welcome email to new users
      if (isNewUser && user.email) {
        try {
          await sendWelcomeEmail({
            email: user.email,
            name: user.displayName || user.email.split('@')[0],
          });
          logger.info('Welcome email sent to new user:', user.email);
        } catch (emailError) {
          logger.error('Failed to send welcome email:', emailError);
          // Don't block sign-in if email fails
        }
      }
      
      navigate("/dashboard/register-brand");
    } catch (error) {
      logger.error("Google Sign-In Failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      handleCloseUserMenu();
      navigate("/");
    } catch (error) {
      logger.error("Logout Failed:", error);
    }
  };

  const drawerContent = (
    <Box
      sx={{ width: 250, py: 2 }}
      role="presentation"
      onClick={handleDrawer(false)}
    >
      <Box sx={{ px: 2, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
        <FranchiseHubLogo variant="full" width={200} height={50} />
      </Box>
      <Divider />
      <List>
        {drawerNavItems.map(({ text, path, icon }) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              component={RouterLink}
              to={path}
              selected={isActivePath(path)}
              sx={{ minHeight: 48 }} // WCAG touch target minimum
            >
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText 
                primary={text}
                primaryTypographyProps={{ fontSize: '0.95rem' }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 1 }} />
      {!user && (
        <>
          <ListItem disablePadding>
            <ListItemButton
              component={RouterLink}
              to="/login"
              sx={{
                backgroundColor: "primary.main",
                color: "white",
                borderRadius: 2,
                mx: 2,
                mb: 1,
                '&:hover': {
                  backgroundColor: "primary.dark",
                },
                minHeight: 48, // WCAG touch target minimum
              }}
            >
              <ListItemIcon>
                <LoginIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText 
                primary="Sign In" 
                primaryTypographyProps={{ fontWeight: 600 }}
              />
            </ListItemButton>
          </ListItem>
        </>
      )}
    </Box>
  );

  const userMenu = (
    <Box>
      <Tooltip title="Account settings">
        <IconButton onClick={handleUserMenu} sx={{ p: 0 }} aria-label="Open user menu">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Avatar 
              alt={user?.displayName || ""} 
              src={user?.photoURL || ""} 
              onError={(e) => {
                e.target.src = ''; // Remove src to show initials instead
              }}
            >
              {user?.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
            </Avatar>
          </motion.div>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleCloseUserMenu}
        sx={{ mt: 1.5 }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {[
          <MenuItem
            key="dashboard"
            onClick={() => {
              handleCloseUserMenu();
              // Use replace to force navigation even if already on dashboard
              navigate("/dashboard", { replace: true });
            }}
          >
            <ListItemIcon>
              <DashboardIcon fontSize="small" />
            </ListItemIcon>
            Dashboard
          </MenuItem>,
          <Divider key="divider" />,
          <MenuItem key="logout" onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        ]}
      </Menu>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "background.paper",
          color: "text.primary",
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: "inherit",
              gap: 1,
            }}
          >
            <FranchiseHubLogo
              variant="full"
              width={isMobile ? 130 : 170}
              height={isMobile ? 36 : 46}
            />
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              {navItems.map(({ text, path }) => {
                const active = isActivePath(path);
                return (
                  <Button
                    key={text}
                    component={RouterLink}
                    to={path}
                    color="inherit"
                    aria-current={active ? "page" : undefined}
                    sx={{
                      position: "relative",
                      fontWeight: active ? 700 : 500,
                      color: active ? "primary.main" : "text.primary",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        left: 12,
                        right: 12,
                        bottom: 4,
                        height: 2,
                        borderRadius: 1,
                        bgcolor: "primary.main",
                        opacity: active ? 1 : 0,
                        transition: "opacity 150ms ease",
                      },
                      "&:hover::after": {
                        opacity: 0.4,
                      },
                    }}
                  >
                    {text}
                  </Button>
                );
              })}
            </Box>
          )}

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {/* Global search / command palette */}
            <Tooltip title="Search (Ctrl+K)">
              <IconButton
                onClick={openCommandPalette}
                aria-label="Open search"
                sx={{ color: "text.secondary" }}
              >
                <SearchIcon />
              </IconButton>
            </Tooltip>

            {/* Language Selector */}
            <LanguageSelector />
            
            {/* Dark Mode Toggle */}
            <DarkModeToggleIcon />
            
            {/* Investor Button - Always visible */}
            <MotionButton
              component={RouterLink}
              to="/investors"
              variant="outlined"
              color="primary"
              startIcon={<InvestorIcon />}
              sx={{ 
                display: { xs: 'none', sm: 'flex' },
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                }
              }}
            >
              Investors
            </MotionButton>
            
            {user ? (
              userMenu
            ) : (
              <MotionButton
                variant="contained"
                color="primary"
                component={RouterLink}
                to="/login"
                startIcon={<LoginIcon />}
              >
                Sign In
              </MotionButton>
            )}
            {isMobile && (
              <IconButton
                edge="end"
                color="inherit"
                onClick={handleDrawer(true)}
                aria-label="Open navigation menu"
                sx={{ 
                  minWidth: 48, 
                  minHeight: 48, // WCAG touch target minimum
                  ml: 1 
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={drawerOpen} onClose={handleDrawer(false)}>
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Header;

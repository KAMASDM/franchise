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
import { Link as RouterLink, useNavigate } from "react-router-dom";
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
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider, db } from "../../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";

const MotionButton = (props) => (
  <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
    <Button {...props} />
  </motion.div>
);

const navItems = [
  { text: "Home", path: "/", icon: <HomeIcon /> },
  { text: "About Us", path: "/about", icon: <AboutIcon /> },
  { text: "Brands", path: "/brands", icon: <BrandsIcon /> },
  { text: "Blog", path: "/blogs", icon: <BlogIcon /> },
  { text: "Contact", path: "/contact", icon: <ContactIcon /> },
  { text: "FAQs", path: "/faq", icon: <FaqIcon /> },
];

const Header = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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
      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          lastLogin: new Date(),
        },
        { merge: true }
      );
      navigate("/dashboard/register-brand");
    } catch (error) {
      console.error("Google Sign-In Failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      handleCloseUserMenu();
      navigate("/");
    } catch (error) {
      console.error("Logout Failed:", error);
    }
  };

  const drawerContent = (
    <Box
      sx={{ width: 250, py: 2 }}
      role="presentation"
      onClick={handleDrawer(false)}
    >
      <Box sx={{ px: 2, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
        <RestaurantIcon sx={{ fontSize: 30, color: "primary.main", fontFamily: "sanchez" }} />
        <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: "sanchez", fontStyle: "italic" }}>
          iKama
        </Typography>
      </Box>
      <Divider />
      <List>
        {navItems.map(({ text, path, icon }) => (
          <ListItem key={text} disablePadding>
            <ListItemButton component={RouterLink} to={path}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      {!user && (
        <>
          <Divider sx={{ my: 1 }} />
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleSignIn}
              sx={{
                backgroundColor: "secondary.light",
                borderRadius: 2,
                mx: 2,
              }}
            >
              <ListItemIcon>
                <LoginIcon />
              </ListItemIcon>
              <ListItemText primary="Brand Sign In" />
            </ListItemButton>
          </ListItem>
        </>
      )}
    </Box>
  );

  const userMenu = (
    <Box>
      <Tooltip title="Account settings">
        <IconButton onClick={handleUserMenu} sx={{ p: 0 }}>
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
        <MenuItem
          onClick={() => {
            navigate("/dashboard");
            handleCloseUserMenu();
          }}
        >
          <ListItemIcon>
            <DashboardIcon fontSize="small" />
          </ListItemIcon>
          Dashboard
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
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
            <RestaurantIcon sx={{ fontSize: 30, color: "primary.main" }} />
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, display: { xs: "none", sm: "block" } }}
            >
              iKama
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {navItems.map(({ text, path }) => (
                <MotionButton
                  key={text}
                  component={RouterLink}
                  to={path}
                  color="inherit"
                >
                  {text}
                </MotionButton>
              ))}
            </Box>
          )}

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {user ? (
              userMenu
            ) : (
              <MotionButton
                variant="contained"
                color="primary"
                startIcon={<BrandIcon />}
                onClick={handleSignIn}
              >
                For Brands
              </MotionButton>
            )}
            {isMobile && (
              <IconButton
                edge="end"
                color="inherit"
                onClick={handleDrawer(true)}
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

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
  ListItemIcon,
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
  Restaurant as RestaurantIcon,
  ExitToApp as LogoutIcon,
  Dashboard as DashboardIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider, db } from "../../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleBrandSignIn = async () => {
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

      navigate("/brand-registration");
    } catch (error) {
      console.error("Google Sign-In Failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      handleCloseMenu();
      navigate("/");
    } catch (error) {
      console.error("Logout Failed:", error);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const navItems = [
    { text: "Home", path: "/", icon: <HomeIcon /> },
    { text: "About Us", path: "/about", icon: <AboutIcon /> },
    { text: "Brands", path: "/brands", icon: <BrandsIcon /> },
    { text: "Blog", path: "/blog", icon: <BlogIcon /> },
    { text: "Contact", path: "/contact", icon: <ContactIcon /> },
    { text: "FAQs", path: "/faq", icon: <FaqIcon /> },
  ];

  const drawer = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}>
        <RestaurantIcon sx={{ mr: 1, fontSize: 30 }} />
        <Typography variant="h6">FranchiseHub</Typography>
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem
            button
            component={RouterLink}
            to={item.path}
            key={item.text}
            sx={{
              "&:hover": {
                backgroundColor: theme.palette.primary.light,
                color: "white",
              },
            }}
          >
            <ListItemIcon sx={{ color: "inherit" }}>{item.icon}</ListItemIcon>
            <Typography variant="body1">{item.text}</Typography>
          </ListItem>
        ))}
        <Divider sx={{ my: 1 }} />
        {!user ? (
          <ListItem
            button
            onClick={handleBrandSignIn}
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: "white",
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
              },
              mt: 1,
            }}
          >
            <ListItemIcon sx={{ color: "inherit" }}>
              <BrandIcon />
            </ListItemIcon>
            <Typography variant="body1">For Brands</Typography>
          </ListItem>
        ) : (
          <>
            <ListItem
              button
              onClick={() => {
                navigate("/dashboard");
                toggleDrawer(false);
              }}
              sx={{
                "&:hover": {
                  backgroundColor: theme.palette.primary.light,
                  color: "white",
                },
                mt: 1,
              }}
            >
              <ListItemIcon sx={{ color: "inherit" }}>
                <DashboardIcon />
              </ListItemIcon>
              <Typography variant="body1">Dashboard</Typography>
            </ListItem>
            <ListItem
              button
              onClick={handleLogout}
              sx={{
                backgroundColor: theme.palette.error.main,
                color: "white",
                "&:hover": {
                  backgroundColor: theme.palette.error.dark,
                },
                mt: 1,
              }}
            >
              <ListItemIcon sx={{ color: "inherit" }}>
                <LogoutIcon />
              </ListItemIcon>
              <Typography variant="body1">Logout</Typography>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        elevation={1}
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
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
            <RestaurantIcon sx={{ mr: 1, fontSize: 30 }} />
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 700,
                letterSpacing: 1,
                fontSize: { xs: "1.1rem", sm: "1.3rem" },
              }}
            >
              FranchiseHub
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {navItems.map((item) => (
                <Button
                  key={item.text}
                  component={RouterLink}
                  to={item.path}
                  startIcon={item.icon}
                  sx={{
                    color: "white",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                >
                  {item.text}
                </Button>
              ))}

              {user ? (
                <Box sx={{ ml: 2, display: "flex", alignItems: "center" }}>
                  <Tooltip title="Dashboard">
                    <IconButton
                      color="inherit"
                      onClick={() => navigate("/dashboard")}
                      sx={{ mr: 1 }}
                    >
                      <DashboardIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Logout">
                    <IconButton
                      color="inherit"
                      onClick={handleLogout}
                      sx={{ mr: 1 }}
                    >
                      <LogoutIcon />
                    </IconButton>
                  </Tooltip>
                  <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                    <Avatar
                      alt={user.displayName || ""}
                      src={user.photoURL || ""}
                    />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleCloseMenu}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                  >
                    <MenuItem onClick={handleCloseMenu}>
                      <Typography variant="body2">
                        {user.displayName || user.email}
                      </Typography>
                    </MenuItem>
                  </Menu>
                </Box>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<BrandIcon />}
                    onClick={handleBrandSignIn}
                    sx={{
                      ml: 1,
                      fontWeight: "bold",
                      borderRadius: 2,
                      boxShadow: "0 4px 14px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    For Brands
                  </Button>
                </motion.div>
              )}
            </Box>
          )}

          {/* Mobile Navigation */}
          {isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {user && (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Tooltip title="Dashboard">
                    <IconButton
                      color="inherit"
                      onClick={() => navigate("/dashboard")}
                      sx={{ mr: 1 }}
                    >
                      <DashboardIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Logout">
                    <IconButton
                      color="inherit"
                      onClick={handleLogout}
                      sx={{ mr: 1 }}
                    >
                      <LogoutIcon />
                    </IconButton>
                  </Tooltip>
                  <IconButton onClick={handleMenuOpen} sx={{ p: 0, mr: 1 }}>
                    <Avatar
                      alt={user.displayName || ""}
                      src={user.photoURL || ""}
                    />
                  </IconButton>
                </Box>
              )}
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
          },
        }}
      >
        {drawer}
      </Drawer>

      {isMobile && user && (
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem onClick={handleCloseMenu}>
            <Typography variant="body2">
              {user.displayName || user.email}
            </Typography>
          </MenuItem>
        </Menu>
      )}
    </>
  );
};

export default Header;

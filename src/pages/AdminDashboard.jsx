import React, { Suspense, lazy } from 'react';
import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, Divider, CssBaseline, AppBar, ThemeProvider, createTheme, CircularProgress, useMediaQuery } from '@mui/material';
import { Routes, Route, Link as RouterLink, useLocation } from 'react-router-dom';
import { Dashboard, Store, People, Notifications as NotificationsIcon, ExitToApp, Leaderboard, BarChart, Email, Chat as ChatIcon, VideoLibrary, Info, Article } from '@mui/icons-material';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import { useDevice } from '../hooks/useDevice';

import AdminOverview from '../components/admin/AdminOverview';
import AdminBrandManagement from '../components/admin/AdminBrandManagement';
import AdminUserManagement from '../components/admin/AdminUserManagement';
import AdminNotifications from '../components/admin/AdminNotifications';
import AdminBrandDetail from '../components/admin/AdminBrandDetail';
import AdminLeadManagement from '../components/admin/AdminLeadManagement';
import AdminAnalytics from '../components/admin/AdminAnalytics';
import AdminContactMessages from '../components/admin/AdminContactMessages';
import AdminChatLeads from '../components/admin/AdminChatLeads';
import AdminTestimonialManagement from '../components/admin/AdminTestimonialManagement';
import AdminAboutUsManagement from '../components/admin/AdminAboutUsManagement';
import BlogManagement from '../components/admin/BlogManagement';

// Lazy load mobile layout
const AdminDashboardMobile = lazy(() => import('../components/admin/AdminDashboardMobile'));

const adminTheme = createTheme({
  palette: {
    primary: {
      50: "#f0f4ff", main: "#5a76a9", dark: "#3a5483", contrastText: "#ffffff",
    },
    secondary: {
      50: "#f0faf7", main: "#92baac", light: "#a5cdbf", dark: "#6c9486",
    },
    background: {
      default: "#f0f4ff", paper: "#ffffff",
    },
    text: {
      primary: "#1a325d", secondary: "#3a5483",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
});

const drawerWidth = 240;

const AdminDashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { isMobile } = useDevice();

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/');
    };

    const navItems = [
        { text: 'Overview', path: '/admin', icon: <Dashboard /> },
        { text: 'Brand Management', path: '/admin/brands', icon: <Store /> },
        { text: 'Franchise Leads', path: '/admin/leads', icon: <Leaderboard /> },
        { text: 'Chat Leads', path: '/admin/chat-leads', icon: <ChatIcon /> },
        { text: 'Contact Messages', path: '/admin/messages', icon: <Email /> },
        { text: 'Blog Management', path: '/admin/blogs', icon: <Article /> },
        { text: 'Video Testimonials', path: '/admin/testimonials', icon: <VideoLibrary /> },
        { text: 'About Us Content', path: '/admin/about-us', icon: <Info /> },
        { text: 'Analytics', path: '/admin/analytics', icon: <BarChart /> },
        { text: 'User Management', path: '/admin/users', icon: <People /> },
        { text: 'Send Notifications', path: '/admin/notifications', icon: <NotificationsIcon /> },
    ];

    // Render mobile version
    if (isMobile) {
        return (
            <ThemeProvider theme={adminTheme}>
                <Suspense fallback={
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                        <CircularProgress />
                    </Box>
                }>
                    <AdminDashboardMobile>
                        <Box sx={{ p: 2 }}>
                            <Routes>
                                <Route path="/" element={<AdminOverview />} />
                                <Route path="/brands" element={<AdminBrandManagement />} />
                                <Route path="/brands/:id" element={<AdminBrandDetail />} />
                                <Route path="/leads" element={<AdminLeadManagement />} />
                                <Route path="/chat-leads" element={<AdminChatLeads />} />
                                <Route path="/messages" element={<AdminContactMessages />} />
                                <Route path="/blogs" element={<BlogManagement />} />
                                <Route path="/testimonials" element={<AdminTestimonialManagement />} />
                                <Route path="/about-us" element={<AdminAboutUsManagement />} />
                                <Route path="/analytics" element={<AdminAnalytics />} />
                                <Route path="/users" element={<AdminUserManagement />} />
                                <Route path="/notifications" element={<AdminNotifications />} />
                            </Routes>
                        </Box>
                    </AdminDashboardMobile>
                </Suspense>
            </ThemeProvider>
        );
    }

    // Desktop version
    const drawer = (
        <div>
            <Toolbar sx={{ backgroundColor: 'primary.dark', color: 'white' }}>
                <Typography variant="h6" noWrap>Admin Panel</Typography>
            </Toolbar>
            <Divider />
            <List>
                {navItems.map((item) => (
                    <ListItemButton key={item.text} component={RouterLink} to={item.path} selected={location.pathname === item.path}>
                        <ListItemIcon sx={{color: 'white'}}>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItemButton>
                ))}
            </List>
            <Divider />
            <List>
                <ListItemButton onClick={handleLogout}>
                    <ListItemIcon sx={{color: 'white'}}><ExitToApp /></ListItemIcon>
                    <ListItemText primary="Logout" />
                </ListItemButton>
            </List>
        </div>
    );

    return (
        <ThemeProvider theme={adminTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: 'primary.dark' }}>
                    <Toolbar>
                        <Typography variant="h6" noWrap component="div">
                            ikama Admin Portal
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Drawer
                    variant="permanent"
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        [`& .MuiDrawer-paper`]: { 
                            width: drawerWidth, 
                            boxSizing: 'border-box',
                            backgroundColor: 'primary.dark',
                            color: 'white'
                        },
                    }}
                >
                    <Toolbar />
                    {drawer}
                </Drawer>
                <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: 'background.default', minHeight: '100vh' }}>
                    <Toolbar />
                    <Routes>
                        <Route path="/" element={<AdminOverview />} />
                        <Route path="brands" element={<AdminBrandManagement />} />
                        <Route path="brands/:id" element={<AdminBrandDetail />} />
                        <Route path="leads" element={<AdminLeadManagement />} />
                        <Route path="chat-leads" element={<AdminChatLeads />} />
                        <Route path="messages" element={<AdminContactMessages />} />
                        <Route path="blogs" element={<BlogManagement />} />
                        <Route path="testimonials" element={<AdminTestimonialManagement />} />
                        <Route path="about-us" element={<AdminAboutUsManagement />} />
                        <Route path="analytics" element={<AdminAnalytics />} />
                        <Route path="users" element={<AdminUserManagement />} />
                        <Route path="notifications" element={<AdminNotifications />} />
                    </Routes>
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default AdminDashboard;
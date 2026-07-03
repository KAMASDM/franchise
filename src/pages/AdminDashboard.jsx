import React, { Suspense, lazy } from 'react';
import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, Divider, CssBaseline, AppBar, CircularProgress, Badge } from '@mui/material';
import { Routes, Route, Link as RouterLink, useLocation } from 'react-router-dom';
import { Dashboard, Store, People, Notifications as NotificationsIcon, ExitToApp, Leaderboard, BarChart, Email, Chat as ChatIcon, VideoLibrary, Info, Article, Videocam, Settings, Send, History } from '@mui/icons-material';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import { useDevice } from '../hooks/useDevice';
import { useAdminBadges } from '../hooks/useAdminBadges';

// Every admin screen is lazy-loaded so opening /admin only fetches the
// shell + Overview instead of the entire admin bundle up front.
const AdminOverview = lazy(() => import('../components/admin/AdminOverview'));
const AdminBrandManagement = lazy(() => import('../components/admin/AdminBrandManagement'));
const AdminUserManagement = lazy(() => import('../components/admin/AdminUserManagement'));
const AdminNotifications = lazy(() => import('../components/admin/AdminNotifications'));
const AdminBrandDetail = lazy(() => import('../components/admin/AdminBrandDetail'));
const AdminLeadManagement = lazy(() => import('../components/admin/AdminLeadManagement'));
const AdminAnalytics = lazy(() => import('../components/admin/AdminAnalytics'));
const AdminContactMessages = lazy(() => import('../components/admin/AdminContactMessages'));
const AdminChatLeads = lazy(() => import('../components/admin/AdminChatLeads'));
const AdminTestimonialManagement = lazy(() => import('../components/admin/AdminTestimonialManagement'));
const AdminAboutUsManagement = lazy(() => import('../components/admin/AdminAboutUsManagement'));
const BlogManagement = lazy(() => import('../components/admin/BlogManagement'));
const DemoVideoManagement = lazy(() => import('../components/admin/DemoVideoManagement'));
const EmailTester = lazy(() => import('../components/admin/EmailTester'));
const EmailJSChecker = lazy(() => import('../components/admin/EmailJSChecker'));
const EngagementEmailManager = lazy(() => import('../components/admin/EngagementEmailManager'));
const AdminActivityLog = lazy(() => import('../components/admin/AdminActivityLog'));

// Lazy load mobile layout
const AdminDashboardMobile = lazy(() => import('../components/admin/AdminDashboardMobile'));

const RouteFallback = () => (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
        <CircularProgress />
    </Box>
);

const drawerWidth = 240;

const AdminDashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { isMobile } = useDevice();
    const badges = useAdminBadges();

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/');
    };

    const navItems = [
        { text: 'Overview', path: '/admin', icon: <Dashboard /> },
        { text: 'Brand Management', path: '/admin/brands', icon: <Store />, badge: badges.pendingBrands },
        { text: 'Franchise Leads', path: '/admin/leads', icon: <Leaderboard />, badge: badges.newLeads },
        { text: 'Chat Leads', path: '/admin/chat-leads', icon: <ChatIcon />, badge: badges.newChatLeads },
        { text: 'Contact Messages', path: '/admin/messages', icon: <Email />, badge: badges.newMessages },
        { text: 'Blog Management', path: '/admin/blogs', icon: <Article /> },
        { text: 'Video Testimonials', path: '/admin/testimonials', icon: <VideoLibrary /> },
        { text: 'Demo Video', path: '/admin/demo-video', icon: <Videocam /> },
        { text: 'About Us Content', path: '/admin/about-us', icon: <Info /> },
        { text: 'Engagement Emails', path: '/admin/engagement-emails', icon: <Send /> },
        { text: 'Email Tester', path: '/admin/email-tester', icon: <Email /> },
        { text: 'Email Config Check', path: '/admin/email-config', icon: <Settings /> },
        { text: 'Analytics', path: '/admin/analytics', icon: <BarChart /> },
        { text: 'User Management', path: '/admin/users', icon: <People /> },
        { text: 'Send Notifications', path: '/admin/notifications', icon: <NotificationsIcon /> },
        { text: 'Activity Log', path: '/admin/activity', icon: <History /> },
    ];

    // Content routes — defined once, shared by mobile and desktop layouts
    const adminRoutes = (
        <Suspense fallback={<RouteFallback />}>
        <Routes>
            <Route path="/" element={<AdminOverview />} />
            <Route path="brands" element={<AdminBrandManagement />} />
            <Route path="brands/:id" element={<AdminBrandDetail />} />
            <Route path="leads" element={<AdminLeadManagement />} />
            <Route path="chat-leads" element={<AdminChatLeads />} />
            <Route path="messages" element={<AdminContactMessages />} />
            <Route path="blogs" element={<BlogManagement />} />
            <Route path="testimonials" element={<AdminTestimonialManagement />} />
            <Route path="demo-video" element={<DemoVideoManagement />} />
            <Route path="about-us" element={<AdminAboutUsManagement />} />
            <Route path="engagement-emails" element={<EngagementEmailManager />} />
            <Route path="email-tester" element={<EmailTester />} />
            <Route path="email-config" element={<EmailJSChecker />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="users" element={<AdminUserManagement />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="activity" element={<AdminActivityLog />} />
        </Routes>
        </Suspense>
    );

    // Render mobile version
    if (isMobile) {
        return (
                <Suspense fallback={
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                        <CircularProgress />
                    </Box>
                }>
                    <AdminDashboardMobile>
                        <Box sx={{ p: 2 }}>
                            {adminRoutes}
                        </Box>
                    </AdminDashboardMobile>
                </Suspense>
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
                        <ListItemIcon sx={{color: 'white'}}>
                            {item.badge ? (
                                <Badge badgeContent={item.badge} color="error" max={99}>
                                    {item.icon}
                                </Badge>
                            ) : item.icon}
                        </ListItemIcon>
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
                    {adminRoutes}
                </Box>
            </Box>
    );
};

export default AdminDashboard;
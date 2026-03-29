import React from 'react';
import { Grid, Card, CardContent, Typography, Box, CircularProgress, CardActionArea, Avatar, Stack, useTheme, alpha } from '@mui/material';
import { People, Store, PendingActions, CheckCircle, Leaderboard, Visibility, TrendingUp } from '@mui/icons-material';
import { useAdminStats } from '../../hooks/useAdminStats';
import AdminBrandManagement from './AdminBrandManagement';
import { useNavigate } from 'react-router-dom';
import { useDevice } from '../../hooks/useDevice';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);

const StatCard = ({ icon, title, value, color, linkTo, index }) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const { isMobile } = useDevice();
    
    return (
        <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            sx={{ 
                height: '100%',
                borderRadius: 3,
                boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.08)}`,
                border: `1px solid ${theme.palette.divider}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 8px 24px ${alpha(color, 0.2)}`,
                },
            }}
        >
            <CardActionArea 
                onClick={() => navigate(linkTo)} 
                sx={{ 
                    height: '100%',
                    minHeight: isMobile ? 120 : 140,
                }}
            >
                <CardContent sx={{ p: isMobile ? 2 : 3 }}>
                    <Stack spacing={2}>
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Avatar
                                sx={{
                                    bgcolor: alpha(color, 0.1),
                                    color: color,
                                    width: isMobile ? 48 : 56,
                                    height: isMobile ? 48 : 56,
                                }}
                            >
                                {icon}
                            </Avatar>
                            <TrendingUp sx={{ color: 'success.main', fontSize: 20 }} />
                        </Box>
                        <Box>
                            <Typography 
                                variant={isMobile ? "h4" : "h3"} 
                                fontWeight="700"
                                color="primary.main"
                                sx={{ mb: 0.5 }}
                            >
                                {value}
                            </Typography>
                            <Typography 
                                variant={isMobile ? "body2" : "h6"} 
                                color="text.secondary"
                                fontWeight={500}
                            >
                                {title}
                            </Typography>
                        </Box>
                    </Stack>
                </CardContent>
            </CardActionArea>
        </MotionCard>
    );
};

const AdminOverview = () => {
    const { stats, loading } = useAdminStats();
    const { isMobile, spacing } = useDevice();
    const theme = useTheme();

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <CircularProgress size={isMobile ? 40 : 60} />
            </Box>
        );
    }

    const statCards = [
        { icon: <People fontSize="large" />, title: "Total Users", value: stats.totalUsers, color: theme.palette.primary.main, linkTo: "/admin/users" },
        { icon: <Store fontSize="large" />, title: "Total Brands", value: stats.totalBrands, color: theme.palette.secondary.main, linkTo: "/admin/brands" },
        { icon: <Leaderboard fontSize="large" />, title: "Total Leads", value: stats.totalLeads, color: theme.palette.info.main, linkTo: "/admin/leads" },
        { icon: <PendingActions fontSize="large" />, title: "Pending Brands", value: stats.pendingBrands, color: theme.palette.warning.main, linkTo: "/admin/brands" },
        { icon: <CheckCircle fontSize="large" />, title: "Active Brands", value: stats.activeBrands, color: theme.palette.success.main, linkTo: "/admin/brands" },
        { icon: <Visibility fontSize="large" />, title: "Total Page Views", value: stats.totalViews, color: theme.palette.grey[700], linkTo: "/admin/analytics" },
    ];

    return (
        <Box sx={{ pb: isMobile ? 2 : 0 }}>
            {/* Header */}
            <Box sx={{ mb: { xs: 3, md: 4 } }}>
                <Typography 
                    variant={isMobile ? "h5" : "h4"} 
                    gutterBottom 
                    fontWeight="bold"
                    color="primary.main"
                >
                    Admin Overview
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Monitor your franchise portal performance
                </Typography>
            </Box>

            {/* Stats Grid */}
            <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: { xs: 3, md: 4 } }}>
                {statCards.map((stat, index) => (
                    <Grid item xs={6} sm={6} md={4} key={index}>
                        <StatCard {...stat} index={index} />
                    </Grid>
                ))}
            </Grid>
            
            {/* Brand Management Section */}
            <Box sx={{ mt: { xs: 3, md: 4 } }}>
                <AdminBrandManagement />
            </Box>
        </Box>
    );
};

export default AdminOverview;
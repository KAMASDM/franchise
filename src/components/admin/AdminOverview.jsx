import React from 'react';
import { Grid, Card, CardContent, Typography, Box, CircularProgress, CardActionArea } from '@mui/material';
import { People, Store, PendingActions, CheckCircle, Leaderboard, Visibility } from '@mui/icons-material';
import { useAdminStats } from '../../hooks/useAdminStats';
import AdminBrandManagement from './AdminBrandManagement';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ icon, title, value, color, linkTo }) => {
    const navigate = useNavigate();
    return (
        <Card sx={{ height: '100%', borderTop: `4px solid ${color}` }}>
            <CardActionArea onClick={() => navigate(linkTo)} sx={{ height: '100%' }}>
                <CardContent>
                    <Box display="flex" alignItems="center" mb={1}>
                        {icon}
                        <Typography variant="h6" ml={1} color="text.secondary">{title}</Typography>
                    </Box>
                    <Typography variant="h3" fontWeight="bold">{value}</Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

const AdminOverview = () => {
    const { stats, loading } = useAdminStats();

    if (loading) return <CircularProgress />;

    return (
        <Box>
            <Typography variant="h4" gutterBottom fontWeight="bold">Admin Overview</Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={4}><StatCard icon={<People color="primary"/>} title="Total Users" value={stats.totalUsers} color="#5a76a9" linkTo="/admin/users" /></Grid>
                <Grid item xs={12} sm={6} md={4}><StatCard icon={<Store color="secondary"/>} title="Total Brands" value={stats.totalBrands} color="#92baac" linkTo="/admin/brands" /></Grid>
                <Grid item xs={12} sm={6} md={4}><StatCard icon={<Leaderboard color="info"/>} title="Total Leads" value={stats.totalLeads} color="#2196f3" linkTo="/admin/brands" /></Grid>
                <Grid item xs={12} sm={6} md={4}><StatCard icon={<PendingActions color="warning"/>} title="Pending Brands" value={stats.pendingBrands} color="#ffa726" linkTo="/admin/brands" /></Grid>
                <Grid item xs={12} sm={6} md={4}><StatCard icon={<CheckCircle color="success"/>} title="Active Brands" value={stats.activeBrands} color="#66bb6a" linkTo="/admin/brands" /></Grid>
                <Grid item xs={12} sm={6} md={4}><StatCard icon={<Visibility color="action"/>} title="Total Page Views" value={stats.totalViews} color="#78909c" linkTo="/admin/brands" /></Grid>
            </Grid>
            
            {/* Embed the brand management component directly here */}
            <AdminBrandManagement />
        </Box>
    );
};

export default AdminOverview;
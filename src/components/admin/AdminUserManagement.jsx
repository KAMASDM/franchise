import React, { useState, useEffect, useMemo } from 'react';
import { useAllUsers } from '../../hooks/useAllUsers';
import { db } from '../../firebase/firebase';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Avatar, CircularProgress, Button, Chip, Alert,
    Card, CardHeader, CardContent, Stack, alpha, useTheme, TextField,
    InputAdornment, TablePagination, Snackbar, Tooltip,
} from '@mui/material';
import { format } from 'date-fns';
import { AdminPanelSettings, Person, AddCircle, Email, CalendarToday, Search, PersonRemove } from '@mui/icons-material';
import { useDevice } from '../../hooks/useDevice';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);

const AdminUserManagement = () => {
    const { users, loading: usersLoading, error: usersError } = useAllUsers();
    const [userRoles, setUserRoles] = useState({});
    const [loadingRoles, setLoadingRoles] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const { isMobile } = useDevice();
    const theme = useTheme();

    // Parallel role fetch — no N+1 serial loop
    useEffect(() => {
        if (usersLoading || usersError || users.length === 0) {
            if (!usersLoading) setLoadingRoles(false);
            return;
        }
        setLoadingRoles(true);
        Promise.all(
            users.map(user =>
                getDoc(doc(db, 'admins', user.id))
                    .then(snap => [user.id, snap.exists() ? 'Admin' : 'User'])
                    .catch(() => [user.id, 'User'])
            )
        ).then(entries => {
            setUserRoles(Object.fromEntries(entries));
            setLoadingRoles(false);
        });
    }, [users, usersLoading, usersError]);

    const handlePromote = async (userId) => {
        try {
            // Use merge:true so we never overwrite any existing fields
            await setDoc(doc(db, 'admins', userId), { isAdmin: true }, { merge: true });
            setUserRoles(prev => ({ ...prev, [userId]: 'Admin' }));
            setSnackbar({ open: true, message: 'User promoted to Admin.', severity: 'success' });
        } catch (error) {
            console.error('Error promoting user:', error);
            setSnackbar({ open: true, message: 'Failed to promote user.', severity: 'error' });
        }
    };

    const handleDemote = async (userId) => {
        try {
            await deleteDoc(doc(db, 'admins', userId));
            setUserRoles(prev => ({ ...prev, [userId]: 'User' }));
            setSnackbar({ open: true, message: 'Admin role removed.', severity: 'success' });
        } catch (error) {
            console.error('Error demoting user:', error);
            setSnackbar({ open: true, message: 'Failed to remove admin role.', severity: 'error' });
        }
    };

    const filteredUsers = useMemo(() => {
        const q = searchQuery.toLowerCase();
        if (!q) return users;
        return users.filter(u =>
            (u.displayName || '').toLowerCase().includes(q) ||
            (u.email || '').toLowerCase().includes(q)
        );
    }, [users, searchQuery]);

    const pagedUsers = useMemo(
        () => filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [filteredUsers, page, rowsPerPage]
    );

    if (usersLoading || loadingRoles) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <CircularProgress size={isMobile ? 40 : 60} />
            </Box>
        );
    }

    if (usersError) {
        return (
            <Box>
                <Typography variant={isMobile ? "h5" : "h4"} gutterBottom sx={{ fontWeight: 'bold' }}>
                    User Management
                </Typography>
                <Alert severity="error" sx={{ mt: 2 }}>
                    <Typography variant="h6">Unable to load users</Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        {usersError.includes('Missing or insufficient permissions')
                            ? 'You do not have permission to view the users list. Please check Firestore security rules.'
                            : `Error: ${usersError}`}
                    </Typography>
                </Alert>
            </Box>
        );
    }

    const formatLastLogin = (lastLogin) => {
        if (!lastLogin) return 'N/A';
        try {
            const date = lastLogin?.toDate ? lastLogin.toDate() : new Date(lastLogin);
            return format(date, 'PPP p');
        } catch {
            return 'N/A';
        }
    };

    // Mobile Card View Component
    const UserMobileCard = ({ user, index }) => (
        <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            sx={{
                mb: 2, borderRadius: 3,
                boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.08)}`,
                border: `1px solid ${theme.palette.divider}`,
            }}
        >
            <CardContent sx={{ p: 2 }}>
                <Stack spacing={2}>
                    <Box display="flex" alignItems="center" gap={1.5}>
                        <Avatar
                            src={user.photoURL}
                            sx={{ width: 56, height: 56, bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }}
                        >
                            {user.displayName?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                        </Avatar>
                        <Box flex={1}>
                            <Typography variant="subtitle1" fontWeight={600}>
                                {user.displayName || 'No name'}
                            </Typography>
                            <Stack direction="row" spacing={0.5} alignItems="center">
                                <Email sx={{ fontSize: 14, color: 'text.secondary' }} />
                                <Typography variant="caption" color="text.secondary">{user.email}</Typography>
                            </Stack>
                        </Box>
                    </Box>

                    <Chip
                        icon={userRoles[user.id] === 'Admin' ? <AdminPanelSettings /> : <Person />}
                        label={userRoles[user.id] || 'User'}
                        color={userRoles[user.id] === 'Admin' ? 'secondary' : 'default'}
                        size="small"
                        sx={{ fontWeight: 600, alignSelf: 'flex-start' }}
                    />

                    <Stack direction="row" spacing={0.5} alignItems="center">
                        <CalendarToday sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                            Last login: {formatLastLogin(user.lastLogin)}
                        </Typography>
                    </Stack>

                    {userRoles[user.id] !== 'Admin' ? (
                        <Button variant="contained" size="small" onClick={() => handlePromote(user.id)} fullWidth sx={{ minHeight: 44 }}>
                            Promote to Admin
                        </Button>
                    ) : (
                        <Button variant="outlined" color="warning" size="small" startIcon={<PersonRemove />} onClick={() => handleDemote(user.id)} fullWidth sx={{ minHeight: 44 }}>
                            Remove Admin
                        </Button>
                    )}
                </Stack>
            </CardContent>
        </MotionCard>
    );

    return (
        <Box>
            <Typography variant={isMobile ? "h5" : "h4"} gutterBottom sx={{ fontWeight: 'bold' }}>
                User Management
            </Typography>

            <Card sx={{ mb: 3, backgroundColor: alpha(theme.palette.primary.main, 0.05), borderRadius: 3 }}>
                <CardHeader
                    avatar={<Avatar sx={{ bgcolor: 'primary.main' }}><AddCircle /></Avatar>}
                    title="How to Add a New User"
                    titleTypographyProps={{ fontWeight: 'bold', variant: isMobile ? 'subtitle1' : 'h6' }}
                />
                <CardContent>
                    <Typography variant={isMobile ? "body2" : "body1"}>
                        New users register through the app. To manually create or delete users, use the Firebase Authentication console.
                    </Typography>
                    <Button
                        variant="contained"
                        sx={{ mt: 2, minHeight: 44 }}
                        href="https://console.firebase.google.com/project/franchise-2d12e/authentication/users"
                        target="_blank"
                        rel="noopener noreferrer"
                        fullWidth={isMobile}
                    >
                        Go to Firebase Console
                    </Button>
                </CardContent>
            </Card>

            {/* Search */}
            <TextField
                fullWidth
                placeholder="Search by name or email…"
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setPage(0); }}
                InputProps={{
                    startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
                }}
                sx={{ mb: 2 }}
                size="small"
            />

            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
            </Typography>

            {isMobile ? (
                <Box>
                    {pagedUsers.map((user, index) => (
                        <UserMobileCard key={user.id} user={user} index={index} />
                    ))}
                </Box>
            ) : (
                <TableContainer component={Paper} elevation={3}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'primary.light' }}>
                                <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Last Login</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pagedUsers.map((user) => (
                                <TableRow key={user.id} hover>
                                    <TableCell>
                                        <Box display="flex" alignItems="center">
                                            <Avatar src={user.photoURL} sx={{ mr: 2 }}>
                                                {user.displayName?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                                            </Avatar>
                                            <Typography>{user.displayName || '—'}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Chip
                                            icon={userRoles[user.id] === 'Admin' ? <AdminPanelSettings /> : <Person />}
                                            label={userRoles[user.id] || 'User'}
                                            color={userRoles[user.id] === 'Admin' ? 'secondary' : 'default'}
                                        />
                                    </TableCell>
                                    <TableCell>{formatLastLogin(user.lastLogin)}</TableCell>
                                    <TableCell>
                                        {userRoles[user.id] !== 'Admin' ? (
                                            <Button variant="contained" size="small" onClick={() => handlePromote(user.id)}>
                                                Promote to Admin
                                            </Button>
                                        ) : (
                                            <Tooltip title="Remove admin privileges">
                                                <Button variant="outlined" color="warning" size="small" startIcon={<PersonRemove />} onClick={() => handleDemote(user.id)}>
                                                    Remove Admin
                                                </Button>
                                            </Tooltip>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        component="div"
                        count={filteredUsers.length}
                        page={page}
                        onPageChange={(_, newPage) => setPage(newPage)}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={e => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
                        rowsPerPageOptions={[10, 25, 50]}
                    />
                </TableContainer>
            )}

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar(s => ({ ...s, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={() => setSnackbar(s => ({ ...s, open: false }))} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AdminUserManagement;
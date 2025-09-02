import React, { useState, useEffect } from 'react';
import { useAllUsers } from '../../hooks/useAllUsers';
import { db } from '../../firebase/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, CircularProgress, Button, Chip, Alert, Card, CardHeader, CardContent } from '@mui/material';
import { format } from 'date-fns';
import { AdminPanelSettings, Person, AddCircle } from '@mui/icons-material';

const AdminUserManagement = () => {
    const { users, loading: usersLoading } = useAllUsers();
    const [userRoles, setUserRoles] = useState({});
    const [loadingRoles, setLoadingRoles] = useState(true);

    useEffect(() => {
        const fetchRoles = async () => {
            if (!usersLoading) {
                const roles = {};
                for (const user of users) {
                    const adminRef = doc(db, 'admins', user.id);
                    const adminDoc = await getDoc(adminRef);
                    roles[user.id] = adminDoc.exists() ? 'Admin' : 'User';
                }
                setUserRoles(roles);
                setLoadingRoles(false);
            }
        };
        fetchRoles();
    }, [users, usersLoading]);

    const handlePromote = async (userId) => {
        const adminRef = doc(db, 'admins', userId);
        await setDoc(adminRef, { isAdmin: true });
        setUserRoles(prev => ({ ...prev, [userId]: 'Admin' }));
    };

    if (usersLoading || loadingRoles) return <CircularProgress />;

    return (
        <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>User Management</Typography>
            
            {/* New section explaining how to add users securely */}
            <Card sx={{mb: 3, backgroundColor: 'primary.light'}}>
                <CardHeader 
                    avatar={<AddCircle />}
                    title="How to Add a New User"
                    titleTypographyProps={{fontWeight: 'bold'}}
                />
                <CardContent>
                    <Typography variant="body1">
                        For security reasons, new users cannot be created directly from this dashboard. All user creation and password management must be handled through the official Firebase Authentication console.
                    </Typography>
                    <Button
                        variant="contained"
                        sx={{mt: 2}}
                        href="https://console.firebase.google.com/project/_/authentication/users"
                        target="_blank"
                    >
                        Go to Firebase Console
                    </Button>
                </CardContent>
            </Card>

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
                        {users.map((user) => (
                            <TableRow key={user.id} hover>
                                <TableCell>
                                    <Box display="flex" alignItems="center">
                                        <Avatar src={user.photoURL} sx={{ mr: 2 }} />
                                        <Typography>{user.displayName}</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Chip 
                                        icon={userRoles[user.id] === 'Admin' ? <AdminPanelSettings /> : <Person />}
                                        label={userRoles[user.id]}
                                        color={userRoles[user.id] === 'Admin' ? 'secondary' : 'default'}
                                    />
                                </TableCell>
                                <TableCell>{user.lastLogin ? format(user.lastLogin.toDate(), 'PPP p') : 'N/A'}</TableCell>
                                <TableCell>
                                    {userRoles[user.id] !== 'Admin' && (
                                        <Button
                                            variant="contained"
                                            size="small"
                                            onClick={() => handlePromote(user.id)}
                                        >
                                            Promote to Admin
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default AdminUserManagement;
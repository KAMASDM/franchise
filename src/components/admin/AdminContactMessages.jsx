import React, { useState, useMemo } from 'react';
import { useContactSubmissions } from '../../hooks/useContactSubmissions';
import { db } from '../../firebase/firebase';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  CircularProgress, Alert, Link as MuiLink, TextField, InputAdornment, IconButton,
  Select, MenuItem, FormControl
} from '@mui/material';
import { format } from 'date-fns';
import { Search, Delete } from '@mui/icons-material';

const statusOptions = ['New', 'Contacted', 'Resolved', 'Spam'];

const AdminContactMessages = () => {
    const { submissions, loading, error, setSubmissions } = useContactSubmissions();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredSubmissions = useMemo(() => {
        return submissions.filter(submission => {
            const searchLower = searchTerm.toLowerCase();
            return (
                submission.name?.toLowerCase().includes(searchLower) ||
                submission.email?.toLowerCase().includes(searchLower) ||
                submission.message?.toLowerCase().includes(searchLower)
            );
        });
    }, [submissions, searchTerm]);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this message?")) {
            try {
                await deleteDoc(doc(db, "contactUs", id));
                setSubmissions(prev => prev.filter(sub => sub.id !== id));
            } catch (err) {
                console.error("Error deleting document: ", err);
                alert("Failed to delete message.");
            }
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await updateDoc(doc(db, "contactUs", id), { status: newStatus });
            setSubmissions(prev => 
                prev.map(sub => 
                    sub.id === id ? { ...sub, status: newStatus } : sub
                )
            );
        } catch (err) {
            console.error("Error updating status: ", err);
            alert("Failed to update status.");
        }
    };

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>Contact Form Submissions</Typography>
            
            <Paper sx={{ p: 2, mb: 3 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search by name, email, or message..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
                    }}
                />
            </Paper>

            <TableContainer component={Paper} elevation={3}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'primary.light' }}>
                            <TableCell sx={{ fontWeight: 'bold' }}>Received</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Contact</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Message</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredSubmissions.map((submission) => (
                            <TableRow key={submission.id} hover>
                                <TableCell sx={{whiteSpace: 'nowrap'}}>{submission.timestamp ? format(submission.timestamp, 'PPp') : 'N/A'}</TableCell>
                                <TableCell>{submission.name}</TableCell>
                                <TableCell>
                                    <Box>
                                        <MuiLink href={`mailto:${submission.email}`}>{submission.email}</MuiLink>
                                        <br/>
                                        <MuiLink href={`tel:${submission.phone}`}>{submission.phone}</MuiLink>
                                    </Box>
                                </TableCell>
                                <TableCell sx={{maxWidth: '400px'}}>{submission.message}</TableCell>
                                <TableCell>
                                    <FormControl size="small" fullWidth>
                                        <Select
                                            value={submission.status || 'New'}
                                            onChange={(e) => handleStatusChange(submission.id, e.target.value)}
                                        >
                                            {statusOptions.map(option => (
                                                <MenuItem key={option} value={option}>{option}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </TableCell>
                                <TableCell>
                                    <IconButton color="error" onClick={() => handleDelete(submission.id)}>
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default AdminContactMessages;
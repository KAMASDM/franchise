import React, { useState, useMemo } from 'react';
import { useContactSubmissions } from '../../hooks/useContactSubmissions';
import { db } from '../../firebase/firebase';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import logger from '../../utils/logger';
import { exportToCSV, formatDataForExport } from '../../utils/exportUtils';
import { useSimpleSearch } from '../../hooks/useSimpleSearch';
import { useArrayPagination } from '../../hooks/usePagination';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  CircularProgress, Alert, Link as MuiLink, TextField, InputAdornment, IconButton,
  Select, MenuItem, FormControl, Button, Pagination
} from '@mui/material';
import { format } from 'date-fns';
import { Search, Delete, Download, Clear } from '@mui/icons-material';

const statusOptions = ['New', 'Contacted', 'Resolved', 'Spam'];

const AdminContactMessages = () => {
    const { submissions, loading, error, setSubmissions } = useContactSubmissions();
    const { searchTerm, setSearchTerm, debouncedSearchTerm } = useSimpleSearch('', 300);

    const filteredSubmissions = useMemo(() => {
        return submissions.filter(submission => {
            const searchLower = debouncedSearchTerm.toLowerCase();
            return (
                !debouncedSearchTerm ||
                submission.name?.toLowerCase().includes(searchLower) ||
                submission.email?.toLowerCase().includes(searchLower) ||
                submission.message?.toLowerCase().includes(searchLower)
            );
        });
    }, [submissions, debouncedSearchTerm]);

    // Pagination
    const { paginatedData, currentPage, totalPages, goToPage } = useArrayPagination(filteredSubmissions, 10);
    const safePaginatedData = Array.isArray(paginatedData) ? paginatedData : [];

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this message?")) {
            try {
                await deleteDoc(doc(db, "contactUs", id));
                setSubmissions(prev => prev.filter(sub => sub.id !== id));
            } catch (err) {
                logger.error("Error deleting document: ", err);
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
            logger.error("Error updating status: ", err);
            alert("Failed to update status.");
        }
    };

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    const handleExport = () => {
        const formattedData = formatDataForExport(filteredSubmissions);
        exportToCSV(formattedData, 'contact-messages');
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Contact Form Submissions</Typography>
                <Button
                    variant="contained"
                    startIcon={<Download />}
                    onClick={handleExport}
                    disabled={filteredSubmissions.length === 0}
                >
                    Export Messages ({filteredSubmissions.length})
                </Button>
            </Box>
            
            <Paper sx={{ p: 2, mb: 3 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search by name, email, or message..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
                        endAdornment: searchTerm && <InputAdornment position="end"><IconButton onClick={() => setSearchTerm("")} aria-label="Clear search"><Clear /></IconButton></InputAdornment>
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
                        {safePaginatedData.length > 0 ? (
                            safePaginatedData.map((submission) => (
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
                                    <IconButton color="error" onClick={() => handleDelete(submission.id)} aria-label="Delete contact message">
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                    <Typography variant="body1" color="text.secondary">
                                        {loading ? 'Loading messages...' : 
                                         searchTerm ? 'No messages match your search criteria.' : 
                                         submissions.length === 0 ? 'No contact messages available.' :
                                         'No data to display.'}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            
            {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Pagination 
                        count={totalPages} 
                        page={currentPage} 
                        onChange={(e, page) => goToPage(page)}
                        color="primary"
                        showFirstButton
                        showLastButton
                    />
                </Box>
            )}
        </Box>
    );
};

export default AdminContactMessages;
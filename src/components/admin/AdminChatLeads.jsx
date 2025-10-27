import React, { useState, useMemo } from 'react';
import { useChatLeads } from '../../hooks/useChatLeads';
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

const statusOptions = ['New', 'Contacted', 'Follow-up', 'Qualified', 'Unqualified'];

const AdminChatLeads = () => {
    const { leads, loading, error, setLeads } = useChatLeads();
    const { searchTerm, setSearchTerm, debouncedSearchTerm } = useSimpleSearch('', 300);

    const filteredLeads = useMemo(() => {
        return leads.filter(lead => {
            const searchLower = debouncedSearchTerm.toLowerCase();
            return (
                !debouncedSearchTerm ||
                lead.name?.toLowerCase().includes(searchLower) ||
                lead.email?.toLowerCase().includes(searchLower) ||
                lead.location?.toLowerCase().includes(searchLower)
            );
        });
    }, [leads, debouncedSearchTerm]);

    // Pagination
    const { paginatedData, currentPage, totalPages, goToPage } = useArrayPagination(filteredLeads, 10);
    const safePaginatedData = Array.isArray(paginatedData) ? paginatedData : [];

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this lead?")) {
            try {
                await deleteDoc(doc(db, "chatLeads", id));
                setLeads(prev => prev.filter(lead => lead.id !== id));
            } catch (err) {
                logger.error("Error deleting chat lead: ", err);
                alert("Failed to delete lead.");
            }
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await updateDoc(doc(db, "chatLeads", id), { status: newStatus });
            setLeads(prev => 
                prev.map(lead => 
                    lead.id === id ? { ...lead, status: newStatus } : lead
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
        const formattedData = formatDataForExport(filteredLeads);
        exportToCSV(formattedData, 'chat-leads');
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Chat Leads</Typography>
                <Button
                    variant="contained"
                    startIcon={<Download />}
                    onClick={handleExport}
                    disabled={filteredLeads.length === 0}
                >
                    Export Chat Leads ({filteredLeads.length})
                </Button>
            </Box>
            
            <Paper sx={{ p: 2, mb: 3 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search by name, email, or location..."
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
                            <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Contact</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Preferences</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {safePaginatedData.length > 0 ? (
                            safePaginatedData.map((lead) => (
                                <TableRow key={lead.id} hover>
                                    <TableCell sx={{whiteSpace: 'nowrap'}}>{lead.createdAt ? format(lead.createdAt, 'PPp') : 'N/A'}</TableCell>
                                    <TableCell>{lead.name}</TableCell>
                                    <TableCell>
                                        <Box>
                                            <MuiLink href={`mailto:${lead.email}`}>{lead.email}</MuiLink>
                                            <br/>
                                            <MuiLink href={`tel:${lead.phone}`}>{lead.phone}</MuiLink>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2"><strong>Budget:</strong> {lead.budget}</Typography>
                                        <Typography variant="body2"><strong>Location:</strong> {lead.location}</Typography>
                                        <Typography variant="body2"><strong>Language:</strong> {lead.language}</Typography>
                                    </TableCell>
                                    <TableCell>
                                    <FormControl size="small" fullWidth>
                                        <Select
                                            value={lead.status || 'New'}
                                            onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                                        >
                                            {statusOptions.map(option => (
                                                <MenuItem key={option} value={option}>{option}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </TableCell>
                                <TableCell>
                                    <IconButton color="error" onClick={() => handleDelete(lead.id)} aria-label="Delete chat lead">
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                    <Typography variant="body1" color="text.secondary">
                                        {loading ? 'Loading chat leads...' : 
                                         searchTerm ? 'No leads match your search criteria.' : 
                                         leads.length === 0 ? 'No chat leads available.' :
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

export default AdminChatLeads;
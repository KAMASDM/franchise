import React, { useState, useMemo } from 'react';
import { useChatLeads } from '../../hooks/useChatLeads';
import { db } from '../../firebase/firebase';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  CircularProgress, Alert, Link as MuiLink, TextField, InputAdornment, IconButton,
  Select, MenuItem, FormControl
} from '@mui/material';
import { format } from 'date-fns';
import { Search, Delete } from '@mui/icons-material';

const statusOptions = ['New', 'Contacted', 'Follow-up', 'Qualified', 'Unqualified'];

const AdminChatLeads = () => {
    const { leads, loading, error, setLeads } = useChatLeads();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredLeads = useMemo(() => {
        return leads.filter(lead => {
            const searchLower = searchTerm.toLowerCase();
            return (
                lead.name?.toLowerCase().includes(searchLower) ||
                lead.email?.toLowerCase().includes(searchLower) ||
                lead.location?.toLowerCase().includes(searchLower)
            );
        });
    }, [leads, searchTerm]);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this lead?")) {
            try {
                await deleteDoc(doc(db, "chatLeads", id));
                setLeads(prev => prev.filter(lead => lead.id !== id));
            } catch (err) {
                console.error("Error deleting chat lead: ", err);
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
            console.error("Error updating status: ", err);
            alert("Failed to update status.");
        }
    };

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>Chatbot Leads</Typography>
            
            <Paper sx={{ p: 2, mb: 3 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search by name, email, or location..."
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
                            <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Contact</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Preferences</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredLeads.map((lead) => (
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
                                    <IconButton color="error" onClick={() => handleDelete(lead.id)}>
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

export default AdminChatLeads;
import React, { useState, useMemo } from 'react';
import { useAllLeads } from '../../hooks/useAllLeads';
import { useAllBrands } from '../../hooks/useAllBrands';
import { db } from '../../firebase/firebase';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Avatar, CircularProgress, Alert, Link as MuiLink, TextField, InputAdornment, IconButton,
  MenuItem, Select, FormControl, InputLabel, Button, Grid,
} from '@mui/material';
import { Search, Clear, FilterList, Phone, Email, Delete } from '@mui/icons-material';
import { format } from 'date-fns';

const statusOptions = ['New', 'Pending', 'Contacted', 'Converted', 'Rejected'];

const AdminLeadManagement = () => {
    const { leads, loading: leadsLoading, error: leadsError, setLeads } = useAllLeads();
    const { brands, loading: brandsLoading, error: brandsError } = useAllBrands();

    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({
        status: "",
        brandId: "",
    });

    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({ ...prev, [filterName]: value }));
    };

    const clearFilters = () => {
        setFilters({ status: "", brandId: "" });
        setSearchTerm("");
    };

    const filteredLeads = useMemo(() => {
        return leads
            .filter(lead => {
                const searchLower = searchTerm.toLowerCase();
                const matchesSearch =
                    lead.firstName?.toLowerCase().includes(searchLower) ||
                    lead.lastName?.toLowerCase().includes(searchLower) ||
                    lead.email?.toLowerCase().includes(searchLower) ||
                    lead.brandName?.toLowerCase().includes(searchLower);

                const matchesFilters =
                    (!filters.status || lead.status === filters.status) &&
                    (!filters.brandId || lead.brandId === filters.brandId);

                return matchesSearch && matchesFilters;
            });
    }, [leads, searchTerm, filters]);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this lead?")) {
            try {
                await deleteDoc(doc(db, "brandfranchiseInquiry", id));
                setLeads(prev => prev.filter(lead => lead.id !== id));
            } catch (err) {
                console.error("Error deleting lead: ", err);
                alert("Failed to delete lead.");
            }
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await updateDoc(doc(db, "brandfranchiseInquiry", id), { status: newStatus });
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


    if (leadsLoading || brandsLoading) return <CircularProgress />;
    if (leadsError || brandsError) return <Alert severity="error">{leadsError || brandsError}</Alert>;

    return (
        <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>Lead Management</Typography>
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Search by name, email, brand..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
                                endAdornment: searchTerm && <IconButton onClick={() => setSearchTerm("")}><Clear /></IconButton>
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth>
                            <InputLabel>Filter by Brand</InputLabel>
                            <Select
                                value={filters.brandId}
                                onChange={(e) => handleFilterChange("brandId", e.target.value)}
                                label="Filter by Brand"
                            >
                                <MenuItem value="">All Brands</MenuItem>
                                {brands.map(brand => (
                                    <MenuItem key={brand.id} value={brand.id}>{brand.brandName}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth>
                            <InputLabel>Filter by Status</InputLabel>
                            <Select
                                value={filters.status}
                                onChange={(e) => handleFilterChange("status", e.target.value)}
                                label="Filter by Status"
                            >
                                <MenuItem value="">All Statuses</MenuItem>
                                {statusOptions.map(status => (
                                    <MenuItem key={status} value={status}>{status}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<FilterList />}
                            onClick={clearFilters}
                            sx={{ height: '56px' }}
                        >
                            Clear
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            <Typography variant="subtitle1" color="text.secondary" sx={{mb: 2}}>
                Displaying {filteredLeads.length} of {leads.length} total leads.
            </Typography>

            <TableContainer component={Paper} elevation={3}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'primary.light' }}>
                            <TableCell sx={{ fontWeight: 'bold' }}>Lead Name</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Contact</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Brand</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Date Received</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredLeads.map((lead) => (
                            <TableRow key={lead.id} hover>
                                <TableCell>{lead.firstName} {lead.lastName}</TableCell>
                                <TableCell>
                                    <Box>
                                        <Box display="flex" alignItems="center">
                                            <Email fontSize="small" sx={{ mr: 1 }} />
                                            <MuiLink href={`mailto:${lead.email}`}>{lead.email}</MuiLink>
                                        </Box>
                                        {lead.phone &&
                                            <Box display="flex" alignItems="center">
                                                <Phone fontSize="small" sx={{ mr: 1 }} />
                                                <MuiLink href={`tel:${lead.phone}`}>{lead.phone}</MuiLink>
                                            </Box>
                                        }
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box display="flex" alignItems="center">
                                        <Avatar src={lead.brandImage} sx={{ width: 30, height: 30, mr: 1.5 }}/>
                                        {lead.brandName}
                                    </Box>
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
                                <TableCell>{lead.createdAt ? format(lead.createdAt, 'PPp') : 'N/A'}</TableCell>
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

export default AdminLeadManagement;
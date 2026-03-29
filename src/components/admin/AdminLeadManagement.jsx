import React, { useState, useMemo } from 'react';
import { useAllLeads } from '../../hooks/useAllLeads';
import { useAllBrands } from '../../hooks/useAllBrands';
import { db } from '../../firebase/firebase';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import logger from '../../utils/logger';
import { exportLeads } from '../../utils/exportUtils';
import { useSimpleSearch } from '../../hooks/useSimpleSearch';
import { useArrayPagination } from '../../hooks/usePagination';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Avatar, CircularProgress, Alert, Link as MuiLink, TextField, InputAdornment, IconButton,
  MenuItem, Select, FormControl, InputLabel, Button, Grid, Pagination, Card, CardContent, Stack, Chip, alpha, useTheme,
} from '@mui/material';
import { Search, Clear, FilterList, Phone, Email, Delete, Download, Person, Business, CalendarToday, CheckCircle } from '@mui/icons-material';
import { format } from 'date-fns';
import { useDevice } from '../../hooks/useDevice';
import { motion } from 'framer-motion';

const statusOptions = ['New', 'Pending', 'Contacted', 'Converted', 'Rejected'];

const AdminLeadManagement = () => {
    const { leads, loading: leadsLoading, error: leadsError, setLeads } = useAllLeads();
    const { brands, loading: brandsLoading, error: brandsError } = useAllBrands();

    const { searchTerm, setSearchTerm, debouncedSearchTerm } = useSimpleSearch('', 300);
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
                const searchLower = debouncedSearchTerm.toLowerCase();
                const matchesSearch =
                    !debouncedSearchTerm ||
                    lead.firstName?.toLowerCase().includes(searchLower) ||
                    lead.lastName?.toLowerCase().includes(searchLower) ||
                    lead.email?.toLowerCase().includes(searchLower) ||
                    lead.brandName?.toLowerCase().includes(searchLower);

                const matchesFilters =
                    (!filters.status || lead.status === filters.status) &&
                    (!filters.brandId || lead.brandId === filters.brandId);

                return matchesSearch && matchesFilters;
            });
    }, [leads, debouncedSearchTerm, filters]);

    // Pagination
    const { paginatedData, currentPage, totalPages, goToPage, nextPage, prevPage } = useArrayPagination(filteredLeads, 10);
    const safePaginatedData = Array.isArray(paginatedData) ? paginatedData : [];

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this lead?")) {
            try {
                await deleteDoc(doc(db, "brandfranchiseInquiry", id));
                setLeads(prev => prev.filter(lead => lead.id !== id));
            } catch (err) {
                logger.error("Error deleting lead: ", err);
                alert("Failed to delete lead.");
            }
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            const lead = leads.find(l => l.id === id);
            const oldStatus = lead?.status || 'New';
            
            await updateDoc(doc(db, "brandfranchiseInquiry", id), { status: newStatus });
            
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


    const { isMobile } = useDevice();
    const theme = useTheme();

    if (leadsLoading || brandsLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <CircularProgress size={isMobile ? 40 : 60} />
            </Box>
        );
    }
    
    if (leadsError || brandsError) return <Alert severity="error">{leadsError || brandsError}</Alert>;

    // Mobile Card Component
    const LeadMobileCard = ({ lead, index }) => {
        const getStatusColor = (status) => {
            switch (status) {
                case 'Converted': return 'success';
                case 'Contacted': return 'info';
                case 'Pending': return 'warning';
                case 'Rejected': return 'error';
                default: return 'default';
            }
        };

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
            >
                <Card 
                    sx={{ 
                        mb: 2,
                        borderRadius: 3,
                        boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.08)}`,
                        border: `1px solid ${theme.palette.divider}`,
                    }}
                >
                    <CardContent sx={{ p: 2 }}>
                        <Stack spacing={2}>
                            {/* Name */}
                            <Box display="flex" alignItems="center" gap={1}>
                                <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }}>
                                    <Person />
                                </Avatar>
                                <Box flex={1}>
                                    <Typography variant="subtitle1" fontWeight={600}>
                                        {lead.firstName} {lead.lastName}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Contact Info */}
                            <Stack spacing={0.5}>
                                <Stack direction="row" spacing={0.5} alignItems="center">
                                    <Email sx={{ fontSize: 14, color: 'text.secondary' }} />
                                    <MuiLink href={`mailto:${lead.email}`} variant="caption" sx={{ wordBreak: 'break-all' }}>
                                        {lead.email}
                                    </MuiLink>
                                </Stack>
                                {lead.phone && (
                                    <Stack direction="row" spacing={0.5} alignItems="center">
                                        <Phone sx={{ fontSize: 14, color: 'text.secondary' }} />
                                        <MuiLink href={`tel:${lead.phone}`} variant="caption">
                                            {lead.phone}
                                        </MuiLink>
                                    </Stack>
                                )}
                            </Stack>

                            {/* Brand & Date */}
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                                <Chip 
                                    icon={<Business />}
                                    label={lead.brandName || 'N/A'}
                                    size="small"
                                    variant="outlined"
                                />
                                <Chip 
                                    icon={<CalendarToday />}
                                    label={lead.createdAt ? format(lead.createdAt instanceof Date ? lead.createdAt : lead.createdAt.toDate(), 'MMM dd, yyyy') : 'N/A'}
                                    size="small"
                                    variant="outlined"
                                />
                            </Stack>

                            {/* Status Selector */}
                            <FormControl fullWidth size="small">
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={lead.status || 'New'}
                                    onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                                    label="Status"
                                >
                                    {statusOptions.map(status => (
                                        <MenuItem key={status} value={status}>{status}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {/* Delete Button */}
                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<Delete />}
                                onClick={() => handleDelete(lead.id)}
                                fullWidth
                                sx={{ minHeight: 44 }}
                            >
                                Delete Lead
                            </Button>
                        </Stack>
                    </CardContent>
                </Card>
            </motion.div>
        );
    };

    return (
        <Box>
            <Typography 
                variant={isMobile ? "h5" : "h4"} 
                gutterBottom 
                sx={{ fontWeight: 'bold' }}
            >
                Lead Management
            </Typography>

            {/* Filters */}
            <Paper elevation={2} sx={{ p: { xs: 2, md: 3 }, mb: 3, borderRadius: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            size={isMobile ? "medium" : "small"}
                            placeholder="Search by name, email, brand..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& input': {
                                        minHeight: isMobile ? 48 : 'auto',
                                    },
                                },
                            }}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
                                endAdornment: searchTerm && (
                                    <InputAdornment position="end">
                                        <IconButton 
                                            onClick={() => setSearchTerm("")} 
                                            aria-label="Clear search"
                                            sx={{ minWidth: 44, minHeight: 44 }}
                                        >
                                            <Clear />
                                        </IconButton>
                                    </InputAdornment>
                                )
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
                            sx={{ minHeight: isMobile ? 48 : 56 }}
                        >
                            Clear
                        </Button>
                    </Grid>
                </Grid>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button
                        variant="contained"
                        startIcon={<Download />}
                        onClick={() => exportLeads(filteredLeads)}
                        disabled={filteredLeads.length === 0}
                        fullWidth={isMobile}
                        sx={{ minHeight: 44 }}
                    >
                        {isMobile ? 'Export' : `Export (${filteredLeads.length})`}
                    </Button>
                </Box>
            </Paper>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Displaying {filteredLeads.length} of {leads.length} total leads
            </Typography>

            {/* Mobile Card View / Desktop Table View */}
            {isMobile ? (
                <Box>
                    {safePaginatedData.length > 0 ? (
                        safePaginatedData.map((lead, index) => (
                            <LeadMobileCard key={lead.id} lead={lead} index={index} />
                        ))
                    ) : (
                        <Card sx={{ p: 4, textAlign: 'center' }}>
                            <Typography variant="body1" color="text.secondary">
                                {leadsLoading ? 'Loading leads...' : 
                                 searchTerm || filters.status || filters.brandId ? 'No leads match your search/filter criteria.' : 
                                 leads.length === 0 ? 'No leads available.' :
                                 'No data to display.'}
                            </Typography>
                        </Card>
                    )}
                </Box>
            ) : (
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
                            {safePaginatedData.length > 0 ? (
                                safePaginatedData.map((lead) => (
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
                                        <IconButton color="error" onClick={() => handleDelete(lead.id)} aria-label="Delete lead">
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                        <Typography variant="body1" color="text.secondary">
                                            {leadsLoading ? 'Loading leads...' : 
                                             searchTerm || filters.status || filters.brandId ? 'No leads match your search/filter criteria.' : 
                                             leads.length === 0 ? 'No leads available.' :
                                             'No data to display.'}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
            
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

export default AdminLeadManagement;
import React, { useState, useEffect, useMemo } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Chip, CircularProgress, Alert, Stack, Tooltip,
    TablePagination, Avatar, useTheme, alpha,
} from '@mui/material';
import {
    History, Store, Person, Leaderboard, Campaign, HelpOutline,
} from '@mui/icons-material';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { formatDistanceToNow, format } from 'date-fns';
import logger from '../../utils/logger';

const ACTION_META = {
    'brand.approve': { label: 'Brand approved', color: 'success' },
    'brand.deactivate': { label: 'Brand deactivated', color: 'warning' },
    'brand.delete': { label: 'Brand deleted', color: 'error' },
    'user.promote': { label: 'Admin granted', color: 'info' },
    'user.demote': { label: 'Admin revoked', color: 'warning' },
    'lead.delete': { label: 'Lead deleted', color: 'error' },
    'lead.status': { label: 'Lead status changed', color: 'default' },
    'notification.broadcast': { label: 'Broadcast sent', color: 'info' },
};

const TARGET_ICONS = {
    brand: <Store fontSize="small" />,
    user: <Person fontSize="small" />,
    lead: <Leaderboard fontSize="small" />,
    broadcast: <Campaign fontSize="small" />,
};

const FILTERS = [
    { value: '', label: 'All activity' },
    { value: 'brand.', label: 'Brands' },
    { value: 'user.', label: 'Users' },
    { value: 'lead.', label: 'Leads' },
    { value: 'notification.', label: 'Broadcasts' },
];

/**
 * Immutable admin audit trail — who did what, and when.
 * Entries are written by logAdminAction() across the admin screens.
 */
const AdminActivityLog = () => {
    const theme = useTheme();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);

    useEffect(() => {
        const load = async () => {
            try {
                const snapshot = await getDocs(
                    query(collection(db, 'auditLogs'), orderBy('timestamp', 'desc'), limit(500))
                );
                setLogs(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })));
            } catch (err) {
                logger.error('Failed to load audit logs:', err);
                setError('Failed to load the activity log.');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const filteredLogs = useMemo(
        () => (filter ? logs.filter((log) => log.action?.startsWith(filter)) : logs),
        [logs, filter]
    );

    const pagedLogs = useMemo(
        () => filteredLogs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [filteredLogs, page, rowsPerPage]
    );

    const formatWhen = (timestamp) => {
        if (!timestamp) return { relative: 'Just now', absolute: '' };
        try {
            const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
            return {
                relative: formatDistanceToNow(date, { addSuffix: true }),
                absolute: format(date, 'PPpp'),
            };
        } catch {
            return { relative: 'Unknown', absolute: '' };
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }} gutterBottom>
                    Activity Log
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Immutable record of admin actions — {logs.length} most recent entries
                </Typography>
            </Box>

            <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', useFlexGap: true }}>
                {FILTERS.map((option) => (
                    <Chip
                        key={option.label}
                        label={option.label}
                        color={filter === option.value ? 'primary' : 'default'}
                        variant={filter === option.value ? 'filled' : 'outlined'}
                        onClick={() => { setFilter(option.value); setPage(0); }}
                        sx={{ fontWeight: 600 }}
                    />
                ))}
            </Stack>

            {filteredLogs.length === 0 ? (
                <Paper sx={{ p: 6, textAlign: 'center' }}>
                    <History sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                    <Typography color="text.secondary">
                        No activity recorded yet. Admin actions will appear here as they happen.
                    </Typography>
                </Paper>
            ) : (
                <>
                    <TableContainer component={Paper} elevation={3}>
                        <Table size="small">
                            <TableHead>
                                <TableRow sx={{ bgcolor: 'primary.light' }}>
                                    <TableCell sx={{ fontWeight: 'bold' }}>When</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Admin</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Target</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Details</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {pagedLogs.map((log) => {
                                    const meta = ACTION_META[log.action] || { label: log.action, color: 'default' };
                                    const when = formatWhen(log.timestamp);
                                    return (
                                        <TableRow key={log.id} hover>
                                            <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                                <Tooltip title={when.absolute}>
                                                    <span>{when.relative}</span>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem', bgcolor: alpha(theme.palette.primary.main, 0.15), color: 'primary.main' }}>
                                                        {(log.actorEmail || '?')[0].toUpperCase()}
                                                    </Avatar>
                                                    <Typography variant="body2">{log.actorEmail || 'Unknown'}</Typography>
                                                </Stack>
                                            </TableCell>
                                            <TableCell>
                                                <Chip label={meta.label} color={meta.color} size="small" sx={{ fontWeight: 600 }} />
                                            </TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={0.75} alignItems="center">
                                                    {TARGET_ICONS[log.targetType] || <HelpOutline fontSize="small" />}
                                                    <Typography variant="body2">
                                                        {log.targetLabel || log.targetId || '—'}
                                                    </Typography>
                                                </Stack>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">
                                                    {log.details ? Object.entries(log.details).map(([key, value]) => `${key}: ${value}`).join(', ') : '—'}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        component="div"
                        count={filteredLogs.length}
                        page={page}
                        onPageChange={(e, newPage) => setPage(newPage)}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
                        rowsPerPageOptions={[25, 50, 100]}
                    />
                </>
            )}
        </Box>
    );
};

export default AdminActivityLog;

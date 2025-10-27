import React, { useState } from 'react';
import { Box, Typography, TextField, Button, CircularProgress, Alert } from '@mui/material';
import { db } from '../../firebase/firebase';
import { collection, writeBatch, getDocs, serverTimestamp } from 'firebase/firestore';
import { Send } from '@mui/icons-material';
import logger from '../../utils/logger';

const AdminNotifications = () => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState({ type: '', message: '' });

    const handleSend = async () => {
        if (!title || !message) {
            setFeedback({ type: 'error', message: 'Title and message are required.' });
            return;
        }
        setLoading(true);
        setFeedback({ type: '', message: '' });

        try {
            const usersSnapshot = await getDocs(collection(db, 'users'));
            if (usersSnapshot.empty) {
                throw new Error("No users found to send notifications to.");
            }

            const batch = writeBatch(db);
            usersSnapshot.forEach(userDoc => {
                const notificationRef = doc(collection(db, `users/${userDoc.id}/notifications`));
                batch.set(notificationRef, {
                    type: 'admin_broadcast',
                    title,
                    message,
                    read: false,
                    createdAt: serverTimestamp(),
                });
            });

            await batch.commit();
            setFeedback({ type: 'success', message: `Notification sent to ${usersSnapshot.size} users.` });
            setTitle('');
            setMessage('');
        } catch (error) {
            logger.error("Error sending notifications:", error);
            setFeedback({ type: 'error', message: 'Failed to send notifications.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>Send Broadcast Notification</Typography>
            <Box component="form" noValidate autoComplete="off">
                <TextField
                    label="Notification Title"
                    fullWidth
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Notification Message"
                    fullWidth
                    multiline
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <Button
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={20} /> : <Send />}
                    onClick={handleSend}
                    disabled={loading}
                >
                    Send to All Users
                </Button>
                {feedback.message && (
                    <Alert severity={feedback.type} sx={{ mt: 2 }}>
                        {feedback.message}
                    </Alert>
                )}
            </Box>
        </Box>
    );
};

export default AdminNotifications;
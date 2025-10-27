import React from 'react';
import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Typography,
    IconButton,
    Divider,
    Badge,
    Chip,
    Paper
} from '@mui/material';
import {
    Close as CloseIcon,
    Circle as CircleIcon,
    Chat as ChatIcon
} from '@mui/icons-material';
import { format, formatDistanceToNow } from 'date-fns';
import { useChat } from '../../hooks/useChat';

/**
 * ChatList - List of all chat conversations
 * Shows recent messages, unread counts, and online status
 */
const ChatList = ({ chatRooms, onSelectChat, onClose }) => {
    const { userStatuses } = useChat();

    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        
        try {
            const date = new Date(timestamp);
            const now = new Date();
            const diffInHours = (now - date) / (1000 * 60 * 60);

            if (diffInHours < 24) {
                return format(date, 'HH:mm');
            } else if (diffInHours < 48) {
                return 'Yesterday';
            } else {
                return format(date, 'MMM dd');
            }
        } catch (error) {
            return '';
        }
    };

    const getOtherParticipant = (room, currentUserId) => {
        if (!room.participants) return null;
        
        const participantIds = Object.keys(room.participants);
        const otherParticipantId = participantIds.find(id => id !== currentUserId);
        
        return otherParticipantId ? room.participants[otherParticipantId] : null;
    };

    const isUserOnline = (userId) => {
        return userStatuses[userId]?.online || false;
    };

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <Paper
                elevation={2}
                sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderRadius: 0
                }}
            >
                <Box display="flex" alignItems="center" gap={1}>
                    <ChatIcon color="primary" />
                    <Typography variant="h6" fontWeight="bold">
                        Messages
                    </Typography>
                </Box>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </Paper>

            <Divider />

            {/* Chat List */}
            <Box sx={{ flex: 1, overflow: 'auto' }}>
                {chatRooms.length === 0 ? (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            p: 3,
                            textAlign: 'center'
                        }}
                    >
                        <ChatIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            No conversations yet
                        </Typography>
                        <Typography variant="body2" color="text.disabled">
                            Start a conversation with an admin to get help with your franchise inquiry
                        </Typography>
                    </Box>
                ) : (
                    <List sx={{ p: 0 }}>
                        {chatRooms.map((room) => {
                            const otherParticipant = getOtherParticipant(room, room.id);
                            const isOnline = otherParticipant && isUserOnline(otherParticipant.id);

                            return (
                                <React.Fragment key={room.id}>
                                    <ListItemButton
                                        onClick={() => onSelectChat(room.id)}
                                        sx={{
                                            py: 2,
                                            '&:hover': {
                                                bgcolor: 'action.hover'
                                            }
                                        }}
                                    >
                                        <ListItemAvatar>
                                            <Badge
                                                overlap="circular"
                                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                                badgeContent={
                                                    isOnline ? (
                                                        <CircleIcon
                                                            sx={{
                                                                fontSize: 12,
                                                                color: 'success.main'
                                                            }}
                                                        />
                                                    ) : null
                                                }
                                            >
                                                <Avatar sx={{ bgcolor: 'primary.main' }}>
                                                    {otherParticipant?.name?.charAt(0)?.toUpperCase() || 'U'}
                                                </Avatar>
                                            </Badge>
                                        </ListItemAvatar>

                                        <ListItemText
                                            primary={
                                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                                    <Typography variant="subtitle2" fontWeight="bold">
                                                        {otherParticipant?.name || 'Unknown User'}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {formatTime(room.lastMessageTime)}
                                                    </Typography>
                                                </Box>
                                            }
                                            secondary={
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    noWrap
                                                    sx={{ mt: 0.5 }}
                                                >
                                                    {room.lastMessage || 'No messages yet'}
                                                </Typography>
                                            }
                                        />
                                    </ListItemButton>
                                    <Divider variant="inset" component="li" />
                                </React.Fragment>
                            );
                        })}
                    </List>
                )}
            </Box>
        </Box>
    );
};

export default ChatList;

import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    Paper,
    TextField,
    IconButton,
    Avatar,
    Typography,
    CircularProgress,
    Chip,
    Divider
} from '@mui/material';
import {
    Send as SendIcon,
    ArrowBack as ArrowBackIcon,
    Circle as CircleIcon
} from '@mui/icons-material';
import { format, isToday, isYesterday } from 'date-fns';
import { useChat } from '../../hooks/useChat';
import { useAuth } from '../../hooks/useAuth';

/**
 * ChatWindow - Individual chat conversation view
 * Shows messages, typing indicators, and message input
 */
const ChatWindow = ({ roomId, onBack, onClose }) => {
    const { user } = useAuth();
    const {
        messages,
        loading,
        sending,
        chatRooms,
        userStatuses,
        sendMessage,
        handleTyping,
        getTypingUsers
    } = useChat(roomId);

    const [messageText, setMessageText] = useState('');
    const messagesEndRef = useRef(null);
    const messageInputRef = useRef(null);

    const room = chatRooms.find(r => r.id === roomId);
    const otherParticipant = room?.participants 
        ? Object.values(room.participants).find(p => p.id !== user?.uid)
        : null;
    
    const isOtherUserOnline = otherParticipant && userStatuses[otherParticipant.id]?.online;
    const typingUsers = getTypingUsers();

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, typingUsers]);

    // Focus input on mount
    useEffect(() => {
        messageInputRef.current?.focus();
    }, []);

    const handleSend = async () => {
        if (!messageText.trim() || sending) return;

        const text = messageText;
        setMessageText('');
        
        try {
            await sendMessage(text, roomId);
        } catch (error) {
            // Error is handled in useChat hook
            setMessageText(text); // Restore message on error
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleInputChange = (e) => {
        setMessageText(e.target.value);
        handleTyping();
    };

    const formatMessageTime = (timestamp) => {
        if (!timestamp) return '';
        
        try {
            const date = new Date(timestamp);
            
            if (isToday(date)) {
                return format(date, 'HH:mm');
            } else if (isYesterday(date)) {
                return `Yesterday ${format(date, 'HH:mm')}`;
            } else {
                return format(date, 'MMM dd, HH:mm');
            }
        } catch (error) {
            return '';
        }
    };

    const renderMessage = (message, index) => {
        const isOwnMessage = message.senderId === user?.uid;
        const showAvatar = index === 0 || messages[index - 1].senderId !== message.senderId;
        const showTime = index === messages.length - 1 || 
            messages[index + 1].senderId !== message.senderId;

        return (
            <Box
                key={message.id}
                sx={{
                    display: 'flex',
                    flexDirection: isOwnMessage ? 'row-reverse' : 'row',
                    alignItems: 'flex-end',
                    mb: 1,
                    gap: 1
                }}
            >
                {/* Avatar */}
                <Box sx={{ width: 40, visibility: showAvatar ? 'visible' : 'hidden' }}>
                    {!isOwnMessage && showAvatar && (
                        <Avatar
                            src={message.senderPhotoURL}
                            sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}
                        >
                            {message.senderName?.charAt(0)?.toUpperCase()}
                        </Avatar>
                    )}
                </Box>

                {/* Message Bubble */}
                <Box
                    sx={{
                        maxWidth: '70%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isOwnMessage ? 'flex-end' : 'flex-start'
                    }}
                >
                    {/* Sender name (for group chats or first message) */}
                    {!isOwnMessage && showAvatar && (
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ px: 1, mb: 0.5 }}
                        >
                            {message.senderName}
                        </Typography>
                    )}

                    {/* Message content */}
                    <Paper
                        elevation={1}
                        sx={{
                            p: 1.5,
                            bgcolor: isOwnMessage ? 'primary.main' : 'grey.100',
                            color: isOwnMessage ? 'primary.contrastText' : 'text.primary',
                            borderRadius: 2,
                            borderTopLeftRadius: !isOwnMessage && showAvatar ? 0 : 2,
                            borderTopRightRadius: isOwnMessage && showAvatar ? 0 : 2
                        }}
                    >
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                            {message.message}
                        </Typography>
                    </Paper>

                    {/* Timestamp */}
                    {showTime && (
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ px: 1, mt: 0.5 }}
                        >
                            {formatMessageTime(message.timestamp)}
                            {isOwnMessage && message.read && (
                                <Typography component="span" variant="caption" sx={{ ml: 0.5 }}>
                                    • Read
                                </Typography>
                            )}
                        </Typography>
                    )}
                </Box>
            </Box>
        );
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
                    gap: 1,
                    borderRadius: 0
                }}
            >
                <IconButton onClick={onBack} size="small">
                    <ArrowBackIcon />
                </IconButton>

                <Avatar
                    sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}
                >
                    {otherParticipant?.name?.charAt(0)?.toUpperCase() || 'U'}
                </Avatar>

                <Box flex={1}>
                    <Typography variant="subtitle2" fontWeight="bold">
                        {otherParticipant?.name || 'Unknown User'}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={0.5}>
                        {isOtherUserOnline && (
                            <CircleIcon sx={{ fontSize: 10, color: 'success.main' }} />
                        )}
                        <Typography variant="caption" color="text.secondary">
                            {isOtherUserOnline ? 'Online' : 'Offline'}
                        </Typography>
                    </Box>
                </Box>
            </Paper>

            <Divider />

            {/* Messages Area */}
            <Box
                sx={{
                    flex: 1,
                    overflow: 'auto',
                    p: 2,
                    bgcolor: 'grey.50',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                        <CircularProgress />
                    </Box>
                ) : messages.length === 0 ? (
                    <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                        height="100%"
                        textAlign="center"
                        color="text.secondary"
                    >
                        <Typography variant="body2" gutterBottom>
                            No messages yet
                        </Typography>
                        <Typography variant="caption">
                            Start the conversation!
                        </Typography>
                    </Box>
                ) : (
                    <>
                        {messages.map((message, index) => renderMessage(message, index))}
                        
                        {/* Typing Indicator */}
                        {typingUsers.length > 0 && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                                    {typingUsers[0].charAt(0).toUpperCase()}
                                </Avatar>
                                <Chip
                                    label={`${typingUsers.join(', ')} ${typingUsers.length === 1 ? 'is' : 'are'} typing...`}
                                    size="small"
                                    sx={{ bgcolor: 'grey.200' }}
                                />
                            </Box>
                        )}
                        
                        <div ref={messagesEndRef} />
                    </>
                )}
            </Box>

            {/* Message Input */}
            <Paper
                elevation={3}
                sx={{
                    p: 2,
                    borderRadius: 0,
                    borderTop: 1,
                    borderColor: 'divider'
                }}
            >
                <Box display="flex" gap={1}>
                    <TextField
                        inputRef={messageInputRef}
                        fullWidth
                        size="small"
                        placeholder="Type a message..."
                        value={messageText}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        disabled={sending}
                        multiline
                        maxRows={4}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 3
                            }
                        }}
                    />
                    <IconButton
                        color="primary"
                        onClick={handleSend}
                        disabled={!messageText.trim() || sending}
                        sx={{
                            bgcolor: 'primary.main',
                            color: 'white',
                            '&:hover': {
                                bgcolor: 'primary.dark'
                            },
                            '&.Mui-disabled': {
                                bgcolor: 'grey.300'
                            }
                        }}
                    >
                        {sending ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
                    </IconButton>
                </Box>
            </Paper>
        </Box>
    );
};

export default ChatWindow;

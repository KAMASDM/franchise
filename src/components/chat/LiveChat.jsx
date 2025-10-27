import React, { useState } from 'react';
import {
    Box,
    Drawer,
    IconButton,
    Badge,
    Fab,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    Chat as ChatIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import ChatWindow from './ChatWindow';
import ChatList from './ChatList';
import { useChat } from '../../hooks/useChat';

/**
 * LiveChat - Main chat component with floating button and drawer
 * Provides access to all chat conversations
 */
const LiveChat = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [open, setOpen] = useState(false);
    const [showChatList, setShowChatList] = useState(true);
    
    const { 
        chatRooms, 
        currentRoom, 
        unreadCount,
        switchRoom,
        setCurrentRoom
    } = useChat();

    const handleToggle = () => {
        setOpen(!open);
        if (!open) {
            // When opening, show chat list
            setShowChatList(true);
        }
    };

    const handleSelectChat = (roomId) => {
        switchRoom(roomId);
        setShowChatList(false);
    };

    const handleBackToList = () => {
        setShowChatList(true);
        setCurrentRoom(null);
    };

    return (
        <>
            {/* Floating Action Button */}
            <Fab
                color="primary"
                aria-label="chat"
                onClick={handleToggle}
                sx={{
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    zIndex: 1000
                }}
            >
                <Badge badgeContent={unreadCount} color="error">
                    {open ? <CloseIcon /> : <ChatIcon />}
                </Badge>
            </Fab>

            {/* Chat Drawer */}
            <Drawer
                anchor="right"
                open={open}
                onClose={handleToggle}
                PaperProps={{
                    sx: {
                        width: isMobile ? '100%' : 400,
                        maxWidth: '100%'
                    }
                }}
            >
                <Box
                    sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        bgcolor: 'background.default'
                    }}
                >
                    {showChatList || !currentRoom ? (
                        <ChatList
                            chatRooms={chatRooms}
                            onSelectChat={handleSelectChat}
                            onClose={handleToggle}
                        />
                    ) : (
                        <ChatWindow
                            roomId={currentRoom}
                            onBack={handleBackToList}
                            onClose={handleToggle}
                        />
                    )}
                </Box>
            </Drawer>
        </>
    );
};

export default LiveChat;

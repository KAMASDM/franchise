import { useState, useEffect, useCallback, useRef } from 'react';
import ChatService from '../utils/ChatService';
import { useAuth } from './useAuth';

/**
 * Custom hook for managing chat state and real-time updates
 * @param {string} chatRoomId - Optional specific chat room ID
 * @returns {Object} Chat state and methods
 */
export const useChat = (chatRoomId = null) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [chatRooms, setChatRooms] = useState([]);
    const [currentRoom, setCurrentRoom] = useState(chatRoomId);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [typing, setTyping] = useState({});
    const [unreadCount, setUnreadCount] = useState(0);
    const [error, setError] = useState(null);
    const [userStatuses, setUserStatuses] = useState({});
    
    const typingTimeoutRef = useRef(null);

    // Initialize ChatService
    useEffect(() => {
        ChatService.initialize();
    }, []);

    // Listen to all user's chat rooms
    useEffect(() => {
        if (!user?.uid) return;

        const unsubscribe = ChatService.listenToUserChats(user.uid, (rooms) => {
            setChatRooms(rooms);
            setLoading(false);
        });

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [user?.uid]);

    // Listen to messages in current room
    useEffect(() => {
        if (!currentRoom) {
            setMessages([]);
            return;
        }

        setLoading(true);

        const unsubscribe = ChatService.listenToMessages(currentRoom, (msgs) => {
            setMessages(msgs);
            setLoading(false);
            
            // Mark messages as read
            if (user?.uid) {
                ChatService.markMessagesAsRead(currentRoom, user.uid);
            }
        });

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [currentRoom, user?.uid]);

    // Listen to unread count
    useEffect(() => {
        if (!user?.uid) return;

        const unsubscribe = ChatService.listenToUnreadCount(user.uid, (count) => {
            setUnreadCount(count);
        });

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [user?.uid]);

    // Listen to typing indicators for all participants in current room
    useEffect(() => {
        if (!currentRoom || !user?.uid) return;

        // Get other participants from current room
        const room = chatRooms.find(r => r.id === currentRoom);
        if (!room || !room.participants) return;

        const otherParticipants = Object.keys(room.participants).filter(id => id !== user.uid);
        
        const unsubscribes = otherParticipants.map(participantId => {
            return ChatService.listenToTyping(currentRoom, participantId, (isTyping) => {
                setTyping(prev => ({
                    ...prev,
                    [participantId]: isTyping
                }));
            });
        });

        return () => {
            unsubscribes.forEach(unsub => unsub && unsub());
        };
    }, [currentRoom, chatRooms, user?.uid]);

    // Listen to user statuses
    useEffect(() => {
        if (chatRooms.length === 0) return;

        const allParticipants = new Set();
        chatRooms.forEach(room => {
            if (room.participants) {
                Object.keys(room.participants).forEach(id => allParticipants.add(id));
            }
        });

        const unsubscribes = Array.from(allParticipants).map(userId => {
            return ChatService.listenToUserStatus(userId, (status) => {
                setUserStatuses(prev => ({
                    ...prev,
                    [userId]: status
                }));
            });
        });

        return () => {
            unsubscribes.forEach(unsub => unsub && unsub());
        };
    }, [chatRooms]);

    // Set user online when component mounts
    useEffect(() => {
        if (!user?.uid) return;

        ChatService.setUserOnlineStatus(user.uid, true);

        // Set offline on unmount
        return () => {
            ChatService.setUserOnlineStatus(user.uid, false);
        };
    }, [user?.uid]);

    /**
     * Send a message
     * @param {string} messageText - Message content
     * @param {string} roomId - Optional room ID (uses currentRoom if not provided)
     */
    const sendMessage = useCallback(async (messageText, roomId = null) => {
        if (!user || !messageText.trim()) return;

        const targetRoom = roomId || currentRoom;
        if (!targetRoom) {
            setError('No chat room selected');
            return;
        }

        try {
            setSending(true);
            setError(null);

            await ChatService.sendMessage(
                targetRoom,
                user.uid,
                user.displayName || user.email || 'Anonymous',
                messageText,
                user.photoURL
            );

            setSending(false);
        } catch (err) {
            console.error('Error sending message:', err);
            setError('Failed to send message');
            setSending(false);
        }
    }, [user, currentRoom]);

    /**
     * Start a new chat with a user
     * @param {string} otherUserId - ID of user to chat with
     * @param {string} otherUserName - Name of user to chat with
     */
    const startChat = useCallback(async (otherUserId, otherUserName) => {
        if (!user) return null;

        try {
            const roomId = ChatService.getChatRoomId(user.uid, otherUserId);
            
            // Check if room already exists
            const existingRoom = chatRooms.find(r => r.id === roomId);
            
            if (!existingRoom) {
                // Initialize new room
                await ChatService.initializeChatRoom(
                    roomId,
                    user.uid,
                    otherUserId,
                    user.displayName || user.email || 'User',
                    otherUserName
                );
            }

            setCurrentRoom(roomId);
            return roomId;
        } catch (err) {
            console.error('Error starting chat:', err);
            setError('Failed to start chat');
            return null;
        }
    }, [user, chatRooms]);

    /**
     * Handle user typing
     */
    const handleTyping = useCallback(() => {
        if (!user?.uid || !currentRoom) return;

        // Clear previous timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Set typing to true
        ChatService.setTyping(currentRoom, user.uid, true);

        // Set timeout to clear typing
        typingTimeoutRef.current = setTimeout(() => {
            ChatService.setTyping(currentRoom, user.uid, false);
        }, 2000);
    }, [user?.uid, currentRoom]);

    /**
     * Delete a message
     * @param {string} messageId - Message ID to delete
     */
    const deleteMessage = useCallback(async (messageId) => {
        if (!currentRoom) return;

        try {
            await ChatService.deleteMessage(currentRoom, messageId);
        } catch (err) {
            console.error('Error deleting message:', err);
            setError('Failed to delete message');
        }
    }, [currentRoom]);

    /**
     * Switch to a different chat room
     * @param {string} roomId - Room ID to switch to
     */
    const switchRoom = useCallback((roomId) => {
        setCurrentRoom(roomId);
        setMessages([]);
        setTyping({});
    }, []);

    /**
     * Get typing status for current room
     * @returns {boolean} True if anyone is typing
     */
    const isAnyoneTyping = useCallback(() => {
        return Object.values(typing).some(isTyping => isTyping);
    }, [typing]);

    /**
     * Get typing user names
     * @returns {string[]} Array of names of users who are typing
     */
    const getTypingUsers = useCallback(() => {
        if (!currentRoom) return [];
        
        const room = chatRooms.find(r => r.id === currentRoom);
        if (!room || !room.participants) return [];

        return Object.entries(typing)
            .filter(([userId, isTyping]) => isTyping && userId !== user?.uid)
            .map(([userId]) => room.participants[userId]?.name || 'Someone')
            .filter(Boolean);
    }, [typing, currentRoom, chatRooms, user?.uid]);

    /**
     * Get unread count for a specific room
     * @param {string} roomId - Room ID
     * @returns {number} Unread message count
     */
    const getUnreadCountForRoom = useCallback((roomId) => {
        const room = chatRooms.find(r => r.id === roomId);
        if (!room) return 0;

        // This would require additional tracking in ChatService
        // For now, return 0 as placeholder
        return 0;
    }, [chatRooms]);

    return {
        // State
        messages,
        chatRooms,
        currentRoom,
        loading,
        sending,
        typing,
        unreadCount,
        error,
        userStatuses,

        // Methods
        sendMessage,
        startChat,
        handleTyping,
        deleteMessage,
        switchRoom,
        setCurrentRoom,

        // Helpers
        isAnyoneTyping,
        getTypingUsers,
        getUnreadCountForRoom
    };
};

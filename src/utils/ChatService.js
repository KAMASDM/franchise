import { getDatabase, ref, push, set, onValue, off, update, query, orderByChild, limitToLast, serverTimestamp, onDisconnect } from 'firebase/database';
import { auth } from '../firebase/firebase';

/**
 * ChatService - Real-time chat service using Firebase Realtime Database
 * Handles direct messaging between users and admins
 */
class ChatService {
    constructor() {
        this.db = null;
        this.listeners = new Map();
        this.typingTimeouts = new Map();
    }

    /**
     * Initialize the chat service with Firebase Realtime Database
     */
    initialize() {
        try {
            this.db = getDatabase();
            console.log('ChatService initialized');
            return true;
        } catch (error) {
            console.error('Failed to initialize ChatService:', error);
            return false;
        }
    }

    /**
     * Get or create a chat room between two users
     * @param {string} userId1 - First user ID
     * @param {string} userId2 - Second user ID (usually admin)
     * @returns {string} Chat room ID
     */
    getChatRoomId(userId1, userId2) {
        // Create consistent room ID by sorting user IDs
        const sorted = [userId1, userId2].sort();
        return `${sorted[0]}_${sorted[1]}`;
    }

    /**
     * Send a message in a chat room
     * @param {string} roomId - Chat room ID
     * @param {string} senderId - Sender user ID
     * @param {string} senderName - Sender display name
     * @param {string} message - Message text
     * @param {string} senderPhotoURL - Sender photo URL (optional)
     * @returns {Promise<string>} Message ID
     */
    async sendMessage(roomId, senderId, senderName, message, senderPhotoURL = null) {
        if (!this.db) this.initialize();

        try {
            const messagesRef = ref(this.db, `chats/${roomId}/messages`);
            const newMessageRef = push(messagesRef);

            const messageData = {
                id: newMessageRef.key,
                senderId,
                senderName,
                senderPhotoURL,
                message: message.trim(),
                timestamp: serverTimestamp(),
                read: false
            };

            await set(newMessageRef, messageData);

            // Update chat room metadata
            await this.updateChatRoomMetadata(roomId, senderId, senderName, message);

            // Clear typing indicator
            await this.setTyping(roomId, senderId, false);

            return newMessageRef.key;
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }

    /**
     * Update chat room metadata (last message, timestamp, participants)
     * @param {string} roomId - Chat room ID
     * @param {string} senderId - Sender ID
     * @param {string} senderName - Sender name
     * @param {string} lastMessage - Last message preview
     */
    async updateChatRoomMetadata(roomId, senderId, senderName, lastMessage) {
        if (!this.db) this.initialize();

        try {
            const chatRoomRef = ref(this.db, `chatRooms/${roomId}`);
            
            await update(chatRoomRef, {
                lastMessage: lastMessage.substring(0, 100),
                lastMessageTime: serverTimestamp(),
                lastMessageSenderId: senderId,
                lastMessageSenderName: senderName,
                updatedAt: serverTimestamp()
            });
        } catch (error) {
            console.error('Error updating chat room metadata:', error);
        }
    }

    /**
     * Initialize a new chat room
     * @param {string} roomId - Chat room ID
     * @param {string} userId - User ID
     * @param {string} adminId - Admin ID
     * @param {string} userName - User display name
     * @param {string} adminName - Admin display name
     */
    async initializeChatRoom(roomId, userId, adminId, userName, adminName) {
        if (!this.db) this.initialize();

        try {
            const chatRoomRef = ref(this.db, `chatRooms/${roomId}`);
            
            await set(chatRoomRef, {
                id: roomId,
                participants: {
                    [userId]: {
                        id: userId,
                        name: userName,
                        role: 'user'
                    },
                    [adminId]: {
                        id: adminId,
                        name: adminName,
                        role: 'admin'
                    }
                },
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                lastMessage: null,
                lastMessageTime: null
            });

            return roomId;
        } catch (error) {
            console.error('Error initializing chat room:', error);
            throw error;
        }
    }

    /**
     * Listen for messages in a chat room
     * @param {string} roomId - Chat room ID
     * @param {Function} callback - Callback function to handle messages
     * @param {number} limit - Number of messages to load (default: 50)
     */
    listenToMessages(roomId, callback, limit = 50) {
        if (!this.db) this.initialize();

        try {
            const messagesRef = ref(this.db, `chats/${roomId}/messages`);
            const messagesQuery = query(messagesRef, orderByChild('timestamp'), limitToLast(limit));

            const unsubscribe = onValue(messagesQuery, (snapshot) => {
                const messages = [];
                snapshot.forEach((childSnapshot) => {
                    messages.push({
                        id: childSnapshot.key,
                        ...childSnapshot.val()
                    });
                });
                callback(messages);
            });

            // Store listener for cleanup
            this.listeners.set(`messages_${roomId}`, { ref: messagesQuery, unsubscribe });

            return unsubscribe;
        } catch (error) {
            console.error('Error listening to messages:', error);
            return null;
        }
    }

    /**
     * Listen for typing indicator
     * @param {string} roomId - Chat room ID
     * @param {string} userId - User ID to listen for
     * @param {Function} callback - Callback function
     */
    listenToTyping(roomId, userId, callback) {
        if (!this.db) this.initialize();

        try {
            const typingRef = ref(this.db, `chats/${roomId}/typing/${userId}`);

            const unsubscribe = onValue(typingRef, (snapshot) => {
                const isTyping = snapshot.val() || false;
                callback(isTyping);
            });

            this.listeners.set(`typing_${roomId}_${userId}`, { ref: typingRef, unsubscribe });

            return unsubscribe;
        } catch (error) {
            console.error('Error listening to typing:', error);
            return null;
        }
    }

    /**
     * Set typing indicator
     * @param {string} roomId - Chat room ID
     * @param {string} userId - User ID
     * @param {boolean} isTyping - Typing status
     */
    async setTyping(roomId, userId, isTyping) {
        if (!this.db) this.initialize();

        try {
            const typingRef = ref(this.db, `chats/${roomId}/typing/${userId}`);
            
            if (isTyping) {
                await set(typingRef, true);
                
                // Clear previous timeout
                if (this.typingTimeouts.has(userId)) {
                    clearTimeout(this.typingTimeouts.get(userId));
                }
                
                // Auto-clear typing after 3 seconds
                const timeout = setTimeout(() => {
                    set(typingRef, false);
                    this.typingTimeouts.delete(userId);
                }, 3000);
                
                this.typingTimeouts.set(userId, timeout);
            } else {
                await set(typingRef, false);
                if (this.typingTimeouts.has(userId)) {
                    clearTimeout(this.typingTimeouts.get(userId));
                    this.typingTimeouts.delete(userId);
                }
            }
        } catch (error) {
            console.error('Error setting typing indicator:', error);
        }
    }

    /**
     * Mark messages as read
     * @param {string} roomId - Chat room ID
     * @param {string} currentUserId - Current user ID
     */
    async markMessagesAsRead(roomId, currentUserId) {
        if (!this.db) this.initialize();

        try {
            const messagesRef = ref(this.db, `chats/${roomId}/messages`);
            const snapshot = await new Promise((resolve) => {
                onValue(messagesRef, (snap) => resolve(snap), { onlyOnce: true });
            });

            const updates = {};
            snapshot.forEach((childSnapshot) => {
                const message = childSnapshot.val();
                if (message.senderId !== currentUserId && !message.read) {
                    updates[`${childSnapshot.key}/read`] = true;
                }
            });

            if (Object.keys(updates).length > 0) {
                await update(messagesRef, updates);
            }
        } catch (error) {
            console.error('Error marking messages as read:', error);
        }
    }

    /**
     * Get unread message count for a user across all chat rooms
     * @param {string} userId - User ID
     * @param {Function} callback - Callback with unread count
     */
    listenToUnreadCount(userId, callback) {
        if (!this.db) this.initialize();

        try {
            const chatRoomsRef = ref(this.db, 'chats');

            const unsubscribe = onValue(chatRoomsRef, (snapshot) => {
                let totalUnread = 0;

                snapshot.forEach((roomSnapshot) => {
                    const roomId = roomSnapshot.key;
                    if (roomId.includes(userId)) {
                        const messages = roomSnapshot.child('messages');
                        messages.forEach((msgSnapshot) => {
                            const msg = msgSnapshot.val();
                            if (msg.senderId !== userId && !msg.read) {
                                totalUnread++;
                            }
                        });
                    }
                });

                callback(totalUnread);
            });

            this.listeners.set(`unread_${userId}`, { ref: chatRoomsRef, unsubscribe });

            return unsubscribe;
        } catch (error) {
            console.error('Error listening to unread count:', error);
            return null;
        }
    }

    /**
     * Get all chat rooms for a user
     * @param {string} userId - User ID
     * @param {Function} callback - Callback with chat rooms
     */
    listenToUserChats(userId, callback) {
        if (!this.db) this.initialize();

        try {
            const chatRoomsRef = ref(this.db, 'chatRooms');

            const unsubscribe = onValue(chatRoomsRef, (snapshot) => {
                const chatRooms = [];

                snapshot.forEach((childSnapshot) => {
                    const room = childSnapshot.val();
                    // Check if user is a participant
                    if (room.participants && room.participants[userId]) {
                        chatRooms.push({
                            id: childSnapshot.key,
                            ...room
                        });
                    }
                });

                // Sort by last message time
                chatRooms.sort((a, b) => {
                    const timeA = a.lastMessageTime || 0;
                    const timeB = b.lastMessageTime || 0;
                    return timeB - timeA;
                });

                callback(chatRooms);
            });

            this.listeners.set(`userChats_${userId}`, { ref: chatRoomsRef, unsubscribe });

            return unsubscribe;
        } catch (error) {
            console.error('Error listening to user chats:', error);
            return null;
        }
    }

    /**
     * Set user online status
     * @param {string} userId - User ID
     * @param {boolean} isOnline - Online status
     */
    async setUserOnlineStatus(userId, isOnline) {
        if (!this.db) this.initialize();

        try {
            const statusRef = ref(this.db, `userStatus/${userId}`);
            
            await set(statusRef, {
                online: isOnline,
                lastSeen: serverTimestamp()
            });

            // Set up auto-disconnect
            if (isOnline) {
                const disconnectRef = onDisconnect(statusRef);
                await disconnectRef.set({
                    online: false,
                    lastSeen: serverTimestamp()
                });
            }
        } catch (error) {
            console.error('Error setting online status:', error);
        }
    }

    /**
     * Listen to user online status
     * @param {string} userId - User ID
     * @param {Function} callback - Callback with online status
     */
    listenToUserStatus(userId, callback) {
        if (!this.db) this.initialize();

        try {
            const statusRef = ref(this.db, `userStatus/${userId}`);

            const unsubscribe = onValue(statusRef, (snapshot) => {
                const status = snapshot.val() || { online: false, lastSeen: null };
                callback(status);
            });

            this.listeners.set(`status_${userId}`, { ref: statusRef, unsubscribe });

            return unsubscribe;
        } catch (error) {
            console.error('Error listening to user status:', error);
            return null;
        }
    }

    /**
     * Delete a message
     * @param {string} roomId - Chat room ID
     * @param {string} messageId - Message ID
     */
    async deleteMessage(roomId, messageId) {
        if (!this.db) this.initialize();

        try {
            const messageRef = ref(this.db, `chats/${roomId}/messages/${messageId}`);
            await set(messageRef, null);
        } catch (error) {
            console.error('Error deleting message:', error);
            throw error;
        }
    }

    /**
     * Clean up all listeners
     */
    cleanup() {
        this.listeners.forEach((listener) => {
            if (listener.unsubscribe) {
                listener.unsubscribe();
            }
        });
        this.listeners.clear();

        this.typingTimeouts.forEach((timeout) => {
            clearTimeout(timeout);
        });
        this.typingTimeouts.clear();

        console.log('ChatService cleaned up');
    }

    /**
     * Remove a specific listener
     * @param {string} key - Listener key
     */
    removeListener(key) {
        const listener = this.listeners.get(key);
        if (listener && listener.unsubscribe) {
            listener.unsubscribe();
            this.listeners.delete(key);
        }
    }
}

export default new ChatService();

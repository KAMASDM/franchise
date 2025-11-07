import { useState, useEffect, useCallback } from 'react';

/**
 * Hook for managing chatbot conversation history
 * 
 * Features:
 * - Save conversations to localStorage
 * - Load previous conversations
 * - Search through conversations
 * - Delete conversations
 * - Export conversations
 */

const STORAGE_KEY = 'chatbot_conversations';
const MAX_CONVERSATIONS = 50; // Limit storage

export const useChatHistory = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load conversations from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setConversations(parsed);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save conversations to localStorage
  const saveConversations = useCallback((newConversations) => {
    try {
      // Keep only the most recent conversations
      const limited = newConversations.slice(0, MAX_CONVERSATIONS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(limited));
      setConversations(limited);
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  }, []);

  // Save a new conversation
  const saveConversation = useCallback((messages, userInfo = null) => {
    const conversation = {
      id: `conv_${Date.now()}`,
      timestamp: new Date().toISOString(),
      messages: messages,
      userInfo: userInfo,
      summary: generateSummary(messages),
    };

    const updated = [conversation, ...conversations];
    saveConversations(updated);
    return conversation.id;
  }, [conversations, saveConversations]);

  // Update an existing conversation
  const updateConversation = useCallback((conversationId, messages) => {
    const updated = conversations.map(conv => 
      conv.id === conversationId 
        ? { ...conv, messages, timestamp: new Date().toISOString(), summary: generateSummary(messages) }
        : conv
    );
    saveConversations(updated);
  }, [conversations, saveConversations]);

  // Delete a conversation
  const deleteConversation = useCallback((conversationId) => {
    const updated = conversations.filter(conv => conv.id !== conversationId);
    saveConversations(updated);
  }, [conversations, saveConversations]);

  // Get a specific conversation
  const getConversation = useCallback((conversationId) => {
    return conversations.find(conv => conv.id === conversationId);
  }, [conversations]);

  // Search conversations
  const searchConversations = useCallback((searchTerm) => {
    if (!searchTerm) return conversations;
    
    const term = searchTerm.toLowerCase();
    return conversations.filter(conv => {
      // Search in summary
      if (conv.summary.toLowerCase().includes(term)) return true;
      
      // Search in messages
      return conv.messages.some(msg => 
        msg.text?.toLowerCase().includes(term)
      );
    });
  }, [conversations]);

  // Get conversations by date range
  const getConversationsByDate = useCallback((startDate, endDate) => {
    return conversations.filter(conv => {
      const convDate = new Date(conv.timestamp);
      return convDate >= startDate && convDate <= endDate;
    });
  }, [conversations]);

  // Clear all conversations
  const clearAllConversations = useCallback(() => {
    saveConversations([]);
  }, [saveConversations]);

  // Export conversations as JSON
  const exportConversations = useCallback(() => {
    const dataStr = JSON.stringify(conversations, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `chatbot_conversations_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [conversations]);

  // Get recent conversations (last 7 days)
  const getRecentConversations = useCallback((days = 7) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return conversations.filter(conv => 
      new Date(conv.timestamp) >= cutoffDate
    );
  }, [conversations]);

  return {
    conversations,
    loading,
    saveConversation,
    updateConversation,
    deleteConversation,
    getConversation,
    searchConversations,
    getConversationsByDate,
    getRecentConversations,
    clearAllConversations,
    exportConversations,
  };
};

// Helper function to generate conversation summary
const generateSummary = (messages) => {
  if (!messages || messages.length === 0) return 'Empty conversation';
  
  // Find the first user message or use first few messages
  const userMessages = messages.filter(msg => msg.sender === 'user');
  
  if (userMessages.length > 0) {
    const firstUserMsg = userMessages[0].text;
    return firstUserMsg.length > 50 
      ? firstUserMsg.substring(0, 50) + '...' 
      : firstUserMsg;
  }
  
  const firstMsg = messages[0].text;
  return firstMsg.length > 50 
    ? firstMsg.substring(0, 50) + '...' 
    : firstMsg;
};

export default useChatHistory;

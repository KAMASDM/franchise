import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Chip,
  Stack,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
  InputAdornment,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  Delete,
  Search,
  MoreVert,
  FileDownload,
  DeleteSweep,
  ChatBubble,
  History,
  FilterList,
  CalendarToday,
  Person,
  SmartToy,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import useChatHistory from '../../hooks/useChatHistory';

/**
 * Chat History Viewer Component
 * Displays saved chatbot conversations
 */
const ChatHistoryViewer = ({ onConversationSelect, standalone = true }) => {
  const {
    conversations,
    loading,
    deleteConversation,
    searchConversations,
    clearAllConversations,
    exportConversations,
    getRecentConversations,
  } = useChatHistory();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [filterDays, setFilterDays] = useState(null);

  const displayedConversations = filterDays
    ? getRecentConversations(filterDays)
    : searchTerm
    ? searchConversations(searchTerm)
    : conversations;

  const handleConversationClick = (conversation) => {
    setSelectedConversation(conversation);
    if (onConversationSelect) {
      onConversationSelect(conversation);
    }
  };

  const handleDeleteClick = (conversation, e) => {
    e.stopPropagation();
    setConversationToDelete(conversation);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (conversationToDelete) {
      deleteConversation(conversationToDelete.id);
      if (selectedConversation?.id === conversationToDelete.id) {
        setSelectedConversation(null);
      }
    }
    setShowDeleteDialog(false);
    setConversationToDelete(null);
  };

  const handleMenuClick = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete all conversations? This cannot be undone.')) {
      clearAllConversations();
      setSelectedConversation(null);
    }
    handleMenuClose();
  };

  const handleExport = () => {
    exportConversations();
    handleMenuClose();
  };

  if (loading) {
    return <Typography>Loading conversations...</Typography>;
  }

  const ConversationList = () => (
    <Paper sx={{ height: standalone ? '70vh' : '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <History />
            Chat History
            <Badge badgeContent={conversations.length} color="primary" max={99} />
          </Typography>
          <IconButton onClick={handleMenuClick} size="small">
            <MoreVert />
          </IconButton>
        </Box>

        {/* Search */}
        <TextField
          fullWidth
          size="small"
          placeholder="Search conversations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        {/* Filter chips */}
        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          <Chip
            label="All"
            size="small"
            onClick={() => setFilterDays(null)}
            color={filterDays === null ? 'primary' : 'default'}
          />
          <Chip
            label="Today"
            size="small"
            onClick={() => setFilterDays(1)}
            color={filterDays === 1 ? 'primary' : 'default'}
          />
          <Chip
            label="Week"
            size="small"
            onClick={() => setFilterDays(7)}
            color={filterDays === 7 ? 'primary' : 'default'}
          />
          <Chip
            label="Month"
            size="small"
            onClick={() => setFilterDays(30)}
            color={filterDays === 30 ? 'primary' : 'default'}
          />
        </Stack>
      </Box>

      {/* Conversation List */}
      <List sx={{ flexGrow: 1, overflow: 'auto', p: 0 }}>
        {displayedConversations.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <ChatBubble sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography color="text.secondary">
              {searchTerm ? 'No conversations found' : 'No conversations yet'}
            </Typography>
          </Box>
        ) : (
          displayedConversations.map((conversation, index) => (
            <React.Fragment key={conversation.id}>
              <ListItem
                button
                selected={selectedConversation?.id === conversation.id}
                onClick={() => handleConversationClick(conversation)}
                sx={{
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <ListItemIcon>
                  <ChatBubble color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2" noWrap>
                      {conversation.summary}
                    </Typography>
                  }
                  secondary={
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                      <CalendarToday sx={{ fontSize: 12 }} />
                      <Typography variant="caption">
                        {formatDistanceToNow(new Date(conversation.timestamp), { addSuffix: true })}
                      </Typography>
                      <Chip
                        label={`${conversation.messages.length} msgs`}
                        size="small"
                        sx={{ height: 16, fontSize: '0.7rem' }}
                      />
                    </Stack>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={(e) => handleDeleteClick(conversation, e)}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              {index < displayedConversations.length - 1 && <Divider />}
            </React.Fragment>
          ))
        )}
      </List>

      {/* Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleExport}>
          <ListItemIcon>
            <FileDownload fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export All</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleClearAll}>
          <ListItemIcon>
            <DeleteSweep fontSize="small" />
          </ListItemIcon>
          <ListItemText>Clear All</ListItemText>
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
      >
        <DialogTitle>Delete Conversation?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this conversation? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );

  const ConversationDetail = () => {
    if (!selectedConversation) {
      return (
        <Paper sx={{ height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ textAlign: 'center' }}>
            <ChatBubble sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography color="text.secondary">
              Select a conversation to view details
            </Typography>
          </Box>
        </Paper>
      );
    }

    return (
      <Paper sx={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6" gutterBottom>
            {selectedConversation.summary}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {new Date(selectedConversation.timestamp).toLocaleString()}
          </Typography>
        </Box>

        {/* Messages */}
        <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
          <Stack spacing={2}>
            {selectedConversation.messages.map((message, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <Paper
                  sx={{
                    p: 1.5,
                    maxWidth: '70%',
                    backgroundColor: message.sender === 'user' ? 'primary.main' : 'grey.100',
                    color: message.sender === 'user' ? 'white' : 'text.primary',
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                    {message.sender === 'user' ? (
                      <Person sx={{ fontSize: 16 }} />
                    ) : (
                      <SmartToy sx={{ fontSize: 16 }} />
                    )}
                    <Typography variant="caption" fontWeight="medium">
                      {message.sender === 'user' ? 'You' : 'Bot'}
                    </Typography>
                  </Stack>
                  <Typography variant="body2">{message.text}</Typography>
                </Paper>
              </Box>
            ))}
          </Stack>
        </Box>
      </Paper>
    );
  };

  if (standalone) {
    return (
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <ConversationList />
          </Box>
          <Box sx={{ flex: 2 }}>
            <ConversationDetail />
          </Box>
        </Box>
      </Box>
    );
  }

  return <ConversationList />;
};

export default ChatHistoryViewer;

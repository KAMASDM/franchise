import React, { useState } from "react";
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Chat as ChatIcon,
  MarkEmailRead as MarkReadIcon,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";

const NotificationCenter = () => {
  const { user } = useAuth();
  const { notifications, unreadCount, loading, error, markAsRead, markAllAsRead } = useNotifications(user);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }
    
    // Handle navigation based on notification type
    switch (notification.type) {
      case 'new_lead':
        window.location.href = '/dashboard/leads';
        break;
      case 'brand_approved':
      case 'brand_rejected':
        window.location.href = '/dashboard/brands';
        break;
      case 'chat_lead':
        window.location.href = '/admin/chat-leads';
        break;
      default:
        // No specific action
        break;
    }
    
    handleClose();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'new_lead':
        return <PersonIcon color="primary" />;
      case 'brand_approved':
        return <CheckCircleIcon color="success" />;
      case 'brand_rejected':
        return <ErrorIcon color="error" />;
      case 'chat_lead':
        return <ChatIcon color="info" />;
      case 'brand_submission':
        return <BusinessIcon color="warning" />;
      default:
        return <InfoIcon color="action" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'new_lead':
        return 'primary';
      case 'brand_approved':
        return 'success';
      case 'brand_rejected':
        return 'error';
      case 'chat_lead':
        return 'info';
      case 'brand_submission':
        return 'warning';
      default:
        return 'default';
    }
  };

  const renderNotificationItem = (notification) => (
    <ListItem
      key={notification.id}
      button
      onClick={() => handleNotificationClick(notification)}
      sx={{
        bgcolor: notification.read ? 'background.paper' : 'action.hover',
        borderLeft: notification.read ? 'none' : '4px solid',
        borderLeftColor: `${getNotificationColor(notification.type)}.main`,
        '&:hover': {
          bgcolor: 'action.selected',
        },
      }}
    >
      <ListItemIcon>
        <Avatar sx={{ bgcolor: 'background.paper', width: 32, height: 32 }}>
          {getNotificationIcon(notification.type)}
        </Avatar>
      </ListItemIcon>
      <ListItemText
        primary={
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Typography variant="subtitle2" noWrap sx={{ maxWidth: '200px' }}>
              {notification.title}
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              {!notification.read && (
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                  }}
                />
              )}
              <Typography variant="caption" color="text.secondary">
                {notification.createdAt && formatDistanceToNow(notification.createdAt, { addSuffix: true })}
              </Typography>
            </Box>
          </Box>
        }
        secondary={
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {notification.message}
            </Typography>
            {notification.prospectName && (
              <Chip
                label={notification.prospectName}
                size="small"
                variant="outlined"
                color={getNotificationColor(notification.type)}
                sx={{ mr: 1 }}
              />
            )}
            {notification.brandName && (
              <Chip
                label={notification.brandName}
                size="small"
                variant="outlined"
                color="default"
              />
            )}
          </Box>
        }
      />
    </ListItem>
  );

  if (error) {
    return (
      <IconButton color="inherit">
        <Badge badgeContent="!" color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
    );
  }

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        aria-label="notifications"
        aria-controls={open ? 'notification-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        id="notification-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 400,
            maxHeight: 500,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* Header */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Notifications</Typography>
            {unreadCount > 0 && (
              <Button
                size="small"
                startIcon={<MarkReadIcon />}
                onClick={(e) => {
                  e.stopPropagation();
                  markAllAsRead();
                }}
              >
                Mark all read
              </Button>
            )}
          </Box>
          {unreadCount > 0 && (
            <Typography variant="body2" color="text.secondary">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </Typography>
          )}
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" p={3}>
              <CircularProgress size={24} />
              <Typography variant="body2" sx={{ ml: 2 }}>
                Loading notifications...
              </Typography>
            </Box>
          ) : notifications.length === 0 ? (
            <Box p={3} textAlign="center">
              <NotificationsIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                No notifications yet
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {notifications.map((notification, index) => (
                <div key={notification.id}>
                  {renderNotificationItem(notification)}
                  {index < notifications.length - 1 && <Divider />}
                </div>
              ))}
            </List>
          )}
        </Box>

        {/* Footer */}
        {notifications.length > 0 && (
          <>
            <Divider />
            <Box sx={{ p: 2 }}>
              <Button fullWidth variant="outlined" onClick={handleClose}>
                View All Notifications
              </Button>
            </Box>
          </>
        )}
      </Menu>
    </>
  );
};

export default NotificationCenter;
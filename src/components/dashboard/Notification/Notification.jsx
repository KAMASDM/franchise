import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  List,
  ListItemText,
  Badge,
  IconButton,
  Divider,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../../../firebase/firebase";
import { useAuth } from "../../../context/AuthContext";
import { Notifications as NotificationsIcon } from "@mui/icons-material";
import logger from "../../../utils/logger";

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "users", user.uid, "notifications"),
      where("read", "==", false)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notifs = [];
      querySnapshot.forEach((doc) => {
        notifs.push({ id: doc.id, ...doc.data() });
      });
      setNotifications(notifs);
      setUnreadCount(notifs.length);
    });

    return () => unsubscribe();
  }, [user]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const markAsRead = async (notificationId) => {
    try {
      await updateDoc(
        doc(db, "users", user.uid, "notifications", notificationId),
        {
          read: true,
        }
      );
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      setUnreadCount((prev) => prev - 1);
    } catch (error) {
      logger.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const batch = writeBatch(db);

      notifications.forEach((notif) => {
        if (!notif.read) {
          const notifRef = doc(
            db,
            "users",
            user.uid,
            "notifications",
            notif.id
          );
          batch.update(notifRef, { read: true });
        }
      });

      await batch.commit();

      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      logger.error("Error marking all notifications as read:", error);
    }
    handleClose();
  };

  return (
    <Box>
      <IconButton
        color="inherit"
        onClick={handleClick}
        aria-controls={open ? "notifications-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        aria-label="View notifications"
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        id="notifications-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "notifications-button",
        }}
        PaperProps={{
          style: {
            width: "350px",
            maxHeight: "400px",
          },
        }}
      >
        {[
          <Box
            key="header"
            p={2}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">Notifications</Typography>
            {unreadCount > 0 && (
              <Typography
                variant="body2"
                color="primary"
                onClick={markAllAsRead}
                style={{ cursor: "pointer" }}
              >
                Mark all as read
              </Typography>
            )}
          </Box>,
          <Divider key="divider" />,
          notifications.length === 0 ? (
            <Box key="empty" p={2}>
              <Typography variant="body2" color="text.secondary">
                No new notifications
              </Typography>
            </Box>
          ) : (
            <List key="list" dense>
              {notifications.map((notification) => (
                <MenuItem
                  key={notification.id}
                  onClick={() => {
                    markAsRead(notification.id);
                  }}
                  sx={{
                    backgroundColor: notification.read
                      ? "inherit"
                      : "action.hover",
                  }}
                >
                  <ListItemText
                    primary={notification.title}
                    secondary={notification.message}
                    primaryTypographyProps={{ fontWeight: "medium" }}
                    secondaryTypographyProps={{ color: "text.secondary" }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {notification.createdAt?.toDate().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Typography>
                </MenuItem>
              ))}
            </List>
          )
        ]}
      </Menu>
    </Box>
  );
};

export default Notifications;

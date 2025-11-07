import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Share as ShareIcon,
  Facebook,
  Twitter,
  LinkedIn,
  WhatsApp,
  Telegram,
  ContentCopy,
  Email,
} from '@mui/icons-material';
import { showToast } from '../../utils/toastUtils';
import logger from '../../utils/logger';

/**
 * Share component with multiple sharing options
 * Supports social media, messaging apps, and clipboard
 */

const ShareButton = ({ 
  url, 
  title, 
  description,
  imageUrl,
  size = 'medium',
  color = 'default',
  variant = 'icon' // 'icon' or 'button'
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const shareUrl = url || window.location.href;
  const shareTitle = title || document.title;
  const shareDescription = description || '';

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast.success('Link copied to clipboard!');
      handleClose();
    } catch (error) {
      logger.error('Failed to copy to clipboard:', error);
      showToast.error('Failed to copy link');
    }
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(shareTitle);
    const body = encodeURIComponent(`${shareDescription}\n\n${shareUrl}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
    handleClose();
  };

  const shareViaFacebook = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(fbUrl, '_blank', 'width=600,height=400');
    handleClose();
  };

  const shareViaTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
    handleClose();
  };

  const shareViaLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(linkedInUrl, '_blank', 'width=600,height=400');
    handleClose();
  };

  const shareViaWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`;
    window.open(whatsappUrl, '_blank');
    handleClose();
  };

  const shareViaTelegram = () => {
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`;
    window.open(telegramUrl, '_blank');
    handleClose();
  };

  const useNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareDescription,
          url: shareUrl,
        });
        handleClose();
      } catch (error) {
        if (error.name !== 'AbortError') {
          logger.error('Native share failed:', error);
        }
      }
    }
  };

  const shareOptions = [
    {
      name: 'Copy Link',
      icon: <ContentCopy />,
      action: copyToClipboard,
    },
    {
      name: 'WhatsApp',
      icon: <WhatsApp />,
      action: shareViaWhatsApp,
      color: '#25D366',
    },
    {
      name: 'Facebook',
      icon: <Facebook />,
      action: shareViaFacebook,
      color: '#1877F2',
    },
    {
      name: 'Twitter',
      icon: <Twitter />,
      action: shareViaTwitter,
      color: '#1DA1F2',
    },
    {
      name: 'LinkedIn',
      icon: <LinkedIn />,
      action: shareViaLinkedIn,
      color: '#0A66C2',
    },
    {
      name: 'Telegram',
      icon: <Telegram />,
      action: shareViaTelegram,
      color: '#0088cc',
    },
    {
      name: 'Email',
      icon: <Email />,
      action: shareViaEmail,
    },
  ];

  return (
    <>
      <Tooltip title="Share">
        <IconButton
          onClick={navigator.share ? useNativeShare : handleClick}
          size={size}
          color={color}
          aria-label="share"
        >
          <ShareIcon />
        </IconButton>
      </Tooltip>

      {!navigator.share && (
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          {shareOptions.map((option) => (
            <MenuItem key={option.name} onClick={option.action}>
              <ListItemIcon sx={{ color: option.color || 'inherit' }}>
                {option.icon}
              </ListItemIcon>
              <ListItemText>{option.name}</ListItemText>
            </MenuItem>
          ))}
        </Menu>
      )}
    </>
  );
};

export default ShareButton;

import React from 'react';
import { Box, Typography, Button, Paper, Stack } from '@mui/material';
import {
  SearchOff,
  StorefrontOutlined,
  LeaderboardOutlined,
  LocationOnOutlined,
  FavoriteBorderOutlined,
  NotificationsNoneOutlined,
  InboxOutlined,
  ErrorOutline,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

/**
 * Beautiful empty state components with actionable CTAs
 */

const EmptyStateBase = ({ icon: Icon, title, description, action, illustration, color = 'primary.main' }) => (
  <Paper
    elevation={0}
    sx={{
      p: 6,
      textAlign: 'center',
      backgroundColor: 'transparent',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 300,
    }}
  >
    {illustration || (
      <Icon
        sx={{
          fontSize: 120,
          color: color,
          opacity: 0.3,
          mb: 3,
        }}
      />
    )}
    
    <Typography variant="h5" fontWeight="bold" color="text.primary" gutterBottom>
      {title}
    </Typography>
    
    <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 500 }}>
      {description}
    </Typography>
    
    {action && (
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        {action}
      </Stack>
    )}
  </Paper>
);

export const NoBrandsEmpty = () => {
  const navigate = useNavigate();
  
  return (
    <EmptyStateBase
      icon={StorefrontOutlined}
      title="No Brands Found"
      description="You haven't registered any brands yet. Start by creating your first brand profile to connect with potential franchisees."
      action={
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/dashboard/register-brand')}
        >
          Register Your First Brand
        </Button>
      }
    />
  );
};

export const NoLeadsEmpty = () => (
  <EmptyStateBase
    icon={LeaderboardOutlined}
    title="No Leads Yet"
    description="You haven't received any franchise inquiries yet. Make sure your brand profile is complete and attractive to potential franchisees."
    action={
      <>
        <Button variant="outlined" size="large">
          View Optimization Tips
        </Button>
        <Button variant="contained" size="large">
          Preview Your Profile
        </Button>
      </>
    }
  />
);

export const NoSearchResultsEmpty = ({ searchQuery, onClear }) => (
  <EmptyStateBase
    icon={SearchOff}
    title="No Results Found"
    description={
      searchQuery
        ? `We couldn't find any franchises matching "${searchQuery}". Try adjusting your search terms or filters.`
        : "No franchises match your current filters. Try broadening your search criteria."
    }
    action={
      <>
        {searchQuery && (
          <Button variant="outlined" size="large" onClick={onClear}>
            Clear Search
          </Button>
        )}
        <Button variant="contained" size="large" onClick={onClear}>
          Reset All Filters
        </Button>
      </>
    }
  />
);

export const NoLocationsEmpty = () => {
  const navigate = useNavigate();
  
  return (
    <EmptyStateBase
      icon={LocationOnOutlined}
      title="No Locations Added"
      description="Add franchise locations to help potential franchisees find opportunities in their area."
      action={
        <Button variant="contained" size="large" onClick={() => navigate('/dashboard/brands')}>
          Add Location
        </Button>
      }
    />
  );
};

export const NoFavoritesEmpty = () => {
  const navigate = useNavigate();
  
  return (
    <EmptyStateBase
      icon={FavoriteBorderOutlined}
      title="No Favorites Yet"
      description="You haven't saved any favorite franchises. Browse brands and click the heart icon to save them for later."
      action={
        <Button variant="contained" size="large" onClick={() => navigate('/brands')}>
          Discover Franchises
        </Button>
      }
    />
  );
};

export const NoNotificationsEmpty = () => (
  <EmptyStateBase
    icon={NotificationsNoneOutlined}
    title="All Caught Up!"
    description="You don't have any notifications right now. We'll notify you when there's something new."
    color="success.main"
  />
);

export const NoMessagesEmpty = () => (
  <EmptyStateBase
    icon={InboxOutlined}
    title="No Messages"
    description="Your inbox is empty. When you receive messages from brand owners or inquiries, they'll appear here."
  />
);

export const ErrorEmpty = ({ message, onRetry }) => (
  <EmptyStateBase
    icon={ErrorOutline}
    title="Oops! Something went wrong"
    description={message || "We're having trouble loading this content. Please try again."}
    action={
      onRetry && (
        <Button variant="contained" size="large" onClick={onRetry}>
          Try Again
        </Button>
      )
    }
    color="error.main"
  />
);

export const NoDataEmpty = ({ title, description, icon: Icon = InboxOutlined }) => (
  <EmptyStateBase
    icon={Icon}
    title={title || "No Data Available"}
    description={description || "There's no data to display at the moment."}
  />
);

export const ComingSoonEmpty = ({ feature }) => (
  <EmptyStateBase
    icon={ErrorOutline}
    title="Coming Soon"
    description={`${feature} is currently under development. We'll notify you when it's ready!`}
    color="info.main"
  />
);

export default EmptyStateBase;

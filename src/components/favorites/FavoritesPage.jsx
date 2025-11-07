import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  IconButton,
  Chip,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Tabs,
  Tab,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Badge,
  Divider,
  Paper,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Folder,
  Add,
  Edit,
  Delete,
  MoreVert,
  GridView,
  ViewList,
  Close,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useFavorites from '../../hooks/useFavorites';

const MotionCard = motion(Card);

/**
 * Favorite Button Component
 * Can be used on brand cards
 */
export const FavoriteButton = ({ brand, size = 'medium', showLabel = false }) => {
  const { isFavorite, toggleFavorite, getBrandCollections } = useFavorites();
  const [anchorEl, setAnchorEl] = useState(null);
  const [showCollectionDialog, setShowCollectionDialog] = useState(false);
  
  const brandIsFavorite = isFavorite(brand.id);
  const brandCollections = getBrandCollections(brand.id);

  const handleClick = (e) => {
    e.stopPropagation();
    if (brandIsFavorite) {
      setAnchorEl(e.currentTarget);
    } else {
      toggleFavorite(brand);
    }
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    toggleFavorite(brand);
    handleMenuClose();
  };

  const handleManageCollections = (e) => {
    e.stopPropagation();
    setShowCollectionDialog(true);
    handleMenuClose();
  };

  return (
    <>
      <Tooltip title={brandIsFavorite ? 'Remove from favorites' : 'Add to favorites'}>
        <IconButton
          onClick={handleClick}
          size={size}
          sx={{
            color: brandIsFavorite ? 'error.main' : 'text.secondary',
            '&:hover': {
              color: 'error.main',
              transform: 'scale(1.1)',
            },
            transition: 'all 0.2s',
          }}
        >
          <Badge badgeContent={brandCollections.length > 1 ? brandCollections.length : 0} color="primary">
            {brandIsFavorite ? <Favorite /> : <FavoriteBorder />}
          </Badge>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleManageCollections}>
          <ListItemIcon>
            <Folder />
          </ListItemIcon>
          <ListItemText>Manage Collections</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleRemove}>
          <ListItemIcon>
            <Delete />
          </ListItemIcon>
          <ListItemText>Remove Favorite</ListItemText>
        </MenuItem>
      </Menu>

      <CollectionManagerDialog
        open={showCollectionDialog}
        onClose={() => setShowCollectionDialog(false)}
        brand={brand}
      />
    </>
  );
};

/**
 * Collection Manager Dialog
 * Manage which collections a brand belongs to
 */
const CollectionManagerDialog = ({ open, onClose, brand }) => {
  const {
    collections,
    getBrandCollections,
    addToCollection,
    removeFromCollection,
  } = useFavorites();

  const brandCollections = getBrandCollections(brand.id);
  const brandCollectionIds = brandCollections.map(c => c.id);

  const handleToggleCollection = (collectionId) => {
    if (brandCollectionIds.includes(collectionId)) {
      removeFromCollection(brand.id, collectionId);
    } else {
      addToCollection(brand.id, collectionId);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Manage Collections
        <Typography variant="body2" color="text.secondary">
          {brand.brandName}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={1} sx={{ mt: 1 }}>
          {collections.map(collection => {
            const isSelected = brandCollectionIds.includes(collection.id);
            return (
              <Paper
                key={collection.id}
                onClick={() => handleToggleCollection(collection.id)}
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  border: isSelected ? 2 : 1,
                  borderColor: isSelected ? 'primary.main' : 'divider',
                  backgroundColor: isSelected ? 'primary.50' : 'background.paper',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'primary.50',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Folder sx={{ color: collection.color || 'primary.main' }} />
                    <Typography>{collection.name}</Typography>
                  </Box>
                  {isSelected && <Favorite color="primary" />}
                </Box>
              </Paper>
            );
          })}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Done</Button>
      </DialogActions>
    </Dialog>
  );
};

/**
 * Favorites Page Component
 * Full page view of favorite brands with collections
 */
const FavoritesPage = () => {
  const navigate = useNavigate();
  const {
    collections,
    getBrandsByCollection,
    getCollectionStats,
    createCollection,
    updateCollection,
    deleteCollection,
  } = useFavorites();

  const [selectedCollection, setSelectedCollection] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [showNewCollectionDialog, setShowNewCollectionDialog] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);

  const collectionStats = getCollectionStats();
  const brands = getBrandsByCollection(selectedCollection);

  const handleBrandClick = (brand) => {
    navigate(`/brands/${brand.slug}`);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Favorite Brands
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Organize and manage your saved franchise opportunities
        </Typography>
      </Box>

      {/* Collections Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Tabs
            value={selectedCollection}
            onChange={(e, newValue) => setSelectedCollection(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            {collectionStats.map(collection => (
              <Tab
                key={collection.id}
                value={collection.id}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Folder sx={{ fontSize: 18, color: collection.color }} />
                    {collection.name}
                    <Chip label={collection.count} size="small" />
                  </Box>
                }
              />
            ))}
          </Tabs>

          <Stack direction="row" spacing={1}>
            <Tooltip title="Grid view">
              <IconButton
                onClick={() => setViewMode('grid')}
                color={viewMode === 'grid' ? 'primary' : 'default'}
              >
                <GridView />
              </IconButton>
            </Tooltip>
            <Tooltip title="List view">
              <IconButton
                onClick={() => setViewMode('list')}
                color={viewMode === 'list' ? 'primary' : 'default'}
              >
                <ViewList />
              </IconButton>
            </Tooltip>
            <Button
              startIcon={<Add />}
              onClick={() => setShowNewCollectionDialog(true)}
              variant="outlined"
              size="small"
            >
              New Collection
            </Button>
          </Stack>
        </Box>
      </Box>

      {/* Brands Grid/List */}
      {brands.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Folder sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No brands in this collection
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/brands')}
            sx={{ mt: 2 }}
          >
            Browse Brands
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {brands.map((brand, index) => (
            <Grid item xs={12} sm={viewMode === 'grid' ? 6 : 12} md={viewMode === 'grid' ? 4 : 12} key={brand.id}>
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                sx={{ height: '100%', position: 'relative' }}
              >
                <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
                  <FavoriteButton brand={brand} />
                </Box>

                <CardActionArea onClick={() => handleBrandClick(brand)} sx={{ height: '100%' }}>
                  {viewMode === 'grid' ? (
                    <>
                      {brand.logoUrl && (
                        <CardMedia
                          component="img"
                          height="180"
                          image={brand.logoUrl}
                          alt={brand.brandName}
                        />
                      )}
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {brand.brandName}
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                          <Chip label={brand.category} size="small" />
                          {brand.initialInvestment && (
                            <Chip
                              label={`$${(brand.initialInvestment / 1000).toFixed(0)}K`}
                              size="small"
                              color="primary"
                            />
                          )}
                        </Stack>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {brand.description}
                        </Typography>
                      </CardContent>
                    </>
                  ) : (
                    <Box sx={{ display: 'flex', p: 2 }}>
                      {brand.logoUrl && (
                        <CardMedia
                          component="img"
                          sx={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 1, mr: 2 }}
                          image={brand.logoUrl}
                          alt={brand.brandName}
                        />
                      )}
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" gutterBottom>
                          {brand.brandName}
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                          <Chip label={brand.category} size="small" />
                          {brand.initialInvestment && (
                            <Chip
                              label={`$${(brand.initialInvestment / 1000).toFixed(0)}K`}
                              size="small"
                              color="primary"
                            />
                          )}
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                          {brand.description}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </CardActionArea>
              </MotionCard>
            </Grid>
          ))}
        </Grid>
      )}

      {/* New Collection Dialog */}
      <NewCollectionDialog
        open={showNewCollectionDialog}
        onClose={() => setShowNewCollectionDialog(false)}
        onCreate={createCollection}
      />
    </Box>
  );
};

/**
 * New Collection Dialog
 */
const NewCollectionDialog = ({ open, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#2196f3');

  const colors = [
    '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
    '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50',
    '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800',
  ];

  const handleCreate = () => {
    if (name.trim()) {
      onCreate(name.trim(), color);
      setName('');
      setColor('#2196f3');
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Create New Collection</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          label="Collection Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mt: 1, mb: 3 }}
        />

        <Typography variant="body2" gutterBottom>
          Choose a color
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {colors.map(c => (
            <Box
              key={c}
              onClick={() => setColor(c)}
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: c,
                cursor: 'pointer',
                border: color === c ? 3 : 1,
                borderColor: color === c ? 'primary.main' : 'divider',
                '&:hover': {
                  transform: 'scale(1.1)',
                },
              }}
            />
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleCreate} variant="contained" disabled={!name.trim()}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FavoritesPage;

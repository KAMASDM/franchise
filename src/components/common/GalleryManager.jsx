import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  IconButton,
  Typography,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Zoom,
  Fade,
  Paper,
  alpha
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  MoreVert as MoreVertIcon,
  DragIndicator as DragIcon,
  ZoomIn as ZoomInIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const GalleryManager = ({
  images = [],
  primaryImageIndex = 0,
  onReorder,
  onDelete,
  onSetPrimary,
  onEdit,
  maxImages = 10,
  minImages = 3
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const handleMenuOpen = (event, index) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedIndex(index);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedIndex(null);
  };

  const handleSetPrimary = () => {
    if (selectedIndex !== null) {
      onSetPrimary(selectedIndex);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    if (selectedIndex !== null) {
      onDelete(selectedIndex);
    }
    handleMenuClose();
  };

  const handleEdit = () => {
    if (selectedIndex !== null && onEdit) {
      onEdit(selectedIndex);
    }
    handleMenuClose();
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;

    if (sourceIndex === destIndex) return;

    onReorder(sourceIndex, destIndex);
  };

  const getImageSrc = (image) => {
    if (typeof image === 'string') {
      return image;
    }
    return URL.createObjectURL(image);
  };

  const canDelete = images.length > minImages;
  const canAddMore = images.length < maxImages;

  return (
    <Box>
      {/* Gallery Info */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box>
          <Typography variant="subtitle1" fontWeight={600}>
            Gallery Images ({images.length}/{maxImages})
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {canAddMore 
              ? `You can add ${maxImages - images.length} more image(s)` 
              : 'Maximum images reached'}
          </Typography>
        </Box>
        {images.length >= minImages && (
          <Chip
            icon={<StarIcon />}
            label="Ready"
            color="success"
            size="small"
          />
        )}
      </Box>

      {images.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: 'center',
            bgcolor: alpha('#000', 0.02),
            border: '1px dashed',
            borderColor: 'divider'
          }}
        >
          <Typography variant="body2" color="text.secondary">
            No images uploaded yet. Upload at least {minImages} images to continue.
          </Typography>
        </Paper>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="gallery" direction="horizontal">
            {(provided, snapshot) => (
              <Box
                ref={provided.innerRef}
                {...provided.droppableProps}
                sx={{
                  bgcolor: snapshot.isDraggingOver ? alpha('#1976d2', 0.05) : 'transparent',
                  borderRadius: 1,
                  p: snapshot.isDraggingOver ? 1 : 0,
                  transition: 'all 0.2s ease'
                }}
              >
                <Grid container spacing={2}>
                  {images.map((image, index) => (
                    <Draggable
                      key={`image-${index}`}
                      draggableId={`image-${index}`}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <Grid
                          item
                          xs={6}
                          sm={4}
                          md={3}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                        >
                          <Zoom in timeout={200 + index * 50}>
                            <Card
                              elevation={snapshot.isDragging ? 8 : 2}
                              sx={{
                                position: 'relative',
                                aspectRatio: '4/3',
                                overflow: 'visible',
                                transform: snapshot.isDragging ? 'rotate(5deg)' : 'none',
                                transition: 'transform 0.2s ease',
                                '&:hover .image-overlay': {
                                  opacity: 1
                                },
                                '&:hover .drag-handle': {
                                  opacity: 1
                                }
                              }}
                            >
                              {/* Image */}
                              <Box
                                component="img"
                                src={getImageSrc(image)}
                                alt={`Gallery ${index + 1}`}
                                sx={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                  display: 'block'
                                }}
                              />

                              {/* Primary Badge */}
                              {index === primaryImageIndex && (
                                <Chip
                                  icon={<StarIcon />}
                                  label="Primary"
                                  color="primary"
                                  size="small"
                                  sx={{
                                    position: 'absolute',
                                    top: 8,
                                    left: 8,
                                    fontWeight: 600,
                                    zIndex: 2
                                  }}
                                />
                              )}

                              {/* Drag Handle */}
                              <Box
                                {...provided.dragHandleProps}
                                className="drag-handle"
                                sx={{
                                  position: 'absolute',
                                  top: 8,
                                  right: 8,
                                  bgcolor: 'rgba(0, 0, 0, 0.7)',
                                  borderRadius: 1,
                                  cursor: 'grab',
                                  opacity: 0,
                                  transition: 'opacity 0.2s ease',
                                  zIndex: 2,
                                  '&:active': {
                                    cursor: 'grabbing'
                                  }
                                }}
                              >
                                <DragIcon sx={{ color: 'white', fontSize: 20, display: 'block' }} />
                              </Box>

                              {/* Overlay Controls */}
                              <Fade in>
                                <Box
                                  className="image-overlay"
                                  sx={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    bgcolor: 'rgba(0, 0, 0, 0.7)',
                                    backdropFilter: 'blur(5px)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    p: 1,
                                    opacity: 0,
                                    transition: 'opacity 0.2s ease'
                                  }}
                                >
                                  <Typography variant="caption" color="white" noWrap>
                                    Image {index + 1}
                                  </Typography>
                                  
                                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                                    {/* Preview */}
                                    <Tooltip title="Preview" arrow>
                                      <IconButton
                                        size="small"
                                        onClick={() => setPreviewImage(getImageSrc(image))}
                                        sx={{
                                          color: 'white',
                                          bgcolor: alpha('#fff', 0.1),
                                          '&:hover': {
                                            bgcolor: alpha('#fff', 0.2)
                                          }
                                        }}
                                      >
                                        <ZoomInIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>

                                    {/* Set Primary */}
                                    {index !== primaryImageIndex && (
                                      <Tooltip title="Set as primary" arrow>
                                        <IconButton
                                          size="small"
                                          onClick={() => onSetPrimary(index)}
                                          sx={{
                                            color: 'white',
                                            bgcolor: alpha('#fff', 0.1),
                                            '&:hover': {
                                              bgcolor: alpha('#fff', 0.2)
                                            }
                                          }}
                                        >
                                          <StarBorderIcon fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                    )}

                                    {/* Delete */}
                                    {canDelete && (
                                      <Tooltip title="Delete" arrow>
                                        <IconButton
                                          size="small"
                                          onClick={() => onDelete(index)}
                                          sx={{
                                            color: 'white',
                                            bgcolor: alpha('#f44336', 0.3),
                                            '&:hover': {
                                              bgcolor: alpha('#f44336', 0.5)
                                            }
                                          }}
                                        >
                                          <DeleteIcon fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                    )}

                                    {/* More Options */}
                                    <Tooltip title="More options" arrow>
                                      <IconButton
                                        size="small"
                                        onClick={(e) => handleMenuOpen(e, index)}
                                        sx={{
                                          color: 'white',
                                          bgcolor: alpha('#fff', 0.1),
                                          '&:hover': {
                                            bgcolor: alpha('#fff', 0.2)
                                          }
                                        }}
                                      >
                                        <MoreVertIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  </Box>
                                </Box>
                              </Fade>

                              {/* Image Number Badge */}
                              <Box
                                sx={{
                                  position: 'absolute',
                                  bottom: 8,
                                  left: 8,
                                  bgcolor: 'rgba(0, 0, 0, 0.6)',
                                  borderRadius: '50%',
                                  width: 28,
                                  height: 28,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  zIndex: 1
                                }}
                              >
                                <Typography variant="caption" color="white" fontWeight={600}>
                                  {index + 1}
                                </Typography>
                              </Box>
                            </Card>
                          </Zoom>
                        </Grid>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Grid>
              </Box>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {selectedIndex !== primaryImageIndex && (
          <MenuItem onClick={handleSetPrimary}>
            <ListItemIcon>
              <StarIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Set as Primary</ListItemText>
          </MenuItem>
        )}
        {onEdit && (
          <MenuItem onClick={handleEdit}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit/Crop</ListItemText>
          </MenuItem>
        )}
        {canDelete && (
          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        )}
      </Menu>

      {/* Image Preview Dialog */}
      {previewImage && (
        <Box
          onClick={() => setPreviewImage(null)}
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0, 0, 0, 0.9)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            p: 2
          }}
        >
          <img
            src={previewImage}
            alt="Preview"
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              objectFit: 'contain',
              borderRadius: 8
            }}
          />
          <IconButton
            onClick={() => setPreviewImage(null)}
            sx={{
              position: 'absolute',
              top: 20,
              right: 20,
              color: 'white',
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.7)'
              }
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      )}

      {/* Help Text */}
      <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
        💡 <strong>Tip:</strong> Drag images to reorder. The first image will be used as your brand's primary image.
        {!canDelete && ' Upload at least ' + (minImages + 1) + ' images to enable deletion.'}
      </Typography>
    </Box>
  );
};

export default GalleryManager;

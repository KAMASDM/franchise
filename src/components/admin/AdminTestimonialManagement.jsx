import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  CircularProgress,
  Alert,
  Chip,
  Avatar,
  Tooltip,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  ArrowUpward,
  ArrowDownward,
  VideoLibrary,
  Image as ImageIcon,
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { db, storage } from '../../firebase/firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import logger from '../../utils/logger';
import toast from 'react-hot-toast';

const AdminTestimonialManagement = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    authorName: '',
    authorTitle: '',
    authorImage: '',
    brandName: '',
    testimonialText: '',
    videoUrl: '',
    thumbnailUrl: '',
    duration: '',
    isActive: true,
    order: 0,
  });

  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({ video: 0, thumbnail: 0 });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'videoTestimonials'), orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      const testimonialsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTestimonials(testimonialsData);
    } catch (error) {
      logger.error('Error fetching testimonials:', error);
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (testimonial = null) => {
    if (testimonial) {
      setEditingTestimonial(testimonial);
      setFormData({
        authorName: testimonial.authorName || '',
        authorTitle: testimonial.authorTitle || '',
        authorImage: testimonial.authorImage || '',
        brandName: testimonial.brandName || '',
        testimonialText: testimonial.testimonialText || '',
        videoUrl: testimonial.videoUrl || '',
        thumbnailUrl: testimonial.thumbnailUrl || '',
        duration: testimonial.duration || '',
        isActive: testimonial.isActive !== false,
        order: testimonial.order || 0,
      });
    } else {
      setEditingTestimonial(null);
      setFormData({
        authorName: '',
        authorTitle: '',
        authorImage: '',
        brandName: '',
        testimonialText: '',
        videoUrl: '',
        thumbnailUrl: '',
        duration: '',
        isActive: true,
        order: testimonials.length,
      });
    }
    setVideoFile(null);
    setThumbnailFile(null);
    setUploadProgress({ video: 0, thumbnail: 0 });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTestimonial(null);
    setVideoFile(null);
    setThumbnailFile(null);
  };

  const uploadFile = (file, path, progressKey) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress((prev) => ({ ...prev, [progressKey]: progress }));
        },
        (error) => {
          logger.error(`Error uploading ${progressKey}:`, error);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  };

  const handleSubmit = async () => {
    try {
      setUploading(true);

      // Validate required fields
      if (!formData.authorName || !formData.authorTitle) {
        toast.error('Please fill in author name and title');
        return;
      }

      if (!editingTestimonial && !videoFile) {
        toast.error('Please upload a video');
        return;
      }

      let videoUrl = formData.videoUrl;
      let thumbnailUrl = formData.thumbnailUrl;

      // Upload video if new file is selected
      if (videoFile) {
        const videoPath = `testimonials/videos/${Date.now()}_${videoFile.name}`;
        videoUrl = await uploadFile(videoFile, videoPath, 'video');
      }

      // Upload thumbnail if new file is selected
      if (thumbnailFile) {
        const thumbnailPath = `testimonials/thumbnails/${Date.now()}_${thumbnailFile.name}`;
        thumbnailUrl = await uploadFile(thumbnailFile, thumbnailPath, 'thumbnail');
      }

      const testimonialData = {
        ...formData,
        videoUrl,
        thumbnailUrl,
        updatedAt: serverTimestamp(),
      };

      if (editingTestimonial) {
        // Update existing testimonial
        await updateDoc(doc(db, 'videoTestimonials', editingTestimonial.id), testimonialData);
        toast.success('Testimonial updated successfully');
      } else {
        // Create new testimonial
        await addDoc(collection(db, 'videoTestimonials'), {
          ...testimonialData,
          createdAt: serverTimestamp(),
        });
        toast.success('Testimonial created successfully');
      }

      handleCloseDialog();
      fetchTestimonials();
    } catch (error) {
      logger.error('Error saving testimonial:', error);
      toast.error('Failed to save testimonial');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (testimonial) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) {
      return;
    }

    try {
      // Delete from Firestore
      await deleteDoc(doc(db, 'videoTestimonials', testimonial.id));

      // Optional: Delete files from storage
      // Note: You may want to keep files for backup purposes
      // Uncomment if you want to delete files immediately
      /*
      if (testimonial.videoUrl) {
        const videoRef = ref(storage, testimonial.videoUrl);
        await deleteObject(videoRef).catch(() => {});
      }
      if (testimonial.thumbnailUrl) {
        const thumbnailRef = ref(storage, testimonial.thumbnailUrl);
        await deleteObject(thumbnailRef).catch(() => {});
      }
      */

      toast.success('Testimonial deleted successfully');
      fetchTestimonials();
    } catch (error) {
      logger.error('Error deleting testimonial:', error);
      toast.error('Failed to delete testimonial');
    }
  };

  const handleToggleActive = async (testimonial) => {
    try {
      await updateDoc(doc(db, 'videoTestimonials', testimonial.id), {
        isActive: !testimonial.isActive,
        updatedAt: serverTimestamp(),
      });
      toast.success('Status updated successfully');
      fetchTestimonials();
    } catch (error) {
      logger.error('Error toggling active status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleReorder = async (result) => {
    if (!result.destination) return;

    const items = Array.from(testimonials);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update local state immediately for better UX
    setTestimonials(items);

    // Update order in Firestore
    try {
      const updatePromises = items.map((item, index) =>
        updateDoc(doc(db, 'videoTestimonials', item.id), { order: index })
      );
      await Promise.all(updatePromises);
      toast.success('Order updated successfully');
    } catch (error) {
      logger.error('Error reordering testimonials:', error);
      toast.error('Failed to update order');
      fetchTestimonials(); // Revert on error
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Video Testimonials
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
            },
          }}
        >
          Add Testimonial
        </Button>
      </Box>

      {testimonials.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <VideoLibrary sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No testimonials yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Add your first video testimonial to showcase success stories
          </Typography>
          <Button variant="outlined" startIcon={<Add />} onClick={() => handleOpenDialog()}>
            Add Testimonial
          </Button>
        </Paper>
      ) : (
        <DragDropContext onDragEnd={handleReorder}>
          <Droppable droppableId="testimonials">
            {(provided) => (
              <TableContainer component={Paper} {...provided.droppableProps} ref={provided.innerRef}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Order</TableCell>
                      <TableCell>Preview</TableCell>
                      <TableCell>Author</TableCell>
                      <TableCell>Brand</TableCell>
                      <TableCell>Testimonial</TableCell>
                      <TableCell>Duration</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {testimonials.map((testimonial, index) => (
                      <Draggable key={testimonial.id} draggableId={testimonial.id} index={index}>
                        {(provided, snapshot) => (
                          <TableRow
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{
                              bgcolor: snapshot.isDragging ? 'action.hover' : 'inherit',
                              '&:hover': { bgcolor: 'action.hover' },
                            }}
                          >
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                #{index + 1}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Avatar
                                src={testimonial.thumbnailUrl}
                                variant="rounded"
                                sx={{ width: 80, height: 45 }}
                              >
                                <VideoLibrary />
                              </Avatar>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {testimonial.authorImage && (
                                  <Avatar src={testimonial.authorImage} sx={{ width: 32, height: 32 }} />
                                )}
                                <Box>
                                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    {testimonial.authorName}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {testimonial.authorTitle}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">{testimonial.brandName || '-'}</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography
                                variant="body2"
                                sx={{
                                  maxWidth: 200,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {testimonial.testimonialText || '-'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">{testimonial.duration || '-'}</Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={testimonial.isActive !== false ? 'Active' : 'Inactive'}
                                color={testimonial.isActive !== false ? 'success' : 'default'}
                                size="small"
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Tooltip title="Edit">
                                <IconButton size="small" onClick={() => handleOpenDialog(testimonial)}>
                                  <Edit fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title={testimonial.isActive !== false ? 'Deactivate' : 'Activate'}>
                                <IconButton
                                  size="small"
                                  onClick={() => handleToggleActive(testimonial)}
                                  color={testimonial.isActive !== false ? 'success' : 'default'}
                                >
                                  <Switch
                                    checked={testimonial.isActive !== false}
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleToggleActive(testimonial);
                                    }}
                                  />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton
                                  size="small"
                                  onClick={() => handleDelete(testimonial)}
                                  color="error"
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            {/* Video Upload */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Video {!editingTestimonial && '*'}
              </Typography>
              <Button
                variant="outlined"
                component="label"
                startIcon={<VideoLibrary />}
                fullWidth
                sx={{ mb: 1 }}
              >
                {videoFile ? videoFile.name : 'Upload Video (MP4, WebM)'}
                <input
                  type="file"
                  hidden
                  accept="video/mp4,video/webm"
                  onChange={(e) => setVideoFile(e.target.files[0])}
                />
              </Button>
              {uploadProgress.video > 0 && uploadProgress.video < 100 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress variant="determinate" value={uploadProgress.video} size={20} />
                  <Typography variant="caption">{Math.round(uploadProgress.video)}%</Typography>
                </Box>
              )}
              {formData.videoUrl && !videoFile && (
                <Typography variant="caption" color="text.secondary">
                  Current video uploaded
                </Typography>
              )}
            </Box>

            {/* Thumbnail Upload */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Thumbnail (Optional)
              </Typography>
              <Button
                variant="outlined"
                component="label"
                startIcon={<ImageIcon />}
                fullWidth
                sx={{ mb: 1 }}
              >
                {thumbnailFile ? thumbnailFile.name : 'Upload Thumbnail (JPG, PNG)'}
                <input
                  type="file"
                  hidden
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={(e) => setThumbnailFile(e.target.files[0])}
                />
              </Button>
              {uploadProgress.thumbnail > 0 && uploadProgress.thumbnail < 100 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress variant="determinate" value={uploadProgress.thumbnail} size={20} />
                  <Typography variant="caption">{Math.round(uploadProgress.thumbnail)}%</Typography>
                </Box>
              )}
            </Box>

            {/* Author Information */}
            <TextField
              label="Author Name"
              value={formData.authorName}
              onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
              required
              fullWidth
            />

            <TextField
              label="Author Title/Position"
              value={formData.authorTitle}
              onChange={(e) => setFormData({ ...formData, authorTitle: e.target.value })}
              required
              fullWidth
              placeholder="e.g., Franchise Owner, CEO"
            />

            <TextField
              label="Author Image URL (Optional)"
              value={formData.authorImage}
              onChange={(e) => setFormData({ ...formData, authorImage: e.target.value })}
              fullWidth
              placeholder="https://example.com/author.jpg"
            />

            <TextField
              label="Brand Name"
              value={formData.brandName}
              onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
              fullWidth
              placeholder="e.g., Starbucks, McDonald's"
            />

            <TextField
              label="Testimonial Text"
              value={formData.testimonialText}
              onChange={(e) => setFormData({ ...formData, testimonialText: e.target.value })}
              multiline
              rows={3}
              fullWidth
              placeholder="Brief quote or testimonial text"
            />

            <TextField
              label="Video Duration"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              fullWidth
              placeholder="e.g., 2:30"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
              }
              label="Active (Show on website)"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={uploading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={uploading}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          >
            {uploading ? <CircularProgress size={24} /> : editingTestimonial ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminTestimonialManagement;

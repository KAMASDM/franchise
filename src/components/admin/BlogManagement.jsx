import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Alert,
  Snackbar,
  CircularProgress,
  Tooltip,
  Tab,
  Tabs,
  InputAdornment,
  Menu,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
  Stack,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Save,
  Cancel,
  CloudUpload,
  Visibility,
  VisibilityOff,
  Image,
  Article,
  Search,
  MoreVert,
  ContentCopy,
  Publish,
  FilterList,
} from '@mui/icons-material';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useBlogs, createBlog, updateBlog, deleteBlog, uploadBlogImage, generateSlug } from '../../hooks/useBlogs';

const CATEGORIES = [
  'Investment Tips',
  'Financing',
  'Market Analysis',
  'Success Tips',
  'Industry Trends',
  'Operations',
  'Legal & Compliance',
  'Marketing',
  'Technology',
  'Case Studies',
];

const BlogManagement = () => {
  const { blogs, loading: blogsLoading } = useBlogs({ includeDrafts: true });
  const [openDialog, setOpenDialog] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [tabValue, setTabValue] = useState(0); // 0: All, 1: Published, 2: Drafts
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    author: '',
    image: '',
    imageFile: null,
    tags: [],
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    readTime: '',
    status: 'draft',
  });
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  // Rich text editor configuration
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      ['link', 'image'],
      [{ align: [] }],
      ['clean'],
    ],
  };

  const quillFormats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'align',
  ];

  // Filter blogs based on tab and search
  const filteredBlogs = useMemo(() => {
    let filtered = blogs;

    // Filter by status (tab)
    if (tabValue === 1) {
      filtered = filtered.filter(blog => blog.status === 'published');
    } else if (tabValue === 2) {
      filtered = filtered.filter(blog => blog.status === 'draft');
    }

    // Filter by category
    if (filterCategory !== 'All') {
      filtered = filtered.filter(blog => blog.category === filterCategory);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(blog =>
        blog.title?.toLowerCase().includes(term) ||
        blog.excerpt?.toLowerCase().includes(term) ||
        blog.author?.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [blogs, tabValue, filterCategory, searchTerm]);

  const handleOpenDialog = (blog = null) => {
    if (blog) {
      setEditingBlog(blog);
      setFormData({
        title: blog.title || '',
        excerpt: blog.excerpt || '',
        content: blog.content || '',
        category: blog.category || '',
        author: blog.author || '',
        image: blog.image || '',
        imageFile: null,
        tags: blog.tags || [],
        metaTitle: blog.metaTitle || blog.title || '',
        metaDescription: blog.metaDescription || blog.excerpt || '',
        metaKeywords: blog.metaKeywords || '',
        readTime: blog.readTime || '',
        status: blog.status || 'draft',
      });
      setImagePreview(blog.image || '');
    } else {
      setEditingBlog(null);
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        category: '',
        author: '',
        image: '',
        imageFile: null,
        tags: [],
        metaTitle: '',
        metaDescription: '',
        metaKeywords: '',
        readTime: '',
        status: 'draft',
      });
      setImagePreview('');
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingBlog(null);
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      category: '',
      author: '',
      image: '',
      imageFile: null,
      tags: [],
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
      readTime: '',
      status: 'draft',
    });
    setImagePreview('');
    setTagInput('');
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData({ ...formData, imageFile: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToDelete),
    });
  };

  const calculateReadTime = (content) => {
    const wordsPerMinute = 200;
    const textContent = content.replace(/<[^>]*>/g, ''); // Strip HTML
    const wordCount = textContent.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  const handleSave = async (publishNow = false) => {
    try {
      setSaving(true);

      // Validation
      if (!formData.title.trim()) {
        setSnackbar({ open: true, message: 'Title is required', severity: 'error' });
        setSaving(false);
        return;
      }

      if (!formData.excerpt.trim()) {
        setSnackbar({ open: true, message: 'Excerpt is required', severity: 'error' });
        setSaving(false);
        return;
      }

      if (!formData.content.trim()) {
        setSnackbar({ open: true, message: 'Content is required', severity: 'error' });
        setSaving(false);
        return;
      }

      if (!formData.category) {
        setSnackbar({ open: true, message: 'Category is required', severity: 'error' });
        setSaving(false);
        return;
      }

      if (!formData.author.trim()) {
        setSnackbar({ open: true, message: 'Author is required', severity: 'error' });
        setSaving(false);
        return;
      }

      // Calculate read time if not provided
      const readTime = formData.readTime || calculateReadTime(formData.content);

      // Auto-fill SEO fields if empty
      const metaTitle = formData.metaTitle || formData.title;
      const metaDescription = formData.metaDescription || formData.excerpt;

      let imageUrl = formData.image;

      // Upload new image if selected
      if (formData.imageFile) {
        const tempBlogId = editingBlog?.id || `temp-${Date.now()}`;
        imageUrl = await uploadBlogImage(formData.imageFile, tempBlogId);
      }

      const blogData = {
        title: formData.title.trim(),
        excerpt: formData.excerpt.trim(),
        content: formData.content,
        category: formData.category,
        author: formData.author.trim(),
        image: imageUrl,
        tags: formData.tags,
        metaTitle,
        metaDescription,
        metaKeywords: formData.metaKeywords,
        readTime,
        status: publishNow ? 'published' : formData.status,
      };

      if (editingBlog) {
        await updateBlog(editingBlog.id, blogData);
        setSnackbar({
          open: true,
          message: `Blog ${publishNow ? 'published' : 'updated'} successfully!`,
          severity: 'success',
        });
      } else {
        await createBlog(blogData);
        setSnackbar({
          open: true,
          message: `Blog ${publishNow ? 'published' : 'created'} successfully!`,
          severity: 'success',
        });
      }

      handleCloseDialog();
    } catch (error) {
      console.error('Error saving blog:', error);
      setSnackbar({
        open: true,
        message: `Error saving blog: ${error.message}`,
        severity: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (blog) => {
    setBlogToDelete(blog);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteBlog(blogToDelete.id, blogToDelete.image);
      setSnackbar({
        open: true,
        message: 'Blog deleted successfully!',
        severity: 'success',
      });
      setDeleteDialogOpen(false);
      setBlogToDelete(null);
    } catch (error) {
      console.error('Error deleting blog:', error);
      setSnackbar({
        open: true,
        message: `Error deleting blog: ${error.message}`,
        severity: 'error',
      });
    }
  };

  const handleMenuOpen = (event, blog) => {
    setAnchorEl(event.currentTarget);
    setSelectedBlog(blog);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedBlog(null);
  };

  const handleDuplicate = async (blog) => {
    try {
      const duplicatedBlog = {
        ...blog,
        title: `${blog.title} (Copy)`,
        status: 'draft',
      };
      delete duplicatedBlog.id;
      delete duplicatedBlog.createdAt;
      delete duplicatedBlog.updatedAt;
      delete duplicatedBlog.publishedAt;

      await createBlog(duplicatedBlog);
      setSnackbar({
        open: true,
        message: 'Blog duplicated successfully!',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Error duplicating blog: ${error.message}`,
        severity: 'error',
      });
    }
    handleMenuClose();
  };

  const handleToggleStatus = async (blog) => {
    try {
      const newStatus = blog.status === 'published' ? 'draft' : 'published';
      await updateBlog(blog.id, { status: newStatus });
      setSnackbar({
        open: true,
        message: `Blog ${newStatus === 'published' ? 'published' : 'unpublished'} successfully!`,
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Error updating status: ${error.message}`,
        severity: 'error',
      });
    }
    handleMenuClose();
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Blog Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create and manage blog posts with SEO optimization
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          size="large"
        >
          Create New Blog
        </Button>
      </Box>

      {/* Filters and Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label={`All (${blogs.length})`} />
          <Tab label={`Published (${blogs.filter(b => b.status === 'published').length})`} />
          <Tab label={`Drafts (${blogs.filter(b => b.status === 'draft').length})`} />
        </Tabs>
        <Box sx={{ p: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{ minWidth: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={filterCategory}
              label="Category"
              onChange={(e) => setFilterCategory(e.target.value)}
              startAdornment={<FilterList sx={{ ml: 1, mr: -0.5 }} />}
            >
              <MenuItem value="All">All Categories</MenuItem>
              {CATEGORIES.map(cat => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Blogs Grid */}
      {blogsLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : filteredBlogs.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <Article sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No blogs found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {searchTerm || filterCategory !== 'All'
              ? 'Try adjusting your filters'
              : 'Create your first blog post to get started'}
          </Typography>
          {!searchTerm && filterCategory === 'All' && (
            <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()}>
              Create New Blog
            </Button>
          )}
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredBlogs.map((blog) => (
            <Grid item xs={12} md={6} lg={4} key={blog.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {blog.image && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={blog.image}
                    alt={blog.title}
                    sx={{ objectFit: 'cover' }}
                  />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Chip
                      label={blog.status}
                      size="small"
                      color={blog.status === 'published' ? 'success' : 'default'}
                      icon={blog.status === 'published' ? <Visibility /> : <VisibilityOff />}
                    />
                    <Chip label={blog.category} size="small" variant="outlined" />
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ 
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {blog.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ 
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    mb: 2,
                  }}>
                    {blog.excerpt}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1 }}>
                    {blog.tags?.slice(0, 3).map((tag, index) => (
                      <Chip key={index} label={tag} size="small" variant="outlined" />
                    ))}
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    By {blog.author} • {blog.readTime}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <Box>
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => handleOpenDialog(blog)}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="More options">
                      <IconButton size="small" onClick={(e) => handleMenuOpen(e, blog)}>
                        <MoreVert />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {blog.views || 0} views
                  </Typography>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* More Options Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => handleToggleStatus(selectedBlog)}>
          <ListItemIcon>
            {selectedBlog?.status === 'published' ? <VisibilityOff /> : <Publish />}
          </ListItemIcon>
          <ListItemText>
            {selectedBlog?.status === 'published' ? 'Unpublish' : 'Publish'}
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleDuplicate(selectedBlog)}>
          <ListItemIcon>
            <ContentCopy />
          </ListItemIcon>
          <ListItemText>Duplicate</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleDeleteClick(selectedBlog)} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <Delete color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Create/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { maxHeight: '90vh' } }}
      >
        <DialogTitle>
          {editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3} sx={{ mt: 1 }}>
            {/* Basic Information */}
            <Typography variant="h6" sx={{ mt: 2 }}>Basic Information</Typography>
            
            <TextField
              label="Title"
              fullWidth
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              helperText={`Slug: ${generateSlug(formData.title || 'your-blog-title')}`}
            />

            <TextField
              label="Excerpt"
              fullWidth
              required
              multiline
              rows={3}
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              helperText="A brief summary of your blog post (shown in listings)"
            />

            <Box>
              <Typography variant="body2" gutterBottom sx={{ mb: 1 }}>
                Content *
              </Typography>
              <Box sx={{ 
                '& .ql-container': { minHeight: 300 },
                '& .ql-editor': { minHeight: 300 },
              }}>
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                  modules={quillModules}
                  formats={quillFormats}
                />
              </Box>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={formData.category}
                    label="Category"
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {CATEGORIES.map((cat) => (
                      <MenuItem key={cat} value={cat}>
                        {cat}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Author"
                  fullWidth
                  required
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                />
              </Grid>
            </Grid>

            <TextField
              label="Read Time"
              fullWidth
              value={formData.readTime}
              onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
              placeholder="e.g., 5 min read"
              helperText="Leave empty to auto-calculate based on content length"
            />

            {/* Featured Image */}
            <Typography variant="h6">Featured Image</Typography>
            
            <Box>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUpload />}
                fullWidth
              >
                Upload Featured Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </Button>
              {imagePreview && (
                <Box sx={{ mt: 2, position: 'relative' }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ width: '100%', maxHeight: 300, objectFit: 'cover', borderRadius: 8 }}
                  />
                </Box>
              )}
            </Box>

            {/* Tags */}
            <Typography variant="h6">Tags</Typography>
            
            <Box>
              <TextField
                label="Add Tags"
                fullWidth
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button onClick={handleAddTag} size="small">
                        Add
                      </Button>
                    </InputAdornment>
                  ),
                }}
                helperText="Press Enter or click Add to add tags"
              />
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
                {formData.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => handleDeleteTag(tag)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>

            {/* SEO Settings */}
            <Typography variant="h6">SEO Settings</Typography>
            
            <TextField
              label="Meta Title"
              fullWidth
              value={formData.metaTitle}
              onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
              helperText={`${formData.metaTitle.length}/60 characters (auto-filled from title if empty)`}
            />

            <TextField
              label="Meta Description"
              fullWidth
              multiline
              rows={2}
              value={formData.metaDescription}
              onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
              helperText={`${formData.metaDescription.length}/160 characters (auto-filled from excerpt if empty)`}
            />

            <TextField
              label="Meta Keywords"
              fullWidth
              value={formData.metaKeywords}
              onChange={(e) => setFormData({ ...formData, metaKeywords: e.target.value })}
              placeholder="franchise, investment, business"
              helperText="Comma-separated keywords for SEO"
            />

            {/* Status */}
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="published">Published</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleCloseDialog} disabled={saving}>
            Cancel
          </Button>
          <Button
            onClick={() => handleSave(false)}
            variant="outlined"
            disabled={saving}
            startIcon={saving ? <CircularProgress size={16} /> : <Save />}
          >
            Save as Draft
          </Button>
          <Button
            onClick={() => handleSave(true)}
            variant="contained"
            disabled={saving}
            startIcon={saving ? <CircularProgress size={16} /> : <Publish />}
          >
            Publish
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Blog Post</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{blogToDelete?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BlogManagement;

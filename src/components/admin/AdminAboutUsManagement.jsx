import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Grid,
  IconButton,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Save,
  Cancel,
  Upload as UploadIcon,
} from '@mui/icons-material';
import { db, storage } from '../../firebase/firebase';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import logger from '../../utils/logger';
import toast from 'react-hot-toast';

const AdminAboutUsManagement = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [aboutData, setAboutData] = useState({
    heroTitle: '',
    heroSubtitle: '',
    missionStatement: '',
    visionStatement: '',
    stats: [
      { number: '', label: '', icon: 'Business' },
      { number: '', label: '', icon: 'TrendingUp' },
      { number: '', label: '', icon: 'Star' },
      { number: '', label: '', icon: 'Timeline' },
    ],
    values: [],
    teamMembers: [],
    achievements: [],
    ctaTitle: '',
    ctaDescription: '',
    heroImage: '',
  });

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, 'aboutUs', 'content');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setAboutData({ ...aboutData, ...docSnap.data() });
      }
    } catch (error) {
      logger.error('Error fetching about data:', error);
      toast.error('Failed to load About Us data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const docRef = doc(db, 'aboutUs', 'content');
      await setDoc(docRef, {
        ...aboutData,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      
      toast.success('About Us content updated successfully!');
    } catch (error) {
      logger.error('Error saving about data:', error);
      toast.error('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const storageRef = ref(storage, `aboutUs/hero-${Date.now()}-${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        null,
        (error) => {
          logger.error('Upload error:', error);
          toast.error('Failed to upload image');
          setUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setAboutData({ ...aboutData, heroImage: downloadURL });
          toast.success('Image uploaded successfully');
          setUploading(false);
        }
      );
    } catch (error) {
      logger.error('Error uploading image:', error);
      toast.error('Failed to upload image');
      setUploading(false);
    }
  };

  const handleStatChange = (index, field, value) => {
    const newStats = [...aboutData.stats];
    newStats[index] = { ...newStats[index], [field]: value };
    setAboutData({ ...aboutData, stats: newStats });
  };

  const handleValueChange = (index, field, value) => {
    const newValues = [...aboutData.values];
    newValues[index] = { ...newValues[index], [field]: value };
    setAboutData({ ...aboutData, values: newValues });
  };

  const addValue = () => {
    setAboutData({
      ...aboutData,
      values: [...aboutData.values, { title: '', description: '', icon: 'Verified' }],
    });
  };

  const removeValue = (index) => {
    const newValues = aboutData.values.filter((_, i) => i !== index);
    setAboutData({ ...aboutData, values: newValues });
  };

  const handleTeamMemberChange = (index, field, value) => {
    const newTeam = [...aboutData.teamMembers];
    newTeam[index] = { ...newTeam[index], [field]: value };
    setAboutData({ ...aboutData, teamMembers: newTeam });
  };

  const addTeamMember = () => {
    setAboutData({
      ...aboutData,
      teamMembers: [...aboutData.teamMembers, { name: '', position: '', experience: '', avatar: '' }],
    });
  };

  const removeTeamMember = (index) => {
    const newTeam = aboutData.teamMembers.filter((_, i) => i !== index);
    setAboutData({ ...aboutData, teamMembers: newTeam });
  };

  const handleAchievementChange = (index, value) => {
    const newAchievements = [...aboutData.achievements];
    newAchievements[index] = value;
    setAboutData({ ...aboutData, achievements: newAchievements });
  };

  const addAchievement = () => {
    setAboutData({
      ...aboutData,
      achievements: [...aboutData.achievements, ''],
    });
  };

  const removeAchievement = (index) => {
    const newAchievements = aboutData.achievements.filter((_, i) => i !== index);
    setAboutData({ ...aboutData, achievements: newAchievements });
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
          About Us Content Management
        </Typography>
        <Button
          variant="contained"
          startIcon={saving ? <CircularProgress size={20} /> : <Save />}
          onClick={handleSave}
          disabled={saving}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
            },
          }}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Hero Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Hero Section
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <TextField
              fullWidth
              label="Hero Title"
              value={aboutData.heroTitle}
              onChange={(e) => setAboutData({ ...aboutData, heroTitle: e.target.value })}
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              label="Hero Subtitle"
              value={aboutData.heroSubtitle}
              onChange={(e) => setAboutData({ ...aboutData, heroSubtitle: e.target.value })}
              multiline
              rows={2}
              sx={{ mb: 2 }}
            />

            <Box sx={{ mb: 2 }}>
              <Button
                variant="outlined"
                component="label"
                startIcon={uploading ? <CircularProgress size={20} /> : <UploadIcon />}
                disabled={uploading}
              >
                {aboutData.heroImage ? 'Change Hero Image' : 'Upload Hero Image'}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </Button>
              {aboutData.heroImage && (
                <Box sx={{ mt: 2 }}>
                  <img
                    src={aboutData.heroImage}
                    alt="Hero"
                    style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }}
                  />
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Mission & Vision */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Mission Statement
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={aboutData.missionStatement}
              onChange={(e) => setAboutData({ ...aboutData, missionStatement: e.target.value })}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Vision Statement
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={aboutData.visionStatement}
              onChange={(e) => setAboutData({ ...aboutData, visionStatement: e.target.value })}
            />
          </Paper>
        </Grid>

        {/* Stats */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Statistics (4 items)
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              {aboutData.stats.map((stat, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <TextField
                    fullWidth
                    label="Number"
                    value={stat.number}
                    onChange={(e) => handleStatChange(index, 'number', e.target.value)}
                    sx={{ mb: 1 }}
                    placeholder="500+"
                  />
                  <TextField
                    fullWidth
                    label="Label"
                    value={stat.label}
                    onChange={(e) => handleStatChange(index, 'label', e.target.value)}
                    placeholder="Franchise Brands"
                  />
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Values */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Core Values</Typography>
              <Button startIcon={<Add />} onClick={addValue} variant="outlined">
                Add Value
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            {aboutData.values.map((value, index) => (
              <Card key={index} sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="subtitle1">Value {index + 1}</Typography>
                    <IconButton onClick={() => removeValue(index)} color="error" size="small">
                      <Delete />
                    </IconButton>
                  </Box>
                  <TextField
                    fullWidth
                    label="Title"
                    value={value.title}
                    onChange={(e) => handleValueChange(index, 'title', e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Description"
                    value={value.description}
                    onChange={(e) => handleValueChange(index, 'description', e.target.value)}
                    multiline
                    rows={2}
                  />
                </CardContent>
              </Card>
            ))}
          </Paper>
        </Grid>

        {/* Team Members */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Team Members</Typography>
              <Button startIcon={<Add />} onClick={addTeamMember} variant="outlined">
                Add Team Member
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            {aboutData.teamMembers.map((member, index) => (
              <Card key={index} sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="subtitle1">Team Member {index + 1}</Typography>
                    <IconButton onClick={() => removeTeamMember(index)} color="error" size="small">
                      <Delete />
                    </IconButton>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Name"
                        value={member.name}
                        onChange={(e) => handleTeamMemberChange(index, 'name', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Position"
                        value={member.position}
                        onChange={(e) => handleTeamMemberChange(index, 'position', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Experience"
                        value={member.experience}
                        onChange={(e) => handleTeamMemberChange(index, 'experience', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Avatar URL or Initials"
                        value={member.avatar}
                        onChange={(e) => handleTeamMemberChange(index, 'avatar', e.target.value)}
                        placeholder="SJ or https://..."
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Paper>
        </Grid>

        {/* Achievements */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Achievements</Typography>
              <Button startIcon={<Add />} onClick={addAchievement} variant="outlined">
                Add Achievement
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            <List>
              {aboutData.achievements.map((achievement, index) => (
                <ListItem key={index}>
                  <TextField
                    fullWidth
                    value={achievement}
                    onChange={(e) => handleAchievementChange(index, e.target.value)}
                    placeholder="Enter achievement..."
                  />
                  <ListItemSecondaryAction>
                    <IconButton onClick={() => removeAchievement(index)} edge="end" color="error">
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* CTA Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Call to Action Section
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <TextField
              fullWidth
              label="CTA Title"
              value={aboutData.ctaTitle}
              onChange={(e) => setAboutData({ ...aboutData, ctaTitle: e.target.value })}
              sx={{ mb: 2 }}
              placeholder="Ready to Start Your Journey?"
            />
            
            <TextField
              fullWidth
              label="CTA Description"
              value={aboutData.ctaDescription}
              onChange={(e) => setAboutData({ ...aboutData, ctaDescription: e.target.value })}
              multiline
              rows={2}
              placeholder="Explore our franchise opportunities..."
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Floating Save Button */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
      >
        <Button
          variant="contained"
          size="large"
          startIcon={saving ? <CircularProgress size={20} /> : <Save />}
          onClick={handleSave}
          disabled={saving}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: 4,
            '&:hover': {
              background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
              boxShadow: 6,
            },
          }}
        >
          {saving ? 'Saving...' : 'Save All Changes'}
        </Button>
      </Box>
    </Box>
  );
};

export default AdminAboutUsManagement;

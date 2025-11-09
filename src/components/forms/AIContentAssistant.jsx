import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  IconButton,
  Tooltip,
  Chip,
  Divider,
  Paper,
} from '@mui/material';
import {
  Close as CloseIcon,
  AutoAwesome as AIIcon,
  ContentCopy as CopyIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckIcon,
  Lightbulb as IdeaIcon,
  Psychology as BrainIcon,
} from '@mui/icons-material';
import * as aiService from '../../services/aiContentService';
import { showToast } from '../../utils/toastUtils';

const AIContentAssistant = ({ open, onClose, brandInfo, onContentSelect }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({
    description: null,
    usps: null,
    taglines: null,
    insights: null,
    partnerProfile: null,
  });
  const [selectedContent, setSelectedContent] = useState(null);

  const handleGenerate = async (type) => {
    setLoading(true);

    try {
      let result;

      switch (type) {
        case 'description':
          result = await aiService.generateBrandDescription(brandInfo);
          if (result.success) {
            setResults(prev => ({ ...prev, description: result }));
          }
          break;

        case 'usps':
          result = await aiService.generateUSPs(brandInfo);
          if (result.success) {
            setResults(prev => ({ ...prev, usps: result }));
          }
          break;

        case 'taglines':
          result = await aiService.generateTaglines(brandInfo);
          if (result.success) {
            setResults(prev => ({ ...prev, taglines: result }));
          }
          break;

        case 'insights':
          result = await aiService.getIndustryInsights(brandInfo.industry || 'Retail');
          if (result.success) {
            setResults(prev => ({ ...prev, insights: result }));
          }
          break;

        case 'partnerProfile':
          result = await aiService.generatePartnerProfile(brandInfo);
          if (result.success) {
            setResults(prev => ({ ...prev, partnerProfile: result }));
          }
          break;

        case 'all':
          result = await aiService.generateCompleteBrandContent(brandInfo);
          if (result.success) {
            setResults(result);
          }
          break;

        default:
          break;
      }

      if (!result.success) {
        showToast.error(result.error || 'Failed to generate content');
      }
    } catch (error) {
      showToast.error('AI generation failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    showToast.success('Copied to clipboard!');
  };

  const handleUse = (content, type) => {
    onContentSelect({ content, type });
    showToast.success('Content applied to form!');
  };

  const handleClose = () => {
    setResults({
      description: null,
      usps: null,
      taglines: null,
      insights: null,
      partnerProfile: null,
    });
    setSelectedContent(null);
    onClose();
  };

  const renderDescriptionTab = () => (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} /> : <AIIcon />}
          onClick={() => handleGenerate('description')}
          disabled={loading}
          fullWidth
        >
          Generate Brand Description
        </Button>
      </Box>

      {results.description?.content && (
        <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Chip label={`${results.description.wordCount} words`} size="small" color="primary" />
            <Box>
              <Tooltip title="Copy to clipboard">
                <IconButton size="small" onClick={() => handleCopy(results.description.content)}>
                  <CopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Regenerate">
                <IconButton size="small" onClick={() => handleGenerate('description')}>
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          <Typography variant="body1" paragraph>
            {results.description.content}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<CheckIcon />}
            onClick={() => handleUse(results.description.content, 'description')}
            fullWidth
          >
            Use This Description
          </Button>
        </Paper>
      )}
    </Box>
  );

  const renderUSPsTab = () => (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} /> : <AIIcon />}
          onClick={() => handleGenerate('usps')}
          disabled={loading}
          fullWidth
        >
          Generate USPs
        </Button>
      </Box>

      {results.usps?.usps && (
        <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="subtitle2" color="primary">
              Unique Selling Propositions
            </Typography>
            <Tooltip title="Regenerate">
              <IconButton size="small" onClick={() => handleGenerate('usps')}>
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          <List>
            {results.usps.usps.map((usp, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <IconButton edge="end" onClick={() => handleCopy(usp)}>
                    <CopyIcon fontSize="small" />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={`${index + 1}. ${usp}`}
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
            ))}
          </List>
          <Button
            variant="outlined"
            startIcon={<CheckIcon />}
            onClick={() => handleUse(results.usps.usps.join('\n'), 'usps')}
            fullWidth
            sx={{ mt: 2 }}
          >
            Use These USPs
          </Button>
        </Paper>
      )}
    </Box>
  );

  const renderTaglinesTab = () => (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} /> : <AIIcon />}
          onClick={() => handleGenerate('taglines')}
          disabled={loading}
          fullWidth
        >
          Generate Taglines
        </Button>
      </Box>

      {results.taglines?.taglines && (
        <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="subtitle2" color="primary">
              Marketing Taglines
            </Typography>
            <Tooltip title="Regenerate">
              <IconButton size="small" onClick={() => handleGenerate('taglines')}>
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          <List>
            {results.taglines.taglines.map((tagline, index) => (
              <ListItemButton
                key={index}
                onClick={() => handleUse(tagline, 'tagline')}
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  mb: 1,
                }}
              >
                <ListItemText
                  primary={tagline}
                  primaryTypographyProps={{ variant: 'h6', textAlign: 'center' }}
                />
              </ListItemButton>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );

  const renderInsightsTab = () => (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} /> : <IdeaIcon />}
          onClick={() => handleGenerate('insights')}
          disabled={loading}
          fullWidth
        >
          Get Industry Insights
        </Button>
      </Box>

      {results.insights?.insights && (
        <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="subtitle2" color="primary">
              {results.insights.industry} Industry Insights
            </Typography>
            <Tooltip title="Copy all">
              <IconButton size="small" onClick={() => handleCopy(results.insights.insights)}>
                <CopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
            {results.insights.insights}
          </Typography>
        </Paper>
      )}
    </Box>
  );

  const renderPartnerProfileTab = () => (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} /> : <BrainIcon />}
          onClick={() => handleGenerate('partnerProfile')}
          disabled={loading}
          fullWidth
        >
          Generate Partner Profile
        </Button>
      </Box>

      {results.partnerProfile?.profile && (
        <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="subtitle2" color="primary">
              Ideal Franchise Partner
            </Typography>
            <Box>
              <Tooltip title="Copy to clipboard">
                <IconButton size="small" onClick={() => handleCopy(results.partnerProfile.profile)}>
                  <CopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Regenerate">
                <IconButton size="small" onClick={() => handleGenerate('partnerProfile')}>
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
            {results.partnerProfile.profile}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<CheckIcon />}
            onClick={() => handleUse(results.partnerProfile.profile, 'partnerProfile')}
            fullWidth
            sx={{ mt: 2 }}
          >
            Use This Profile
          </Button>
        </Paper>
      )}
    </Box>
  );

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AIIcon color="primary" />
            <Typography variant="h6">AI Content Assistant</Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} variant="fullWidth">
            <Tab label="Description" />
            <Tab label="USPs" />
            <Tab label="Taglines" />
            <Tab label="Insights" />
            <Tab label="Partner Profile" />
          </Tabs>
        </Box>

        {activeTab === 0 && renderDescriptionTab()}
        {activeTab === 1 && renderUSPsTab()}
        {activeTab === 2 && renderTaglinesTab()}
        {activeTab === 3 && renderInsightsTab()}
        {activeTab === 4 && renderPartnerProfileTab()}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
        <Button
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} /> : <AIIcon />}
          onClick={() => handleGenerate('all')}
          disabled={loading}
        >
          Generate All
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AIContentAssistant;

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Alert,
  AlertTitle,
  Chip,
  Avatar,
  Stack,
  Divider,
  LinearProgress,
  CircularProgress,
} from '@mui/material';
import {
  PictureAsPdf,
  Download,
  Share,
  WhatsApp,
  Email,
  CheckCircle,
  Warning,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useBrands } from '../../hooks/useBrands';
import BrandBrochureManager from '../brand/BrandBrochureManager';
import AutoBrochureService from '../../services/AutoBrochureService';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);

/**
 * Marketing Materials Dashboard
 * Allows brand owners to manage and download their marketing materials
 */
const MarketingMaterials = () => {
  const { user } = useAuth();
  const { brands, loading, error } = useBrands(user);
  const [brochureStats, setBrochureStats] = useState({});
  const [loadingStats, setLoadingStats] = useState(false);

  // Fetch brochure statistics for all user's brands
  useEffect(() => {
    const fetchBrochureStats = async () => {
      if (!brands || brands.length === 0) return;
      
      setLoadingStats(true);
      const stats = {};
      
      try {
        await Promise.all(
          brands.map(async (brand) => {
            const brandStats = await AutoBrochureService.getBrochureStats(brand.id);
            stats[brand.id] = brandStats;
          })
        );
        setBrochureStats(stats);
      } catch (error) {
        console.error('Error fetching brochure stats:', error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchBrochureStats();
  }, [brands]);

  const handleShareViaWhatsApp = (brand, brochureUrl) => {
    const message = `Check out the franchise opportunity for ${brand.brandName}! 🚀\n\nDownload the complete brochure: ${brochureUrl}\n\nInterested in franchising with us? Contact us for more details!\n\n#Franchise #BusinessOpportunity #${brand.brandName.replace(/\s+/g, '')}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleShareViaEmail = (brand, brochureUrl) => {
    const subject = `Franchise Opportunity - ${brand.brandName}`;
    const body = `Dear Potential Franchisee,

I hope this email finds you well.

I'm excited to share with you an incredible franchise opportunity with ${brand.brandName}. We're currently expanding and looking for passionate entrepreneurs to join our growing network.

Please find our detailed franchise brochure attached: ${brochureUrl}

The brochure includes:
✓ Complete brand overview and success story
✓ Investment requirements and financial projections
✓ Comprehensive support and training programs
✓ Territory information and growth opportunities
✓ Contact details for next steps

If you're interested in learning more about this opportunity, I'd love to schedule a call to discuss how we can work together.

Best regards,
${user?.displayName || 'Brand Owner'}
${brand.brandName} Franchise Team

---
Generated via ikama - India's Premier Franchise Hub
Visit: https://ikama.in`;

    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        <AlertTitle>Error Loading Brands</AlertTitle>
        {error}
      </Alert>
    );
  }

  if (!brands || brands.length === 0) {
    return (
      <Container maxWidth="md">
        <Box textAlign="center" py={8}>
          <PictureAsPdf sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            No Brands Found
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            You don't have any registered brands yet. Register your brand first to access marketing materials.
          </Typography>
          <Button variant="contained" href="/dashboard/register-brand">
            Register Your Brand
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Marketing Materials
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Generate, download, and share professional marketing materials for your franchise brands.
          </Typography>
        </Box>

        {/* Overview Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: 'center', py: 2 }}>
              <CardContent>
                <Typography variant="h3" color="primary.main" fontWeight="bold">
                  {brands.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Brands
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: 'center', py: 2 }}>
              <CardContent>
                <Typography variant="h3" color="success.main" fontWeight="bold">
                  {Object.values(brochureStats).filter(stat => stat.exists).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Brochures Ready
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: 'center', py: 2 }}>
              <CardContent>
                <Typography variant="h3" color="warning.main" fontWeight="bold">
                  {brands.filter(b => b.status === 'active').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Brands
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Brand Marketing Materials */}
        <Grid container spacing={3}>
          {brands.map((brand, index) => {
            const stats = brochureStats[brand.id] || {};
            const isActive = brand.status === 'active';
            
            return (
              <Grid item xs={12} lg={6} key={brand.id}>
                <MotionCard
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  sx={{
                    position: 'relative',
                    overflow: 'visible',
                    ...(isActive ? {} : { opacity: 0.7 }),
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    {/* Brand Header */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        src={brand.brandLogo || brand.brandImage}
                        sx={{ width: 48, height: 48, mr: 2 }}
                      >
                        {brand.brandName?.[0]}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" fontWeight="bold">
                          {brand.brandName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {brand.category}
                        </Typography>
                      </Box>
                      <Chip
                        label={brand.status}
                        color={
                          brand.status === 'active' ? 'success' :
                          brand.status === 'pending' ? 'warning' : 'error'
                        }
                        size="small"
                      />
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Brand Status Message */}
                    {!isActive && (
                      <Alert severity="info" sx={{ mb: 2 }}>
                        <AlertTitle>Brand Not Active</AlertTitle>
                        Marketing materials are available only for active brands. 
                        Your brand is currently <strong>{brand.status}</strong>.
                      </Alert>
                    )}

                    {/* Brochure Status */}
                    {isActive && (
                      <Box sx={{ mb: 2 }}>
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                          <PictureAsPdf color={stats.exists ? 'success' : 'disabled'} />
                          <Typography variant="subtitle2">
                            Professional Brochure
                          </Typography>
                          {stats.exists && <CheckCircle color="success" sx={{ fontSize: 20 }} />}
                        </Stack>
                        
                        {stats.exists ? (
                          <Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Generated on {stats.generatedAt ? new Date(stats.generatedAt.seconds * 1000).toLocaleDateString() : 'Unknown'}
                            </Typography>
                            
                            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                              <Button
                                variant="contained"
                                size="small"
                                startIcon={<Download />}
                                onClick={() => window.open(stats.url, '_blank')}
                              >
                                Download
                              </Button>
                              
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<WhatsApp />}
                                onClick={() => handleShareViaWhatsApp(brand, stats.url)}
                                sx={{ color: '#25D366', borderColor: '#25D366' }}
                              >
                                WhatsApp
                              </Button>
                              
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<Email />}
                                onClick={() => handleShareViaEmail(brand, stats.url)}
                              >
                                Email
                              </Button>
                            </Stack>
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No brochure available yet
                          </Typography>
                        )}
                      </Box>
                    )}

                    {/* Brochure Generator */}
                    {isActive && (
                      <Box>
                        <BrandBrochureManager
                          brand={brand}
                          onSuccess={() => {
                            // Refresh stats after successful generation
                            AutoBrochureService.getBrochureStats(brand.id).then(newStats => {
                              setBrochureStats(prev => ({
                                ...prev,
                                [brand.id]: newStats
                              }));
                            });
                          }}
                        />
                      </Box>
                    )}
                  </CardContent>
                </MotionCard>
              </Grid>
            );
          })}
        </Grid>

        {/* Help Section */}
        <Box sx={{ mt: 4, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            📋 About Marketing Materials
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Professional brochures are automatically generated when your brand is approved. 
            These 5-page PDFs include your brand story, investment details, support information, 
            and contact details - perfect for sharing with potential franchisees.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Tip:</strong> Share your brochure via WhatsApp or email to reach potential 
            franchisees quickly and professionally.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default MarketingMaterials;
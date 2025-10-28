import React, { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Chip,
  Avatar,
  IconButton,
  Fab,
  SwipeableDrawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Collapse,
} from '@mui/material';
import {
  ArrowBack,
  Share,
  Favorite,
  FavoriteBorder,
  Phone,
  Email,
  WhatsApp,
  LocationOn,
  AttachMoney,
  TrendingUp,
  ExpandMore,
  ExpandLess,
  Info,
  Business,
  PhotoLibrary,
  ContactPhone,
  Timer,
  Store as StoreIcon,
  LocalShipping as LocalShippingIcon,
  Handshake as HandshakeIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useBrand } from '../../hooks/useBrand';
import { useDevice } from '../../hooks/useDevice';
import { BUSINESS_MODEL_CONFIG } from '../../constants/businessModels';
import FranchiseInquiryForm from '../forms/FranchiseInquiryForm';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

// Icon mapping
const iconMap = {
  Store: StoreIcon,
  LocalShipping: LocalShippingIcon,
  Handshake: HandshakeIcon,
  Inventory: InventoryIcon,
};

/**
 * Mobile-optimized Brand Detail component
 * Features:
 * - Touch-friendly interface
 * - Swipeable image gallery
 * - Collapsible sections
 * - Bottom action bar
 * - Share functionality
 * - Quick contact options
 */
const BrandDetailMobile = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { brand, loading, error } = useBrand({ slug });
  const { isMobile, spacing } = useDevice();
  
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    investment: false,
    business: false,
    requirements: false,
    contact: false,
  });

  const toggleSection = useCallback((section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  }, []);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: brand?.brandName,
          text: `Check out ${brand?.brandName} franchise opportunity!`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  }, [brand]);

  const handleWhatsApp = useCallback(() => {
    const phone = brand?.brandOwnerInformation?.contactNumber?.replace(/\D/g, '');
    const message = `Hi, I'm interested in the ${brand?.brandName} franchise opportunity.`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  }, [brand]);

  const handleCall = useCallback(() => {
    window.location.href = `tel:${brand?.brandOwnerInformation?.contactNumber}`;
  }, [brand]);

  const handleEmail = useCallback(() => {
    window.location.href = `mailto:${brand?.brandOwnerInformation?.ownerEmail}`;
  }, [brand]);

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        bgcolor="background.default"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !brand) {
    return (
      <Box p={3} bgcolor="background.default" minHeight="100vh">
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Brand not found'}
        </Alert>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={() => navigate('/brands')}
          fullWidth
          variant="contained"
        >
          Back to Brands
        </Button>
      </Box>
    );
  }

  const businessModelConfig = brand.businessModels?.map(model => 
    BUSINESS_MODEL_CONFIG[model]
  ).filter(Boolean) || [];

  return (
    <Box 
      sx={{ 
        bgcolor: 'background.default',
        minHeight: '100vh',
        pb: 18, // Space for both bottom action bar (80px) + bottom nav (64px)
      }}
    >
      {/* Header */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1100,
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          px: 2,
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <IconButton onClick={() => navigate(-1)} edge="start">
          <ArrowBack />
        </IconButton>
        <Box display="flex" gap={1}>
          <IconButton onClick={handleShare}>
            <Share />
          </IconButton>
          <IconButton onClick={() => setIsFavorite(!isFavorite)}>
            {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
          </IconButton>
        </Box>
      </Box>

      {/* Image Gallery */}
      <Box sx={{ bgcolor: 'background.paper' }}>
        <Box
          sx={{
            display: 'flex',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
          }}
        >
          {brand.brandFranchiseImages?.length > 0 ? (
            brand.brandFranchiseImages.map((img, index) => (
              <Box
                key={index}
                sx={{
                  minWidth: '100%',
                  height: '280px',
                  backgroundImage: `url(${img})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  scrollSnapAlign: 'start',
                }}
              />
            ))
          ) : (
            <Box
              sx={{
                minWidth: '100%',
                height: '280px',
                backgroundImage: `url(${brand.brandImage || brand.brandLogo})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                scrollSnapAlign: 'start',
              }}
            />
          )}
        </Box>
      </Box>

      {/* Brand Header Info */}
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        sx={{ m: 2, mt: -4, position: 'relative', zIndex: 1 }}
        elevation={3}
      >
        <CardContent>
          <Box display="flex" alignItems="flex-start" gap={2}>
            <Avatar
              src={brand.brandLogo}
              alt={brand.brandName}
              sx={{ width: 64, height: 64, border: 2, borderColor: 'background.paper' }}
            />
            <Box flex={1}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {brand.brandName}
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1} mb={1}>
                {brand.industries?.slice(0, 2).map((industry, idx) => (
                  <Chip
                    key={idx}
                    label={industry}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
              <Box display="flex" alignItems="center" gap={2}>
                <Typography variant="body2" color="text.secondary">
                  <LocationOn fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                  {brand.locations?.[0] || 'Multiple Locations'}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Key Stats */}
          <Box 
            display="grid" 
            gridTemplateColumns="repeat(3, 1fr)" 
            gap={2} 
            mt={3}
            pt={3}
            borderTop={1}
            borderColor="divider"
          >
            <Box textAlign="center">
              <Typography variant="h6" color="primary" fontWeight="bold">
                ₹{(brand.brandInvestment / 100000).toFixed(1)}L
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Investment
              </Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="h6" color="primary" fontWeight="bold">
                {brand.payBackPeriod || '2-3 yrs'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Payback
              </Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="h6" color="primary" fontWeight="bold">
                {brand.brandTotalOutlets || 'N/A'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Outlets
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </MotionCard>

      {/* Business Models */}
      {businessModelConfig.length > 0 && (
        <Box px={2} pb={2}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Business Models
          </Typography>
          <Box display="flex" gap={1} overflow="auto" pb={1}>
            {businessModelConfig.map((model, idx) => {
              const IconComponent = iconMap[model.icon] || Business;
              return (
                <Card 
                  key={idx} 
                  sx={{ 
                    minWidth: 140,
                    p: 1.5,
                    textAlign: 'center',
                    bgcolor: `${model.color}.lighter`,
                  }}
                >
                  <IconComponent sx={{ fontSize: 32, color: `${model.color}.main`, mb: 0.5 }} />
                  <Typography variant="caption" fontWeight="bold" display="block">
                    {model.label}
                  </Typography>
                </Card>
              );
            })}
          </Box>
        </Box>
      )}

      {/* Collapsible Sections */}
      <Box px={2}>
        {/* Overview */}
        <CollapsibleSection
          title="Overview"
          icon={<Info />}
          expanded={expandedSections.overview}
          onToggle={() => toggleSection('overview')}
        >
          <Typography variant="body2" color="text.secondary" paragraph>
            <strong>Vision:</strong> {brand.brandVision || brand.brandVission}
          </Typography>
          {brand.brandMission && (
            <Typography variant="body2" color="text.secondary" paragraph>
              <strong>Mission:</strong> {brand.brandMission}
            </Typography>
          )}
          {brand.uniqueSellingProposition && (
            <Typography variant="body2" color="text.secondary">
              <strong>USP:</strong> {brand.uniqueSellingProposition}
            </Typography>
          )}
        </CollapsibleSection>

        {/* Investment Details */}
        <CollapsibleSection
          title="Investment Details"
          icon={<AttachMoney />}
          expanded={expandedSections.investment}
          onToggle={() => toggleSection('investment')}
        >
          <List dense disablePadding>
            <InvestmentItem label="Total Investment" value={`₹${brand.brandInvestment?.toLocaleString()}`} />
            <InvestmentItem label="Franchise Fee" value={`₹${brand.franchiseFee?.toLocaleString()}`} />
            {brand.securityDeposit && (
              <InvestmentItem label="Security Deposit" value={`₹${brand.securityDeposit?.toLocaleString()}`} />
            )}
            {brand.royaltyFee && (
              <InvestmentItem label="Royalty Fee" value={brand.royaltyFee} />
            )}
            {brand.expectedRevenue && (
              <InvestmentItem label="Expected Revenue" value={`₹${brand.expectedRevenue?.toLocaleString()}/year`} />
            )}
          </List>
        </CollapsibleSection>

        {/* Business Details */}
        <CollapsibleSection
          title="Business Details"
          icon={<Business />}
          expanded={expandedSections.business}
          onToggle={() => toggleSection('business')}
        >
          <List dense disablePadding>
            {brand.franchiseTermLength && (
              <InvestmentItem label="Franchise Term" value={brand.franchiseTermLength} />
            )}
            {brand.territoryRights && (
              <InvestmentItem label="Territory Rights" value={brand.territoryRights} />
            )}
            {brand.franchisorSupport && (
              <InvestmentItem label="Support Provided" value={brand.franchisorSupport} />
            )}
          </List>
        </CollapsibleSection>

        {/* Requirements */}
        <CollapsibleSection
          title="Requirements"
          icon={<Timer />}
          expanded={expandedSections.requirements}
          onToggle={() => toggleSection('requirements')}
        >
          <List dense disablePadding>
            {brand.spaceRequired && (
              <InvestmentItem label="Space Required" value={`${brand.spaceRequired} sq ft`} />
            )}
            {brand.locations && (
              <InvestmentItem 
                label="Available Locations" 
                value={brand.locations.join(', ')} 
              />
            )}
          </List>
        </CollapsibleSection>

        {/* Contact */}
        <CollapsibleSection
          title="Contact Information"
          icon={<ContactPhone />}
          expanded={expandedSections.contact}
          onToggle={() => toggleSection('contact')}
        >
          <List dense disablePadding>
            <InvestmentItem 
              label="Owner" 
              value={brand.brandOwnerInformation?.ownerName} 
            />
            <InvestmentItem 
              label="Email" 
              value={brand.brandOwnerInformation?.ownerEmail}
              action={() => handleEmail()}
            />
            <InvestmentItem 
              label="Phone" 
              value={brand.brandOwnerInformation?.contactNumber}
              action={() => handleCall()}
            />
          </List>
        </CollapsibleSection>
      </Box>

      {/* Bottom Action Bar */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 64, // Position above the bottom navigation (64px)
          left: 0,
          right: 0,
          bgcolor: 'background.paper',
          borderTop: 1,
          borderColor: 'divider',
          p: 2,
          zIndex: 1200, // Higher than bottom navigation (1100)
          display: 'flex',
          gap: 1,
          boxShadow: '0 -4px 12px rgba(0,0,0,0.1)',
        }}
      >
        <IconButton 
          color="success" 
          onClick={handleWhatsApp}
          sx={{ bgcolor: 'success.lighter' }}
        >
          <WhatsApp />
        </IconButton>
        <IconButton 
          color="primary" 
          onClick={handleCall}
          sx={{ bgcolor: 'primary.lighter' }}
        >
          <Phone />
        </IconButton>
        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={() => setShowInquiryForm(true)}
          sx={{ fontWeight: 'bold' }}
        >
          Request Information
        </Button>
      </Box>

      {/* Inquiry Form Drawer */}
      <SwipeableDrawer
        anchor="bottom"
        open={showInquiryForm}
        onClose={() => setShowInquiryForm(false)}
        onOpen={() => setShowInquiryForm(true)}
        sx={{
          '& .MuiDrawer-paper': {
            maxHeight: '90vh',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Request Information
          </Typography>
          <FranchiseInquiryForm
            brand={brand}
            onSuccess={() => setShowInquiryForm(false)}
          />
        </Box>
      </SwipeableDrawer>
    </Box>
  );
};

// Helper Components
const CollapsibleSection = ({ title, icon, expanded, onToggle, children }) => (
  <Card sx={{ mb: 2 }} elevation={0} variant="outlined">
    <Box
      onClick={onToggle}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2,
        cursor: 'pointer',
        '&:active': { bgcolor: 'action.hover' },
      }}
    >
      <Box display="flex" alignItems="center" gap={1}>
        {icon}
        <Typography variant="subtitle1" fontWeight="bold">
          {title}
        </Typography>
      </Box>
      {expanded ? <ExpandLess /> : <ExpandMore />}
    </Box>
    <Collapse in={expanded}>
      <Box sx={{ px: 2, pb: 2 }}>
        {children}
      </Box>
    </Collapse>
  </Card>
);

const InvestmentItem = ({ label, value, action }) => (
  <ListItem 
    disablePadding 
    sx={{ py: 0.5 }}
    onClick={action}
    button={!!action}
  >
    <ListItemText
      primary={label}
      secondary={value}
      primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
      secondaryTypographyProps={{ variant: 'body2', color: 'text.primary', fontWeight: 500 }}
    />
  </ListItem>
);

export default BrandDetailMobile;

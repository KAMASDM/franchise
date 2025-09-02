import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Link,
  Divider,
  CircularProgress,
  Grid,
  Alert,
  CardHeader,
} from "@mui/material";
import {
  LocationOn,
  CheckCircle,
  Phone,
  Business,
  Timeline,
  AttachMoney,
  Support,
  School,
  BusinessCenter,
  SupportAgent,
  EmojiEvents,
  Email,
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Person,
  CropLandscape,
  AdminPanelSettings,
  ThumbUp,
  ThumbDown,
  Language,
  Info,
  Gavel,
  Storefront,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import useBrand from "../../hooks/useBrand";
import { useAdminStatus } from "../../hooks/useAdminStatus";
import { db } from "../../firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";

const MotionCard = motion(Card);

// Reusable component for displaying an item of information
const InfoItem = ({ icon, primary, secondary, isLink = false }) => (
    <ListItem dense>
        <ListItemIcon sx={{minWidth: '40px'}}>{icon}</ListItemIcon>
        {isLink && secondary ? (
             <Link href={secondary.startsWith('http') ? secondary : `https://${secondary}`} target="_blank" rel="noopener noreferrer">{primary}</Link>
        ) : (
            <ListItemText primary={primary} secondary={secondary || "Not Provided"} />
        )}
    </ListItem>
);

// Admin Actions card remains the same
const AdminActions = ({ brand, setBrandLocally }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleStatusChange = async (newStatus) => {
        setIsSubmitting(true);
        try {
            const brandRef = doc(db, 'brands', brand.id);
            await updateDoc(brandRef, { status: newStatus });
            setBrandLocally(prevBrand => ({ ...prevBrand, status: newStatus }));
        } catch (error) {
            console.error("Error updating status:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card sx={{ mb: 4, bgcolor: 'secondary.light', border: '1px solid', borderColor: 'secondary.main' }}>
            <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                    <AdminPanelSettings sx={{ mr: 1 }} />
                    <Typography variant="h6" fontWeight="bold">Admin Actions</Typography>
                </Box>
                <Chip
                    label={`Current Status: ${brand.status}`}
                    color={brand.status === 'active' ? 'success' : brand.status === 'pending' ? 'warning' : 'error'}
                    sx={{ mb: 2 }}
                />
                <Box display="flex" gap={2}>
                    {(brand.status === 'pending' || brand.status === 'inactive') && (
                        <Button variant="contained" color="success" startIcon={<ThumbUp />} onClick={() => handleStatusChange('active')} disabled={isSubmitting}>
                            Approve & Activate
                        </Button>
                    )}
                    {brand.status === 'active' && (
                         <Button variant="contained" color="error" startIcon={<ThumbDown />} onClick={() => handleStatusChange('inactive')} disabled={isSubmitting}>
                            Deactivate
                        </Button>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

const BrandDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { brand, setBrand, loading, error } = useBrand(id);
  const { isAdmin } = useAdminStatus();

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    adaptiveHeight: true,
  };
  
  if (loading) {
    return <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh"><CircularProgress /></Box>;
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button variant="contained" onClick={() => navigate('/dashboard/admin-verify')}>Back to Verification List</Button>
      </Container>
    );
  }

  if (!brand) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h4" color="text.secondary">Brand not found</Typography>
        <Button variant="contained" onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {isAdmin && <AdminActions brand={brand} setBrandLocally={setBrand} />}

      {/* === HEADER CARD === */}
      <MotionCard sx={{ mb: 3 }} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <CardHeader 
            avatar={<Avatar src={brand.brandImage} sx={{ width: 60, height: 60 }} variant="rounded" />}
            title={brand.brandName}
            titleTypographyProps={{variant: 'h4', fontWeight: 'bold'}}
            subheader={`Founded in ${brand.brandfoundedYear} | Owner: ${brand.brandOwnerInformation?.name}`}
          />
        <CardContent>
          <Typography variant="h6" color="text.secondary">{brand.brandMission}</Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" fontWeight="bold">Brand Vision</Typography>
          <Typography paragraph>{brand.brandVission || "Not Provided"}</Typography>
        </CardContent>
      </MotionCard>
      
      {/* === INFORMATION CARDS IN A SINGLE ROW === */}
      <Grid container spacing={3}>

        <Grid item xs={12} md={6} lg={4}>
          <MotionCard sx={{ height: '100%' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{delay: 0.1}}>
             <CardHeader title="Investment & Fees" />
             <CardContent>
                <List>
                  <InfoItem icon={<AttachMoney />} primary="Investment Range" secondary={brand.investmentRange} />
                  <InfoItem icon={<AttachMoney />} primary="Initial Fee" secondary={`₹${brand.initialFranchiseFee}`} />
                  <InfoItem icon={<Timeline />} primary="Royalty Fee" secondary={`${brand.royaltyFee}%`} />
                  <InfoItem icon={<CropLandscape />} primary="Area Required" secondary={`${brand.areaRequired?.min} - ${brand.areaRequired?.max} ${brand.areaRequired?.unit}`} />
                </List>
             </CardContent>
          </MotionCard>
        </Grid>
        
        <Grid item xs={12} md={6} lg={4}>
          <MotionCard sx={{ height: '100%' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{delay: 0.2}}>
             <CardHeader title="Business Model" />
             <CardContent>
                <List>
                    <InfoItem icon={<Business />} primary="Model" secondary={brand.businessModel} />
                    <InfoItem icon={<Storefront />} primary="Franchise Types" secondary={brand.franchiseModels?.join(', ')} />
                    <InfoItem icon={<EmojiEvents />} primary="USP Claimed" secondary={brand.uniqueSellingProposition ? "Yes" : "No"} />
                    <InfoItem icon={<CheckCircle />} primary="Advantage Claimed" secondary={brand.competitiveAdvantage ? "Yes" : "No"} />
                </List>
             </CardContent>
          </MotionCard>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <MotionCard sx={{ height: '100%' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{delay: 0.3}}>
            <CardHeader title="Owner & Contact Info" />
            <CardContent>
              <List>
                <InfoItem icon={<Person />} primary="Owner Name" secondary={brand.brandOwnerInformation?.name} />
                <InfoItem icon={<Email />} primary="Owner Email" secondary={brand.brandOwnerInformation?.email} />
                <InfoItem icon={<Phone />} primary="Contact Phone" secondary={brand.brandContactInformation?.phone} />
                <InfoItem icon={<Language />} primary="Website" secondary={brand.brandContactInformation?.website} isLink={true} />
              </List>
            </CardContent>
          </MotionCard>
        </Grid>

        {brand.brandFranchiseImages && brand.brandFranchiseImages.length > 0 && (
          <Grid item xs={12} md={6} lg={4}>
             <MotionCard sx={{ height: '100%' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{delay: 0.4}}>
                <CardHeader title="Brand Gallery" />
                <CardContent>
                    <Slider {...sliderSettings}>
                    {brand.brandFranchiseImages.map((image, index) => (
                        <Box key={index} component="img" src={image} alt={`Gallery image ${index + 1}`} sx={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: 2 }} />
                    ))}
                    </Slider>
                </CardContent>
             </MotionCard>
          </Grid>
        )}

      </Grid>
    </Container>
  );
};

export default BrandDetail;
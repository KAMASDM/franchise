import React from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  Avatar,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  useTheme,
  CircularProgress,
  Alert,
  Grid,
} from "@mui/material";
import {
  Business,
  TrendingUp,
  Support,
  Verified,
  CheckCircle,
  Timeline,
  People,
  Star,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { Link as RouterLink } from "react-router-dom";
import { useAboutUsContent } from "../hooks/useAboutUsContent";
import SEO from "../components/common/SEO";

// Icon mapping
const iconMap = {
  Business: <Business />,
  TrendingUp: <TrendingUp />,
  Star: <Star />,
  Timeline: <Timeline />,
  Verified: <Verified />,
  Support: <Support />,
  People: <People />,
  CheckCircle: <CheckCircle />,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6 } },
};

const StatCard = ({ icon, number, label }) => (
  <Card
    component={motion.div}
    variants={itemVariants}
    sx={{
      p: 3,
      textAlign: "center",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    }}
  >
    <Avatar
      sx={{
        bgcolor: "primary.main",
        color: "primary.contrastText",
        width: 60,
        height: 60,
        mx: "auto",
        mb: 2,
      }}
    >
      {icon}
    </Avatar>
    <Typography
      variant="h4"
      component="p"
      fontWeight="bold"
      color="text.primary"
    >
      {number}
    </Typography>
    <Typography variant="body1" color="text.secondary">
      {label}
    </Typography>
  </Card>
);

const ValueCard = ({ icon, title, description }) => (
  <Card
    component={motion.div}
    variants={itemVariants}
    sx={{
      p: 3,
      height: "100%",
      display: "flex",
      flexDirection: "column",
      gap: 2,
      textAlign: "center",
      alignItems: "center",
    }}
  >
    <Avatar
      sx={{
        bgcolor: "secondary.main",
        color: "secondary.contrastText",
        width: 56,
        height: 56,
      }}
    >
      {icon}
    </Avatar>
    <Typography variant="h6" fontWeight="bold">
      {title}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {description}
    </Typography>
  </Card>
);

const TeamMemberCard = ({ name, position, experience, avatar }) => {
  const isUrl = avatar?.startsWith('http');
  
  return (
    <Card
      component={motion.div}
      variants={itemVariants}
      sx={{
        p: 3,
        textAlign: "center",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Avatar
        src={isUrl ? avatar : undefined}
        sx={{
          width: 100,
          height: 100,
          mb: 2,
          bgcolor: "primary.main",
          fontSize: "2rem",
        }}
      >
        {!isUrl && avatar}
      </Avatar>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        {name}
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        {position}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {experience}
      </Typography>
    </Card>
  );
};

const About = () => {
  const theme = useTheme();
  const { aboutData, loading, error } = useAboutUsContent();

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading About Us content...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  const { 
    heroTitle, 
    heroSubtitle, 
    heroImage,
    missionStatement, 
    visionStatement,
    stats = [],
    values = [],
    teamMembers = [],
    achievements = [],
    ctaTitle,
    ctaDescription
  } = aboutData || {};

  return (
    <>
      <SEO
        title={`${heroTitle || 'About Us'} | ikama - Franchise Hub`}
        description={heroSubtitle || 'Learn about ikama - Franchise Hub and our mission to connect entrepreneurs with franchise opportunities.'}
        keywords="about ikama, franchise consulting, franchise experts, franchise team"
      />
      
      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Hero Section */}
        <Box
          component={motion.div}
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          sx={{ textAlign: "center", mb: 8 }}
        >
          {heroImage && (
            <Box
              component={motion.div}
              variants={itemVariants}
              sx={{ mb: 4 }}
            >
              <img
                src={heroImage}
                alt="About ikama"
                style={{
                  maxWidth: '100%',
                  maxHeight: '400px',
                  borderRadius: '16px',
                  objectFit: 'cover',
                  boxShadow: theme.shadows[4]
                }}
              />
            </Box>
          )}
          <Typography
            component={motion.div}
            variants={itemVariants}
            variant="h2"
            fontWeight="bold"
            gutterBottom
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {heroTitle || 'About ikama - Franchise Hub'}
          </Typography>
          <Typography
            component={motion.div}
            variants={itemVariants}
            variant="h5"
            color="text.secondary"
            sx={{ maxWidth: 800, mx: "auto" }}
          >
            {heroSubtitle || 'Your trusted partner in franchise success'}
          </Typography>
        </Box>

        {/* Statistics */}
        {stats && stats.length > 0 && (
          <Box
            component={motion.div}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            sx={{ mb: 10 }}
          >
            <Grid container spacing={3}>
              {stats.map((stat, index) => (
                <Grid item xs={6} md={3} key={index}>
                  <StatCard
                    icon={iconMap[stat.icon] || <Business />}
                    number={stat.number}
                    label={stat.label}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Mission & Vision */}
        {(missionStatement || visionStatement) && (
          <Box
            component={motion.div}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            sx={{ mb: 10 }}
          >
            <Grid container spacing={4}>
              {missionStatement && (
                <Grid item xs={12} md={6}>
                  <Paper
                    component={motion.div}
                    variants={itemVariants}
                    sx={{ p: 4, height: "100%", textAlign: "center" }}
                  >
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                      Our Mission
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {missionStatement}
                    </Typography>
                  </Paper>
                </Grid>
              )}
              {visionStatement && (
                <Grid item xs={12} md={6}>
                  <Paper
                    component={motion.div}
                    variants={itemVariants}
                    sx={{ p: 4, height: "100%", textAlign: "center" }}
                  >
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                      Our Vision
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {visionStatement}
                    </Typography>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </Box>
        )}

        {/* Core Values */}
        {values && values.length > 0 && (
          <Box
            component={motion.div}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            sx={{ mb: 10 }}
          >
            <Typography
              variant="h3"
              fontWeight="bold"
              textAlign="center"
              gutterBottom
            >
              Our Core Values
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              textAlign="center"
              sx={{ mb: 6, maxWidth: 700, mx: "auto" }}
            >
              The principles that guide everything we do
            </Typography>
            <Grid container spacing={3}>
              {values.map((value, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <ValueCard
                    icon={iconMap[value.icon] || <Verified />}
                    title={value.title}
                    description={value.description}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Team Members */}
        {teamMembers && teamMembers.length > 0 && (
          <Box
            component={motion.div}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            sx={{ mb: 10 }}
          >
            <Typography
              variant="h3"
              fontWeight="bold"
              textAlign="center"
              gutterBottom
            >
              Meet Our Team
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              textAlign="center"
              sx={{ mb: 6, maxWidth: 700, mx: "auto" }}
            >
              Experienced professionals dedicated to your success
            </Typography>
            <Grid container spacing={3}>
              {teamMembers.map((member, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <TeamMemberCard
                    name={member.name}
                    position={member.position}
                    experience={member.experience}
                    avatar={member.avatar}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Achievements */}
        {achievements && achievements.length > 0 && (
          <Box
            component={motion.div}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            sx={{ mb: 10 }}
          >
            <Paper sx={{ p: 4 }}>
              <Typography
                variant="h4"
                fontWeight="bold"
                textAlign="center"
                gutterBottom
              >
                Our Achievements
              </Typography>
              <List>
                {achievements.map((achievement, index) => (
                  <ListItem
                    component={motion.li}
                    variants={itemVariants}
                    key={index}
                  >
                    <ListItemIcon>
                      <CheckCircle color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary={achievement}
                      primaryTypographyProps={{ variant: "body1" }}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Box>
        )}

        {/* Call to Action */}
        {(ctaTitle || ctaDescription) && (
          <Box
            component={motion.div}
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Paper
              sx={{
                p: 6,
                textAlign: "center",
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                color: "white",
              }}
            >
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                {ctaTitle || 'Ready to Start Your Journey?'}
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                {ctaDescription || 'Explore our franchise opportunities and take the first step toward business ownership.'}
              </Typography>
              <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                <Button
                  component={RouterLink}
                  to="/brands"
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: "white",
                    color: "primary.main",
                    "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.9)" },
                  }}
                >
                  Explore Franchises
                </Button>
                <Button
                  component={RouterLink}
                  to="/contact"
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: "white",
                    color: "white",
                    "&:hover": { 
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      borderColor: "white",
                    },
                  }}
                >
                  Contact Us
                </Button>
              </Box>
            </Paper>
          </Box>
        )}
      </Container>
    </>
  );
};

export default About;

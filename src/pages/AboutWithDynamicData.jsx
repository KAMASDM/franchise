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
    sx={{
      p: 3,
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    }}
  >
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: "center",
        textAlign: { xs: "center", sm: "left" },
        gap: 3,
      }}
    >
      <Avatar
        sx={{
          bgcolor: "primary.main",
          color: "primary.contrastText",
          width: 60,
          height: 60,
          flexShrink: 0,
        }}
      >
        {icon}
      </Avatar>
      <Box>
        <Typography
          variant="h6"
          component="h3"
          fontWeight="bold"
          sx={{ mb: 1 }}
        >
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {description}
        </Typography>
      </Box>
    </Box>
  </Card>
);

const TeamMemberCard = ({ avatar, name, position, experience }) => (
  <Card
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
        bgcolor: "primary.light",
        color: "text.primary",
        width: 80,
        height: 80,
        mx: "auto",
        mb: 2,
        fontSize: "2rem",
        fontWeight: 600,
      }}
    >
      {avatar}
    </Avatar>
    <Typography variant="h6" component="h3" fontWeight="bold">
      {name}
    </Typography>
    <Typography variant="subtitle1" color="primary.main" sx={{ mb: 1 }}>
      {position}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {experience}
    </Typography>
  </Card>
);

const About = () => {
  const theme = useTheme();
  const { aboutData, loading, error } = useAboutUsContent();

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading...
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
    stats = [],
    values = [],
    teamMembers = [],
    achievements = []
  } = aboutData || {};

  return (
    <>
      <SEO
        title={`${heroTitle || 'About Us'} | ikama - Franchise Hub`}
        description={heroSubtitle || 'Learn about ikama - Franchise Hub and our mission to connect entrepreneurs with franchise opportunities.'}
        keywords="about ikama, franchise consulting, franchise experts, franchise team"
      />
      <Box
        sx={{
          background: `linear-gradient(to bottom, ${theme.palette.primary[50]}, ${theme.palette.background.paper} 50%, ${theme.palette.secondary[50]})`,
        }}
      >
        <Container maxWidth="xl" sx={{ py: { xs: 5, md: 10 } }}>
          <motion.div variants={itemVariants} initial="hidden" animate="visible">
            <Typography
              component="h1"
              variant="h2"
              sx={{
                textAlign: "center",
                mb: 2,
                fontSize: { xs: "2.25rem", md: "3rem" },
              }}
            >
              {heroTitle || 'About ikama - Franchise Hub'}
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                maxWidth: 800,
                mx: "auto",
                textAlign: "center",
                mb: { xs: 8, md: 10 },
              }}
            >
              {heroSubtitle || "We're the leading franchise consulting firm dedicated to helping entrepreneurs find and succeed with the perfect franchise opportunity."}
            </Typography>
          </motion.div>

          {/* Stats Section */}
          {stats && stats.length > 0 && (
            <Box sx={{ mb: { xs: 8, md: 10 } }}>
              <Box
                component={motion.div}
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}
              >
                {stats.map((stat, index) => (
                  <Box
                    component={motion.div}
                    variants={itemVariants}
                    key={index}
                    sx={{
                      width: {
                        xs: "100%",
                        sm: "calc(50% - 12px)",
                        md: "calc(25% - 18px)",
                      },
                      flexGrow: 1,
                    }}
                  >
                    <StatCard 
                      icon={iconMap[stat.icon] || <Business />}
                      number={stat.number}
                      label={stat.label}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* Core Values Section */}
          {values && values.length > 0 && (
            <Box sx={{ mb: { xs: 8, md: 10 } }}>
              <motion.div
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <Typography
                  component="h1"
                  variant="h2"
                  sx={{
                    textAlign: "center",
                    mb: 6,
                    fontSize: { xs: "2rem", md: "2.5rem" },
                  }}
                >
                  Our Core Values
                </Typography>
              </motion.div>
              <Box
                component={motion.div}
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}
              >
                {values.map((value, index) => (
                  <Box
                    component={motion.div}
                    variants={itemVariants}
                    key={index}
                    sx={{
                      width: { xs: "100%", md: "calc(50% - 12px)" },
                      flexGrow: 1,
                    }}
                  >
                    <ValueCard 
                      icon={iconMap[value.icon] || <Verified />}
                      title={value.title}
                      description={value.description}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* Team Section */}
          {teamMembers && teamMembers.length > 0 && (
            <Box sx={{ mb: { xs: 8, md: 10 } }}>
              <motion.div
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <Typography
                  component="h1"
                  variant="h2"
                  sx={{
                    textAlign: "center",
                    mb: 6,
                    fontSize: { xs: "2rem", md: "2.5rem" },
                  }}
                >
                  Meet Our Expert Team
                </Typography>
              </motion.div>
              <Box
                component={motion.div}
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 3,
                  justifyContent: "center",
                }}
              >
                {teamMembers.map((member, index) => (
                  <Box
                    component={motion.div}
                    variants={itemVariants}
                    key={index}
                    sx={{
                      width: {
                        xs: "100%",
                        sm: "calc(50% - 12px)",
                        md: "calc(25% - 18px)",
                      },
                      flexGrow: 1,
                    }}
                  >
                    <TeamMemberCard
                      avatar={member.avatar}
                      name={member.name}
                      position={member.position}
                      experience={member.experience}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* Achievements Section */}
          {achievements && achievements.length > 0 && (
            <motion.div
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Box sx={{ mb: { xs: 8, md: 10 } }}>
                <Typography
                  component="h1"
                  variant="h2"
                  sx={{
                    textAlign: "center",
                    mb: 6,
                    fontSize: { xs: "2rem", md: "2.5rem" },
                  }}
                >
                  Our Achievements
                </Typography>
                <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
                  <List>
                    {achievements.map((achievement, index) => (
                      <ListItem key={index}>
                        <ListItemIcon sx={{ color: "primary.main", minWidth: 40 }}>
                          <CheckCircle />
                        </ListItemIcon>
                        <ListItemText
                          primary={achievement}
                          primaryTypographyProps={{
                            variant: "body1",
                            color: "text.primary",
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Box>
            </motion.div>
          )}

        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Paper>
            <Box
              sx={{
                textAlign: "center",
                p: { xs: 4, md: 6 },
                backgroundColor: "primary.dark",
                color: "primary.contrastText",
              }}
            >
              <Typography
                component="h2"
                variant="h4"
                sx={{ mb: 2, fontSize: { xs: "1.75rem", md: "2.25rem" } }}
              >
                Ready to Start Your Franchise Journey?
              </Typography>
              <Typography
                variant="h6"
                sx={{ mb: 4, opacity: 0.9, fontWeight: 300 }}
              >
                Let our experienced team guide you to the perfect franchise
                opportunity.
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <Button
                  component={RouterLink}
                  variant="contained"
                  to="/brands"
                  size="large"
                  sx={{
                    bgcolor: "background.paper",
                    color: "primary.main",
                    "&:hover": { bgcolor: "primary.50" },
                  }}
                >
                  Browse Franchises
                </Button>
                <Button
                  variant="outlined"
                  component={RouterLink}
                  to="/contact"
                  size="large"
                  sx={{
                    borderColor: "primary.contrastText",
                    color: "primary.contrastText",
                    "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
                  }}
                >
                  Contact Us
                </Button>
              </Box>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
    </>
  );
};

export default About;

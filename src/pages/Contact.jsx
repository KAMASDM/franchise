import React from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Button,
  TextField,
  Avatar,
  useTheme,
  Grid,
} from "@mui/material";
import { Phone, Email, LocationOn, Schedule, Send } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";

const MotionCard = motion(Card);

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6 } },
};

const contactMethods = [
  {
    icon: <Phone sx={{ color: "primary.dark" }} />,
    title: "Phone",
    description: "Speak with a franchise specialist",
    contact: "+91 98765 43210",
    action: "Call Now",
  },
  {
    icon: <Email sx={{ color: "primary.dark" }} />,
    title: "Email",
    description: "Send us your questions",
    contact: "info@franchisehub.co.in",
    action: "Email Us",
  },
  {
    icon: <LocationOn sx={{ color: "primary.dark" }} />,
    title: "Office",
    description: "Visit our Indian headquarters",
    contact: "123 Business Hub, Alkapuri, Vadodara, Gujarat 390007",
    action: "Get Directions",
  },
  {
    icon: <Schedule sx={{ color: "primary.dark" }} />,
    title: "Hours",
    description: "Our operating hours",
    contact: "Mon-Fri: 10:00 AM - 7:00 PM IST",
    action: "Schedule Call",
  },
];

const Contact = () => {
  const theme = useTheme();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Contact form submitted:", data);
  };

  return (
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
            Get In Touch With Us
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
            Whether you're ready to explore franchise opportunities or just want
            to ask a question, we're here to help. Contact our team of experts
            today and let's take the next step together.
          </Typography>
        </motion.div>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
            mb: 8,
          }}
        >
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
            }}
          >
            {contactMethods.map((method, index) => (
              <MotionCard
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, boxShadow: theme.shadows[10] }}
                sx={{
                  width: { xs: "100%", sm: "calc(50% - 12px)" },
                  textAlign: "center",
                  p: 3,
                  borderRadius: 3,
                  boxShadow: theme.shadows[3],
                }}
              >
                <CardContent>
                  <Avatar
                    sx={{
                      backgroundColor: "primary.light",
                      width: 60,
                      height: 60,
                      mx: "auto",
                      mb: 2,
                    }}
                  >
                    {method.icon}
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                    {method.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2, minHeight: 40 }}
                  >
                    {method.description}
                  </Typography>
                  <Typography variant="body1" fontWeight="bold" sx={{ mb: 3 }}>
                    {method.contact}
                  </Typography>
                  <Button variant="outlined" size="small" color="primary">
                    {method.action}
                  </Button>
                </CardContent>
              </MotionCard>
            ))}
          </Box>

          <MotionCard
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            sx={{ flex: 1, p: 4, borderRadius: 3, boxShadow: theme.shadows[3] }}
          >
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
              Send Us a Message
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="First Name"
                    {...register("firstName", {
                      required: "First name is required",
                    })}
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Last Name"
                    {...register("lastName", {
                      required: "Last name is required",
                    })}
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                  />
                </Grid>
              </Grid>
              <TextField
                fullWidth
                variant="outlined"
                label="Email"
                type="email"
                sx={{ mt: 2 }}
                {...register("email", { required: "Email is required" })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
              <TextField
                fullWidth
                variant="outlined"
                label="Phone Number"
                sx={{ mt: 2 }}
                {...register("phone")}
              />
              <TextField
                fullWidth
                variant="outlined"
                label="Message"
                multiline
                rows={6}
                sx={{ mt: 2 }}
                {...register("message", { required: "Message is required" })}
                error={!!errors.message}
                helperText={errors.message?.message}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={<Send />}
                sx={{
                  borderRadius: 25,
                  px: 4,
                  py: 1.5,
                  fontWeight: "bold",
                  mt: 3,
                }}
              >
                Send Message
              </Button>
            </form>
          </MotionCard>
        </Box>

        <Box
          sx={{
            width: "100%",
            height: 400,
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: theme.shadows[3],
          }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d118147.8239433439!2d73.13456044719318!3d22.322307338092837!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395fc8ab91a3ddab%3A0xac39d3bfe14734d3!2sVadodara%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1689600000000!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="FranchiseHub Office Location - Vadodara"
          />
        </Box>
      </Container>
    </Box>
  );
};

export default Contact;

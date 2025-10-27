import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
  Avatar,
  Chip,
  Paper,
  Grid,
  Card,
  CardContent,
  IconButton,
  LinearProgress,
  Breadcrumbs,
  Link,
  useTheme,
} from "@mui/material";
import {
  CalendarToday,
  AccessTime,
  Facebook,
  Twitter,
  LinkedIn,
  Home,
  Article,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { blogPostsData } from "../data/blogData";

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const BlogDetail = () => {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const foundPost = blogPostsData.find((p) => p.id === parseInt(id));
    setPost(foundPost);

    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const updateReadingProgress = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setReadingProgress(progress);
    };

    window.addEventListener("scroll", updateReadingProgress);
    return () => window.removeEventListener("scroll", updateReadingProgress);
  }, []);

  // Enhanced content parser to handle markdown-like formatting
  const parseContent = (content) => {
    if (!content) return [];

    const paragraphs = content.split("\n\n");
    return paragraphs.map((paragraph, index) => {
      // Handle headers
      if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
        const headerText = paragraph.slice(2, -2);
        return (
          <Typography
            key={index}
            variant="h4"
            component="h2"
            fontWeight="bold"
            sx={{
              mb: 3,
              mt: 5,
              color: "primary.main",
              borderLeft: 4,
              borderColor: "primary.main",
              pl: 2,
            }}
          >
            {headerText}
          </Typography>
        );
      }

      // Handle bold text within paragraphs
      const formattedText = paragraph
        .split(/(\*\*.*?\*\*)/)
        .map((part, partIndex) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return <strong key={partIndex}>{part.slice(2, -2)}</strong>;
          }
          return part;
        });

      return (
        <Typography
          key={index}
          variant="body1"
          sx={{
            mb: 3,
            lineHeight: 1.8,
            fontSize: "1.125rem",
            color: "text.primary",
            textAlign: "justify",
          }}
        >
          {formattedText}
        </Typography>
      );
    });
  };

  const sharePost = (platform) => {
    const url = window.location.href;
    const title = post.title;

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    };

    window.open(shareUrls[platform], "_blank", "width=600,height=400");
  };

  if (!post) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
          }}
        >
          <Typography variant="h4" color="text.secondary">
            {blogPostsData.length === 0 ? "Loading..." : "Blog post not found"}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/blogs")}
            size="large"
            sx={{ borderRadius: 25, px: 4 }}
          >
            Back to Blogs
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        background: `linear-gradient(to bottom, ${theme.palette.primary[50]}, ${theme.palette.background.paper} 50%, ${theme.palette.secondary[50]})`,
      }}
    >
      <LinearProgress
        variant="determinate"
        value={readingProgress}
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          height: 3,
          "& .MuiLinearProgress-bar": {
            backgroundColor: "primary.main",
          },
        }}
      />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link
            underline="hover"
            color="inherit"
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
          >
            <Home fontSize="small" />
            Home
          </Link>
          <Link
            underline="hover"
            color="inherit"
            href="/blogs"
            onClick={(e) => {
              e.preventDefault();
              navigate("/blogs");
            }}
            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
          >
            <Article fontSize="small" />
            Blogs
          </Link>
          <Typography color="text.primary">{post.title}</Typography>
        </Breadcrumbs>

        <Grid container spacing={6}>
          {/* Main Content */}
          <Grid item xs={12} lg={8}>
            <MotionBox
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Header Section */}
              <Box sx={{ mb: 6 }}>
                <Chip
                  label={post.category}
                  color="primary"
                  sx={{
                    mb: 3,
                    fontWeight: "bold",
                    fontSize: "0.875rem",
                    px: 2,
                    py: 1,
                  }}
                />

                <Typography
                  variant="h2"
                  component="h1"
                  fontWeight="bold"
                  sx={{
                    mb: 3,
                    lineHeight: 1.2,
                    fontSize: { xs: "2rem", md: "2.75rem" },
                    color: "text.primary",
                  }}
                >
                  {post.title}
                </Typography>

                <Typography
                  variant="h6"
                  component="p"
                  sx={{
                    mb: 4,
                    color: "text.secondary",
                    fontStyle: "italic",
                    lineHeight: 1.5,
                  }}
                >
                  {post.excerpt}
                </Typography>

                {/* Author and Meta Info */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    backgroundColor: "grey.50",
                    border: 1,
                    borderColor: "divider",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 2,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar
                        sx={{
                          width: 50,
                          height: 50,
                          backgroundColor: "primary.main",
                          fontSize: "1.25rem",
                        }}
                      >
                        {post.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {post.author}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Senior Franchise Consultant
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                        flexWrap: "wrap",
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <CalendarToday
                          sx={{ fontSize: 18, color: "text.secondary" }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {new Date(post.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </Typography>
                      </Box>

                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <AccessTime
                          sx={{ fontSize: 18, color: "text.secondary" }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {post.readTime}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </Box>

              {/* Featured Image */}
              <MotionBox
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                sx={{ mb: 6 }}
              >
                <Box
                  component="img"
                  src={post.image}
                  alt={post.title}
                  sx={{
                    width: "100%",
                    height: { xs: 250, md: 400 },
                    objectFit: "cover",
                    borderRadius: 3,
                    boxShadow: 3,
                  }}
                />
              </MotionBox>

              {/* Social Share Buttons */}
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  mb: 4,
                  justifyContent: "center",
                }}
              >
                <IconButton
                  onClick={() => sharePost("facebook")}
                  aria-label="Share on Facebook"
                  sx={{
                    backgroundColor: "#1877F2",
                    color: "white",
                    "&:hover": { backgroundColor: "#166FE5" },
                  }}
                >
                  <Facebook />
                </IconButton>
                <IconButton
                  onClick={() => sharePost("twitter")}
                  aria-label="Share on Twitter"
                  sx={{
                    backgroundColor: "#1DA1F2",
                    color: "white",
                    "&:hover": { backgroundColor: "#0D95E8" },
                  }}
                >
                  <Twitter />
                </IconButton>
                <IconButton
                  onClick={() => sharePost("linkedin")}
                  aria-label="Share on LinkedIn"
                  sx={{
                    backgroundColor: "#0077B5",
                    color: "white",
                    "&:hover": { backgroundColor: "#005885" },
                  }}
                >
                  <LinkedIn />
                </IconButton>
              </Box>

              {/* Content */}
              <Box sx={{ mb: 6 }}>{parseContent(post.content)}</Box>

              {/* Tags */}
              {post.tags && (
                <Box
                  sx={{
                    mb: 6,
                    p: 3,
                    backgroundColor: "grey.50",
                    borderRadius: 3,
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                    Related Topics:
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {post.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={`#${tag}`}
                        variant="outlined"
                        size="small"
                        clickable
                        sx={{
                          "&:hover": {
                            backgroundColor: "primary.light",
                            color: "white",
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {/* CTA Section */}
              <MotionCard
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                sx={{
                  borderRadius: 3,
                  backgroundColor: "primary.dark",
                  color: "primary.contrastText",
                }}
              >
                <CardContent sx={{ p: { xs: 3, md: 5 }, textAlign: "center" }}>
                  <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
                    Ready to Start Your Journey?
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>
                    Get personalized guidance from our franchise experts.
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
                      variant="contained"
                      size="large"
                      onClick={() => navigate("/contact")}
                      sx={{
                        bgcolor: "background.paper",
                        color: "primary.main",
                        fontWeight: "bold",
                        "&:hover": { bgcolor: "primary.50" },
                      }}
                    >
                      Get Free Consultation
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => navigate("/blogs")}
                      sx={{
                        borderColor: "primary.contrastText",
                        color: "primary.contrastText",
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                        },
                      }}
                    >
                      More Articles
                    </Button>
                  </Box>
                </CardContent>
              </MotionCard>
            </MotionBox>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default BlogDetail;

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
  CircularProgress,
} from "@mui/material";
import {
  CalendarToday,
  AccessTime,
  Facebook,
  Twitter,
  LinkedIn,
  Home,
  Article,
  Visibility,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { Helmet } from 'react-helmet-async';
import { useBlog, incrementBlogViews } from "../hooks/useBlogs";

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const BlogDetail = () => {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const { blog: post, loading, error } = useBlog(id);
  const [readingProgress, setReadingProgress] = useState(0);
  const [viewIncremented, setViewIncremented] = useState(false);

  // Increment view count once when blog loads
  useEffect(() => {
    if (post && !viewIncremented) {
      incrementBlogViews(post.id);
      setViewIncremented(true);
    }
  }, [post, viewIncremented]);

  useEffect(() => {
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

  // Enhanced content parser to handle HTML from rich text editor
  const parseContent = (content) => {
    if (!content) return [];

    // If content is already HTML (from Quill), render it directly
    if (content.includes('<p>') || content.includes('<h1>') || content.includes('<h2>')) {
      return (
        <Box
          dangerouslySetInnerHTML={{ __html: content }}
          sx={{
            '& p': {
              mb: 3,
              lineHeight: 1.8,
              fontSize: '1.125rem',
              color: 'text.primary',
              textAlign: 'justify',
            },
            '& h1, & h2, & h3': {
              mb: 3,
              mt: 5,
              color: 'primary.main',
              borderLeft: 4,
              borderColor: 'primary.main',
              pl: 2,
              fontWeight: 'bold',
            },
            '& h1': { fontSize: '2rem' },
            '& h2': { fontSize: '1.75rem' },
            '& h3': { fontSize: '1.5rem' },
            '& ul, & ol': {
              mb: 3,
              pl: 4,
              '& li': {
                mb: 1,
                lineHeight: 1.8,
                fontSize: '1.125rem',
              },
            },
            '& img': {
              maxWidth: '100%',
              height: 'auto',
              borderRadius: 2,
              my: 3,
            },
            '& a': {
              color: 'primary.main',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            },
            '& blockquote': {
              borderLeft: 4,
              borderColor: 'primary.main',
              pl: 3,
              py: 2,
              my: 3,
              fontStyle: 'italic',
              backgroundColor: 'primary.50',
            },
            '& code': {
              backgroundColor: 'grey.100',
              padding: '2px 6px',
              borderRadius: 1,
              fontFamily: 'monospace',
            },
            '& pre': {
              backgroundColor: 'grey.900',
              color: 'grey.50',
              p: 2,
              borderRadius: 2,
              overflow: 'auto',
              mb: 3,
              '& code': {
                backgroundColor: 'transparent',
                color: 'inherit',
              },
            },
          }}
        />
      );
    }

    // Fallback for plain text with markdown-like formatting
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
    const title = post?.title || '';
    const text = post?.excerpt || '';

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };

    window.open(shareUrls[platform], "_blank", "width=600,height=400");
  };

  // Loading state
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
          Loading blog post...
        </Typography>
      </Container>
    );
  }

  // Error or not found state
  if (error || !post) {
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
            {error || "Blog post not found"}
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

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.image,
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "FranchiseHub",
      "logo": {
        "@type": "ImageObject",
        "url": "https://yoursite.com/logo.png"
      }
    },
    "datePublished": post.publishedAt?.toISOString() || post.createdAt.toISOString(),
    "dateModified": post.updatedAt.toISOString(),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": window.location.href
    },
    "keywords": post.tags?.join(', ') || '',
    "articleSection": post.category,
    "wordCount": post.content?.replace(/<[^>]*>/g, '').split(/\s+/).length || 0
  };

  return (
    <Box
      sx={{
        background: `linear-gradient(to bottom, ${theme.palette.primary[50]}, ${theme.palette.background.paper} 50%, ${theme.palette.secondary[50]})`,
      }}
    >
      {/* Comprehensive SEO Meta Tags */}
      <Helmet>
        <title>{post.metaTitle || post.title} | FranchiseHub Blog</title>
        <meta name="description" content={post.metaDescription || post.excerpt} />
        <meta name="keywords" content={post.metaKeywords || post.tags?.join(', ') || ''} />
        <meta name="author" content={post.author} />
        <link rel="canonical" href={window.location.href} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:title" content={post.metaTitle || post.title} />
        <meta property="og:description" content={post.metaDescription || post.excerpt} />
        <meta property="og:image" content={post.image} />
        <meta property="article:published_time" content={post.publishedAt?.toISOString() || post.createdAt.toISOString()} />
        <meta property="article:modified_time" content={post.updatedAt.toISOString()} />
        <meta property="article:author" content={post.author} />
        <meta property="article:section" content={post.category} />
        {post.tags?.map((tag, index) => (
          <meta property="article:tag" content={tag} key={index} />
        ))}
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={window.location.href} />
        <meta name="twitter:title" content={post.metaTitle || post.title} />
        <meta name="twitter:description" content={post.metaDescription || post.excerpt} />
        <meta name="twitter:image" content={post.image} />
        
        {/* Structured Data (JSON-LD) */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

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
                          {new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-US", {
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

                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Visibility
                          sx={{ fontSize: 18, color: "text.secondary" }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {post.views || 0} views
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

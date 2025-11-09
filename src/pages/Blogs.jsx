import React, { useState, useMemo } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Box,
  Chip,
  Button,
  Avatar,
  TextField,
  InputAdornment,
  Pagination,
  useTheme,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Search,
  CalendarToday,
  Person,
  ArrowForward,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import { useBlogs } from "../hooks/useBlogs";

const MotionCard = motion(Card);
const POSTS_PER_PAGE = 6;

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6 } },
};

const Blogs = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [page, setPage] = useState(1);

  // Fetch blogs from Firestore
  const { blogs: allBlogs, loading, error } = useBlogs({ includeDrafts: false });

  const categories = [
    "All",
    "Investment Tips",
    "Financing",
    "Market Analysis",
    "Success Tips",
    "Industry Trends",
    "Operations",
    "Legal & Compliance",
    "Marketing",
    "Technology",
    "Case Studies",
  ];

  // Filter blogs
  const filteredBlogs = useMemo(() => {
    return allBlogs.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [allBlogs, searchTerm, selectedCategory]);

  const totalPages = Math.ceil((filteredBlogs.length - 1) / POSTS_PER_PAGE);
  const paginatedPosts = filteredBlogs.slice(
    1 + (page - 1) * POSTS_PER_PAGE,
    1 + page * POSTS_PER_PAGE
  );

  const featuredPost = filteredBlogs[0] || null;

  return (
    <Box
      sx={{
        background: `linear-gradient(to bottom, ${theme.palette.primary[50]}, ${theme.palette.background.paper} 50%, ${theme.palette.secondary[50]})`,
      }}
    >
      <Helmet>
        <title>Franchise Insights & Tips | FranchiseHub Blog</title>
        <meta
          name="description"
          content="Stay informed with the latest franchise trends, investment tips, and success stories from industry experts. Expert advice for franchise investors and entrepreneurs."
        />
        <meta
          name="keywords"
          content="franchise blog, franchise tips, franchise investment, franchise news, franchise trends, franchise success stories"
        />
        <link rel="canonical" href="https://yoursite.com/blogs" />
      </Helmet>

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
            Franchise Insights & Tips
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              maxWidth: 800,
              mx: "auto",
              textAlign: "center",
              mb: { xs: 4, md: 6 },
            }}
          >
            Stay informed with the latest franchise trends, investment tips, and
            success stories from industry experts.
          </Typography>

          {/* Loading State */}
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress />
            </Box>
          )}

          {/* Error State */}
          {error && (
            <Alert severity="error" sx={{ mb: 4 }}>
              Error loading blogs: {error}
            </Alert>
          )}

          {/* Search and Filter */}
          {!loading && !error && (
            <>
              <Box sx={{ maxWidth: 800, mx: "auto", mb: 4 }}>
                <TextField
                  fullWidth
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 3 }}
                />

                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  {categories.map((category) => (
                    <Chip
                      key={category}
                      label={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setPage(1);
                      }}
                      color={selectedCategory === category ? "primary" : "default"}
                      variant={
                        selectedCategory === category ? "filled" : "outlined"
                      }
                      sx={{
                        fontWeight:
                          selectedCategory === category ? "bold" : "normal",
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </>
          )}
        </motion.div>

        {/* No Results */}
        {!loading && !error && filteredBlogs.length === 0 && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No blog posts found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {searchTerm || selectedCategory !== "All"
                ? "Try adjusting your search or filters"
                : "Check back soon for new content!"}
            </Typography>
          </Box>
        )}

        {/* Featured Post */}
        {!loading && !error && featuredPost && (
          <MotionCard
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            sx={{
              mb: 8,
              borderRadius: 3,
              overflow: "hidden",
              cursor: "pointer",
            }}
            onClick={() => navigate(`/blog/${featuredPost.slug || featuredPost.id}`)}
          >
            <Box sx={{ display: "flex", flexWrap: "wrap" }}>
              <CardMedia
                component="img"
                height="350"
                image={featuredPost.image}
                alt={featuredPost.title}
                sx={{ width: { xs: "100%", md: "50%" }, objectFit: "cover" }}
              />
              <CardContent sx={{ width: { xs: "100%", md: "50%" }, p: 4 }}>
                <Chip
                  label="Featured"
                  color="primary"
                  size="small"
                  sx={{ mb: 2, fontWeight: "bold" }}
                />
                <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
                  {featuredPost.title}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  {featuredPost.excerpt}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    mb: 3,
                    flexWrap: "wrap",
                  }}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      backgroundColor: "primary.main",
                    }}
                  >
                    <Person />
                  </Avatar>
                  <Typography variant="body2">{featuredPost.author}</Typography>
                  <CalendarToday sx={{ fontSize: 16 }} />
                  <Typography variant="body2" color="text.secondary">
                    {new Date(featuredPost.publishedAt || featuredPost.createdAt).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {featuredPost.readTime}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  endIcon={<ArrowForward />}
                  sx={{ borderRadius: 25, px: 3, fontWeight: "bold" }}
                >
                  Read Full Article
                </Button>
              </CardContent>
            </Box>
          </MotionCard>
        )}

        {/* Blog Cards */}
        {!loading && !error && paginatedPosts.length > 0 && (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 4,
              justifyContent: "center",
            }}
          >
            {paginatedPosts.map((post, index) => (
              <MotionCard
                key={post.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                sx={{
                  width: { xs: "100%", sm: "45%", md: "30%" },
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                onClick={() => navigate(`/blog/${post.slug || post.id}`)}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={post.image}
                  alt={post.title}
                />
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Chip
                    label={post.category}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                    {post.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3, lineHeight: 1.6 }}
                  >
                    {post.excerpt}
                  </Typography>
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                  >
                    <Avatar
                      sx={{
                        width: 24,
                        height: 24,
                        backgroundColor: "primary.main",
                        fontSize: "0.75rem",
                      }}
                    >
                      {post.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </Avatar>
                    <Typography variant="caption">{post.author}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      •
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      •
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {post.readTime}
                    </Typography>
                  </Box>
                  <Button
                    variant="text"
                    endIcon={<ArrowForward />}
                    sx={{ fontWeight: "bold", p: 0 }}
                  >
                    Read More
                  </Button>
                </CardContent>
              </MotionCard>
            ))}
          </Box>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 0 && (
          <Box sx={{ mt: 6, display: "flex", justifyContent: "center" }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
              shape="rounded"
            />
          </Box>
        )}

        {/* Newsletter - Updated Styling */}
        <Box
          sx={{
            mt: 8,
            p: { xs: 4, md: 6 },
            borderRadius: 3,
            backgroundColor: "primary.dark",
            color: "primary.contrastText",
            textAlign: "center",
          }}
        >
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
            Stay Updated
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Subscribe to our newsletter for the latest franchise insights and
            opportunities.
          </Typography>
          <Box sx={{ display: "flex", gap: 2, maxWidth: 500, mx: "auto" }}>
            <TextField
              fullWidth
              placeholder="Enter your email"
              variant="outlined"
              sx={{
                backgroundColor: "background.paper",
                borderRadius: 1,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                  "& fieldset": {
                    border: "none",
                  },
                },
              }}
            />
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: "background.paper",
                color: "primary.main",
                fontWeight: "bold",
                px: 3,
                "&:hover": { bgcolor: "primary.50" },
              }}
            >
              Subscribe
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Blogs;

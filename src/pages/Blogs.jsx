import React, { useState } from "react";
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
} from "@mui/material";
import {
  Search,
  CalendarToday,
  Person,
  ArrowForward,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { blogPostsData } from "../data/blogData";

const MotionCard = motion(Card);
const POSTS_PER_PAGE = 6;

const Blogs = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [page, setPage] = useState(1);

  const categories = [
    "All",
    "Investment Tips",
    "Financing",
    "Market Analysis",
    "Success Tips",
    "Industry Trends",
    "Operations",
  ];

  const filteredPosts = blogPostsData.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil((filteredPosts.length - 1) / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    1 + (page - 1) * POSTS_PER_PAGE,
    1 + page * POSTS_PER_PAGE
  );

  const featuredPost = filteredPosts[0] || blogPostsData[0];

  return (
    <Container maxWidth="xl" sx={{ py: 8 }}>
      <Box sx={{ textAlign: "center", mb: 8 }}>
        <Typography variant="h2" fontWeight="bold" sx={{ mb: 3 }}>
          Franchise Insights & Tips
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ maxWidth: 600, mx: "auto", lineHeight: 1.6, mb: 4 }}
        >
          Stay informed with the latest franchise trends, investment tips, and
          success stories from industry experts.
        </Typography>

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
                variant={selectedCategory === category ? "filled" : "outlined"}
                sx={{
                  fontWeight: selectedCategory === category ? "bold" : "normal",
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>

      {/* Featured Post */}
      {featuredPost && (
        <MotionCard
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          sx={{ mb: 8, borderRadius: 3, overflow: "hidden", cursor: "pointer" }}
          onClick={() => navigate(`/blog/${featuredPost.id}`)}
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
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
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
                  {new Date(featuredPost.date).toLocaleDateString()}
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
            onClick={() => navigate(`/blog/${post.id}`)}
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
                  {new Date(post.date).toLocaleDateString()}
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

      {/* Pagination */}
      <Box sx={{ mt: 6, display: "flex", justifyContent: "center" }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
          shape="rounded"
        />
      </Box>

      {/* Newsletter */}
      <Box
        sx={{
          mt: 8,
          p: 6,
          borderRadius: 3,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
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
        <Box sx={{ display: "flex", gap: 2, maxWidth: 400, mx: "auto" }}>
          <TextField
            fullWidth
            placeholder="Enter your email"
            size="small"
            sx={{
              backgroundColor: "white",
              borderRadius: 25,
              "& .MuiOutlinedInput-root": {
                borderRadius: 25,
              },
            }}
          />
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#FFD700",
              color: "black",
              fontWeight: "bold",
              borderRadius: 25,
              px: 3,
              "&:hover": { backgroundColor: "#FFC107" },
            }}
          >
            Subscribe
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Blogs;

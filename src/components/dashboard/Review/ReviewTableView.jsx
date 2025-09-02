import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Rating,
  Avatar,
  Typography,
  Box,
  useTheme,
} from "@mui/material";
import { format } from "date-fns";

const ReviewTableView = ({ testimonials }) => {
  const theme = useTheme();

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
      <Table>
        <TableHead sx={{ bgcolor: theme.palette.grey[100] }}>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Brand</TableCell>
            <TableCell>Rating</TableCell>
            <TableCell>Review</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {testimonials.map((testimonial) => (
            <TableRow key={testimonial.id} hover>
              <TableCell>
                <Box display="flex" alignItems="center">
                  <Avatar
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      width: 36,
                      height: 36,
                      mr: 2,
                    }}
                  >
                    {testimonial.userName.charAt(0)}
                  </Avatar>
                  <Typography variant="body2">{testimonial.userName}</Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{testimonial.brand}</Typography>
              </TableCell>
              <TableCell>
                <Rating
                  value={testimonial.rating}
                  precision={0.5}
                  readOnly
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {testimonial.content}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {format(
                    new Date(testimonial.createdAt.seconds * 1000),
                    "MMM dd, yyyy"
                  )}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ReviewTableView;
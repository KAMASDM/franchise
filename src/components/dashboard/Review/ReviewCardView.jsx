import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Rating,
  Box,
  Grid,
  useTheme,
} from "@mui/material";
import { format } from "date-fns";

const ReviewCardView = ({ testimonials }) => {
  const theme = useTheme();

  return (
    <Grid container spacing={3}>
      {testimonials.map((testimonial) => (
        <Grid item xs={12} key={testimonial.id}>
          <Card
            sx={{
              borderRadius: 2,
              boxShadow: theme.shadows[2],
              "&:hover": {
                boxShadow: theme.shadows[4],
              },
            }}
          >
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={2}
              >
                <Box display="flex" alignItems="center">
                  <Avatar
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      width: 48,
                      height: 48,
                      mr: 2,
                    }}
                  >
                    {testimonial.userName.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {testimonial.userName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {format(
                        new Date(testimonial.createdAt.seconds * 1000),
                        "MMM dd, yyyy"
                      )}
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    {testimonial.brand}
                  </Typography>
                </Box>
              </Box>

              <Box mb={2}>
                <Rating
                  value={testimonial.rating}
                  precision={0.5}
                  readOnly
                  size="small"
                />
              </Box>

              <Typography variant="body2" color="text.secondary">
                {testimonial.content}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ReviewCardView;
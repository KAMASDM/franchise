import React, { useState } from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Card,
  CardContent,
  IconButton,
  Alert
} from '@mui/material'
import { Close, Send } from '@mui/icons-material'
import { useForm, Controller } from 'react-hook-form'

const FranchiseInquiryForm = ({ brand, onClose }) => {
  const [submitted, setSubmitted] = useState(false)
  const { control, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = (data) => {
    console.log('Form Data:', { ...data, brand: brand.name })
    // Here you would typically send the data to your backend
    setSubmitted(true)
    setTimeout(() => {
      onClose()
    }, 2000)
  }

  if (submitted) {
    return (
      <Card sx={{ m: 2 }}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Alert severity="success" sx={{ mb: 3 }}>
            Thank you for your interest in {brand.name}!
          </Alert>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Your inquiry has been submitted successfully.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            A franchise specialist will contact you within 24 hours.
          </Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card sx={{ m: 2 }}>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" fontWeight="bold">
            Request Information - {brand.name}
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="firstName"
                control={control}
                rules={{ required: 'First name is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="First Name"
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="lastName"
                control={control}
                rules={{ required: 'Last name is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Last Name"
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Invalid email address'
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Email"
                    type="email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="phone"
                control={control}
                rules={{ required: 'Phone number is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Phone Number"
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="location"
                control={control}
                rules={{ required: 'Preferred location is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Preferred Location"
                    error={!!errors.location}
                    helperText={errors.location?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="budget"
                control={control}
                rules={{ required: 'Investment budget is required' }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.budget}>
                    <InputLabel>Investment Budget</InputLabel>
                    <Select
                      {...field}
                      label="Investment Budget"
                    >
                      <MenuItem value="under-100k">Under $100K</MenuItem>
                      <MenuItem value="100-200k">$100K - $200K</MenuItem>
                      <MenuItem value="200-300k">$200K - $300K</MenuItem>
                      <MenuItem value="300-500k">$300K - $500K</MenuItem>
                      <MenuItem value="over-500k">Over $500K</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="experience"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Business Experience</InputLabel>
                    <Select
                      {...field}
                      label="Business Experience"
                    >
                      <MenuItem value="none">No business experience</MenuItem>
                      <MenuItem value="some">Some business experience</MenuItem>
                      <MenuItem value="restaurant">Restaurant experience</MenuItem>
                      <MenuItem value="franchise">Franchise experience</MenuItem>
                      <MenuItem value="corporate">Corporate executive</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="timeline"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Timeline to Open</InputLabel>
                    <Select
                      {...field}
                      label="Timeline to Open"
                    >
                      <MenuItem value="asap">As soon as possible</MenuItem>
                      <MenuItem value="3-months">Within 3 months</MenuItem>
                      <MenuItem value="6-months">Within 6 months</MenuItem>
                      <MenuItem value="1-year">Within 1 year</MenuItem>
                      <MenuItem value="exploring">Just exploring</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="comments"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Additional Comments"
                    multiline
                    rows={4}
                    placeholder="Tell us more about your goals and any specific questions you have..."
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="agreement"
                control={control}
                rules={{ required: 'You must agree to be contacted' }}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...field}
                        color="primary"
                      />
                    }
                    label="I agree to be contacted by FranchiseHub and the franchise brand regarding this opportunity"
                  />
                )}
              />
              {errors.agreement && (
                <Typography variant="caption" color="error">
                  {errors.agreement.message}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                startIcon={<Send />}
                sx={{
                  borderRadius: 25,
                  fontWeight: 'bold',
                  py: 1.5
                }}
              >
                Submit Inquiry
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default FranchiseInquiryForm
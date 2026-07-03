import React, { useState, useEffect } from "react";
import {
  Dialog,
  Box,
  Typography,
  Button,
  Stack,
  IconButton,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Storefront,
  CompareArrows,
  TravelExplore,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const SEEN_KEY = "welcome_tour_seen_v1";

const STEPS = [
  {
    icon: Storefront,
    title: "Discover verified brands",
    body: "Browse franchise opportunities across every industry, with transparent investment details and verified listings.",
  },
  {
    icon: CompareArrows,
    title: "Compare, favorite, save",
    body: "Shortlist favorites, compare brands side by side, and save your searches — everything stays exactly where you left it.",
  },
  {
    icon: TravelExplore,
    title: "Get expert guidance",
    body: "Use AI-powered location analysis and free expert chat to pick the right opportunity for your budget and city.",
  },
];

/**
 * One-time welcome for first-time visitors on the homepage.
 * Skipped for signed-in users, remembered in localStorage, and delayed
 * a moment so it never competes with the page's first paint.
 */
const WelcomeTour = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (loading || user) return;
    let seen = false;
    try {
      seen = Boolean(localStorage.getItem(SEEN_KEY));
    } catch {
      seen = true; // storage unavailable — never nag
    }
    if (seen) return;
    const timer = setTimeout(() => setOpen(true), 1800);
    return () => clearTimeout(timer);
  }, [loading, user]);

  const dismiss = () => {
    try {
      localStorage.setItem(SEEN_KEY, "1");
    } catch {
      // ignore
    }
    setOpen(false);
  };

  const handleFinish = () => {
    dismiss();
    navigate("/brands");
  };

  if (!open) return null;

  const isLast = step === STEPS.length - 1;
  const { icon: StepIcon, title, body } = STEPS[step];

  return (
    <Dialog
      open={open}
      onClose={dismiss}
      maxWidth="xs"
      fullWidth
      aria-label="Welcome to ikama"
      PaperProps={{ sx: { borderRadius: 4, overflow: "hidden" } }}
    >
      <Box
        sx={{
          position: "relative",
          px: 4,
          pt: 5,
          pb: 3,
          textAlign: "center",
          background: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, transparent 100%)`,
        }}
      >
        <IconButton
          onClick={dismiss}
          aria-label="Close welcome tour"
          sx={{ position: "absolute", top: 8, right: 8, color: "text.secondary" }}
        >
          <CloseIcon />
        </IconButton>

        <Box
          sx={{
            width: 72,
            height: 72,
            mx: "auto",
            mb: 2.5,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: alpha(theme.palette.primary.main, 0.12),
            color: "primary.main",
          }}
        >
          <StepIcon sx={{ fontSize: 36 }} />
        </Box>

        <Typography variant="h5" fontWeight={700} gutterBottom>
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ minHeight: 72 }}>
          {body}
        </Typography>

        {/* Step dots */}
        <Stack direction="row" spacing={1} justifyContent="center" sx={{ my: 3 }}>
          {STEPS.map((_, index) => (
            <Box
              key={index}
              onClick={() => setStep(index)}
              sx={{
                width: index === step ? 24 : 8,
                height: 8,
                borderRadius: 4,
                cursor: "pointer",
                bgcolor: index === step ? "primary.main" : "action.disabled",
                transition: "all 200ms ease",
              }}
            />
          ))}
        </Stack>

        <Stack direction="row" spacing={1.5} justifyContent="center">
          <Button color="inherit" onClick={dismiss} sx={{ color: "text.secondary" }}>
            Skip
          </Button>
          {isLast ? (
            <Button variant="contained" size="large" onClick={handleFinish}>
              Explore brands
            </Button>
          ) : (
            <Button variant="contained" size="large" onClick={() => setStep(step + 1)}>
              Next
            </Button>
          )}
        </Stack>
      </Box>
    </Dialog>
  );
};

export default WelcomeTour;

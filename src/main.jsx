import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import App from "./App.jsx";

const theme = createTheme({
  palette: {
    primary: {
      50: "#f0f4ff",
      100: "#e0e9ff",
      200: "#809bce",
      300: "#95b8d1",
      400: "#6d89bc",
      500: "#5a76a9",
      600: "#4a6596",
      700: "#3a5483",
      800: "#2a4370",
      900: "#1a325d",
      main: "#5a76a9",
      light: "#95b8d1",
      dark: "#3a5483",
      contrastText: "#ffffff",
    },
    secondary: {
      50: "#f0faf7",
      100: "#e1f5ef",
      200: "#b8e0d2",
      300: "#d6eadf",
      400: "#a5cdbf",
      500: "#92baac",
      600: "#7fa799",
      700: "#6c9486",
      800: "#598173",
      900: "#466e60",
      main: "#92baac",
      light: "#a5cdbf",
      dark: "#6c9486",
      contrastText: "#1f2937",
    },
    // Custom accent palette (MUI doesn't have accent by default, but we can add it)
    accent: {
      50: "#fdf2f6",
      100: "#fbe5ed",
      200: "#eac4d5",
      300: "#ecd5e0",
      400: "#d7b1c2",
      500: "#c49eaf",
      600: "#b18b9c",
      700: "#9e7889",
      800: "#8b6576",
      900: "#785263",
      main: "#c49eaf",
      light: "#d7b1c2",
      dark: "#b18b9c",
      contrastText: "#1f2937",
    },
    dark: {
      main: "#1f2937",
      light: "#374151",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f0f4ff",
      paper: "#ffffff",
    },
    text: {
      primary: "#1a325d",
      secondary: "#3a5483",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  customColors: {
    primary: {
      50: "#f0f4ff",
      100: "#e0e9ff",
      200: "#809bce",
      300: "#95b8d1",
      400: "#6d89bc",
      500: "#5a76a9",
      600: "#4a6596",
      700: "#3a5483",
      800: "#2a4370",
      900: "#1a325d",
    },
    secondary: {
      50: "#f0faf7",
      100: "#e1f5ef",
      200: "#b8e0d2",
      300: "#d6eadf",
      400: "#a5cdbf",
      500: "#92baac",
      600: "#7fa799",
      700: "#6c9486",
      800: "#598173",
      900: "#466e60",
    },
    accent: {
      50: "#fdf2f6",
      100: "#fbe5ed",
      200: "#eac4d5",
      300: "#ecd5e0",
      400: "#d7b1c2",
      500: "#c49eaf",
      600: "#b18b9c",
      700: "#9e7889",
      800: "#8b6576",
      900: "#785263",
    },
    dark: {
      DEFAULT: "#1f2937",
      light: "#374151",
    },
  },
  customAnimations: {
    scrollLeft: {
      "@keyframes scrollLeft": {
        "0%": { transform: "translateX(0)" },
        "100%": { transform: "translateX(-100%)" },
      },
      animation: "scrollLeft 40s linear infinite",
    },
    scrollRight: {
      "@keyframes scrollRight": {
        "0%": { transform: "translateX(-100%)" },
        "100%": { transform: "translateX(0)" },
      },
      animation: "scrollRight 40s linear infinite",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        ".scrollbar-hide": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
        "@keyframes scrollLeft": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },
        },
        "@keyframes scrollRight": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);

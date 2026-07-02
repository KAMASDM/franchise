import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  Dialog,
  Box,
  InputBase,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Typography,
  Divider,
  Chip,
  alpha,
  useTheme,
} from "@mui/material";
import {
  Search as SearchIcon,
  Home as HomeIcon,
  Storefront as BrandsIcon,
  Article as BlogIcon,
  Info as AboutIcon,
  Help as FaqIcon,
  ContactMail as ContactIcon,
  TrendingUp as InvestorIcon,
  Dashboard as DashboardIcon,
  Favorite as FavoriteIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Login as LoginIcon,
  Business as BrandIcon,
  TravelExplore as LocationIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useDarkMode } from "../../context/DarkModeContext";
import { useBrands } from "../../hooks/useBrands";
import { enhancedSearch } from "../../utils/fuzzySearch";
import { generateBrandSlug } from "../../utils/brandUtils";

const PAGES = [
  { label: "Home", path: "/", icon: <HomeIcon fontSize="small" /> },
  { label: "Browse Brands", path: "/brands", icon: <BrandsIcon fontSize="small" /> },
  { label: "Blog", path: "/blogs", icon: <BlogIcon fontSize="small" /> },
  { label: "About", path: "/about", icon: <AboutIcon fontSize="small" /> },
  { label: "FAQs", path: "/faq", icon: <FaqIcon fontSize="small" /> },
  { label: "Contact", path: "/contact", icon: <ContactIcon fontSize="small" /> },
  { label: "Investors", path: "/investors", icon: <InvestorIcon fontSize="small" /> },
  { label: "Favorites", path: "/favorites", icon: <FavoriteIcon fontSize="small" /> },
  { label: "Location Analysis", path: "/location-analysis", icon: <LocationIcon fontSize="small" /> },
];

/**
 * Inner content is mounted only while the palette is open, so the
 * brand list is fetched lazily on first open (and cached by the browser
 * for the session via Firestore's local cache).
 */
const PaletteContent = ({ onClose }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { mode, toggleTheme } = useDarkMode();
  const { brands, loading: brandsLoading } = useBrands(null, { limit: 100 });

  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef(null);

  const actions = useMemo(
    () => [
      {
        label: mode === "dark" ? "Switch to light mode" : "Switch to dark mode",
        icon: mode === "dark" ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />,
        run: () => toggleTheme(),
      },
      user
        ? { label: "Go to Dashboard", icon: <DashboardIcon fontSize="small" />, run: () => navigate("/dashboard") }
        : { label: "Sign in", icon: <LoginIcon fontSize="small" />, run: () => navigate("/login") },
    ],
    [mode, toggleTheme, user, navigate]
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();

    const pages = q
      ? PAGES.filter((p) => p.label.toLowerCase().includes(q))
      : PAGES.slice(0, 5);

    const matchedActions = q
      ? actions.filter((a) => a.label.toLowerCase().includes(q))
      : actions;

    let matchedBrands = [];
    if (q && brands?.length) {
      const searchResult = enhancedSearch(brands, query, {
        searchFields: ["brandName", "brandCategory", "industries"],
        limit: 6,
      });
      matchedBrands = searchResult.results || [];
    }

    const items = [
      ...pages.map((p) => ({
        type: "page",
        label: p.label,
        icon: p.icon,
        run: () => navigate(p.path),
      })),
      ...matchedActions.map((a) => ({ type: "action", ...a })),
      ...matchedBrands.map((b) => ({
        type: "brand",
        label: b.brandName,
        sub: b.brandCategory,
        icon: <BrandIcon fontSize="small" />,
        run: () => navigate(`/brand/${generateBrandSlug(b.brandName)}`),
      })),
    ];
    return items;
  }, [query, actions, brands, navigate]);

  // Keep selection in range when results change
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const runItem = useCallback(
    (item) => {
      onClose();
      // Run after close so navigation isn't swallowed by the dialog transition
      setTimeout(() => item.run(), 0);
    },
    [onClose]
  );

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[activeIndex]) {
      e.preventDefault();
      runItem(results[activeIndex]);
    }
  };

  // Keep the active option visible while arrowing through the list
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${activeIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const sections = [
    { key: "page", title: "Pages" },
    { key: "action", title: "Actions" },
    { key: "brand", title: "Brands" },
  ];

  let flatIndex = -1;

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 2.5, py: 2 }}>
        <SearchIcon sx={{ color: "text.secondary" }} />
        <InputBase
          autoFocus
          fullWidth
          placeholder="Search brands, pages, actions…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          inputProps={{ "aria-label": "Command palette search" }}
          sx={{ fontSize: "1.05rem" }}
        />
        <Chip label="esc" size="small" variant="outlined" sx={{ color: "text.secondary" }} />
      </Box>
      <Divider />
      <Box ref={listRef} sx={{ maxHeight: 420, overflowY: "auto", py: 1 }}>
        {results.length === 0 && (
          <Typography sx={{ px: 3, py: 4, textAlign: "center" }} color="text.secondary">
            {brandsLoading ? "Searching…" : `No results for “${query}”`}
          </Typography>
        )}
        {sections.map(({ key, title }) => {
          const sectionItems = results.filter((r) => r.type === key);
          if (sectionItems.length === 0) return null;
          return (
            <List
              key={key}
              dense
              disablePadding
              subheader={
                <ListSubheader disableSticky sx={{ bgcolor: "transparent", lineHeight: 2.5 }}>
                  {title}
                </ListSubheader>
              }
            >
              {sectionItems.map((item) => {
                flatIndex += 1;
                const index = results.indexOf(item);
                return (
                  <ListItemButton
                    key={`${key}-${item.label}`}
                    data-index={index}
                    selected={index === activeIndex}
                    onClick={() => runItem(item)}
                    onMouseEnter={() => setActiveIndex(index)}
                    sx={{
                      mx: 1,
                      borderRadius: 1.5,
                      "&.Mui-selected": {
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36, color: "text.secondary" }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      secondary={item.sub}
                      primaryTypographyProps={{ fontSize: "0.95rem" }}
                    />
                  </ListItemButton>
                );
              })}
            </List>
          );
        })}
      </Box>
      <Divider />
      <Box sx={{ display: "flex", gap: 2, px: 2.5, py: 1.25 }}>
        <Typography variant="caption" color="text.secondary">↑↓ navigate</Typography>
        <Typography variant="caption" color="text.secondary">↵ open</Typography>
      </Box>
    </>
  );
};

/**
 * Global command palette. Opens with Cmd/Ctrl+K anywhere in the app,
 * or via the header search button (custom "open-command-palette" event).
 */
const CommandPalette = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpenEvent = () => setOpen(true);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("open-command-palette", onOpenEvent);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("open-command-palette", onOpenEvent);
    };
  }, []);

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      fullWidth
      maxWidth="sm"
      aria-label="Command palette"
      sx={{
        "& .MuiDialog-container": { alignItems: "flex-start", pt: "12vh" },
      }}
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      {open && <PaletteContent onClose={() => setOpen(false)} />}
    </Dialog>
  );
};

export default CommandPalette;

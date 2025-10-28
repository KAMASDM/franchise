# 📱 Mobile PWA - Quick Reference Card

## 🚀 Quick Start

### Import the Hook
```javascript
import { useDevice } from '../hooks/useDevice';

const MyComponent = () => {
  const { isMobile, isTablet, isDesktop } = useDevice();
  
  if (isMobile) return <MobileView />;
  return <DesktopView />;
};
```

## 🎯 Common Patterns

### 1. Conditional Mobile Rendering
```javascript
{isMobile && <BottomActionBar />}
{!isMobile && <DesktopSidebar />}
```

### 2. Responsive Spacing
```javascript
const { spacing } = useDevice();

<Box p={spacing.md}> // Auto: 3 on mobile, 4 on desktop
  {content}
</Box>
```

### 3. Responsive Typography
```javascript
const { fontSize } = useDevice();

<Typography fontSize={fontSize.h4}>
  {/* Auto-scales: 1.25rem mobile, 1.75rem desktop */}
</Typography>
```

### 4. Dynamic Values
```javascript
const { getValue } = useDevice();

const columns = getValue(1, 2, 3); // Mobile, Tablet, Desktop
```

## 🧩 Layout Components

```javascript
import ResponsiveContainer, { 
  ResponsiveGrid, 
  ResponsiveStack,
  MobileSection 
} from '../layout/ResponsiveContainer';

// Container with auto-padding
<ResponsiveContainer>
  {content}
</ResponsiveContainer>

// Grid with auto-columns
<ResponsiveGrid>
  <Card>1</Card>
  <Card>2</Card>
  <Card>3</Card>
</ResponsiveGrid>

// Stack with responsive direction
<ResponsiveStack>
  <Box>Left</Box>
  <Box>Right</Box>
</ResponsiveStack>
```

## 📐 Responsive Styles

### Material-UI sx Prop
```javascript
<Box
  sx={{
    p: { xs: 2, sm: 3, md: 4 },
    fontSize: { xs: '0.875rem', md: '1rem' },
    display: { xs: 'block', md: 'flex' },
  }}
>
  {content}
</Box>
```

### Breakpoints
- `xs`: 0-599px (Mobile)
- `sm`: 600-899px (Tablet)
- `md`: 900-1199px (Small Desktop)
- `lg`: 1200-1535px (Desktop)
- `xl`: 1536px+ (Large Desktop)

## 🎨 Mobile UI Patterns

### Bottom Navigation
```javascript
<BottomNavigation value={value} onChange={handleChange}>
  <BottomNavigationAction label="Home" icon={<Home />} />
</BottomNavigation>
```

### Swipeable Drawer
```javascript
<SwipeableDrawer 
  anchor="bottom"
  open={open}
  onClose={handleClose}
  onOpen={handleOpen}
>
  {content}
</SwipeableDrawer>
```

### Collapsible Section
```javascript
<Box onClick={() => setExpanded(!expanded)}>
  <Typography>Title</Typography>
  {expanded ? <ExpandLess /> : <ExpandMore />}
</Box>
<Collapse in={expanded}>{content}</Collapse>
```

### Fixed Action Bar
```javascript
<Box
  sx={{
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    p: 2,
    bgcolor: 'background.paper',
  }}
>
  <Button fullWidth variant="contained">
    Primary Action
  </Button>
</Box>
```

### Horizontal Scroll
```javascript
<Box display="flex" overflow="auto" gap={2}>
  {items.map(item => (
    <Card sx={{ minWidth: 150 }}>{item}</Card>
  ))}
</Box>
```

## 📱 Native Features

### Share API
```javascript
const handleShare = async () => {
  if (navigator.share) {
    await navigator.share({
      title: 'Title',
      text: 'Description',
      url: window.location.href,
    });
  }
};
```

### Phone Call
```javascript
<Button href={`tel:${phone}`}>Call Now</Button>
// or
window.location.href = `tel:${phone}`;
```

### WhatsApp
```javascript
const handleWhatsApp = () => {
  const phone = '919876543210';
  const message = 'Hello!';
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`);
};
```

### Email
```javascript
<Button href={`mailto:${email}`}>Email</Button>
// or
window.location.href = `mailto:${email}`;
```

## ⚡ Performance

### Code Splitting
```javascript
const MobileComponent = lazy(() => import('./MobileComponent'));

<Suspense fallback={<CircularProgress />}>
  <MobileComponent />
</Suspense>
```

### Lazy Images
```javascript
<Box
  component="img"
  src={imageSrc}
  loading="lazy"
  alt="Description"
/>
```

## 🎯 Touch Guidelines

### Minimum Sizes
- Buttons: 48x48px
- Icons: 24px
- Tap spacing: 8px minimum

### Implementation
```javascript
<IconButton sx={{ width: 48, height: 48 }}>
  <Icon />
</IconButton>

<Button size="large" fullWidth>
  Touch-Friendly Button
</Button>
```

## 🔍 Device Detection

```javascript
const { 
  isMobile,          // true if < 600px
  isTablet,          // true if 600-899px
  isDesktop,         // true if > 900px
  isMobileOrTablet,  // true if < 900px
  isTouchDevice,     // true if touch capable
  isPWA,             // true if installed
  isPortrait,        // true if portrait
  isLandscape,       // true if landscape
  deviceType,        // 'mobile' | 'tablet' | 'desktop'
} = useDevice();
```

## 📋 Checklist for New Mobile Page

- [ ] Import `useDevice` hook
- [ ] Create mobile version if significantly different
- [ ] Use responsive spacing (`spacing.md`)
- [ ] Use responsive typography (`fontSize.h4`)
- [ ] Ensure 48px+ tap targets
- [ ] Add bottom navigation if needed
- [ ] Use swipeable drawers for modals
- [ ] Add native features (share, call, etc.)
- [ ] Test on iOS Safari
- [ ] Test on Android Chrome
- [ ] Test landscape orientation
- [ ] Check Lighthouse mobile score

## 🐛 Common Issues

### 1. 100vh on Mobile Safari
❌ `height: 100vh` (includes browser chrome)  
✅ `height: 100dvh` (dynamic viewport height)

### 2. Input Zoom on iOS
❌ `fontSize: 14px` (causes zoom)  
✅ `fontSize: 16px` (prevents zoom)

### 3. Touch Delay
❌ Default 300ms delay  
✅ `touchAction: 'manipulation'` (already in global styles)

### 4. Keyboard Overlap
❌ Fixed bottom elements  
✅ Use `pb: 10` for keyboard space

## 📞 Support

- **Documentation**: `/MOBILE_PWA_GUIDE.md`
- **Examples**: `/src/components/brand/BrandDetailMobile.jsx`
- **Hook**: `/src/hooks/useDevice.js`
- **Components**: `/src/components/layout/ResponsiveContainer.jsx`

---

*Quick Reference v1.0 | October 2025*

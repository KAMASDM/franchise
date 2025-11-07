import React, { useState, useEffect, useRef } from 'react';
import { Box, Skeleton, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

/**
 * Lazy Loading Image Component with Blur-up Effect
 * Progressively loads images with a smooth blur-to-sharp transition
 * 
 * @param {Object} props
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Alt text for accessibility
 * @param {string} props.placeholderSrc - Low-res placeholder image (optional)
 * @param {number} props.height - Image height
 * @param {number} props.width - Image width
 * @param {string} props.objectFit - CSS object-fit property (default: 'cover')
 * @param {boolean} props.lazy - Enable lazy loading (default: true)
 * @param {Function} props.onLoad - Callback when image loads
 * @param {Object} props.sx - MUI sx prop for styling
 */
const LazyImage = ({
  src,
  alt = '',
  placeholderSrc,
  height = 300,
  width = '100%',
  objectFit = 'cover',
  lazy = true,
  onLoad,
  sx = {},
  ...props
}) => {
  const theme = useTheme();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before image enters viewport
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [lazy]);

  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    setError(true);
  };

  return (
    <Box
      ref={imgRef}
      sx={{
        position: 'relative',
        width,
        height,
        overflow: 'hidden',
        backgroundColor: theme.palette.grey[200],
        ...sx,
      }}
      {...props}
    >
      {/* Placeholder/Skeleton */}
      {!isLoaded && !error && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          animation="wave"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        />
      )}

      {/* Low-res placeholder image (if provided) */}
      {placeholderSrc && !isLoaded && isInView && (
        <Box
          component="img"
          src={placeholderSrc}
          alt={alt}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit,
            filter: 'blur(10px)',
            transform: 'scale(1.1)', // Slightly scale to hide blur edges
          }}
        />
      )}

      {/* Main image */}
      {isInView && !error && (
        <motion.img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit,
          }}
        />
      )}

      {/* Error fallback */}
      {error && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.palette.grey[100],
            color: theme.palette.text.secondary,
          }}
        >
          Image not available
        </Box>
      )}
    </Box>
  );
};

/**
 * Progressive Image Component
 * Loads tiny base64 placeholder, then full image
 */
export const ProgressiveImage = ({ src, alt, placeholder, ...props }) => {
  const [imgSrc, setImgSrc] = useState(placeholder || src);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImgSrc(src);
      setIsLoading(false);
    };
  }, [src]);

  return (
    <LazyImage
      {...props}
      src={imgSrc}
      alt={alt}
      sx={{
        filter: isLoading ? 'blur(20px)' : 'blur(0px)',
        transition: 'filter 0.5s ease-out',
        ...props.sx,
      }}
    />
  );
};

/**
 * Background Image with Lazy Loading
 */
export const LazyBackgroundImage = ({
  src,
  children,
  height = 400,
  overlay = 0.3,
  sx = {},
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const bgRef = useRef(null);
  const theme = useTheme();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' }
    );

    if (bgRef.current) {
      observer.observe(bgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isInView && src) {
      const img = new Image();
      img.src = src;
      img.onload = () => setIsLoaded(true);
    }
  }, [isInView, src]);

  return (
    <Box
      ref={bgRef}
      sx={{
        position: 'relative',
        height,
        backgroundImage: isLoaded ? `url(${src})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: theme.palette.grey[200],
        transition: 'background-image 0.5s ease-in-out',
        '&::before': overlay
          ? {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: `rgba(0, 0, 0, ${overlay})`,
            }
          : {},
        ...sx,
      }}
    >
      {!isLoaded && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          animation="wave"
        />
      )}
      <Box sx={{ position: 'relative', zIndex: 1, height: '100%' }}>
        {children}
      </Box>
    </Box>
  );
};

/**
 * Image Gallery with Lazy Loading
 */
export const LazyImageGallery = ({ images = [], columns = 3, gap = 2 }) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap,
      }}
    >
      {images.map((img, index) => (
        <LazyImage
          key={index}
          src={img.src || img}
          alt={img.alt || `Image ${index + 1}`}
          height={250}
          sx={{
            borderRadius: 2,
            cursor: 'pointer',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        />
      ))}
    </Box>
  );
};

export default LazyImage;

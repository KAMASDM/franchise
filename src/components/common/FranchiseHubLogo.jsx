/**
 * IKAMA - Franchise Hub Logo Component
 * Professional SVG logo with modern gradient design
 */

import React from 'react';
import { useTheme } from '@mui/material/styles';

const FranchiseHubLogo = ({ 
  width = 200, 
  height = 60, 
  variant = 'full', // 'full', 'icon', 'text'
  color = 'primary' // 'primary', 'white', 'dark'
}) => {
  const theme = useTheme();
  
  const colors = {
    primary: theme.palette.primary.main,
    secondary: theme.palette.secondary.main,
    white: '#ffffff',
    dark: theme.palette.text.primary,
  };

  const fillColor = colors[color] || colors.primary;
  const accentColor = colors.secondary;

  // Icon only (modern abstract 'IK' lettermark with connection nodes)
  const IconOnly = () => (
    <svg width={width} height={height} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ikamaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={fillColor} />
          <stop offset="100%" stopColor={accentColor} />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Circular background with gradient */}
      <circle cx="30" cy="30" r="28" fill="url(#ikamaGradient)" opacity="0.1"/>
      
      {/* Abstract 'I' - vertical pillar */}
      <rect x="14" y="15" width="6" height="30" rx="3" fill="url(#ikamaGradient)"/>
      
      {/* Abstract 'K' - diagonal connection */}
      <path d="M 26 30 L 40 18 L 44 21 L 30 33 Z" fill={fillColor}/>
      <path d="M 30 27 L 44 39 L 40 42 L 26 30 Z" fill={accentColor}/>
      
      {/* Connection nodes (representing network/franchise) */}
      <circle cx="42" cy="19" r="4" fill={accentColor} filter="url(#glow)"/>
      <circle cx="42" cy="41" r="4" fill={fillColor} filter="url(#glow)"/>
      <circle cx="17" cy="30" r="4" fill={accentColor} filter="url(#glow)"/>
    </svg>
  );

  // Text only
  const TextOnly = () => (
    <svg width={width} height={height} viewBox="0 0 280 45" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={fillColor} />
          <stop offset="100%" stopColor={accentColor} />
        </linearGradient>
      </defs>
      
      {/* ikama - bold modern font (lowercase) */}
      <text x="0" y="28" fontFamily="Inter, sans-serif" fontSize="32" fontWeight="800" fill="url(#textGradient)" letterSpacing="-1">
        ikama
      </text>
      
      {/* Subtitle - Franchise Hub */}
      <text x="2" y="40" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="600" fill={fillColor} letterSpacing="1.5" opacity="0.7">
        FRANCHISE HUB
      </text>
    </svg>
  );

  // Full logo (icon + text)
  const FullLogo = () => (
    <svg width={width} height={height} viewBox="0 0 320 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fullGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={fillColor} />
          <stop offset="100%" stopColor={accentColor} />
        </linearGradient>
        <linearGradient id="textFullGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={fillColor} />
          <stop offset="60%" stopColor={accentColor} />
        </linearGradient>
        <filter id="logoGlow">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Icon */}
      <g transform="translate(0, 0)">
        {/* Circular background with gradient */}
        <circle cx="30" cy="30" r="26" fill="url(#fullGradient)" opacity="0.12"/>
        
        {/* Abstract 'I' - vertical pillar */}
        <rect x="16" y="16" width="5" height="28" rx="2.5" fill="url(#fullGradient)"/>
        
        {/* Abstract 'K' - diagonal connection */}
        <path d="M 26 30 L 38 20 L 41 22.5 L 29 32.5 Z" fill={fillColor}/>
        <path d="M 29 27.5 L 41 37.5 L 38 40 L 26 30 Z" fill={accentColor}/>
        
        {/* Connection nodes */}
        <circle cx="39.5" cy="21" r="3.5" fill={accentColor} filter="url(#logoGlow)"/>
        <circle cx="39.5" cy="39" r="3.5" fill={fillColor} filter="url(#logoGlow)"/>
        <circle cx="18.5" cy="30" r="3.5" fill={accentColor} filter="url(#logoGlow)"/>
      </g>
      
      {/* Text */}
      <g transform="translate(70, 0)">
        {/* ikama - main brand name (lowercase) */}
        <text x="0" y="30" fontFamily="Inter, sans-serif" fontSize="28" fontWeight="800" fill="url(#textFullGradient)" letterSpacing="-0.5">
          ikama
        </text>
        
        {/* Separator line */}
        <line x1="0" y1="38" x2="90" y2="38" stroke={accentColor} strokeWidth="1.5" opacity="0.3"/>
        
        {/* Subtitle */}
        <text x="0" y="50" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="600" fill={fillColor} letterSpacing="1.8" opacity="0.65">
          FRANCHISE HUB
        </text>
      </g>
    </svg>
  );

  // Render based on variant
  switch (variant) {
    case 'icon':
      return <IconOnly />;
    case 'text':
      return <TextOnly />;
    case 'full':
    default:
      return <FullLogo />;
  }
};

export default FranchiseHubLogo;

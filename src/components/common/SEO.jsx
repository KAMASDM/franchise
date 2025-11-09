import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * SEO Component - Manages meta tags, Open Graph, Twitter Cards, and JSON-LD structured data
 * for improved search engine crawlability and social sharing
 */
const SEO = ({
  title = 'ikama - Franchise Hub | Find Your Perfect Franchise Opportunity',
  description = 'Discover top franchise opportunities across industries. Connect with successful brands, explore investment options, and start your entrepreneurial journey with ikama.',
  keywords = 'franchise opportunities, franchise business, franchise investment, business opportunities, franchising, brand partnerships',
  image = '/og-image.jpg', // You'll need to add this to your public folder
  url = typeof window !== 'undefined' ? window.location.href : 'https://ikama.com',
  type = 'website',
  author = 'ikama',
  structuredData = null,
  canonicalUrl = null,
}) => {
  const siteName = 'ikama - Franchise Hub';
  const twitterHandle = '@ikama'; // Update with your actual Twitter handle

  // Default structured data for organization
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": siteName,
    "url": "https://ikama.com",
    "logo": "https://ikama.com/logo.png",
    "description": description,
    "sameAs": [
      // Add your social media profiles
      "https://facebook.com/ikama",
      "https://twitter.com/ikama",
      "https://linkedin.com/company/ikama",
      "https://instagram.com/ikama"
    ]
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />

      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      <meta property="twitter:creator" content={twitterHandle} />

      {/* Additional SEO Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="theme-color" content="#667eea" />

      {/* Geo Meta Tags (if applicable) */}
      <meta name="geo.region" content="US" />
      <meta name="geo.placename" content="United States" />

      {/* Structured Data / JSON-LD */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      {!structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(defaultStructuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;

/**
 * Helper function to generate BreadcrumbList structured data
 */
export const generateBreadcrumbStructuredData = (breadcrumbs) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": breadcrumbs.map((crumb, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": crumb.name,
    "item": crumb.url
  }))
});

/**
 * Helper function to generate Organization structured data
 */
export const generateOrganizationStructuredData = (data) => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": data.name || "ikama - Franchise Hub",
  "url": data.url || "https://ikama.com",
  "logo": data.logo || "https://ikama.com/logo.png",
  "description": data.description,
  "contactPoint": data.contactPoint ? {
    "@type": "ContactPoint",
    "telephone": data.contactPoint.telephone,
    "contactType": data.contactPoint.contactType || "customer service",
    "email": data.contactPoint.email
  } : undefined,
  "sameAs": data.socialLinks || []
});

/**
 * Helper function to generate Product/Service structured data for brands
 */
export const generateBrandStructuredData = (brand) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": brand.brandName,
  "description": brand.description || brand.brandDescription,
  "image": brand.logo || brand.logoUrl,
  "brand": {
    "@type": "Brand",
    "name": brand.brandName
  },
  "offers": {
    "@type": "Offer",
    "priceCurrency": "USD",
    "price": brand.investmentRange || "Variable",
    "availability": "https://schema.org/InStock",
    "url": brand.url || `https://ikama.com/brands/${brand.slug || brand.id}`
  },
  "aggregateRating": brand.rating ? {
    "@type": "AggregateRating",
    "ratingValue": brand.rating,
    "reviewCount": brand.reviewCount || 1
  } : undefined
});

/**
 * Helper function to generate VideoObject structured data
 */
export const generateVideoStructuredData = (video) => ({
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": video.name || `${video.authorName} Testimonial`,
  "description": video.description || video.testimonialText,
  "thumbnailUrl": video.thumbnailUrl,
  "contentUrl": video.videoUrl,
  "uploadDate": video.uploadDate || new Date().toISOString(),
  "duration": video.duration,
  "author": {
    "@type": "Person",
    "name": video.authorName,
    "jobTitle": video.authorTitle
  }
});

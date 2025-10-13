# Security Headers Configuration Guide

## 🔒 **X-Frame-Options Error - Fixed!**

### **Problem Solved:**
The error `X-Frame-Options may only be set via an HTTP header` was caused by trying to set security headers using HTML `<meta>` tags in `index.html`. This is not allowed by browsers for security reasons.

### **What Was Fixed:**
✅ **Removed invalid meta tags** from `index.html`
✅ **Added proper server-side headers** in `vite.config.js`
✅ **Configured development and preview servers** with security headers

---

## 🛠️ **Implementation Details**

### **Files Modified:**

#### 1. `index.html` - Removed Invalid Meta Tags
```html
<!-- REMOVED (These don't work and cause errors): -->
<meta http-equiv="X-Frame-Options" content="DENY" />
<meta http-equiv="X-Content-Type-Options" content="nosniff" />
<meta http-equiv="X-XSS-Protection" content="1; mode=block" />
<meta http-equiv="Referrer-Policy" content="strict-origin-when-cross-origin" />

<!-- KEPT (These are valid in meta tags): -->
<title>FranchiseHub - Find the Perfect Franchise Opportunity in India</title>
<meta name="description" content="..." />
<meta property="og:title" content="..." />
<!-- Other SEO and social media meta tags -->
```

#### 2. `vite.config.js` - Added Proper Server Headers
```javascript
server: {
  port: 5173,
  host: true,
  headers: {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  },
},
preview: {
  port: 4173,
  host: true,
  headers: {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  },
},
```

---

## 🔍 **Understanding Security Headers**

### **Which Headers Can Be Set Where:**

#### ✅ **Server-Side Only (HTTP Headers)**
- `X-Frame-Options` - Prevents iframe embedding
- `X-Content-Type-Options` - Prevents MIME sniffing
- `X-XSS-Protection` - XSS protection (deprecated but still used)
- `Content-Security-Policy` - Comprehensive security policy
- `Strict-Transport-Security` - HTTPS enforcement

#### ✅ **Meta Tags Allowed**
- `viewport` - Responsive design settings
- `description` - SEO description
- `keywords` - SEO keywords (less important now)
- `author` - Content author
- `robots` - Search engine directives
- Open Graph tags (`og:title`, `og:description`, etc.)
- Twitter Card tags (`twitter:card`, etc.)

### **Security Headers Explained:**

#### **X-Frame-Options: DENY**
- **Purpose**: Prevents your site from being embedded in iframes
- **Protection**: Clickjacking attacks
- **Options**: 
  - `DENY` - Never allow framing
  - `SAMEORIGIN` - Allow framing by same domain
  - `ALLOW-FROM uri` - Allow framing by specific domain

#### **X-Content-Type-Options: nosniff**
- **Purpose**: Prevents MIME type sniffing
- **Protection**: MIME confusion attacks
- **Effect**: Forces browser to respect declared content types

#### **Referrer-Policy: strict-origin-when-cross-origin**
- **Purpose**: Controls referrer information sent with requests
- **Protection**: Information leakage
- **Effect**: Sends full referrer for same-origin, origin only for cross-origin HTTPS

---

## 🚀 **Production Deployment**

### **For Different Hosting Platforms:**

#### **Firebase Hosting**
Create `firebase.json` configuration:
```json
{
  "hosting": {
    "headers": [
      {
        "source": "**",
        "headers": [
          {
            "key": "X-Frame-Options",
            "value": "DENY"
          },
          {
            "key": "X-Content-Type-Options",
            "value": "nosniff"
          },
          {
            "key": "X-XSS-Protection",
            "value": "1; mode=block"
          },
          {
            "key": "Referrer-Policy",
            "value": "strict-origin-when-cross-origin"
          }
        ]
      }
    ]
  }
}
```

#### **Vercel**
Create `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

#### **Netlify**
Create `_headers` file in public directory:
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
```

#### **Apache (.htaccess)**
```apache
Header always set X-Frame-Options DENY
Header always set X-Content-Type-Options nosniff
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
```

#### **Nginx**
```nginx
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;
add_header X-XSS-Protection "1; mode=block";
add_header Referrer-Policy "strict-origin-when-cross-origin";
```

---

## 🧪 **Testing Security Headers**

### **Browser Developer Tools**
1. Open your site
2. Go to Developer Tools → Network tab
3. Reload page
4. Click on the main document request
5. Check Response Headers section

### **Online Tools**
- **Security Headers**: https://securityheaders.com/
- **Mozilla Observatory**: https://observatory.mozilla.org/
- **SSL Labs**: https://www.ssllabs.com/ssltest/

### **Expected Headers in Response**
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

---

## 🛡️ **Advanced Security (Optional)**

### **Content Security Policy (CSP)**
For enhanced security, consider adding CSP headers:

```javascript
// In vite.config.js headers
'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://apis.google.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.openai.com https://firebaseapp.com;"
```

### **Strict Transport Security (HTTPS only)**
```javascript
'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
```

---

## ✅ **Verification Steps**

1. **Start your development server**: `npm run dev`
2. **Open browser developer tools**
3. **Go to Network tab**
4. **Load your application**
5. **Check response headers** - should see security headers
6. **Console should be clear** - no more X-Frame-Options errors

---

## 🎯 **Summary**

**Problem**: ❌ X-Frame-Options set in HTML meta tag (not allowed)
**Solution**: ✅ X-Frame-Options set as HTTP header via server configuration

**Benefits**:
- ✅ No more console errors
- ✅ Proper security implementation
- ✅ Production-ready configuration
- ✅ Enhanced protection against attacks

Your application now has proper security headers configured and the error should be resolved! 🔒
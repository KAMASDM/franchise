# Complete Field Mapping Reference
## Registration Form → Database → Edit Forms

### Step 1: Basic Information
| Field Name | Database Key | Type | Required | Notes |
|------------|--------------|------|----------|-------|
| Brand Name | `brandName` | String | Yes | Auto-generates slug |
| Slug | `slug` | String | Auto | URL-friendly version |
| Founded Year | `brandfoundedYear` | String | Yes | |
| Total Outlets | `brandTotalOutlets` | Number | No | |
| Brand Rating | `brandRating` | Number | No | 0-5 scale |
| Business Model | `businessModel` | String | No | B2B/B2C/B2B2C/Marketplace |
| Franchise Models | `franchiseModels` | Array | No | Unit/Multi-City/Dealer/Master |
| Industries | `industries` | Array | Yes | Comma-separated |
| Brand Vision | `brandVision` | String | Yes | 500 char max |
| Brand Mission | `brandMission` | String | No | 500 char max |
| Business Models | `businessModels` | Array | No | From BusinessModelSelector |
| Revenue Model | `revenueModel` | String | No | |
| Support Types | `supportTypes` | Array | No | |

### Step 2: Investment & Financials
| Field Name | Database Key | Type | Required | Notes |
|------------|--------------|------|----------|-------|
| Total Investment Required | `brandInvestment` | Number | Yes | |
| Franchise Fee | `franchiseFee` | Number | Yes | |
| Security Deposit | `securityDeposit` | Number | No | |
| Working Capital | `workingCapital` | Number | No | |
| Equipment Costs | `equipmentCosts` | Number | No | |
| Real Estate Costs | `realEstateCosts` | Number | No | |
| Royalty Fee | `royaltyFee` | Number | No | Percentage |
| Brand/Marketing Fee | `brandFee` | Number | No | |
| Payback Period | `payBackPeriod` | String | Yes | e.g., "2-3 years" |
| Expected Annual Revenue | `expectedRevenue` | Number | No | |
| EBITDA Margin | `ebitdaMargin` | String | No | e.g., "20-25%" |
| Investment Range | `investmentRange` | String | No | e.g., "₹50L-₹1Cr" |
| Minimum Expected ROI | `minROI` | String | No | e.g., "25-30%" |

### Step 3: Business Details
| Field Name | Database Key | Type | Required | Notes |
|------------|--------------|------|----------|-------|
| Unique Selling Proposition (USP) | `uniqueSellingProposition` | String | Yes | 500 char max |
| Target Market | `targetMarket` | String | Yes | 500 char max, NEW FIELD |
| Competitive Advantage | `competitiveAdvantage` | String | Yes | 500 char max |
| Franchise Term Length | `franchiseTermLength` | String | Yes | e.g., "5 years" |
| Territory Rights | `territoryRights` | String | No | |
| Non-Compete Restrictions | `nonCompeteRestrictions` | String | No | Multiline |
| Franchisor Support | `franchisorSupport` | String | Yes | Multiline |
| Marketing Support | `marketingSupport` | String | No | Multiline |
| Transfer Conditions | `transferConditions` | String | No | |
| Termination Conditions | `terminationConditions` | String | No | |
| Dispute Resolution | `disputeResolution` | String | No | |

### Step 4: Locations & Requirements
| Field Name | Database Key | Type | Required | Notes |
|------------|--------------|------|----------|-------|
| Preferred Locations | `locations` | Array | Yes | Comma-separated cities |
| Space Required (sq ft) | `spaceRequired` | String | Yes | e.g., "1000-2000" |
| Franchise Locations | `brandFranchiseLocations` | Array | No | Current locations |

### Step 5: Contact & Social
| Field Name | Database Key | Type | Required | Notes |
|------------|--------------|------|----------|-------|
| Owner Name | `brandOwnerInformation.ownerName` | String | Yes | Nested object |
| Owner Email | `brandOwnerInformation.ownerEmail` | String | Yes | Must be unique |
| Contact Number | `brandOwnerInformation.contactNumber` | String | Yes | Must be unique |
| Facebook URL | `brandOwnerInformation.facebookUrl` | String | No | |
| Instagram URL | `brandOwnerInformation.instagramUrl` | String | No | |
| Twitter URL | `brandOwnerInformation.twitterUrl` | String | No | |
| LinkedIn URL | `brandOwnerInformation.linkedinUrl` | String | No | |

### Step 6: Images & Gallery
| Field Name | Database Key | Type | Required | Notes |
|------------|--------------|------|----------|-------|
| Brand Logo | `brandLogo` | String | No | Firebase Storage URL |
| Brand Banner | `brandBanner` | String | No | Firebase Storage URL |
| Brand Main Image | `brandImage` | String | No | Firebase Storage URL |
| Franchise Gallery | `brandFranchiseImages` | Array | No | Array of URLs |

### System Fields (Auto-generated)
| Field Name | Database Key | Type | Notes |
|------------|--------------|------|-------|
| User ID | `userId` | String | From Firebase Auth |
| Status | `status` | String | pending/active/inactive |
| Created At | `createdAt` | String | ISO timestamp |
| Updated At | `updatedAt` | String | ISO timestamp |

## Total Fields: 60+ fields across 6 steps

import React from "react";
import BrandRegistrationNew from "../components/forms/BrandRegistrationNew";

const CreateBrandProfileNew = () => {
  return <BrandRegistrationNew />;
};

export default CreateBrandProfileNew;

const steps = [
  { label: "Basic Information", icon: <Business /> },
  { label: "Investment & Financials", icon: <AttachMoney /> },
  { label: "Business Details", icon: <Description /> },
  { label: "Locations & Requirements", icon: <LocationOn /> },
  { label: "Contact & Social", icon: <ContactPhone /> },
  { label: "Images & Gallery", icon: <PhotoLibrary /> },
];

const CreateBrandProfileNew = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  
  const [formData, setFormData] = useState({
    // Basic Information
    brandName: "",
    slug: "", // Auto-generated from brandName
    brandfoundedYear: "",
    brandVision: "",
    brandMission: "",
    industries: [],
    businessModel: "",
    franchiseModels: [],
    targetMarket: "", // Changed from checkbox to text
    businessModels: [],
    revenueModel: "",
    supportTypes: [],
    brandTotalOutlets: "",
    brandRating: "",
    
    // Investment & Financials
    brandInvestment: "",
    franchiseFee: "",
    securityDeposit: "",
    royaltyFee: "",
    brandFee: "",
    workingCapital: "",
    equipmentCosts: "",
    realEstateCosts: "",
    payBackPeriod: "",
    expectedRevenue: "",
    ebitdaMargin: "",
    investmentRange: "",
    minROI: "",
    
    // Business Details
    uniqueSellingProposition: "",
    competitiveAdvantage: "",
    territoryRights: "",
    nonCompeteRestrictions: "",
    franchisorSupport: "",
    marketingSupport: "",
    franchiseTermLength: "",
    transferConditions: "",
    terminationConditions: "",
    disputeResolution: "",
    
    // Locations & Requirements
    locations: [],
    spaceRequired: "",
    brandFranchiseLocations: [],
    
    // Contact & Social
    brandOwnerInformation: {
      ownerName: "",
      ownerEmail: "",
      contactNumber: "",
      facebookUrl: "",
      twitterUrl: "",
      instagramUrl: "",
      linkedinUrl: "",
    },
    
    // Images & Gallery
    brandLogo: "",
    brandBanner: "",
    brandImage: "",
    brandFranchiseImages: [],
    
    // System fields
    status: "pending",
    userId: "",
    createdAt: "",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Pre-fill owner email and userId
        setFormData((prev) => ({
          ...prev,
          userId: currentUser.uid,
          brandOwnerInformation: {
            ...prev.brandOwnerInformation,
            ownerEmail: currentUser.email || "",
          },
        }));
      } else {
        navigate("/brand-signin");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Generate slug from brand name
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // Validation functions
  const validateEmail = async (email) => {
    if (!email) return null;
    
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
    if (!emailRegex.test(email)) {
      return "Invalid email format";
    }

    // Check if email already exists in database
    const brandsRef = collection(db, "brands");
    const emailQuery = query(brandsRef, where("brandOwnerInformation.ownerEmail", "==", email));
    const snapshot = await getDocs(emailQuery);
    
    // Allow same email if it's the current user's brand
    const existingBrands = snapshot.docs.filter(doc => doc.id !== user?.uid);
    if (existingBrands.length > 0) {
      return "This email is already registered with another brand";
    }
    
    return null;
  };

  const validatePhone = async (phone) => {
    if (!phone) return null;
    
    const phoneRegex = /^[+]?[0-9]{1,4}[-\s]?[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      return "Invalid phone format (e.g., +91-9876543210)";
    }

    // Check if phone already exists in database
    const brandsRef = collection(db, "brands");
    const phoneQuery = query(brandsRef, where("brandOwnerInformation.contactNumber", "==", phone));
    const snapshot = await getDocs(phoneQuery);
    
    // Allow same phone if it's the current user's brand
    const existingBrands = snapshot.docs.filter(doc => doc.id !== user?.uid);
    if (existingBrands.length > 0) {
      return "This phone number is already registered with another brand";
    }
    
    return null;
  };

  const validateSlug = async (slug) => {
    if (!slug) return null;

    // Check if slug already exists in database
    const brandsRef = collection(db, "brands");
    const slugQuery = query(brandsRef, where("slug", "==", slug));
    const snapshot = await getDocs(slugQuery);
    
    // Allow same slug if it's the current user's brand
    const existingBrands = snapshot.docs.filter(doc => doc.id !== user?.uid);
    if (existingBrands.length > 0) {
      return "This brand name (URL) is already taken. Please choose a different name.";
    }
    
    return null;
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: value,
      // Auto-generate slug when brand name changes
      ...(name === "brandName" && { slug: generateSlug(value) })
    }));
    
    // Clear validation error when field is modified
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleOwnerInfoChange = async (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      brandOwnerInformation: {
        ...prev.brandOwnerInformation,
        [name]: value,
      },
    }));
    
    // Clear validation error when field is modified
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleArrayInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: typeof value === "string" ? value.split(",").map((v) => v.trim()) : value,
    }));
  };

  const handleFranchiseModelChange = (model) => {
    setFormData((prev) => ({
      ...prev,
      franchiseModels: prev.franchiseModels.includes(model)
        ? prev.franchiseModels.filter(m => m !== model)
        : [...prev.franchiseModels, model]
    }));
  };

  const handleBusinessModelsChange = (selectedModels) => {
    setFormData((prev) => ({ ...prev, businessModels: selectedModels }));
  };

  const handleNext = async () => {
    // Validate on specific steps
    if (activeStep === 0) {
      // Validate brand name and slug on first step
      const slugError = await validateSlug(formData.slug);
      if (slugError) {
        setValidationErrors({ slug: slugError });
        alert(slugError);
        return;
      }
    }
    
    if (activeStep === 4) {
      // Validate email and phone on contact step
      const emailError = await validateEmail(formData.brandOwnerInformation.ownerEmail);
      const phoneError = await validatePhone(formData.brandOwnerInformation.contactNumber);
      
      const errors = {};
      if (emailError) errors.ownerEmail = emailError;
      if (phoneError) errors.contactNumber = phoneError;
      
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        alert("Please fix the validation errors before proceeding.");
        return;
      }
    }
    
    setActiveStep((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSave = async (shouldNavigate = false) => {
    if (!user) {
      alert("You must be signed in to create a profile.");
      return;
    }

    setLoading(true);
    try {
      // Final validation before saving
      const emailError = await validateEmail(formData.brandOwnerInformation.ownerEmail);
      const phoneError = await validatePhone(formData.brandOwnerInformation.contactNumber);
      const slugError = await validateSlug(formData.slug);
      
      const errors = {};
      if (emailError) errors.ownerEmail = emailError;
      if (phoneError) errors.contactNumber = phoneError;
      if (slugError) errors.slug = slugError;
      
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        setLoading(false);
        alert("Please fix the validation errors before saving.");
        return;
      }
      
      // Prepare data with updated timestamp only if it's first save
      const dataToSave = {
        ...formData,
        updatedAt: new Date().toISOString(),
        // Only set createdAt if it doesn't exist (first save)
        ...(formData.createdAt ? {} : { createdAt: new Date().toISOString() })
      };
      
      await setDoc(doc(db, "brands", user.uid), dataToSave, { merge: true });
      
      if (shouldNavigate) {
        alert("Profile submitted successfully! It will be reviewed by our team.");
        navigate("/");
      } else {
        alert("Progress saved!");
      }
    } catch (error) {
      logger.error("Error saving brand data:", error);
      alert("Failed to save. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    await handleSave(true);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        // Basic Information
        return (
          <Box>
            <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 3 }}>
              <Business sx={{ verticalAlign: "middle", mr: 1 }} />
              Basic Brand Information
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FieldWithHelp helpText="Enter the official name of your brand/franchise. This will be used to create a unique URL for your brand page.">
                  <TextField
                    label="Brand Name *"
                    name="brandName"
                    value={formData.brandName}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    error={!!validationErrors.slug}
                    helperText={validationErrors.slug || `URL will be: ${formData.slug || 'your-brand-name'}`}
                  />
                </FieldWithHelp>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FieldWithHelp helpText="The year when your brand was officially established or founded.">
                  <TextField
                    label="Founded Year *"
                    name="brandfoundedYear"
                    value={formData.brandfoundedYear}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    placeholder="e.g., 2015"
                  />
                </FieldWithHelp>
              </Grid>

              <Grid item xs={12} md={6}>
                <FieldWithHelp helpText="Total number of operating franchise outlets/units across all locations currently.">
                  <TextField
                    label="Total Outlets"
                    name="brandTotalOutlets"
                    type="number"
                    value={formData.brandTotalOutlets}
                    onChange={handleInputChange}
                    fullWidth
                    helperText="Current number of outlets"
                  />
                </FieldWithHelp>
              </Grid>

              <Grid item xs={12} md={6}>
                <FieldWithHelp helpText="Overall customer satisfaction rating for your brand on a scale of 0-5.">
                  <TextField
                    label="Brand Rating"
                    name="brandRating"
                    type="number"
                    inputProps={{ min: 0, max: 5, step: 0.1 }}
                    value={formData.brandRating}
                    onChange={handleInputChange}
                    fullWidth
                    helperText="Rating out of 5"
                  />
                </FieldWithHelp>
              </Grid>

              <Grid item xs={12} md={6}>
                <FieldWithHelp helpText="Select your primary business model: B2B (selling to other businesses), B2C (selling to consumers), B2B2C (hybrid), or Marketplace (platform connecting buyers and sellers).">
                  <FormControl fullWidth>
                    <InputLabel>Business Model</InputLabel>
                    <Select
                      name="businessModel"
                      value={formData.businessModel}
                      onChange={handleInputChange}
                      label="Business Model"
                    >
                      <MenuItem value="B2B">B2B (Business to Business)</MenuItem>
                      <MenuItem value="B2C">B2C (Business to Consumer)</MenuItem>
                      <MenuItem value="B2B2C">B2B2C (Hybrid)</MenuItem>
                      <MenuItem value="Marketplace">Marketplace</MenuItem>
                    </Select>
                  </FormControl>
                </FieldWithHelp>
              </Grid>

              <Grid item xs={12}>
                <FieldWithHelp helpText="Select all franchise types you offer. Unit franchises operate a single location, multi-city franchises can operate in multiple cities, dealers/distributors handle product distribution, and master franchises can sub-franchise in a territory.">
                  <FormControl component="fieldset">
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>
                      Franchise Types *
                    </Typography>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.franchiseModels.includes("Unit Franchise")}
                            onChange={() => handleFranchiseModelChange("Unit Franchise")}
                          />
                        }
                        label="Unit Franchise - Single outlet ownership in one location"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.franchiseModels.includes("Multi-City Franchise")}
                            onChange={() => handleFranchiseModelChange("Multi-City Franchise")}
                          />
                        }
                        label="Multi-City Franchise - Multiple outlets across different cities"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.franchiseModels.includes("Dealer/Distributor")}
                            onChange={() => handleFranchiseModelChange("Dealer/Distributor")}
                          />
                        }
                        label="Dealer/Distributor - Product distribution rights in a territory"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.franchiseModels.includes("Master Franchise")}
                            onChange={() => handleFranchiseModelChange("Master Franchise")}
                          />
                        }
                        label="Master Franchise - Territory development rights with ability to sub-franchise"
                      />
                    </FormGroup>
                  </FormControl>
                </FieldWithHelp>
              </Grid>

              <Grid item xs={12}>
                <FieldWithHelp helpText="Enter the industries your business operates in, separated by commas (e.g., Food & Beverage, Retail, Healthcare, Education).">
                  <TextField
                    label="Industries *"
                    name="industries"
                    value={formData.industries.join(", ")}
                    onChange={(e) => handleArrayInputChange("industries", e.target.value)}
                    fullWidth
                    required
                    helperText="Comma separated (e.g., Food & Beverage, Retail, Education)"
                  />
                </FieldWithHelp>
              </Grid>

              <Grid item xs={12}>
                <FieldWithHelp helpText="Describe your brand's long-term vision and aspirations. What do you want to achieve in the next 5-10 years? How do you see your brand growing?">
                  <TextField
                    label="Brand Vision *"
                    name="brandVision"
                    value={formData.brandVision}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    multiline
                    rows={3}
                    helperText={`Your brand's long-term vision (${formData.brandVision.length}/500 characters)`}
                    inputProps={{ maxLength: 500 }}
                  />
                </FieldWithHelp>
              </Grid>

              <Grid item xs={12}>
                <FieldWithHelp helpText="Explain your brand's mission - why your business exists and what problem it solves for customers. What value do you provide?">
                  <TextField
                    label="Brand Mission"
                    name="brandMission"
                    value={formData.brandMission}
                    onChange={handleInputChange}
                    fullWidth
                    multiline
                    rows={3}
                    helperText={`Your brand's mission statement (${formData.brandMission.length}/500 characters)`}
                    inputProps={{ maxLength: 500 }}
                  />
                </FieldWithHelp>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  Partnership Models
                </Typography>
                <BusinessModelSelector
                  selectedModels={formData.businessModels}
                  onChange={handleBusinessModelsChange}
                  allowMultiple={true}
                  industry={formData.industries[0]}
                  showRecommendations={true}
                  variant="cards"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Revenue Model</InputLabel>
                  <Select
                    name="revenueModel"
                    value={formData.revenueModel}
                    onChange={handleInputChange}
                    label="Revenue Model"
                  >
                    {Object.entries(REVENUE_MODELS).map(([key, model]) => (
                      <MenuItem key={key} value={key}>
                        {model.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Support Types</InputLabel>
                  <Select
                    name="supportTypes"
                    multiple
                    value={formData.supportTypes}
                    onChange={(e) => setFormData((prev) => ({ ...prev, supportTypes: e.target.value }))}
                    label="Support Types"
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={SUPPORT_TYPES[value]?.label || value} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    {Object.entries(SUPPORT_TYPES).map(([key, support]) => (
                      <MenuItem key={key} value={key}>
                        {support.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        );

      case 1:
        // Investment & Financials
        return (
          <Box>
            <Typography variant="h6" gutterBottom color="success.dark" sx={{ mb: 3 }}>
              <AttachMoney sx={{ verticalAlign: "middle", mr: 1 }} />
              Investment & Financial Details
            </Typography>
            
            <Alert severity="info" sx={{ mb: 3 }}>
              All amounts should be in Indian Rupees (₹). Be as accurate as possible to help investors make informed decisions.
            </Alert>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Total Investment Required *"
                  name="brandInvestment"
                  type="number"
                  value={formData.brandInvestment}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  helperText="Total capital needed to start (₹)"
                  inputProps={{ min: 0, step: 10000 }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Franchise Fee *"
                  name="franchiseFee"
                  type="number"
                  value={formData.franchiseFee}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  helperText="One-time franchise fee (₹)"
                  inputProps={{ min: 0, step: 10000 }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Security Deposit"
                  name="securityDeposit"
                  type="number"
                  value={formData.securityDeposit}
                  onChange={handleInputChange}
                  fullWidth
                  helperText="Refundable security deposit (₹)"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Working Capital"
                  name="workingCapital"
                  type="number"
                  value={formData.workingCapital}
                  onChange={handleInputChange}
                  fullWidth
                  helperText="Initial working capital needed (₹)"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Equipment Costs"
                  name="equipmentCosts"
                  type="number"
                  value={formData.equipmentCosts}
                  onChange={handleInputChange}
                  fullWidth
                  helperText="Cost of equipment & machinery (₹)"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Real Estate Costs"
                  name="realEstateCosts"
                  type="number"
                  value={formData.realEstateCosts}
                  onChange={handleInputChange}
                  fullWidth
                  helperText="Property lease/purchase costs (₹)"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Royalty Fee"
                  name="royaltyFee"
                  value={formData.royaltyFee}
                  onChange={handleInputChange}
                  fullWidth
                  helperText="e.g., 5% of revenue or ₹10,000/month"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Brand/Marketing Fee"
                  name="brandFee"
                  value={formData.brandFee}
                  onChange={handleInputChange}
                  fullWidth
                  helperText="e.g., 2% of revenue"
                />
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }}>
                  <Chip label="Expected Returns" />
                </Divider>
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  label="Payback Period *"
                  name="payBackPeriod"
                  value={formData.payBackPeriod}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  helperText="e.g., 24-36 months"
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  label="Expected Annual Revenue"
                  name="expectedRevenue"
                  type="number"
                  value={formData.expectedRevenue}
                  onChange={handleInputChange}
                  fullWidth
                  helperText="Average annual revenue (₹)"
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  label="EBITDA Margin"
                  name="ebitdaMargin"
                  value={formData.ebitdaMargin}
                  onChange={handleInputChange}
                  fullWidth
                  helperText="e.g., 20-25%"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Investment Range"
                  name="investmentRange"
                  value={formData.investmentRange}
                  onChange={handleInputChange}
                  fullWidth
                  helperText="e.g., ₹50 Lakhs - ₹1 Crore"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Minimum Expected ROI"
                  name="minROI"
                  value={formData.minROI}
                  onChange={handleInputChange}
                  fullWidth
                  helperText="e.g., 25-30%"
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        // Business Details
        return (
          <Box>
            <Typography variant="h6" gutterBottom color="info.dark" sx={{ mb: 3 }}>
              <Description sx={{ verticalAlign: "middle", mr: 1 }} />
              Business Details & Competitive Advantage
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FieldWithHelp helpText="Describe what makes your brand unique and different from others. What special value or benefits do you offer that competitors don't? This is your key differentiator.">
                  <TextField
                    label="Unique Selling Proposition (USP) *"
                    name="uniqueSellingProposition"
                    value={formData.uniqueSellingProposition}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    multiline
                    rows={4}
                    placeholder="e.g., 'We offer the only cloud kitchen model with guaranteed 30-minute delivery, using proprietary technology and local sourcing partnerships.'"
                    helperText={`What makes your brand unique and different? (${formData.uniqueSellingProposition.length}/500 characters)`}
                    inputProps={{ maxLength: 500 }}
                  />
                </FieldWithHelp>
              </Grid>

              <Grid item xs={12}>
                <FieldWithHelp helpText="Explain your target customer base and ideal markets. Who are your primary customers? What demographics, psychographics, or geographic areas do you serve?">
                  <TextField
                    label="Target Market *"
                    name="targetMarket"
                    value={formData.targetMarket}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    multiline
                    rows={4}
                    placeholder="e.g., 'Young professionals aged 25-40 in tier 1 and tier 2 cities, with household income above 8 lakhs annually, who value convenience and quality.'"
                    helperText={`Describe your ideal customer profile and target markets (${formData.targetMarket.length}/500 characters)`}
                    inputProps={{ maxLength: 500 }}
                  />
                </FieldWithHelp>
              </Grid>

              <Grid item xs={12}>
                <FieldWithHelp helpText="Explain how you stand out from competitors. What specific advantages do you have in terms of technology, processes, pricing, quality, brand recognition, or support systems?">
                  <TextField
                    label="Competitive Advantage *"
                    name="competitiveAdvantage"
                    value={formData.competitiveAdvantage}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    multiline
                    rows={4}
                    placeholder="e.g., 'Proprietary POS system, established supply chain with 15% cost advantage, 20 years brand recognition, and comprehensive 3-month training program.'"
                    helperText={`How do you stand out from competitors? (${formData.competitiveAdvantage.length}/500 characters)`}
                    inputProps={{ maxLength: 500 }}
                  />
                </FieldWithHelp>
              </Grid>

              <Grid item xs={12} md={6}>
                <FieldWithHelp helpText="Specify the duration of the franchise agreement (e.g., 5 years, 10 years, 15 years).">
                  <TextField
                    label="Franchise Term Length *"
                    name="franchiseTermLength"
                    value={formData.franchiseTermLength}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    helperText="e.g., 5 years, 10 years"
                  />
                </FieldWithHelp>
              </Grid>

              <Grid item xs={12} md={6}>
                <FieldWithHelp helpText="Define the exclusive territory rights for franchisees (e.g., 5 km radius, entire city, specific pin codes).">
                  <TextField
                    label="Territory Rights"
                    name="territoryRights"
                    value={formData.territoryRights}
                    onChange={handleInputChange}
                    fullWidth
                    helperText="e.g., Exclusive territory of 5 km radius"
                  />
                </FieldWithHelp>
              </Grid>

              <Grid item xs={12}>
                <FieldWithHelp helpText="List any restrictions on franchisee operations, such as prohibited activities, competing businesses, or operational limitations during and after the franchise term.">
                  <TextField
                    label="Non-Compete Restrictions"
                    name="nonCompeteRestrictions"
                    value={formData.nonCompeteRestrictions}
                    onChange={handleInputChange}
                    fullWidth
                    multiline
                    rows={2}
                    helperText="Any restrictions on franchisee operations during and after franchise term"
                  />
                </FieldWithHelp>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }}>
                  <Chip label="Support & Training" />
                </Divider>
              </Grid>

              <Grid item xs={12}>
                <FieldWithHelp helpText="Detail the comprehensive support you provide to franchisees including training, operational assistance, technology, supply chain, and ongoing business guidance.">
                  <TextField
                    label="Franchisor Support *"
                    name="franchisorSupport"
                    value={formData.franchisorSupport}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    multiline
                    rows={3}
                    helperText="Describe the support you provide to franchisees (training, operations, technology, etc.)"
                  />
                </FieldWithHelp>
              </Grid>

              <Grid item xs={12}>
                <FieldWithHelp helpText="Describe the marketing and advertising support provided, including national campaigns, local marketing materials, digital marketing assistance, and co-op advertising programs.">
                  <TextField
                    label="Marketing Support"
                    name="marketingSupport"
                    value={formData.marketingSupport}
                    onChange={handleInputChange}
                    fullWidth
                    multiline
                    rows={3}
                    helperText="Marketing & advertising support provided"
                  />
                </FieldWithHelp>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }}>
                  <Chip label="Legal Terms" />
                </Divider>
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  label="Transfer Conditions"
                  name="transferConditions"
                  value={formData.transferConditions}
                  onChange={handleInputChange}
                  fullWidth
                  helperText="Franchise transfer terms"
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  label="Termination Conditions"
                  name="terminationConditions"
                  value={formData.terminationConditions}
                  onChange={handleInputChange}
                  fullWidth
                  helperText="Contract termination terms"
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  label="Dispute Resolution"
                  name="disputeResolution"
                  value={formData.disputeResolution}
                  onChange={handleInputChange}
                  fullWidth
                  helperText="How disputes are resolved"
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 3:
        // Locations & Requirements
        return (
          <Box>
            <Typography variant="h6" gutterBottom color="warning.dark" sx={{ mb: 3 }}>
              <LocationOn sx={{ verticalAlign: "middle", mr: 1 }} />
              Locations & Space Requirements
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Preferred Locations *"
                  name="locations"
                  value={formData.locations.join(", ")}
                  onChange={(e) => handleArrayInputChange("locations", e.target.value)}
                  fullWidth
                  required
                  helperText="Comma separated cities/states (e.g., Mumbai, Delhi, Bangalore)"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Space Required (sq ft) *"
                  name="spaceRequired"
                  type="number"
                  value={formData.spaceRequired}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  helperText="Minimum space needed for outlet"
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                  Current Franchise Locations (Optional)
                </Typography>
                <TextField
                  label="Franchise Locations"
                  name="brandFranchiseLocations"
                  value={
                    Array.isArray(formData.brandFranchiseLocations)
                      ? formData.brandFranchiseLocations.join(", ")
                      : ""
                  }
                  onChange={(e) =>
                    handleArrayInputChange("brandFranchiseLocations", e.target.value)
                  }
                  fullWidth
                  multiline
                  rows={2}
                  helperText="Comma separated existing franchise locations"
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 4:
        // Contact & Social
        return (
          <Box>
            <Typography variant="h6" gutterBottom color="error.dark" sx={{ mb: 3 }}>
              <ContactPhone sx={{ verticalAlign: "middle", mr: 1 }} />
              Contact Information & Social Media
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FieldWithHelp helpText="Full name of the brand owner or primary contact person.">
                  <TextField
                    label="Owner Name *"
                    name="ownerName"
                    value={formData.brandOwnerInformation.ownerName}
                    onChange={handleOwnerInfoChange}
                    fullWidth
                    required
                  />
                </FieldWithHelp>
              </Grid>

              <Grid item xs={12} md={6}>
                <FieldWithHelp helpText="Official email address for brand correspondence. This must be unique - each email can only be used for one brand registration.">
                  <TextField
                    label="Owner Email *"
                    name="ownerEmail"
                    type="email"
                    value={formData.brandOwnerInformation.ownerEmail}
                    onChange={handleOwnerInfoChange}
                    fullWidth
                    required
                    error={!!validationErrors.ownerEmail}
                    helperText={validationErrors.ownerEmail || "Email address for brand correspondence (must be unique)"}
                    inputProps={{
                      pattern: "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$"
                    }}
                  />
                </FieldWithHelp>
              </Grid>

              <Grid item xs={12} md={6}>
                <FieldWithHelp helpText="Primary contact number with country code. This must be unique - each phone number can only be used for one brand registration.">
                  <TextField
                    label="Contact Number *"
                    name="contactNumber"
                    type="tel"
                    value={formData.brandOwnerInformation.contactNumber}
                    onChange={handleOwnerInfoChange}
                    fullWidth
                    required
                    error={!!validationErrors.contactNumber}
                    helperText={validationErrors.contactNumber || "Primary contact number (e.g., +91-9876543210) - must be unique"}
                    inputProps={{
                      pattern: "[+]?[0-9]{1,4}[-\\s]?[0-9]{10}"
                    }}
                  />
                </FieldWithHelp>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }}>
                  <Chip label="Social Media Links" />
                </Divider>
              </Grid>

              <Grid item xs={12} md={6}>
                <FieldWithHelp helpText="Your brand's official Facebook page URL (optional).">
                  <TextField
                    label="Facebook URL"
                    name="facebookUrl"
                    value={formData.brandOwnerInformation.facebookUrl}
                    onChange={handleOwnerInfoChange}
                    fullWidth
                    placeholder="https://facebook.com/yourbrand"
                    type="url"
                    helperText="Enter your brand's Facebook page URL"
                  />
                </FieldWithHelp>
              </Grid>

              <Grid item xs={12} md={6}>
                <FieldWithHelp helpText="Your brand's official Instagram profile URL (optional).">
                  <TextField
                    label="Instagram URL"
                    name="instagramUrl"
                    value={formData.brandOwnerInformation.instagramUrl}
                    onChange={handleOwnerInfoChange}
                    fullWidth
                    placeholder="https://instagram.com/yourbrand"
                    type="url"
                    helperText="Enter your brand's Instagram profile URL"
                  />
                </FieldWithHelp>
              </Grid>

              <Grid item xs={12} md={6}>
                <FieldWithHelp helpText="Your brand's official Twitter/X profile URL (optional).">
                  <TextField
                    label="Twitter URL"
                    name="twitterUrl"
                    value={formData.brandOwnerInformation.twitterUrl}
                    onChange={handleOwnerInfoChange}
                    fullWidth
                    placeholder="https://twitter.com/yourbrand"
                    type="url"
                    helperText="Enter your brand's Twitter/X profile URL"
                  />
                </FieldWithHelp>
              </Grid>

              <Grid item xs={12} md={6}>
                <FieldWithHelp helpText="Your brand's official LinkedIn company page URL (optional).">
                  <TextField
                    label="LinkedIn URL"
                    name="linkedinUrl"
                    value={formData.brandOwnerInformation.linkedinUrl}
                    onChange={handleOwnerInfoChange}
                    fullWidth
                    placeholder="https://linkedin.com/company/yourbrand"
                    type="url"
                    helperText="Enter your brand's LinkedIn company page URL"
                  />
                </FieldWithHelp>
              </Grid>
            </Grid>
          </Box>
        );

      case 5:
        // Images & Gallery
        return (
          <Box>
            <Typography variant="h6" gutterBottom color="secondary.dark" sx={{ mb: 3 }}>
              <PhotoLibrary sx={{ verticalAlign: "middle", mr: 1 }} />
              Brand Images & Gallery
            </Typography>

            <Alert severity="info" sx={{ mb: 3 }}>
              Upload high-quality images to attract more franchisees! Images will be stored securely in Firebase Storage.
            </Alert>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <ImageUpload
                  label="Brand Logo"
                  value={formData.brandLogo}
                  onChange={(url) => setFormData((prev) => ({ ...prev, brandLogo: url }))}
                  path="brands/logos"
                  required
                  helperText="Your brand's official logo (recommended: square, min 512x512px)"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <ImageUpload
                  label="Brand Banner"
                  value={formData.brandBanner}
                  onChange={(url) => setFormData((prev) => ({ ...prev, brandBanner: url }))}
                  path="brands/banners"
                  helperText="Hero banner image (recommended: 1920x600px)"
                />
              </Grid>

              <Grid item xs={12}>
                <ImageUpload
                  label="Brand Main Image"
                  value={formData.brandImage}
                  onChange={(url) => setFormData((prev) => ({ ...prev, brandImage: url }))}
                  path="brands/images"
                  helperText="Main brand/outlet image"
                />
              </Grid>

              <Grid item xs={12}>
                <ImageUpload
                  label="Franchise Gallery"
                  value={formData.brandFranchiseImages}
                  onChange={(urls) => setFormData((prev) => ({ ...prev, brandFranchiseImages: urls }))}
                  path="brands/gallery"
                  multiple
                  helperText="Upload multiple images showing your outlets, products, interior, team, etc."
                />
              </Grid>
            </Grid>
          </Box>
        );

      default:
        return "Unknown step";
    }
  };

  const progress = ((activeStep + 1) / steps.length) * 100;

  return (
    <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center" fontWeight="bold">
          Create Your Franchise Brand Profile
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 4 }}>
          Complete all sections to submit your brand for review. You can save and continue later.
        </Typography>

        {/* Progress Bar */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Step {activeStep + 1} of {steps.length}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {Math.round(progress)}% Complete
            </Typography>
          </Box>
          <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
        </Box>

        {/* Stepper */}
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel icon={step.icon}>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Form Content */}
        <Box sx={{ mt: 4, minHeight: 400 }}>
          {renderStepContent(activeStep)}
        </Box>

        {/* Navigation Buttons */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4, pt: 3, borderTop: 1, borderColor: "divider" }}>
          <Button
            variant="outlined"
            onClick={handleBack}
            disabled={activeStep === 0 || loading}
          >
            Back
          </Button>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => handleSave(false)}
              disabled={loading}
            >
              Save Progress
            </Button>

            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                color="success"
                onClick={handleSubmit}
                disabled={loading}
                startIcon={<CheckCircle />}
              >
                {loading ? "Submitting..." : "Submit for Review"}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={loading}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>

        {loading && <LinearProgress sx={{ mt: 2 }} />}
      </Paper>
    </Container>
  );
};

export default CreateBrandProfileNew;

import React, { useState, useRef } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Tooltip,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge,
  Fab,
  Zoom,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Description as DescriptionIcon,
  Info as InfoIcon,
  Check as CheckIcon,
  ExpandMore as ExpandMoreIcon,
  Help as HelpIcon,
  Business as BusinessIcon,
  AttachMoney as MoneyIcon,
  School as SchoolIcon,
  Gavel as GavelIcon,
  Save as SaveIcon,
} from '@mui/icons-material';

const BrandRegistration = () => {
  const fileInputRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [savedProgress, setSavedProgress] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({});
  
  // Form completion tracking
  const [completedSections, setCompletedSections] = useState({
    0: false, 1: false, 2: false, 3: false, 4: false
  });

  const steps = [
    { label: 'Basic Information', icon: <BusinessIcon />, description: 'Brand story and company details' },
    { label: 'Business Details', icon: <BusinessIcon />, description: 'Products, services, and market position' },
    { label: 'Investment & Fees', icon: <MoneyIcon />, description: 'Financial requirements and fee structure' },
    { label: 'Operations & Support', icon: <SchoolIcon />, description: 'Training, support, and operations' },
    { label: 'Legal Framework', icon: <GavelIcon />, description: 'Terms, conditions, and legal documents' }
  ];

  const [formData, setFormData] = useState({
    // Basic Information
    brandName: '',
    website: '',
    foundedYear: '',
    headquarters: '',
    brandStory: '',
    mission: '',
    vision: '',
    coreValues: '',
    companySize: '',
    annualRevenue: '',
    
    // Business Details
    businessModel: '',
    productsServices: '',
    uniqueSellingProposition: '',
    targetMarket: '',
    keyPeople: '',
    competitiveAdvantage: '',
    marketPosition: '',
    
    // Investment & Fees
    initialFranchiseFee: '',
    totalInvestmentMin: '',
    totalInvestmentMax: '',
    royaltyFee: '',
    marketingFee: '',
    workingCapital: '',
    financingOptions: '',
    equipmentCosts: '',
    realEstateCosts: '',
    
    // Operations & Support
    franchiseeObligations: '',
    franchisorSupport: '',
    territoryRights: '',
    trainingProgram: '',
    ongoingSupport: '',
    marketingSupport: '',
    operationalStandards: '',
    qualityControl: '',
    
    // Legal Framework
    franchiseTermLength: '',
    terminationConditions: '',
    transferConditions: '',
    disputeResolution: '',
    nonCompeteRestrictions: '',
    intellectualProperty: '',
    
    // Additional
    industries: [],
    investmentRange: '',
    franchiseModel: '',
    targetAudience: '',
    growthPlans: '',
  });

  const industries = [
    'Food & Beverage', 'Retail', 'Healthcare', 'Education', 'Fitness',
    'Beauty & Wellness', 'Technology', 'Automotive', 'Real Estate',
    'Home Services', 'Entertainment', 'Travel & Hospitality', 'Other'
  ];

  const investmentRanges = [
    'Under $50K', '$50K - $100K', '$100K - $250K', '$250K - $500K',
    '$500K - $1M', 'Over $1M'
  ];

  const franchiseModels = [
    'Single-Unit Franchise', 'Multi-Unit Development', 'Area Development',
    'Master Franchise', 'Conversion Franchise'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    checkSectionCompletion();
  };

  const checkSectionCompletion = () => {
    // Logic to check if current section has required fields filled
    const requiredFields = getRequiredFieldsForStep(activeStep);
    const isComplete = requiredFields.every(field => formData[field]);
    setCompletedSections(prev => ({ ...prev, [activeStep]: isComplete }));
  };

  const getRequiredFieldsForStep = (step) => {
    switch (step) {
      case 0: return ['brandName', 'headquarters', 'brandStory'];
      case 1: return ['businessModel', 'industries'];
      case 2: return ['initialFranchiseFee', 'investmentRange'];
      case 3: return ['trainingProgram', 'franchisorSupport'];
      case 4: return ['franchiseTermLength'];
      default: return [];
    }
  };

  const handleFileUpload = (field, event) => {
    const file = event.target.files[0];
    if (file) {
      // In a real app, you'd upload to Firebase Storage here
      setUploadedFiles(prev => ({
        ...prev,
        [field]: {
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file) // For preview
        }
      }));
    }
  };

  const removeFile = (field) => {
    setUploadedFiles(prev => {
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
  };

  const FileUploadSection = ({ field, label, acceptedTypes = ".pdf,.doc,.docx", helpText }) => (
    <Card elevation={1} sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
            {label}
          </Typography>
          {helpText && (
            <Tooltip title={helpText}>
              <IconButton size="small">
                <HelpIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        
        {uploadedFiles[field] ? (
          <Box sx={{ display: 'flex', alignItems: 'center', p: 2, backgroundColor: 'success.light', borderRadius: 1 }}>
            <DescriptionIcon sx={{ mr: 2, color: 'success.dark' }} />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body2" fontWeight="medium">
                {uploadedFiles[field].name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {(uploadedFiles[field].size / 1024).toFixed(1)} KB
              </Typography>
            </Box>
            <IconButton onClick={() => removeFile(field)} color="error">
              <DeleteIcon />
            </IconButton>
          </Box>
        ) : (
          <Box
            sx={{
              border: '2px dashed',
              borderColor: 'grey.300',
              borderRadius: 2,
              p: 3,
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: 'primary.light',
                opacity: 0.1,
              },
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <CloudUploadIcon sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Click to upload or drag and drop
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Supported formats: PDF, DOC, DOCX
            </Typography>
            <input
              ref={fileInputRef}
              type="file"
              hidden
              accept={acceptedTypes}
              onChange={(e) => handleFileUpload(field, e)}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const RichTextEditor = ({ value, onChange, placeholder, label }) => (
    <Card elevation={1} sx={{ mb: 2 }}>
      <CardHeader 
        title={label}
        titleTypographyProps={{ variant: 'subtitle1' }}
        sx={{ pb: 1 }}
      />
      <Divider />
      <CardContent>
        <TextField
          multiline
          fullWidth
          rows={6}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            },
          }}
        />
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          {value.length} characters
        </Typography>
      </CardContent>
    </Card>
  );

  const handleNext = () => {
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const saveProgress = () => {
    // Save to localStorage or send to backend
    localStorage.setItem('brandRegistrationProgress', JSON.stringify({
      formData,
      activeStep,
      uploadedFiles: Object.keys(uploadedFiles),
      timestamp: new Date().toISOString()
    }));
    setSavedProgress(true);
    setTimeout(() => setSavedProgress(false), 2000);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Submit logic here
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      alert('Application submitted successfully!');
    } catch (err) {
      setError('Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  Tell us about your brand's story, mission, and core values. This information helps potential franchisees understand your company culture.
                </Typography>
              </Alert>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Brand Name"
                value={formData.brandName}
                onChange={(e) => handleInputChange('brandName', e.target.value)}
                required
                error={!formData.brandName}
                helperText={!formData.brandName ? "Brand name is required" : ""}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Website"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="https://www.yourbrand.com"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Founded Year"
                type="number"
                value={formData.foundedYear}
                onChange={(e) => handleInputChange('foundedYear', e.target.value)}
                inputProps={{ min: 1800, max: new Date().getFullYear() }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Headquarters Location"
                value={formData.headquarters}
                onChange={(e) => handleInputChange('headquarters', e.target.value)}
                required
                error={!formData.headquarters}
                placeholder="City, State/Province, Country"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Company Size</InputLabel>
                <Select
                  value={formData.companySize}
                  onChange={(e) => handleInputChange('companySize', e.target.value)}
                >
                  <MenuItem value="startup">Startup (1-10 employees)</MenuItem>
                  <MenuItem value="small">Small (11-50 employees)</MenuItem>
                  <MenuItem value="medium">Medium (51-200 employees)</MenuItem>
                  <MenuItem value="large">Large (200+ employees)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Annual Revenue Range</InputLabel>
                <Select
                  value={formData.annualRevenue}
                  onChange={(e) => handleInputChange('annualRevenue', e.target.value)}
                >
                  <MenuItem value="under1m">Under $1M</MenuItem>
                  <MenuItem value="1m-5m">$1M - $5M</MenuItem>
                  <MenuItem value="5m-10m">$5M - $10M</MenuItem>
                  <MenuItem value="10m-50m">$10M - $50M</MenuItem>
                  <MenuItem value="over50m">Over $50M</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <RichTextEditor
                value={formData.brandStory}
                onChange={(value) => handleInputChange('brandStory', value)}
                label="Brand Story"
                placeholder="Tell us the compelling story of your brand - its origins, journey, challenges overcome, and what inspired its creation. This narrative helps potential franchisees connect with your vision and understand what makes your brand special."
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <RichTextEditor
                value={formData.mission}
                onChange={(value) => handleInputChange('mission', value)}
                label="Mission Statement"
                placeholder="What is your company's purpose and primary objectives?"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <RichTextEditor
                value={formData.vision}
                onChange={(value) => handleInputChange('vision', value)}
                label="Vision Statement"
                placeholder="Where do you see your company in the future?"
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  Describe your business model, target market, and what sets you apart from competitors.
                </Typography>
              </Alert>
            </Grid>
            
            <Grid item xs={12}>
              <RichTextEditor
                value={formData.businessModel}
                onChange={(value) => handleInputChange('businessModel', value)}
                label="Business Model & Description"
                placeholder="Clearly describe what your business does, how it operates, the products or services offered, and your revenue streams. Include your target customers and how you serve them."
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card elevation={1}>
                <CardHeader 
                  title="Industries"
                  titleTypographyProps={{ variant: 'subtitle1' }}
                />
                <CardContent>
                  <FormControl fullWidth>
                    <InputLabel>Select Industries</InputLabel>
                    <Select
                      multiple
                      value={formData.industries}
                      onChange={(e) => handleInputChange('industries', e.target.value)}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip key={value} label={value} size="small" />
                          ))}
                        </Box>
                      )}
                    >
                      {industries.map((industry) => (
                        <MenuItem key={industry} value={industry}>
                          {industry}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card elevation={1}>
                <CardHeader 
                  title="Franchise Model"
                  titleTypographyProps={{ variant: 'subtitle1' }}
                />
                <CardContent>
                  <FormControl fullWidth>
                    <InputLabel>Franchise Type</InputLabel>
                    <Select
                      value={formData.franchiseModel}
                      onChange={(e) => handleInputChange('franchiseModel', e.target.value)}
                    >
                      {franchiseModels.map((model) => (
                        <MenuItem key={model} value={model}>
                          {model}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12}>
              <RichTextEditor
                value={formData.uniqueSellingProposition}
                onChange={(value) => handleInputChange('uniqueSellingProposition', value)}
                label="Unique Selling Proposition"
                placeholder="What makes your brand stand out from the competition? Highlight your key differentiators, competitive advantages, and unique value propositions."
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <RichTextEditor
                value={formData.targetMarket}
                onChange={(value) => handleInputChange('targetMarket', value)}
                label="Target Market"
                placeholder="Describe your ideal customers, demographics, and market segments."
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <RichTextEditor
                value={formData.competitiveAdvantage}
                onChange={(value) => handleInputChange('competitiveAdvantage', value)}
                label="Competitive Advantage"
                placeholder="What gives you an edge over competitors?"
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="warning" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  Provide accurate investment details. This information is crucial for potential franchisees to make informed decisions.
                </Typography>
              </Alert>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card elevation={1}>
                <CardHeader 
                  title="Initial Investment"
                  titleTypographyProps={{ variant: 'subtitle1' }}
                />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Initial Franchise Fee ($)"
                        type="number"
                        value={formData.initialFranchiseFee}
                        onChange={(e) => handleInputChange('initialFranchiseFee', e.target.value)}
                        required
                        InputProps={{ startAdornment: '$' }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel>Total Investment Range</InputLabel>
                        <Select
                          value={formData.investmentRange}
                          onChange={(e) => handleInputChange('investmentRange', e.target.value)}
                        >
                          {investmentRanges.map((range) => (
                            <MenuItem key={range} value={range}>
                              {range}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card elevation={1}>
                <CardHeader 
                  title="Ongoing Fees"
                  titleTypographyProps={{ variant: 'subtitle1' }}
                />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Royalty Fee (%)"
                        type="number"
                        value={formData.royaltyFee}
                        onChange={(e) => handleInputChange('royaltyFee', e.target.value)}
                        inputProps={{ min: 0, max: 100, step: 0.5 }}
                        InputProps={{ endAdornment: '%' }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Marketing Fee (%)"
                        type="number"
                        value={formData.marketingFee}
                        onChange={(e) => handleInputChange('marketingFee', e.target.value)}
                        inputProps={{ min: 0, max: 100, step: 0.5 }}
                        InputProps={{ endAdornment: '%' }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Equipment Costs ($)"
                type="number"
                value={formData.equipmentCosts}
                onChange={(e) => handleInputChange('equipmentCosts', e.target.value)}
                InputProps={{ startAdornment: '$' }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Real Estate Costs ($)"
                type="number"
                value={formData.realEstateCosts}
                onChange={(e) => handleInputChange('realEstateCosts', e.target.value)}
                InputProps={{ startAdornment: '$' }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Working Capital ($)"
                type="number"
                value={formData.workingCapital}
                onChange={(e) => handleInputChange('workingCapital', e.target.value)}
                InputProps={{ startAdornment: '$' }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <RichTextEditor
                value={formData.financingOptions}
                onChange={(value) => handleInputChange('financingOptions', value)}
                label="Financing Options"
                placeholder="Describe available financing options, partnerships with lenders, or any assistance you provide to help franchisees secure funding."
              />
            </Grid>

            <Grid item xs={12}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1">Upload Financial Documents (Optional)</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <FileUploadSection
                        field="financialProjections"
                        label="Financial Projections"
                        helpText="Upload projected financial performance data"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FileUploadSection
                        field="fddDocument"
                        label="Franchise Disclosure Document (FDD)"
                        helpText="If available, upload your current FDD"
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>
        );

      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  Detail the support systems you provide to franchisees and their operational obligations.
                </Typography>
              </Alert>
            </Grid>
            
            <Grid item xs={12}>
              <RichTextEditor
                value={formData.trainingProgram}
                onChange={(value) => handleInputChange('trainingProgram', value)}
                label="Training Program"
                placeholder="Describe your comprehensive training program including duration, location, curriculum, and both initial and ongoing training components."
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <RichTextEditor
                value={formData.franchisorSupport}
                onChange={(value) => handleInputChange('franchisorSupport', value)}
                label="Franchisor Support Services"
                placeholder="Detail the ongoing support services you provide including field support, business consulting, technology assistance, and operational guidance."
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <RichTextEditor
                value={formData.marketingSupport}
                onChange={(value) => handleInputChange('marketingSupport', value)}
                label="Marketing & Advertising Support"
                placeholder="Explain your marketing fund utilization, national campaigns, local marketing assistance, and brand promotion strategies."
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <RichTextEditor
                value={formData.territoryRights}
                onChange={(value) => handleInputChange('territoryRights', value)}
                label="Territory Rights & Exclusivity"
                placeholder="Define the territorial rights, exclusivity arrangements, and protected areas for franchisees."
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <RichTextEditor
                value={formData.operationalStandards}
                onChange={(value) => handleInputChange('operationalStandards', value)}
                label="Operational Standards"
                placeholder="Describe the operational standards, procedures, and quality control measures franchisees must follow."
              />
            </Grid>

            <Grid item xs={12}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1">Upload Training & Operations Documents</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <FileUploadSection
                        field="trainingManual"
                        label="Training Manual"
                        helpText="Upload your comprehensive training manual"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FileUploadSection
                        field="operationsManual"
                        label="Operations Manual"
                        helpText="Upload your operations and procedures manual"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FileUploadSection
                        field="marketingMaterials"
                        label="Marketing Materials Sample"
                        helpText="Upload sample marketing and promotional materials"
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>
        );

      case 4:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="warning" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  <strong>Legal Framework:</strong> Please provide detailed legal terms or upload relevant documents. Consider having these reviewed by legal counsel.
                </Typography>
              </Alert>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card elevation={1}>
                <CardHeader 
                  title="Franchise Agreement Terms"
                  titleTypographyProps={{ variant: 'subtitle1' }}
                />
                <CardContent>
                  <TextField
                    fullWidth
                    label="Franchise Term Length"
                    value={formData.franchiseTermLength}
                    onChange={(e) => handleInputChange('franchiseTermLength', e.target.value)}
                    placeholder="e.g., 10 years with 5-year renewal options"
                    sx={{ mb: 2 }}
                  />
                  <FormControlLabel
                    control={<Switch />}
                    label="Renewal options available"
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card elevation={1}>
                <CardHeader 
                  title="Territory & Competition"
                  titleTypographyProps={{ variant: 'subtitle1' }}
                />
                <CardContent>
                  <RichTextEditor
                    value={formData.nonCompeteRestrictions}
                    onChange={(value) => handleInputChange('nonCompeteRestrictions', value)}
                    label="Non-Compete & Restrictions"
                    placeholder="Detail any non-compete clauses, territorial restrictions, or limitations on franchisee business activities."
                  />
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12}>
              <RichTextEditor
                value={formData.terminationConditions}
                onChange={(value) => handleInputChange('terminationConditions', value)}
                label="Termination Conditions & Procedures"
                placeholder="Outline the conditions under which the franchise agreement may be terminated, the process involved, and any obligations of both parties upon termination."
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <RichTextEditor
                value={formData.transferConditions}
                onChange={(value) => handleInputChange('transferConditions', value)}
                label="Transfer & Sale Conditions"
                placeholder="Describe the process and requirements for franchisees to transfer or sell their franchise, including approval procedures and fees."
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <RichTextEditor
                value={formData.disputeResolution}
                onChange={(value) => handleInputChange('disputeResolution', value)}
                label="Dispute Resolution Process"
                placeholder="Explain how disputes between franchisor and franchisee are handled, including mediation, arbitration, or legal procedures."
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 3, mb: 2 }}>
                Legal Documents Upload
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FileUploadSection
                    field="franchiseAgreement"
                    label="Franchise Agreement Template"
                    helpText="Upload your standard franchise agreement template"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FileUploadSection
                    field="disclosureDocument"
                    label="Franchise Disclosure Document"
                    helpText="Upload your complete FDD (required in most jurisdictions)"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FileUploadSection
                    field="corporateDocuments"
                    label="Corporate Documents"
                    helpText="Articles of incorporation, bylaws, and other corporate documents"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FileUploadSection
                    field="legalCompliance"
                    label="Legal Compliance Certificates"
                    helpText="Regulatory compliance documents and certifications"
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  const getStepValidation = (step) => {
    const requiredFields = getRequiredFieldsForStep(step);
    return requiredFields.every(field => formData[field]);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Progress Save Fab */}
      <Zoom in={Object.values(formData).some(val => val !== '')}>
        <Fab
          color={savedProgress ? "success" : "primary"}
          sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1000 }}
          onClick={saveProgress}
        >
          {savedProgress ? <CheckIcon /> : <SaveIcon />}
        </Fab>
      </Zoom>

      <Paper elevation={3} sx={{ overflow: 'hidden' }}>
        {/* Header */}
        <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 4, textAlign: 'center' }}>
          <Typography variant="h3" gutterBottom fontWeight="bold">
            Brand Registration
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Share your franchise opportunity with serious investors
          </Typography>
        </Box>

        {/* Stepper */}
        <Box sx={{ p: 4, pb: 2 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((step, index) => (
              <Step key={step.label} completed={completedSections[index]}>
                <StepLabel
                  StepIconComponent={({ active, completed }) => (
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: completed ? 'success.main' : active ? 'primary.main' : 'grey.300',
                        color: 'white',
                        mb: 1
                      }}
                    >
                      {completed ? <CheckIcon /> : step.icon}
                    </Box>
                  )}
                >
                  <Typography variant="subtitle1" fontWeight={activeStep === index ? 'bold' : 'normal'}>
                    {step.label}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {step.description}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Divider />

        {/* Form Content */}
        <Box sx={{ p: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <Box sx={{ mb: 4 }}>
            {renderStepContent(activeStep)}
          </Box>

          {/* Navigation */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            pt: 3,
            borderTop: '1px solid',
            borderColor: 'divider'
          }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
              size="large"
              sx={{ minWidth: 120 }}
            >
              Back
            </Button>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Step {activeStep + 1} of {steps.length}
              </Typography>
              {completedSections[activeStep] && (
                <Chip 
                  icon={<CheckIcon />} 
                  label="Complete" 
                  color="success" 
                  size="small" 
                />
              )}
            </Box>
            
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading || !getStepValidation(activeStep)}
                size="large"
                sx={{ minWidth: 120 }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Submit Application'
                )}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!getStepValidation(activeStep)}
                size="large"
                sx={{ minWidth: 120 }}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default BrandRegistration;
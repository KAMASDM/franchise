import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
} from '@mui/material';

/**
 * Example: Brand Registration Form Header with i18n
 * This demonstrates how to integrate translations into components
 */
const BrandRegistrationHeader = () => {
  const { t } = useTranslation('form');

  return (
    <Box sx={{ mb: 4, textAlign: 'center' }}>
      <Typography variant="h3" gutterBottom>
        {t('title')}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary">
        {t('subtitle')}
      </Typography>
    </Box>
  );
};

/**
 * Example: Business Model Selection with i18n
 */
const BusinessModelSelector = ({ value, onChange }) => {
  const { t } = useTranslation('form');

  const businessModels = [
    { value: 'franchise', label: t('businessModel.franchise') },
    { value: 'distributorship', label: t('businessModel.distributorship') },
    { value: 'dealership', label: t('businessModel.dealership') },
    { value: 'license', label: t('businessModel.license') },
  ];

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        {t('businessModel.title')}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {t('businessModel.description')}
      </Typography>
      
      <TextField
        select
        fullWidth
        value={value}
        onChange={onChange}
        label={t('businessModel.title')}
        helperText={t('help.businessModel')}
      >
        {businessModels.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
};

/**
 * Example: Basic Info Form Fields with i18n
 */
const BasicInfoFields = ({ formData, handleChange, errors }) => {
  const { t } = useTranslation('form');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <TextField
        fullWidth
        name="brandName"
        label={t('basicInfo.brandName')}
        placeholder={t('basicInfo.brandNamePlaceholder')}
        value={formData.brandName || ''}
        onChange={handleChange}
        error={!!errors.brandName}
        helperText={errors.brandName ? t('validation.required') : t('help.brandName')}
        required
      />

      <TextField
        fullWidth
        multiline
        rows={4}
        name="brandDescription"
        label={t('basicInfo.brandDescription')}
        placeholder={t('basicInfo.brandDescriptionPlaceholder')}
        value={formData.brandDescription || ''}
        onChange={handleChange}
        error={!!errors.brandDescription}
        helperText={errors.brandDescription ? t('validation.required') : ''}
      />

      <TextField
        fullWidth
        name="establishedYear"
        label={t('basicInfo.establishedYear')}
        placeholder={t('basicInfo.establishedYearPlaceholder')}
        value={formData.establishedYear || ''}
        onChange={handleChange}
        error={!!errors.establishedYear}
        helperText={errors.establishedYear ? t('validation.invalidYear') : ''}
        type="number"
      />
    </Box>
  );
};

/**
 * Example: Form Actions with i18n
 */
const FormActions = ({ onBack, onNext, onSubmit, isLastStep }) => {
  const { t } = useTranslation('common');

  return (
    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', mt: 4 }}>
      <Button
        variant="outlined"
        onClick={onBack}
      >
        {t('buttons.back')}
      </Button>
      
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="outlined">
          {t('buttons.cancel')}
        </Button>
        <Button
          variant="contained"
          onClick={isLastStep ? onSubmit : onNext}
        >
          {isLastStep ? t('buttons.finish') : t('buttons.next')}
        </Button>
      </Box>
    </Box>
  );
};

/**
 * Example: Validation Error Display with i18n
 */
const ValidationError = ({ fieldName, errorType, value }) => {
  const { t } = useTranslation('form');

  const getErrorMessage = () => {
    switch (errorType) {
      case 'required':
        return t('validation.required');
      case 'invalidEmail':
        return t('validation.invalidEmail');
      case 'invalidPhone':
        return t('validation.invalidPhone');
      case 'minLength':
        return t('validation.minLength', { count: value });
      case 'maxLength':
        return t('validation.maxLength', { count: value });
      case 'fileTooLarge':
        return t('validation.fileTooLarge', { size: value });
      default:
        return '';
    }
  };

  return (
    <Typography variant="caption" color="error">
      {getErrorMessage()}
    </Typography>
  );
};

/**
 * Example: Step Labels Array with i18n
 * Use this pattern to create dynamic step arrays
 */
const useStepLabels = () => {
  const { t } = useTranslation('form');

  return [
    {
      label: t('steps.businessModel'),
      description: t('businessModel.description'),
    },
    {
      label: t('steps.basicInfo'),
      description: 'Enter your brand basic information',
    },
    {
      label: t('steps.brandDetails'),
      description: 'Provide detailed brand information',
    },
    {
      label: t('steps.location'),
      description: 'Add location and contact details',
    },
    {
      label: t('steps.investment'),
      description: 'Specify investment requirements',
    },
    {
      label: t('steps.media'),
      description: 'Upload brand media and documents',
    },
    {
      label: t('steps.review'),
      description: 'Review and submit your registration',
    },
  ];
};

/**
 * Example: Complete Usage in Main Form Component
 */
const BrandRegistrationExample = () => {
  const { t } = useTranslation(['common', 'form']);
  const steps = useStepLabels();
  const [activeStep, setActiveStep] = React.useState(0);
  const [formData, setFormData] = React.useState({});
  const [errors, setErrors] = React.useState({});

  const handleNext = () => {
    // Add validation logic
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = () => {
    // Add submit logic
    console.log(t('form:review.submitting'));
  };

  return (
    <Box>
      <BrandRegistrationHeader />
      
      {/* Step content */}
      {activeStep === 0 && (
        <BusinessModelSelector
          value={formData.businessModelType}
          onChange={(e) => setFormData({ ...formData, businessModelType: e.target.value })}
        />
      )}
      
      {activeStep === 1 && (
        <BasicInfoFields
          formData={formData}
          handleChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
          errors={errors}
        />
      )}
      
      {/* Form actions */}
      <FormActions
        onBack={handleBack}
        onNext={handleNext}
        onSubmit={handleSubmit}
        isLastStep={activeStep === steps.length - 1}
      />
    </Box>
  );
};

/**
 * INTEGRATION INSTRUCTIONS FOR BrandRegistrationNew.jsx
 * 
 * 1. Import the hook at the top:
 *    import { useTranslation } from 'react-i18next';
 * 
 * 2. Use the hook in your component:
 *    const { t } = useTranslation('form');
 *    // Or for multiple namespaces:
 *    const { t: tCommon } = useTranslation('common');
 *    const { t: tForm } = useTranslation('form');
 * 
 * 3. Replace hardcoded strings:
 *    OLD: <Typography>Brand Name</Typography>
 *    NEW: <Typography>{t('basicInfo.brandName')}</Typography>
 * 
 * 4. Update step labels:
 *    OLD: { label: "Business Model", ... }
 *    NEW: { label: t('steps.businessModel'), ... }
 * 
 * 5. Update button labels:
 *    OLD: <Button>Submit</Button>
 *    NEW: <Button>{tCommon('buttons.submit')}</Button>
 * 
 * 6. Update validation messages:
 *    OLD: error="This field is required"
 *    NEW: error={t('validation.required')}
 * 
 * 7. Update placeholders:
 *    OLD: placeholder="Enter your brand name"
 *    NEW: placeholder={t('basicInfo.brandNamePlaceholder')}
 * 
 * 8. Use interpolation for dynamic values:
 *    t('validation.minLength', { count: 10 })
 *    t('validation.fileTooLarge', { size: 5 })
 * 
 * 9. Keep analytics keys in English:
 *    analytics.trackFormStart() // Don't translate analytics events
 * 
 * 10. Test all languages after integration
 */

export default BrandRegistrationExample;
export {
  BrandRegistrationHeader,
  BusinessModelSelector,
  BasicInfoFields,
  FormActions,
  ValidationError,
  useStepLabels,
};

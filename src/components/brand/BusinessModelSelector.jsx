import React, { useState } from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    CardActionArea,
    Typography,
    Chip,
    Radio,
    FormControl,
    FormLabel,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Divider,
    Alert,
    Tooltip,
    IconButton
} from '@mui/material';
import {
    Store as StoreIcon,
    Business as BusinessIcon,
    LocalShipping as LocalShippingIcon,
    Inventory as InventoryIcon,
    Handshake as HandshakeIcon,
    Map as MapIcon,
    Storefront as StorefrontIcon,
    VerifiedUser as VerifiedUserIcon,
    Warehouse as WarehouseIcon,
    ExpandMore as ExpandMoreIcon,
    Info as InfoIcon
} from '@mui/icons-material';
import {
    BUSINESS_MODEL_CONFIG,
    BUSINESS_MODEL_TYPES,
    getBusinessModelsByCategory,
    getRecommendedModels
} from '../../constants/businessModels';

const iconMap = {
    Store: StoreIcon,
    Business: BusinessIcon,
    Map: MapIcon,
    Storefront: StorefrontIcon,
    VerifiedUser: VerifiedUserIcon,
    LocalShipping: LocalShippingIcon,
    Warehouse: WarehouseIcon,
    Inventory: InventoryIcon,
    Handshake: HandshakeIcon
};

/**
 * BusinessModelSelector - Component for selecting business partnership models
 * Supports multiple models, categorization, and recommendations
 */
const BusinessModelSelector = ({
    selectedModels = [],
    onChange,
    allowMultiple = true,
    industry = null,
    showRecommendations = true,
    variant = 'cards' // 'cards' or 'list'
}) => {
    const [expandedCategory, setExpandedCategory] = useState('franchise');
    
    const categories = getBusinessModelsByCategory();
    const recommendedModels = industry ? getRecommendedModels(industry) : [];

    const handleModelToggle = (modelId) => {
        if (allowMultiple) {
            const newSelection = selectedModels.includes(modelId)
                ? selectedModels.filter(id => id !== modelId)
                : [...selectedModels, modelId];
            onChange(newSelection);
        } else {
            onChange([modelId]);
        }
    };

    const isSelected = (modelId) => selectedModels.includes(modelId);
    const isRecommended = (modelId) => recommendedModels.includes(modelId);

    const getIconComponent = (iconName) => {
        const IconComponent = iconMap[iconName] || StoreIcon;
        return IconComponent;
    };

    const renderModelCard = (modelId) => {
        const config = BUSINESS_MODEL_CONFIG[modelId];
        const IconComponent = getIconComponent(config.icon);
        const selected = isSelected(modelId);
        const recommended = isRecommended(modelId);

        return (
            <Grid item xs={12} sm={6} md={4} key={modelId}>
                <Card
                    sx={{
                        height: '100%',
                        border: 2,
                        borderColor: selected ? 'primary.main' : 'transparent',
                        bgcolor: selected ? 'primary.light' : 'background.paper',
                        transition: 'all 0.3s',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: 4
                        }
                    }}
                >
                    <CardActionArea
                        onClick={() => handleModelToggle(modelId)}
                        sx={{ height: '100%', p: 2 }}
                    >
                        <Box display="flex" flexDirection="column" height="100%">
                            <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={1}>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <IconComponent
                                        sx={{
                                            fontSize: 40,
                                            color: selected ? 'primary.main' : config.color
                                        }}
                                    />
                                    {allowMultiple ? (
                                        <Checkbox
                                            checked={selected}
                                            sx={{ p: 0 }}
                                        />
                                    ) : (
                                        <Radio
                                            checked={selected}
                                            sx={{ p: 0 }}
                                        />
                                    )}
                                </Box>
                                {recommended && (
                                    <Chip
                                        label="Recommended"
                                        size="small"
                                        color="success"
                                        sx={{ fontWeight: 'bold' }}
                                    />
                                )}
                            </Box>

                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                {config.label}
                            </Typography>

                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                                {config.description}
                            </Typography>

                            <Divider sx={{ my: 1 }} />

                            <Box>
                                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                                    Key Features:
                                </Typography>
                                <Box display="flex" flexWrap="wrap" gap={0.5}>
                                    {config.features.slice(0, 3).map((feature, index) => (
                                        <Chip
                                            key={index}
                                            label={feature}
                                            size="small"
                                            variant="outlined"
                                            sx={{ fontSize: '0.7rem' }}
                                        />
                                    ))}
                                </Box>
                            </Box>

                            <Box mt={1}>
                                <Typography variant="caption" color="text.secondary">
                                    Investment: <strong>{config.investmentType}</strong>
                                </Typography>
                            </Box>
                        </Box>
                    </CardActionArea>
                </Card>
            </Grid>
        );
    };

    const renderCategoryAccordion = (categoryName, categoryModels) => {
        const categoryLabels = {
            franchise: '🏪 Franchise Models',
            distribution: '🚚 Distribution & Supply Chain',
            dealership: '🏬 Dealership Models',
            partnership: '🤝 Strategic Partnerships'
        };

        return (
            <Accordion
                key={categoryName}
                expanded={expandedCategory === categoryName}
                onChange={() => setExpandedCategory(expandedCategory === categoryName ? null : categoryName)}
                sx={{ mb: 2 }}
            >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6" fontWeight="bold">
                        {categoryLabels[categoryName]}
                    </Typography>
                    <Chip
                        label={categoryModels.length}
                        size="small"
                        sx={{ ml: 2 }}
                    />
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container spacing={2}>
                        {categoryModels.map(modelId => renderModelCard(modelId))}
                    </Grid>
                </AccordionDetails>
            </Accordion>
        );
    };

    return (
        <Box>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h6" fontWeight="bold">
                    Select Business Model{allowMultiple && 's'}
                </Typography>
                <Tooltip title="You can offer multiple partnership models to cater to different investor profiles">
                    <IconButton size="small">
                        <InfoIcon />
                    </IconButton>
                </Tooltip>
            </Box>

            {showRecommendations && recommendedModels.length > 0 && (
                <Alert severity="info" sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                        Recommended for {industry}:
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                        {recommendedModels.map(modelId => (
                            <Chip
                                key={modelId}
                                label={BUSINESS_MODEL_CONFIG[modelId].label}
                                color="primary"
                                variant={isSelected(modelId) ? 'filled' : 'outlined'}
                                onClick={() => handleModelToggle(modelId)}
                            />
                        ))}
                    </Box>
                </Alert>
            )}

            {variant === 'cards' ? (
                <Box>
                    {Object.entries(categories).map(([categoryName, categoryModels]) =>
                        renderCategoryAccordion(categoryName, categoryModels)
                    )}
                </Box>
            ) : (
                <Grid container spacing={2}>
                    {Object.values(BUSINESS_MODEL_CONFIG).map(config =>
                        renderModelCard(config.id)
                    )}
                </Grid>
            )}

            {selectedModels.length > 0 && (
                <Box mt={3} p={2} bgcolor="primary.light" borderRadius={2}>
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                        Selected Models ({selectedModels.length}):
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                        {selectedModels.map(modelId => (
                            <Chip
                                key={modelId}
                                label={BUSINESS_MODEL_CONFIG[modelId].label}
                                onDelete={() => handleModelToggle(modelId)}
                                color="primary"
                            />
                        ))}
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default BusinessModelSelector;

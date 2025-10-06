import React from 'react';
import { useFAQs } from '../../hooks/useFAQs';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, CircularProgress, useTheme, Avatar } from '@mui/material';
import { ExpandMore, HelpOutline } from "@mui/icons-material";

const BrandFAQs = ({ brandName }) => {
    const theme = useTheme();
    const { faqs, loading } = useFAQs({ brandName: brandName, type: 'brand' });

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>;
    }

    if (faqs.length === 0) {
        return (
            <Box sx={{ p: 3, textAlign: 'center', backgroundColor: 'grey.50', borderRadius: 2 }}>
                <Typography color="text.secondary">No frequently asked questions have been added for this brand yet.</Typography>
            </Box>
        );
    }

    return (
        <Box>
            {faqs.map((faq, index) => (
                <Accordion key={faq.id} sx={{ mb: 2, '&:before': { display: 'none' }, boxShadow: 3, borderRadius: 2, overflow: 'hidden' }}>
                    <AccordionSummary
                        expandIcon={<ExpandMore color="primary" />}
                        sx={{ backgroundColor: theme.palette.primary[50], px: 3, py: 1 }}
                    >
                         <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Avatar sx={{ bgcolor: "primary.main", color: "primary.contrastText", width: 32, height: 32 }}>
                                <HelpOutline sx={{ fontSize: 20 }} />
                            </Avatar>
                            <Typography variant="subtitle1" fontWeight="bold">{faq.question}</Typography>
                         </Box>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 3, backgroundColor: "background.paper" }}>
                        <Typography variant="body1" sx={{ lineHeight: 1.8 }}>{faq.answer}</Typography>
                    </AccordionDetails>
                </Accordion>
            ))}
        </Box>
    );
};

export default BrandFAQs;
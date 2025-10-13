import React, { useState, useRef, useEffect } from "react";
import {
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Button,
  Typography,
  Avatar,
  Paper,
  IconButton,
  Divider,
  CircularProgress,
  Chip,
  Card,
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Badge,
  Grid,
  Stack,
} from "@mui/material";
import { 
  Chat as ChatIcon, 
  Close, 
  Support,
  Business,
  AttachMoney,
  LocationOn,
  TrendingUp,
  CheckCircle,
  Star,
  Launch
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import UserInfoForm from "./UserInfoForm";
import { db } from "../../firebase/firebase";
import { collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import NotificationService from "../../utils/NotificationService";
import { BrandMatchingService } from "../../utils/BrandMatchingService";
import { INVESTMENT_RANGES, INDUSTRIES } from "../../constants";
import { generateBrandSlug } from "../../utils/brandUtils";

const Chatbot = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [chatPhase, setChatPhase] = useState("pre-chat");
  const [userInfo, setUserInfo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestionStep, setCurrentQuestionStep] = useState(1);
  const [userResponses, setUserResponses] = useState({});
  const [brandsData, setBrandsData] = useState([]);
  const [matchedBrands, setMatchedBrands] = useState([]);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch approved brands when component mounts
  useEffect(() => {
    const fetchApprovedBrands = async () => {
      try {
        const brandsCollection = collection(db, "brands");
        const q = query(brandsCollection, where("status", "==", "active"));
        const querySnapshot = await getDocs(q);
        const brands = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBrandsData(brands);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };
    
    fetchApprovedBrands();
  }, []);

  // Smart brand matching using the dedicated service
  const findMatchingBrands = async (responses, userInfo) => {
    if (brandsData.length === 0) return [];

    // Transform responses to match BrandMatchingService format
    const userPreferences = {
      budget: userInfo.budget,
      location: userInfo.location,
      interests: [responses.industry],
      experience: responses.experience,
      timeline: responses.timeline,
      riskTolerance: responses.riskTolerance
    };

    try {
      const matches = await BrandMatchingService.matchBrands(userPreferences, brandsData);
      
      // Transform matches to include user-friendly reasons
      return matches.slice(0, 5).map(match => ({
        ...match.brand,
        matchScore: Math.round(match.matchScore),
        matchReasons: generateUserFriendlyReasons(match.matchFactors, responses, userInfo)
      }));
    } catch (error) {
      console.error("Error in brand matching:", error);
      // Fallback to simple matching
      return brandsData
        .filter(brand => 
          brand.industries?.some(industry => 
            industry.toLowerCase().includes(responses.industry?.toLowerCase()) ||
            responses.industry?.toLowerCase().includes(industry.toLowerCase())
          )
        )
        .slice(0, 3)
        .map(brand => ({
          ...brand,
          matchScore: 75,
          matchReasons: [`Matches your interest in ${responses.industry}`, `Available in your location`]
        }));
    }
  };

  const generateUserFriendlyReasons = (matchFactors, responses, userInfo) => {
    const reasons = [];
    
    if (matchFactors.budgetScore > 70) {
      reasons.push(`Perfect fit for your budget of ₹${userInfo.budget}`);
    } else if (matchFactors.budgetScore > 50) {
      reasons.push(`Within your budget range`);
    }

    if (matchFactors.industryScore > 80) {
      reasons.push(`Excellent match for ${responses.industry} industry`);
    } else if (matchFactors.industryScore > 50) {
      reasons.push(`Related to your interest in ${responses.industry}`);
    }

    if (responses.experience === "No Business Experience") {
      reasons.push(`Comprehensive training and support for beginners`);
    } else if (responses.experience.includes("Experience")) {
      reasons.push(`Great opportunity for experienced investors`);
    }

    if (responses.riskTolerance === "Low Risk") {
      reasons.push(`Low-risk investment model`);
    } else if (responses.riskTolerance === "High Risk") {
      reasons.push(`High growth potential`);
    } else {
      reasons.push(`Balanced risk-return profile`);
    }

    return reasons.slice(0, 3); // Limit to top 3 reasons
  };

  const saveChatLead = async (responses, userInfo) => {
    try {
      const chatLeadsCollection = collection(db, "chatLeads");
      const leadData = {
        userInfo: userInfo,
        responses: responses,
        createdAt: serverTimestamp(),
        status: "New",
        source: "chatbot",
        matchedBrands: matchedBrands.map(b => ({
          brandId: b.id,
          brandName: b.brandName,
          matchScore: b.matchScore,
          matchReasons: b.matchReasons
        }))
      };
      
      const docRef = await addDoc(chatLeadsCollection, leadData);
      
      // Send notification to admins about new chat lead
      await NotificationService.sendAdminNotification(
        `New chat lead from ${userInfo?.name || 'Anonymous'} - Interested in ${responses.industry}`,
        {
          type: "chat_lead",
          leadId: docRef.id,
          prospectName: userInfo?.name,
          location: userInfo?.location,
          budget: userInfo?.budget,
          industry: responses.industry
        }
      );
      
      return docRef.id;
    } catch (error) {
      console.error("Error saving chat lead:", error);
    }
  };

  // Updated question flow with franchise-specific questions
  const getQuestionData = (step, language = "English") => {
    const questions = {
      1: {
        English: {
          question: "Which industry interests you most for franchise investment?",
          options: [
            { key: "food", label: "Food & Beverage", description: "Restaurants, Cafes, Quick Service" },
            { key: "retail", label: "Retail", description: "Clothing, Electronics, Consumer Goods" },
            { key: "healthcare", label: "Healthcare", description: "Clinics, Wellness Centers, Pharmacies" },
            { key: "education", label: "Education", description: "Coaching, Training, Schools" },
            { key: "fitness", label: "Fitness", description: "Gyms, Yoga Studios, Sports" },
            { key: "beauty", label: "Beauty & Wellness", description: "Salons, Spas, Beauty Services" },
            { key: "services", label: "Services", description: "Cleaning, Repair, Consulting" },
            { key: "other", label: "Other", description: "Explore other opportunities" }
          ]
        },
        Hindi: {
          question: "फ्रैंचाइज़ी निवेश के लिए आपको कौन सा उद्योग सबसे अधिक रुचिकर लगता है?",
          options: [
            { key: "food", label: "खाद्य और पेय", description: "रेस्टोरेंट, कैफे, त्वरित सेवा" },
            { key: "retail", label: "रिटेल", description: "कपड़े, इलेक्ट्रॉनिक्स, उपभोक्ता वस्तुएं" },
            { key: "healthcare", label: "स्वास्थ्य सेवा", description: "क्लिनिक, वेलनेस सेंटर, फार्मेसी" },
            { key: "education", label: "शिक्षा", description: "कोचिंग, प्रशिक्षण, स्कूल" },
            { key: "fitness", label: "फिटनेस", description: "जिम, योग स्टूडियो, खेल" },
            { key: "beauty", label: "सौंदर्य और कल्याण", description: "सैलून, स्पा, सौंदर्य सेवाएं" },
            { key: "services", label: "सेवाएं", description: "सफाई, मरम्मत, परामर्श" },
            { key: "other", label: "अन्य", description: "अन्य अवसरों का अन्वेषण करें" }
          ]
        }
      },
      2: {
        English: {
          question: "What's your business experience level?",
          options: [
            { key: "none", label: "No Business Experience", description: "First-time entrepreneur" },
            { key: "some", label: "Some Business Experience", description: "1-3 years in business" },
            { key: "experienced", label: "Experienced", description: "3+ years running a business" },
            { key: "franchise", label: "Franchise Experience", description: "Previously owned franchises" }
          ]
        },
        Hindi: {
          question: "आपका व्यावसायिक अनुभव का स्तर क्या है?",
          options: [
            { key: "none", label: "कोई व्यावसायिक अनुभव नहीं", description: "पहली बार उद्यमी" },
            { key: "some", label: "कुछ व्यावसायिक अनुभव", description: "व्यवसाय में 1-3 साल" },
            { key: "experienced", label: "अनुभवी", description: "3+ साल व्यवसाय चलाने का अनुभव" },
            { key: "franchise", label: "फ्रैंचाइज़ी अनुभव", description: "पहले फ्रैंचाइज़ी का मालिक रहा है" }
          ]
        }
      },
      3: {
        English: {
          question: "What's your risk tolerance for this investment?",
          options: [
            { key: "low", label: "Low Risk", description: "Prefer established, safe franchises" },
            { key: "moderate", label: "Moderate Risk", description: "Balanced approach to risk and returns" },
            { key: "high", label: "High Risk", description: "Willing to take risks for higher returns" }
          ]
        },
        Hindi: {
          question: "इस निवेश के लिए आपकी जोखिम सहनशीलता क्या है?",
          options: [
            { key: "low", label: "कम जोखिम", description: "स्थापित, सुरक्षित फ्रैंचाइज़ी पसंद करते हैं" },
            { key: "moderate", label: "मध्यम जोखिम", description: "जोखिम और रिटर्न का संतुलित दृष्टिकोण" },
            { key: "high", label: "उच्च जोखिम", description: "अधिक रिटर्न के लिए जोखिम लेने को तैयार" }
          ]
        }
      },
      4: {
        English: {
          question: "When are you looking to start your franchise?",
          options: [
            { key: "asap", label: "As soon as possible", description: "Ready to start immediately" },
            { key: "3months", label: "Within 3 months", description: "Planning to start in 3 months" },
            { key: "6months", label: "Within 6 months", description: "Planning to start in 6 months" },
            { key: "exploring", label: "Just exploring", description: "Still researching options" }
          ]
        },
        Hindi: {
          question: "आप अपनी फ्रैंचाइज़ी कब शुरू करना चाहते हैं?",
          options: [
            { key: "asap", label: "जल्द से जल्द", description: "तुरंत शुरू करने के लिए तैयार" },
            { key: "3months", label: "3 महीने के भीतर", description: "3 महीने में शुरू करने की योजना" },
            { key: "6months", label: "6 महीने के भीतर", description: "6 महीने में शुरू करने की योजना" },
            { key: "exploring", label: "सिर्फ खोज रहा हूं", description: "अभी भी विकल्पों पर शोध कर रहा हूं" }
          ]
        }
      }
    };

    return questions[step]?.[language] || questions[step]?.["English"];
  };

  const handleStartChat = (info) => {
    setUserInfo(info);
    const questionData = getQuestionData(1, info.language);
    
    setMessages([
      {
        id: 1,
        sender: "bot",
        timestamp: new Date(),
        text: `Hello ${info.name}! 👋 I'm here to help you find the perfect franchise opportunity based on your preferences and budget of ₹${info.budget}.\n\n${questionData.question}`,
        options: questionData.options
      },
    ]);
    setChatPhase("chatting");
    setCurrentQuestionStep(1);
  };

  const handleOptionSelect = async (option) => {
    const userMessage = {
      id: messages.length + 1,
      text: `${option.label} - ${option.description}`,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Store the response
    const responseKey = {
      1: 'industry',
      2: 'experience', 
      3: 'riskTolerance',
      4: 'timeline'
    }[currentQuestionStep];

    const newResponses = {
      ...userResponses,
      [responseKey]: option.label
    };
    setUserResponses(newResponses);

    try {
      if (currentQuestionStep < 4) {
        // Move to next question
        const nextStep = currentQuestionStep + 1;
        const questionData = getQuestionData(nextStep, userInfo.language);
        
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: prev.length + 1,
              text: questionData.question,
              sender: "bot",
              timestamp: new Date(),
              options: questionData.options
            },
          ]);
          setCurrentQuestionStep(nextStep);
          setIsLoading(false);
        }, 1000);
      } else {
        // Save chat lead first
        await saveChatLead(newResponses, userInfo);
        
        setTimeout(async () => {
          const matches = await findMatchingBrands(newResponses, userInfo);
          setMatchedBrands(matches);
          
          if (matches.length > 0) {
            setMessages((prev) => [
              ...prev,
              {
                id: prev.length + 1,
                text: `Perfect! Based on your preferences, I found ${matches.length} franchise opportunities that match your criteria. Here are my top recommendations:`,
                sender: "bot",
                timestamp: new Date(),
                recommendations: matches
              },
            ]);
          } else {
            setMessages((prev) => [
              ...prev,
              {
                id: prev.length + 1,
                text: `I couldn't find exact matches for your criteria, but don't worry! Our team will review your preferences and get back to you with personalized recommendations within 24 hours.\n\nIn the meantime, you can browse all available franchises on our platform.`,
                sender: "bot",
                timestamp: new Date(),
                showBrowseButton: true
              },
            ]);
          }
          setChatPhase("recommendations");
          setIsLoading(false);
        }, 1500);
      }
    } catch (error) {
      console.error("Error processing response:", error);
      setIsLoading(false);
    }
  };

  const handleBrandClick = (brand) => {
    // Generate consistent URL-friendly slug
    const slug = generateBrandSlug(brand.brandName);
    
    // Open brand page in new window/tab instead of navigating away
    const brandUrl = `${window.location.origin}/brands/${slug || brand.id}`;
    window.open(brandUrl, '_blank', 'noopener,noreferrer');
    
    // Don't close the chat - keep it open so user can see chat content
    // setOpen(false); // Removed this line
  };

  const handleClose = () => {
    setOpen(false);
  };

  const formatInvestmentAmount = (amount) => {
    if (!amount) return "Contact for details";
    const numAmount = parseInt(amount.toString().replace(/[₹,]/g, ''));
    if (numAmount >= 100000) {
      return `₹${(numAmount / 100000).toFixed(1)}L`;
    } else if (numAmount >= 1000) {
      return `₹${(numAmount / 1000).toFixed(0)}K`;
    }
    return `₹${numAmount}`;
  };

  return (
    <>
      <Fab
        color="primary"
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1300,
          width: 64,
          height: 64,
        }}
        onClick={() => setOpen(true)}
      >
        <Badge badgeContent="New" color="secondary" variant="dot">
          <ChatIcon />
        </Badge>
      </Fab>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            height: "80vh",
            maxHeight: 700,
            position: "fixed",
            bottom: { xs: 0, sm: 100 },
            right: { xs: 0, sm: 24 },
            m: 0,
            maxWidth: 420,
            borderRadius: { xs: 0, sm: 4 },
            width: "100%",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pb: 1,
            background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
            color: "white"
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar sx={{ mr: 2, backgroundColor: "rgba(255,255,255,0.2)" }}>
              <Support />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                FranchiseHub Assistant
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9, display: "flex", alignItems: "center", gap: 0.5 }}>
                Find your perfect franchise match
                {chatPhase === "recommendations" && (
                  <>
                    <Launch fontSize="inherit" sx={{ ml: 1 }} />
                    Links open in new tabs
                  </>
                )}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={handleClose} sx={{ color: "white" }}>
            <Close />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent
          sx={{
            p: 0,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          {chatPhase === "pre-chat" ? (
            <UserInfoForm onStartChat={handleStartChat} />
          ) : (
            <>
              <Box sx={{ flexGrow: 1, p: 2, overflowY: "auto" }}>
                {messages.map((message) => (
                  <Box key={message.id}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent:
                          message.sender === "user" ? "flex-end" : "flex-start",
                        mb: 2,
                      }}
                    >
                      <Paper
                        sx={{
                          p: 2,
                          maxWidth: "85%",
                          backgroundColor:
                            message.sender === "user"
                              ? "primary.main"
                              : "grey.100",
                          color:
                            message.sender === "user"
                              ? "white"
                              : "text.primary",
                          borderRadius:
                            message.sender === "user"
                              ? "20px 20px 4px 20px"
                              : "20px 20px 20px 4px",
                        }}
                      >
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                          {message.text}
                        </Typography>
                      </Paper>
                    </Box>

                    {/* Options for bot messages - Using Chips */}
                    {message.sender === "bot" && message.options && (
                      <Box sx={{ mb: 2, px: 1 }}>
                        <Typography 
                          variant="caption" 
                          color="text.secondary" 
                          sx={{ mb: 1, display: "block" }}
                        >
                          {userInfo?.language === "Hindi" 
                            ? "एक विकल्प चुनें:"
                            : "Choose an option:"}
                        </Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "flex-start" }}>
                          {message.options.map((option) => (
                            <Chip
                              key={option.key}
                              label={option.label}
                              onClick={() => handleOptionSelect(option)}
                              color="primary"
                              variant="outlined"
                              sx={{
                                cursor: "pointer",
                                mb: 1,
                                transition: "all 0.3s ease",
                                borderRadius: "20px",
                                border: "2px solid",
                                borderColor: "primary.main",
                                backgroundColor: "transparent",
                                color: "primary.main",
                                "&:hover": {
                                  backgroundColor: "primary.main",
                                  color: "white",
                                  transform: "translateY(-2px)",
                                  boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
                                  "& .MuiChip-label": {
                                    color: "white",
                                  }
                                },
                                "&:active": {
                                  transform: "translateY(0px)",
                                },
                                fontSize: "0.875rem",
                                height: "40px",
                                "& .MuiChip-label": {
                                  padding: "0 16px",
                                  fontWeight: "500",
                                  color: "inherit"
                                }
                              }}
                              title={option.description} // Tooltip for description
                            />
                          ))}
                        </Box>
                        
                        {/* Helper text showing that descriptions are available on hover */}
                        <Typography 
                          variant="caption" 
                          color="text.disabled" 
                          sx={{ mt: 1, display: "block", fontStyle: "italic" }}
                        >
                          💡 Hover over options to see details
                        </Typography>
                      </Box>
                    )}

                    {/* Brand Recommendations */}
                    {message.sender === "bot" && message.recommendations && (
                      <Box sx={{ mb: 2 }}>
                        <Stack spacing={2}>
                          {message.recommendations.map((brand, index) => (
                            <Card 
                              key={brand.id}
                              sx={{ 
                                cursor: "pointer",
                                transition: "all 0.3s",
                                "&:hover": { 
                                  transform: "translateY(-3px)",
                                  boxShadow: 6 
                                },
                                border: index === 0 ? "2px solid #1976d2" : "1px solid #e0e0e0"
                              }}
                              onClick={() => handleBrandClick(brand)}
                            >
                              {index === 0 && (
                                <Box sx={{ 
                                  background: "linear-gradient(135deg, #1976d2, #42a5f5)",
                                  color: "white",
                                  px: 2,
                                  py: 0.5,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  gap: 1
                                }}>
                                  <Star fontSize="small" />
                                  <Typography variant="caption" fontWeight="bold">
                                    BEST MATCH
                                  </Typography>
                                </Box>
                              )}
                              <CardContent>
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                                  <Typography variant="h6" fontWeight="bold">
                                    {brand.brandName}
                                  </Typography>
                                  <Chip 
                                    label={`${brand.matchScore}% Match`} 
                                    color="success" 
                                    size="small"
                                    icon={<CheckCircle />}
                                  />
                                </Box>
                                
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                                  {brand.industries?.slice(0, 2).map((industry) => (
                                    <Chip key={industry} label={industry} size="small" color="primary" variant="outlined" />
                                  ))}
                                </Box>

                                <Grid container spacing={1} sx={{ mb: 2 }}>
                                  <Grid item xs={6}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                      <AttachMoney fontSize="small" color="primary" />
                                      <Box>
                                        <Typography variant="caption" color="text.secondary">Investment</Typography>
                                        <Typography variant="body2" fontWeight="bold">
                                          {brand.investmentRange}
                                        </Typography>
                                      </Box>
                                    </Box>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                      <TrendingUp fontSize="small" color="primary" />
                                      <Box>
                                        <Typography variant="caption" color="text.secondary">Royalty</Typography>
                                        <Typography variant="body2" fontWeight="bold">
                                          {brand.royaltyFee}%
                                        </Typography>
                                      </Box>
                                    </Box>
                                  </Grid>
                                </Grid>

                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                  {brand.brandMission?.substring(0, 100)}...
                                </Typography>

                                <Box sx={{ mb: 2 }}>
                                  <Typography variant="caption" color="text.secondary" fontWeight="bold">
                                    Why it's perfect for you:
                                  </Typography>
                                  {brand.matchReasons?.slice(0, 2).map((reason, idx) => (
                                    <Typography key={idx} variant="caption" display="block" color="success.main">
                                      ✓ {reason}
                                    </Typography>
                                  ))}
                                </Box>
                              </CardContent>
                              <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
                                <Button 
                                  variant="contained" 
                                  color="primary" 
                                  size="small"
                                  endIcon={<Launch />}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleBrandClick(brand);
                                  }}
                                >
                                  View Details & Inquire
                                </Button>
                                <Typography variant="caption" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                  <Launch fontSize="inherit" />
                                  Opens in new tab
                                </Typography>
                              </CardActions>
                            </Card>
                          ))}
                        </Stack>
                      </Box>
                    )}

                    {/* Browse All Button */}
                    {message.sender === "bot" && message.showBrowseButton && (
                      <Box sx={{ mb: 2, textAlign: "center" }}>
                        <Button 
                          variant="contained" 
                          color="primary"
                          onClick={() => {
                            const brandsUrl = `${window.location.origin}/brands`;
                            window.open(brandsUrl, '_blank', 'noopener,noreferrer');
                            // Keep chat open
                          }}
                        >
                          Browse All Franchises
                        </Button>
                      </Box>
                    )}
                  </Box>
                ))}
                
                {isLoading && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      mb: 2,
                    }}
                  >
                    <Paper
                      sx={{
                        p: 2,
                        backgroundColor: "grey.100",
                        borderRadius: "20px 20px 20px 4px",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CircularProgress size={16} />
                        <Typography variant="body2">
                          Finding perfect matches...
                        </Typography>
                      </Box>
                    </Paper>
                  </Box>
                )}
                <div ref={chatEndRef} />
              </Box>

              {chatPhase === "recommendations" && (
                <Box sx={{ p: 2, borderTop: 1, borderColor: "divider", textAlign: "center" }}>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: "block" }}>
                    Need more help? Our franchise experts are here to assist you!
                  </Typography>
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <Button 
                      variant="outlined" 
                      size="small"
                      onClick={() => {
                        const contactUrl = `${window.location.origin}/contact`;
                        window.open(contactUrl, '_blank', 'noopener,noreferrer');
                        // Keep chat open
                      }}
                    >
                      Contact Expert
                    </Button>
                    <Button 
                      variant="contained" 
                      size="small"
                      onClick={() => {
                        const brandsUrl = `${window.location.origin}/brands`;
                        window.open(brandsUrl, '_blank', 'noopener,noreferrer');
                        // Keep chat open
                      }}
                    >
                      View All Brands
                    </Button>
                  </Stack>
                </Box>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Chatbot;
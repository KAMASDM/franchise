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
  Launch,
  History,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import UserInfoForm from "./UserInfoForm";
import { db } from "../../firebase/firebase";
import { collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import NotificationService from "../../utils/NotificationService";
import { BrandMatchingService } from "../../utils/BrandMatchingService";
import { INVESTMENT_RANGES, INDUSTRIES } from "../../constants";
import { getBrandUrl } from "../../utils/brandUtils";
import { useDevice } from "../../hooks/useDevice";
import logger from "../../utils/logger";
import { 
  SuggestedQuestions, 
  ContextualQuickReplies, 
  ConversationStarters 
} from "./ChatbotEnhancements";
import useChatHistory from "../../hooks/useChatHistory";

const Chatbot = () => {
  const navigate = useNavigate();
  const { isMobile } = useDevice();
  const [open, setOpen] = useState(false);
  const { saveConversation } = useChatHistory();

  // Expose setOpen to window for mobile bottom nav access
  useEffect(() => {
    window.openChatbot = () => setOpen(true);
    return () => {
      delete window.openChatbot;
    };
  }, []);
  const [chatPhase, setChatPhase] = useState("pre-chat");
  const [userInfo, setUserInfo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestionStep, setCurrentQuestionStep] = useState(1);
  const [userResponses, setUserResponses] = useState({});
  const [brandsData, setBrandsData] = useState([]);
  const [matchedBrands, setMatchedBrands] = useState([]);
  const [conversationContext, setConversationContext] = useState('greeting');
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
        logger.error("Error fetching brands:", error);
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
      logger.error("Error in brand matching:", error);
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

  const getGreeting = (name, budget, language = "English") => {
    const greetings = {
      English: `Hello ${name}! 👋 I'm here to help you find the perfect franchise opportunity based on your preferences and budget of ₹${budget}.`,
      Hindi: `नमस्ते ${name}! 👋 मैं आपकी पसंद और ₹${budget} के बजट के आधार पर सही फ्रैंचाइज़ी अवसर खोजने में आपकी मदद करने के लिए यहाँ हूँ।`,
      Gujarati: `નમસ્તે ${name}! 👋 હું તમારી પસંદગી અને ₹${budget} ના બજેટના આધારે સંપૂર્ણ ફ્રેન્ચાઇઝ તક શોધવામાં તમને મદદ કરવા અહીં છું।`,
      Marathi: `नमस्कार ${name}! 👋 मी तुमच्या पसंतीनुसार आणि ₹${budget} च्या बजेटवर आधारित योग्य फ्रँचायझी संधी शोधण्यात तुम्हाला मदत करण्यासाठी येथे आहे।`,
      Tamil: `வணக்கம் ${name}! 👋 உங்கள் விருப்பத்திற்கும் ₹${budget} பட்ஜெட்டிற்கும் ஏற்ற சரியான உரிமையாளர் வாய்ப்பைக் கண்டுபிடிக்க நான் இங்கே உதவுகிறேன்.`,
      Telugu: `నమస్కారం ${name}! 👋 మీ ప్రాధాన్యతలు మరియు ₹${budget} బడ్జెట్ ఆధారంగా సరైన ఫ్రాంచైజీ అవకాశాన్ని కనుగొనడంలో మీకు సహాయం చేయడానికి నేను ఇక్కడ ఉన్నాను.`
    };
    return greetings[language] || greetings["English"];
  };

  const getRecommendationMessage = (count, language = "English") => {
    const messages = {
      English: `Perfect! Based on your preferences, I found ${count} franchise opportunities that match your criteria. Here are my top recommendations:`,
      Hindi: `बढ़िया! आपकी पसंद के आधार पर, मुझे ${count} फ्रैंचाइज़ी अवसर मिले जो आपके मानदंडों से मेल खाते हैं। यहाँ मेरी शीर्ष सिफारिशें हैं:`,
      Gujarati: `સંપૂર્ણ! તમારી પસંદગીના આધારે, મને ${count} ફ્રેન્ચાઇઝ તકો મળી જે તમારા માપદંડ સાથે મેળ ખાય છે. અહીં મારી ટોચની ભલામણો છે:`,
      Marathi: `परिपूर्ण! तुमच्या पसंतीनुसार, मला ${count} फ्रँचायझी संधी सापडल्या ज्या तुमच्या निकषांशी जुळतात. येथे माझ्या टॉप शिफारसी आहेत:`,
      Tamil: `சரியாக! உங்கள் விருப்பங்களின் அடிப்படையில், உங்கள் தேவைகளுக்கு பொருந்தும் ${count} உரிமையாளர் வாய்ப்புகளை நான் கண்டேன். இதோ எனது சிறந்த பரிந்துரைகள்:`,
      Telugu: `పర్ఫెక్ట్! మీ ప్రాధాన్యతల ఆధారంగా, మీ ప్రమాణాలతో సరిపోయే ${count} ఫ్రాంచైజీ అవకాశాలు నేను కనుగొన్నాను. ఇదిగో నా టాప్ సిఫార్సులు:`
    };
    return messages[language] || messages["English"];
  };

  const getNoMatchMessage = (language = "English") => {
    const messages = {
      English: `I couldn't find exact matches for your criteria, but don't worry! Our team will review your preferences and get back to you with personalized recommendations within 24 hours.\n\nIn the meantime, you can browse all available franchises on our platform.`,
      Hindi: `मुझे आपके मानदंडों के लिए सटीक मेल नहीं मिला, लेकिन चिंता न करें! हमारी टीम आपकी पसंद की समीक्षा करेगी और 24 घंटों के भीतर व्यक्तिगत सिफारिशों के साथ आपसे संपर्क करेगी।\n\nइस बीच, आप हमारे प्लेटफ़ॉर्म पर सभी उपलब्ध फ्रैंचाइज़ी ब्राउज़ कर सकते हैं।`,
      Gujarati: `મને તમારા માપદંડ માટે ચોક્કસ મેળ મળી શક્યા નથી, પરંતુ ચિંતા કરશો નહીં! અમારી ટીમ તમારી પસંદગીઓની સમીક્ષા કરશે અને 24 કલાકની અંદર વ્યક્તિગત ભલામણો સાથે તમારો સંપર્ક કરશે.\n\nમધ્યસ્થ સમયે, તમે અમારા પ્લેટફોર્મ પર ઉપલબ્ધ તમામ ફ્રેન્ચાઇઝ બ્રાઉઝ કરી શકો છો.`,
      Marathi: `मला तुमच्या निकषांसाठी अचूक जुळणी सापडली नाही, पण काळजी करू नका! आमची टीम तुमच्या पसंतींचे पुनरावलोकन करेल आणि 24 तासांच्या आत वैयक्तिक शिफारशींसह तुमच्याशी संपर्क साधेल.\n\nदरम्यान, तुम्ही आमच्या प्लॅटफॉर्मवर उपलब्ध सर्व फ्रँचायझी ब्राउझ करू शकता.`,
      Tamil: `உங்கள் தேவைகளுக்கு சரியான பொருத்தங்கள் எனக்கு கிடைக்கவில்லை, ஆனால் கவலைப்பட வேண்டாம்! எங்கள் குழு உங்கள் விருப்பங்களை மதிப்பாய்வு செய்து 24 மணி நேரத்திற்குள் தனிப்பயன் பரிந்துரைகளுடன் உங்களைத் தொடர்பு கொள்ளும்.\n\nஇதற்கிடையில், எங்கள் தளத்தில் கிடைக்கும் அனைத்து உரிமையாளர்களையும் நீங்கள் பார்க்கலாம்.`,
      Telugu: `మీ ప్రమాణాలకు సరిగ్గా సరిపోయేవి నాకు కనిపించలేదు, కానీ చింతించకండి! మా బృందం మీ ప్రాధాన్యతలను సమీక్షించి 24 గంటల్లో వ్యక్తిగత సిఫార్సులతో మిమ్మల్ని సంప్రదిస్తుంది.\n\nఈ మధ్యకాలంలో, మీరు మా ప్లాట్‌ఫారమ్‌లో అందుబాటులో ఉన్న అన్ని ఫ్రాంచైజీలను బ్రౌజ్ చేయవచ్చు.`
    };
    return messages[language] || messages["English"];
  };

  const getButtonText = (buttonType, language = "English") => {
    const texts = {
      viewDetails: {
        English: "View Details & Inquire",
        Hindi: "विवरण देखें और पूछताछ करें",
        Gujarati: "વિગતો જુઓ અને પૂછપરછ કરો",
        Marathi: "तपशील पहा आणि चौकशी करा",
        Tamil: "விவரங்களைப் பார்க்கவும் மற்றும் விசாரிக்கவும்",
        Telugu: "వివరాలు చూడండి మరియు విచారించండి"
      },
      browseAll: {
        English: "Browse All Franchises",
        Hindi: "सभी फ्रैंचाइज़ी ब्राउज़ करें",
        Gujarati: "તમામ ફ્રેન્ચાઇઝ બ્રાઉઝ કરો",
        Marathi: "सर्व फ्रँचायझी ब्राउझ करा",
        Tamil: "அனைத்து உரிமையாளர்களையும் பார்க்கவும்",
        Telugu: "అన్ని ఫ్రాంచైజీలను బ్రౌజ్ చేయండి"
      },
      opensInNewTab: {
        English: "Opens in new tab",
        Hindi: "नए टैब में खुलता है",
        Gujarati: "નવા ટેબમાં ખુલે છે",
        Marathi: "नवीन टॅबमध्ये उघडते",
        Tamil: "புதிய தாவலில் திறக்கிறது",
        Telugu: "కొత్త ట్యాబ్‌లో తెరుచుకుంటుంది"
      }
    };
    return texts[buttonType]?.[language] || texts[buttonType]?.["English"] || "";
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
      logger.error("Error saving chat lead:", error);
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
        },
        Gujarati: {
          question: "ફ્રેન્ચાઇઝ રોકાણ માટે તમને કયા ઉદ્યોગમાં સૌથી વધુ રસ છે?",
          options: [
            { key: "food", label: "ખોરાક અને પીણાં", description: "રેસ્ટોરન્ટ, કાફે, ઝડપી સેવા" },
            { key: "retail", label: "રિટેલ", description: "કપડાં, ઇલેક્ટ્રોનિક્સ, ગ્રાહક ચીજવસ્તુઓ" },
            { key: "healthcare", label: "આરોગ્યસેવા", description: "ક્લિનિક, વેલનેસ સેન્ટર, ફાર્મસી" },
            { key: "education", label: "શિક્ષણ", description: "કોચિંગ, તાલીમ, શાળાઓ" },
            { key: "fitness", label: "ફિટનેસ", description: "જિમ, યોગ સ્ટુડિયો, રમતો" },
            { key: "beauty", label: "સૌંદર્ય અને કલ્યાણ", description: "સલૂન, સ્પા, સૌંદર્ય સેવાઓ" },
            { key: "services", label: "સેવાઓ", description: "સફાઈ, સમારકામ, પરામર્શ" },
            { key: "other", label: "અન્ય", description: "અન્ય તકોનું અન્વેષણ કરો" }
          ]
        },
        Marathi: {
          question: "फ्रँचायझी गुंतवणुकीसाठी तुम्हाला कोणत्या उद्योगात सर्वाधिक रस आहे?",
          options: [
            { key: "food", label: "अन्न आणि पेय", description: "रेस्टॉरंट, कॅफे, द्रुत सेवा" },
            { key: "retail", label: "किरकोळ", description: "कपडे, इलेक्ट्रॉनिक्स, ग्राहक वस्तू" },
            { key: "healthcare", label: "आरोग्यसेवा", description: "क्लिनिक, वेलनेस सेंटर, फार्मसी" },
            { key: "education", label: "शिक्षण", description: "कोचिंग, प्रशिक्षण, शाळा" },
            { key: "fitness", label: "फिटनेस", description: "जिम, योग स्टुडिओ, खेळ" },
            { key: "beauty", label: "सौंदर्य आणि निरोगीपणा", description: "सलून, स्पा, सौंदर्य सेवा" },
            { key: "services", label: "सेवा", description: "स्वच्छता, दुरुस्ती, सल्लामसलत" },
            { key: "other", label: "इतर", description: "इतर संधींचा शोध घ्या" }
          ]
        },
        Tamil: {
          question: "உரிமையாளர் முதலீட்டிற்கு எந்தத் துறை உங்களுக்கு அதிக ஆர்வமாக உள்ளது?",
          options: [
            { key: "food", label: "உணவு மற்றும் பானம்", description: "உணவகங்கள், கஃபே, விரைவு சேவை" },
            { key: "retail", label: "சில்லறை", description: "ஆடை, மின்னணுவியல், நுகர்வோர் பொருட்கள்" },
            { key: "healthcare", label: "சுகாதாரம்", description: "மருத்துவமனைகள், வெல்னெஸ் மையங்கள், மருந்தகங்கள்" },
            { key: "education", label: "கல்வி", description: "பயிற்சி, பயிற்சி மையங்கள், பள்ளிகள்" },
            { key: "fitness", label: "உடற்பயிற்சி", description: "ஜிம், யோகா ஸ்டுடியோ, விளையாட்டு" },
            { key: "beauty", label: "அழகு மற்றும் ஆரோக்கியம்", description: "சலூன்கள், ஸ்பா, அழகு சேவைகள்" },
            { key: "services", label: "சேவைகள்", description: "சுத்தம், பழுதுபார்த்தல், ஆலோசனை" },
            { key: "other", label: "மற்றவை", description: "பிற வாய்ப்புகளை ஆராயுங்கள்" }
          ]
        },
        Telugu: {
          question: "ఫ్రాంచైజీ పెట్టుబడికి మీకు ఏ పరిశ్రమలో ఎక్కువ ఆసక్తి ఉంది?",
          options: [
            { key: "food", label: "ఆహారం మరియు పానీయాలు", description: "రెస్టారెంట్లు, కేఫ్‌లు, త్వరిత సేవ" },
            { key: "retail", label: "రిటైల్", description: "వస్త్రాలు, ఎలక్ట్రానిక్స్, వినియోగదారు వస్తువులు" },
            { key: "healthcare", label: "ఆరోగ్య సంరక్షణ", description: "క్లినిక్‌లు, వెల్‌నెస్ సెంటర్లు, ఫార్మసీలు" },
            { key: "education", label: "విద్య", description: "కోచింగ్, శిక్షణ, పాఠశాలలు" },
            { key: "fitness", label: "ఫిట్‌నెస్", description: "జిమ్‌లు, యోగా స్టూడియోలు, క్రీడలు" },
            { key: "beauty", label: "అందం మరియు ఆరోగ్యం", description: "సలూన్లు, స్పాలు, అందం సేవలు" },
            { key: "services", label: "సేవలు", description: "శుభ్రపరచడం, మరమ్మత్తు, సలహా" },
            { key: "other", label: "ఇతర", description: "ఇతర అవకాశాలను అన్వేషించండి" }
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
        },
        Gujarati: {
          question: "તમારું વ્યવસાયિક અનુભવ સ્તર શું છે?",
          options: [
            { key: "none", label: "કોઈ વ્યવસાયિક અનુભવ નથી", description: "પ્રથમ વખત ઉદ્યોગસાહસિક" },
            { key: "some", label: "થોડો વ્યવસાયિક અનુભવ", description: "વ્યવસાયમાં 1-3 વર્ષ" },
            { key: "experienced", label: "અનુભવી", description: "3+ વર્ષ વ્યવસાય ચલાવવાનો અનુભવ" },
            { key: "franchise", label: "ફ્રેન્ચાઇઝ અનુભવ", description: "અગાઉ ફ્રેન્ચાઇઝના માલિક હતા" }
          ]
        },
        Marathi: {
          question: "तुमचा व्यावसायिक अनुभव स्तर काय आहे?",
          options: [
            { key: "none", label: "व्यावसायिक अनुभव नाही", description: "प्रथम वेळ उद्योजक" },
            { key: "some", label: "काही व्यावसायिक अनुभव", description: "व्यवसायात 1-3 वर्षे" },
            { key: "experienced", label: "अनुभवी", description: "3+ वर्षे व्यवसाय चालवण्याचा अनुभव" },
            { key: "franchise", label: "फ्रँचायझी अनुभव", description: "पूर्वी फ्रँचायझीचे मालक होते" }
          ]
        },
        Tamil: {
          question: "உங்கள் வணிக அனுபவ நிலை என்ன?",
          options: [
            { key: "none", label: "வணிக அனுபவம் இல்லை", description: "முதல் முறையாக தொழில்முனைவோர்" },
            { key: "some", label: "சில வணிக அனுபவம்", description: "வணிகத்தில் 1-3 ஆண்டுகள்" },
            { key: "experienced", label: "அனுபவம் வாய்ந்த", description: "3+ ஆண்டுகள் வணிகம் நடத்திய அனுபவம்" },
            { key: "franchise", label: "உரிமையாளர் அனுபவம்", description: "முன்பு உரிமையாளர் உடைமையாளர்" }
          ]
        },
        Telugu: {
          question: "మీ వ్యాపార అనుభవ స్థాయి ఏమిటి?",
          options: [
            { key: "none", label: "వ్యాపార అనుభవం లేదు", description: "మొదటిసారి వ్యవస్థాపకుడు" },
            { key: "some", label: "కొంత వ్యాపార అనుభవం", description: "వ్యాపారంలో 1-3 సంవత్సరాలు" },
            { key: "experienced", label: "అనుభవజ్ఞుడు", description: "3+ సంవత్సరాలు వ్యాపారం నడిపిన అనుభవం" },
            { key: "franchise", label: "ఫ్రాంచైజీ అనుభవం", description: "గతంలో ఫ్రాంచైజీలను కలిగి ఉన్నారు" }
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
        },
        Gujarati: {
          question: "આ રોકાણ માટે તમારી જોખમ સહનશીલતા શું છે?",
          options: [
            { key: "low", label: "ઓછું જોખમ", description: "સ્થાપિત, સુરક્ષિત ફ્રેન્ચાઇઝ પસંદ કરો છો" },
            { key: "moderate", label: "મધ્યમ જોખમ", description: "જોખમ અને વળતરનો સંતુલિત અભિગમ" },
            { key: "high", label: "ઉચ્ચ જોખમ", description: "વધુ વળતર માટે જોખમ લેવા તૈયાર" }
          ]
        },
        Marathi: {
          question: "या गुंतवणुकीसाठी तुमची जोखीम सहनशीलता काय आहे?",
          options: [
            { key: "low", label: "कमी जोखीम", description: "प्रस्थापित, सुरक्षित फ्रँचायझी पसंद करतात" },
            { key: "moderate", label: "मध्यम जोखीम", description: "जोखीम आणि परताव्याचा संतुलित दृष्टिकोन" },
            { key: "high", label: "उच्च जोखीम", description: "जास्त परताव्यासाठी जोखीम घेण्यास तयार" }
          ]
        },
        Tamil: {
          question: "இந்த முதலீட்டிற்கான உங்கள் ரிஸ்க் டாலரன்ஸ் என்ன?",
          options: [
            { key: "low", label: "குறைந்த ரிஸ்க்", description: "நிறுவப்பட்ட, பாதுகாப்பான உரிமையாளர்களை விரும்புகிறேன்" },
            { key: "moderate", label: "மிதமான ரிஸ்க்", description: "ரிஸ்க் மற்றும் வருமானத்தின் சமநிலை அணுகுமுறை" },
            { key: "high", label: "அதிக ரிஸ்க்", description: "அதிக வருமானத்திற்காக ரிஸ்க் எடுக்க தயாராக உள்ளேன்" }
          ]
        },
        Telugu: {
          question: "ఈ పెట్టుబడికి మీ రిస్క్ టాలరెన్స్ ఏమిటి?",
          options: [
            { key: "low", label: "తక్కువ రిస్క్", description: "స్థాపితమైన, సురక్షితమైన ఫ్రాంచైజీలను ఇష్టపడతారు" },
            { key: "moderate", label: "మితమైన రిస్క్", description: "రిస్క్ మరియు రిటర్న్‌ల సమతుల్య విధానం" },
            { key: "high", label: "అధిక రిస్క్", description: "ఎక్కువ రిటర్న్‌ల కోసం రిస్క్ తీసుకోవడానికి సిద్ధంగా ఉన్నారు" }
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
        },
        Gujarati: {
          question: "તમે તમારી ફ્રેન્ચાઇઝ ક્યારે શરૂ કરવા માંગો છો?",
          options: [
            { key: "asap", label: "શક્ય તેટલી જલ્દી", description: "તરત જ શરૂ કરવા માટે તૈયાર" },
            { key: "3months", label: "3 મહિનામાં", description: "3 મહિનામાં શરૂ કરવાની યોજના" },
            { key: "6months", label: "6 મહિનામાં", description: "6 મહિનામાં શરૂ કરવાની યોજના" },
            { key: "exploring", label: "ફક્ત શોધ રહ્યા છીએ", description: "હજુ પણ વિકલ્પોનું સંશોધન કરી રહ્યા છીએ" }
          ]
        },
        Marathi: {
          question: "तुम्ही तुमचे फ्रँचायझी कधी सुरू करू इच्छिता?",
          options: [
            { key: "asap", label: "शक्य तितक्या लवकर", description: "लगेच सुरू करण्यासाठी तयार" },
            { key: "3months", label: "3 महिन्यांत", description: "3 महिन्यांत सुरू करण्याची योजना" },
            { key: "6months", label: "6 महिन्यांत", description: "6 महिन्यांत सुरू करण्याची योजना" },
            { key: "exploring", label: "फक्त शोधत आहे", description: "अजूनही पर्यायांवर संशोधन करत आहे" }
          ]
        },
        Tamil: {
          question: "உங்கள் உரிமையாளர் எப்போது தொடங்க விரும்புகிறீர்கள்?",
          options: [
            { key: "asap", label: "முடிந்தவரை விரைவில்", description: "உடனடியாக தொடங்க தயாராக உள்ளேன்" },
            { key: "3months", label: "3 மாதங்களுக்குள்", description: "3 மாதங்களில் தொடங்க திட்டமிட்டுள்ளேன்" },
            { key: "6months", label: "6 மாதங்களுக்குள்", description: "6 மாதங்களில் தொடங்க திட்டமிட்டுள்ளேன்" },
            { key: "exploring", label: "வெறும் ஆராய்ச்சி", description: "இன்னும் விருப்பங்களை ஆராய்ந்து வருகிறேன்" }
          ]
        },
        Telugu: {
          question: "మీరు మీ ఫ్రాంచైజీని எప్పుడు ప్రారంభించాలనుకుంటున్నారు?",
          options: [
            { key: "asap", label: "వీలైనంత త్వరగా", description: "వెంటనే ప్రారంభించడానికి సిద్ధంగా ఉన్నారు" },
            { key: "3months", label: "3 నెలల్లో", description: "3 నెలల్లో ప్రారంభించే ప్లాన్" },
            { key: "6months", label: "6 నెలల్లో", description: "6 నెలల్లో ప్రారంభించే ప్లాన్" },
            { key: "exploring", label: "కేవలం అన్వేషిస్తున్నాను", description: "ఇంకా ఎంపికలను పరిశోధిస్తున్నాను" }
          ]
        }
      }
    };

    return questions[step]?.[language] || questions[step]?.["English"];
  };

  const handleStartChat = (info) => {
    setUserInfo(info);
    const questionData = getQuestionData(1, info.language);
    const greeting = getGreeting(info.name, info.budget, info.language);
    
    setMessages([
      {
        id: 1,
        sender: "bot",
        timestamp: new Date(),
        text: `${greeting}\n\n${questionData.question}`,
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
            const recommendationMsg = getRecommendationMessage(matches.length, userInfo.language);
            setMessages((prev) => [
              ...prev,
              {
                id: prev.length + 1,
                text: recommendationMsg,
                sender: "bot",
                timestamp: new Date(),
                recommendations: matches
              },
            ]);
          } else {
            const noMatchMsg = getNoMatchMessage(userInfo.language);
            setMessages((prev) => [
              ...prev,
              {
                id: prev.length + 1,
                text: noMatchMsg,
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
      logger.error("Error processing response:", error);
      setIsLoading(false);
    }
  };

  const handleBrandClick = (brand) => {
    // Generate brand URL using utility function
    const brandPath = getBrandUrl(brand);
    
    // Open brand page in new window/tab instead of navigating away
    const brandUrl = `${window.location.origin}${brandPath}`;
    window.open(brandUrl, '_blank', 'noopener,noreferrer');
    
    // Don't close the chat - keep it open so user can see chat content
    // setOpen(false); // Removed this line
  };

  const handleClose = () => {
    // Save conversation history before closing
    if (messages.length > 0) {
      saveConversation(messages, userInfo);
    }
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
      {/* Hide FAB on mobile - use bottom nav Chat tab instead */}
      <Fab
        color="primary"
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1300,
          width: 64,
          height: 64,
          display: { xs: 'none', md: 'flex' }, // Hide on mobile (xs, sm), show on desktop (md+)
        }}
        onClick={() => setOpen(true)}
      >
        <Badge badgeContent={0} color="error" variant="dot" invisible>
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
            background: "linear-gradient(135deg, #5a76a9 0%, #93c5fd 100%)",
            color: "white"
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar sx={{ mr: 2, backgroundColor: "rgba(255,255,255,0.2)" }}>
              <Support />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                ikama Assistant
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
          <IconButton onClick={handleClose} sx={{ color: "white" }} aria-label="Close chatbot">
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
                                border: index === 0 ? "2px solid #5a76a9" : "1px solid #e0e0e0"
                              }}
                              onClick={() => handleBrandClick(brand)}
                            >
                              {index === 0 && (
                                <Box sx={{ 
                                  background: "linear-gradient(135deg, #5a76a9, #93c5fd)",
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
                                  {getButtonText('viewDetails', userInfo?.language)}
                                </Button>
                                <Typography variant="caption" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                  <Launch fontSize="inherit" />
                                  {getButtonText('opensInNewTab', userInfo?.language)}
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
                          {getButtonText('browseAll', userInfo?.language)}
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
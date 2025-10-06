import React, { useState, useRef, useEffect } from "react";
import {
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  Paper,
  IconButton,
  Divider,
  CircularProgress,
  Chip,
} from "@mui/material";
import { Chat as ChatIcon, Close, Send, Support } from "@mui/icons-material";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import UserInfoForm from "./UserInfoForm";
import { db } from "../../firebase/firebase";
import { collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";

// Use environment variables for Firebase Function URLs
const SEND_MESSAGE_URL = import.meta.env.VITE_FIREBASE_SEND_MESSAGE_URL || "https://us-central1-franchise-2d12e.cloudfunctions.net/sendMessage";
const START_CHAT_URL = import.meta.env.VITE_FIREBASE_START_CHAT_URL || "https://us-central1-franchise-2d12e.cloudfunctions.net/startChat";

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [chatPhase, setChatPhase] = useState("pre-chat");
  const [userInfo, setUserInfo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestionStep, setCurrentQuestionStep] = useState(1);
  const [userResponses, setUserResponses] = useState({});
  const [brandsData, setBrandsData] = useState([]);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch approved brands when component mounts
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

  const saveChatLead = async (responses, userInfo) => {
    try {
      const chatLeadsCollection = collection(db, "chatLeads");
      const leadData = {
        userInfo: userInfo,
        responses: responses,
        createdAt: serverTimestamp(),
        status: "new",
        source: "chatbot"
      };
      
      const docRef = await addDoc(chatLeadsCollection, leadData);
      return docRef.id;
    } catch (error) {
      console.error("Error saving chat lead:", error);
    }
  };

  const callFirebaseFunction = async (
    message,
    chatHistory = [],
    systemPrompt = ""
  ) => {
    try {
      const response = await fetch(SEND_MESSAGE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
          chatHistory: chatHistory,
          systemPrompt: systemPrompt,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      return data.response;
    } catch (error) {
      console.error("Error calling Start Chat Function:", error);
      console.error("error", error);
      throw error;
    }
  };

  const getResponseOptions = (step, language) => {
    const options = {
      1: {
        English: [
          {
            key: "A",
            label: "Food & Beverage",
            description: "Restaurants, Cafes, Food Delivery",
          },
          {
            key: "B",
            label: "Retail",
            description: "Clothing, Electronics, General Stores",
          },
          {
            key: "C",
            label: "Education & Training",
            description: "Coaching Centers, Skill Development",
          },
          {
            key: "D",
            label: "Healthcare & Wellness",
            description: "Clinics, Fitness, Beauty Salons",
          },
          {
            key: "E",
            label: "Services",
            description: "Cleaning, Repair, Consulting",
          },
        ],
        Hindi: [
          {
            key: "A",
            label: "खाद्य और पेय",
            description: "रेस्टोरेंट, कैफे, खाना डिलीवरी",
          },
          {
            key: "B",
            label: "रिटेल",
            description: "कपड़े, इलेक्ट्रॉनिक्स, जनरल स्टोर",
          },
          {
            key: "C",
            label: "शिक्षा और प्रशिक्षण",
            description: "कोचिंग सेंटर, कौशल विकास",
          },
          {
            key: "D",
            label: "स्वास्थ्य और कल्याण",
            description: "क्लिनिक, फिटनेस, ब्यूटी सैलून",
          },
          { key: "E", label: "सेवाएं", description: "सफाई, मरम्मत, परामर्श" },
        ],
        Gujarati: [
          {
            key: "A",
            label: "ખાદ્ય અને પીણા",
            description: "રેસ્ટોરન્ટ, કાફે, ફૂડ ડિલિવરી",
          },
          {
            key: "B",
            label: "રિટેલ",
            description: "કપડાં, ઈલેક્ટ્રોનિક્સ, જનરલ સ્ટોર",
          },
          {
            key: "C",
            label: "શિક્ષણ અને તાલીમ",
            description: "કોચિંગ સેન્ટર, કૌશલ્ય વિકાસ",
          },
          {
            key: "D",
            label: "આરોગ્ય અને કલ્યાણ",
            description: "ક્લિનિક, ફિટનેસ, બ્યુટી સલૂન",
          },
          { key: "E", label: "સેવાઓ", description: "સફાઈ, સમારકામ, સલાહ" },
        ],
      },
      2: {
        English: [
          {
            key: "A",
            label: "Beginner",
            description: "No previous business experience",
          },
          {
            key: "B",
            label: "Some Experience",
            description: "1-3 years business experience",
          },
          {
            key: "C",
            label: "Experienced",
            description: "3+ years business experience",
          },
          {
            key: "D",
            label: "Expert",
            description: "Extensive business/franchise experience",
          },
        ],
        Hindi: [
          {
            key: "A",
            label: "शुरुआती",
            description: "कोई पिछला व्यावसायिक अनुभव नहीं",
          },
          {
            key: "B",
            label: "कुछ अनुभव",
            description: "1-3 साल का व्यावसायिक अनुभव",
          },
          {
            key: "C",
            label: "अनुभवी",
            description: "3+ साल का व्यावसायिक अनुभव",
          },
          {
            key: "D",
            label: "विशेषज्ञ",
            description: "व्यापक व्यावसायिक/फ्रैंचाइज़ी अनुभव",
          },
        ],
        Gujarati: [
          {
            key: "A",
            label: "શરૂઆતી",
            description: "કોઈ અગાઉનો બિઝનેસ અનુભવ નથી",
          },
          {
            key: "B",
            label: "થોડો અનુભવ",
            description: "1-3 વર્ષનો બિઝનેસ અનુભવ",
          },
          { key: "C", label: "અનુભવી", description: "3+ વર્ષનો બિઝનેસ અનુભવ" },
          {
            key: "D",
            label: "નિષ્ણાત",
            description: "વ્યાપક બિઝનેસ/ફ્રેન્ચાઇઝ અનુભવ",
          },
        ],
      },
      3: {
        English: [
          {
            key: "A",
            label: "Low Risk",
            description: "Prefer safe, established franchises",
          },
          {
            key: "B",
            label: "Moderate Risk",
            description: "Balanced approach to risk and return",
          },
          {
            key: "C",
            label: "High Risk",
            description: "Willing to take risks for higher returns",
          },
        ],
        Hindi: [
          {
            key: "A",
            label: "कम जोखिम",
            description: "सुरक्षित, स्थापित फ्रैंचाइज़ी पसंद",
          },
          {
            key: "B",
            label: "मध्यम जोखिम",
            description: "जोखिम और रिटर्न का संतुलित दृष्टिकोण",
          },
          {
            key: "C",
            label: "उच्च जोखिम",
            description: "अधिक रिटर्न के लिए जोखिम लेने को तैयार",
          },
        ],
        Gujarati: [
          {
            key: "A",
            label: "ઓછું જોખમ",
            description: "સુરક્ષિત, સ્થાપિત ફ્રેન્ચાઇઝ પસંદ",
          },
          {
            key: "B",
            label: "મધ્યમ જોખમ",
            description: "જોખમ અને વળતરનો સંતુલિત અભિગમ",
          },
          {
            key: "C",
            label: "વધુ જોખમ",
            description: "વધુ વળતર માટે જોખમ લેવા તૈયાર",
          },
        ],
      },
      4: {
        English: [
          {
            key: "A",
            label: "Quick Returns",
            description: "Want to see profits within 1-2 years",
          },
          {
            key: "B",
            label: "Long-term Growth",
            description: "Building wealth over 5+ years",
          },
          {
            key: "C",
            label: "Passive Income",
            description: "Steady income with minimal involvement",
          },
          {
            key: "D",
            label: "Active Business",
            description: "Want to be actively involved daily",
          },
        ],
        Hindi: [
          {
            key: "A",
            label: "त्वरित रिटर्न",
            description: "1-2 साल में मुनाफा देखना चाहते हैं",
          },
          {
            key: "B",
            label: "दीर्घकालिक विकास",
            description: "5+ साल में संपत्ति निर्माण",
          },
          {
            key: "C",
            label: "निष्क्रिय आय",
            description: "न्यूनतम भागीदारी के साथ स्थिर आय",
          },
          {
            key: "D",
            label: "सक्रिय व्यवसाय",
            description: "दैनिक रूप से सक्रिय रूप से शामिल होना चाहते हैं",
          },
        ],
        Gujarati: [
          {
            key: "A",
            label: "ઝડપી વળતર",
            description: "1-2 વર્ષમાં નફો જોવા માંગો છો",
          },
          {
            key: "B",
            label: "લાંબા ગાળાની વૃદ્ધિ",
            description: "5+ વર્ષમાં સંપત્તિ નિર્માણ",
          },
          {
            key: "C",
            label: "નિષ્ક્રિય આવક",
            description: "ન્યૂનતમ સંડોવણી સાથે સ્થિર આવક",
          },
          {
            key: "D",
            label: "સક્રિય વ્યવસાય",
            description: "દરરોજ સક્રિય રીતે સંડોવાયેલા રહેવા માંગો છો",
          },
        ],
      },
    };

    const languageOptions =
      options[step]?.[language] || options[step]?.["English"] || [];
    return languageOptions;
  };

  const createSystemPrompt = (info) => {
    // Format brand data for AI context
    const brandContext = brandsData.length > 0 ? `

**AVAILABLE FRANCHISE BRANDS:**
Here are the currently active and approved franchise brands in our platform:

${brandsData.map((brand, index) => `
${index + 1}. **${brand.brandName}**
   - **Category:** ${brand.brandCategory || 'Not specified'}
   - **Investment Required:** ₹${brand.brandInvestmentRange || 'Contact for details'}
   - **Franchise Fee:** ₹${brand.brandFranchiseFee || 'Contact for details'}
   - **ROI Timeline:** ${brand.brandROITimeline || 'Not specified'}
   - **Training Provided:** ${brand.brandTrainingProvided ? 'Yes' : 'No'}
   - **Marketing Support:** ${brand.brandMarketingSupport ? 'Yes' : 'No'}
   - **Locations Available:** ${brand.brandFranchiseLocations?.length || 0} cities
   - **About:** ${brand.brandDescription?.substring(0, 150) || 'Contact for more details'}...`).join('')}

**BRAND RECOMMENDATION GUIDELINES:**
- After collecting user preferences (steps 1-4), recommend 2-3 brands that best match their:
  * Budget range
  * Preferred category
  * Experience level
  * Risk tolerance
  * Location preferences
- Always mention specific brand names from the above list
- Explain WHY each brand matches their criteria
- Include investment details and ROI expectations` : `

**BRAND DATA STATUS:** No active brands are currently available in the system. Please inform the user to check back later or contact support.`;

    return `You are "FranchiseHub Assistant," a specialized AI expert in Indian franchise opportunities. Your goal is to provide helpful, accurate, and well-formatted information to users looking to invest in a franchise in India.

**User's Profile:**
- **Preferred Language:** ${info.language}
- **Preferred Location:** ${info.location}, India
- **Budget:** ₹${Number(info.budget).toLocaleString("en-IN")}${brandContext}

**CRITICAL INSTRUCTIONS:**
1. **RESPOND ONLY IN ${info.language.toUpperCase()}:** All your responses must be in ${
      info.language
    }. If the user selected Hindi, respond in Hindi. If Gujarati, respond in Gujarati, etc.

2. **ASK ONE QUESTION AT A TIME:** Never ask multiple questions in a single response. Ask only one focused question and wait for the user's answer before proceeding.

3. **FRANCHISE FOCUS ONLY:** ONLY discuss topics related to buying, investing in, or managing franchises in India. If the user asks about anything else, politely redirect them back to franchise discussions in ${
      info.language
    }.

4. **QUESTION SEQUENCE:** Follow this sequence when gathering information:
   - Step 1: Ask about business category interest (food, retail, education, etc.)
   - Step 2: Ask about business experience level
   - Step 3: Ask about risk tolerance
   - Step 4: Ask about investment timeline/goals
   - Step 5: Provide tailored franchise recommendations from our available brands

5. **USE USER CONTEXT:** Always consider the user's location (${
      info.location
    }) and budget (₹${Number(info.budget).toLocaleString(
      "en-IN"
    )}) in your responses.

6. **PROVIDE SPECIFIC RECOMMENDATIONS:** When making recommendations, ONLY suggest brands from the "AVAILABLE FRANCHISE BRANDS" list above. Match them based on the user's stated preferences.

7. **FORMAT RESPONSES:** Use Markdown formatting for clarity. Use lists, bold text, and italics appropriately.

Remember: You must respond in ${
      info.language
    } and ask only ONE question per response. After step 4, provide specific brand recommendations from our platform.`;
  };

  const getInitialQuestion = (language) => {
    const questions = {
      English:
        "What type of business are you most interested in? Please choose one option below:",
      Hindi:
        "आप किस प्रकार के व्यवसाय में सबसे अधिक रुचि रखते हैं? कृपया नीचे से एक विकल्प चुनें:",
      Gujarati:
        "તમને કયા પ્રકારના વ્યવસાયમાં સૌથી વધુ રસ છે? કૃપા કરીને નીચેથી એક વિકલ્પ પસંદ કરો:",
      Marathi:
        "तुम्हाला कोणत्या प्रकारच्या व्यवसायात सर्वाधिक रस आहे? कृपया खालीलपैकी एक पर्याय निवडा:",
      Tamil:
        "நீங்கள் எந்த வகையான வணிகத்தில் அதிக ஆர்வம் கொண்டுள்ளீர்கள்? கீழே உள்ள விருப்பங்களில் ஒன்றை தேர்ந்தெடுக்கவும்:",
      Telugu:
        "మీరు ఏ రకమైన వ్యాపారంలో ఎక్కువ ఆసక్తి కలిగి ఉన్నారు? దయచేసి క్రింది ఎంపికలలో ఒకటి ఎంచుకోండి:",
      Kannada:
        "ನೀವು ಯಾವ ರೀತಿಯ ವ್ಯಾಪಾರದಲ್ಲಿ ಹೆಚ್ಚು ಆಸಕ್ತಿ ಹೊಂದಿದ್ದೀರಿ? ದಯವಿಟ್ಟು ಕೆಳಗಿನ ಆಯ್ಕೆಗಳಲ್ಲಿ ಒಂದನ್ನು ಆರಿಸಿ:",
      Bengali:
        "আপনি কোন ধরনের ব্যবসায় সবচেয়ে বেশি আগ্রহী? দয়া করে নিচের বিকল্পগুলি থেকে একটি বেছে নিন:",
      Malayalam:
        "നിങ്ങൾക്ക് ഏത് തരത്തിലുള്ള ബിസിനസിൽ ഏറ്റവും കൂടുതൽ താൽപ്പര്യമുണ്ട്? ദയവായി ചുവടെയുള്ള ഓപ്ഷനുകളിൽ നിന്ന് ഒന്ന് തിരഞ്ഞെടുക്കുക:",
      Punjabi:
        "ਤੁਸੀਂ ਕਿਸ ਕਿਸਮ ਦੇ ਕਾਰੋਬਾਰ ਵਿੱਚ ਸਭ ਤੋਂ ਵੱਧ ਦਿਲਚਸਪੀ ਰੱਖਦੇ ਹੋ? ਕਿਰਪਾ ਕਰਕੇ ਹੇਠਾਂ ਦਿੱਤੇ ਵਿਕਲਪਾਂ ਵਿੱਚੋਂ ਇੱਕ ਚੁਣੋ:",
    };

    return questions[language] || questions.English;
  };

  const handleStartChat = (info) => {
    setUserInfo(info);
    const systemPrompt = createSystemPrompt(info);
    const initialQuestion = getInitialQuestion(info.language);

    setMessages([
      {
        id: "system-prompt",
        role: "system",
        text: systemPrompt,
      },
      {
        id: 1,
        sender: "bot",
        timestamp: new Date(),
        text: initialQuestion,
      },
    ]);
    setChatPhase("chatting");
    setCurrentQuestionStep(1);
  };

  const handleChipResponse = async (option) => {
    const responseText = `${option.key}: ${option.label}`;

    const userMessage = {
      id: messages.length + 1,
      text: responseText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const systemPrompt = messages.find(
        (msg) => msg.id === "system-prompt"
      )?.text;
      const chatHistory = messages
        .filter((msg) => msg.id !== "system-prompt" && msg.sender !== "system")
        .slice(1)
        .map((msg) => ({
          role: msg.sender === "user" ? "user" : "model",
          parts: [{ text: msg.text }],
        }));

      const responseText_ai = await callFirebaseFunction(
        responseText,
        chatHistory,
        systemPrompt
      );

      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: responseText_ai,
          sender: "bot",
          timestamp: new Date(),
        },
      ]);

      if (currentQuestionStep < 4) {
        setCurrentQuestionStep((prev) => prev + 1);
      } else {
        // Moving to recommendation phase - update system prompt with latest brand data
        const updatedSystemPrompt = createSystemPrompt(userInfo);
        setMessages((prev) => 
          prev.map(msg => 
            msg.id === "system-prompt" 
              ? { ...msg, text: updatedSystemPrompt }
              : msg
          )
        );
        
        // Save chat lead with collected responses
        const finalResponses = {
          ...userResponses,
          [`step_${currentQuestionStep}`]: responseText,
        };
        await saveChatLead(finalResponses, userInfo);
        
        setChatPhase("free-chat");
      }

      setUserResponses((prev) => ({
        ...prev,
        [`step_${currentQuestionStep}`]: responseText,
      }));
    } catch (error) {
      const errorMessage =
        userInfo?.language === "Hindi"
          ? "क्षमा करें, मुझे कनेक्ट करने में समस्या हो रही है। कृपया बाद में पुनः प्रयास करें।"
          : userInfo?.language === "Gujarati"
          ? "માફ કરશો, મને કનેક્ટ કરવામાં મુશ્કેલી આવી રહી છે. કૃપા કરીને પછીથી ફરી પ્રયાસ કરો."
          : "I'm sorry, I'm having trouble connecting. Please try again later.";

      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: errorMessage,
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const systemPrompt = messages.find(
        (msg) => msg.id === "system-prompt"
      )?.text;
      const chatHistory = messages
        .filter((msg) => msg.id !== "system-prompt" && msg.sender !== "system")
        .slice(1)
        .map((msg) => ({
          role: msg.sender === "user" ? "user" : "model",
          parts: [{ text: msg.text }],
        }));

      const responseText = await callFirebaseFunction(
        inputMessage,
        chatHistory,
        systemPrompt
      );

      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: responseText,
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      const errorMessage =
        userInfo?.language === "Hindi"
          ? "क्षमा करें, मुझे कनेक्ट करने में समस्या हो रही है। कृपया बाद में पुनः प्रयास करें।"
          : userInfo?.language === "Gujarati"
          ? "માફ કરશો, મને કનેક્ટ કરવામાં મુશ્કેલી આવી રહી છે. કૃપા કરીને પછીથી ફરી પ્રયાસ કરો."
          : "I'm sorry, I'm having trouble connecting. Please try again later.";

      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: errorMessage,
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const currentOptions = getResponseOptions(
    currentQuestionStep,
    userInfo?.language || "English"
  );
  const showChips = chatPhase === "chatting" && currentQuestionStep <= 4;

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
        <ChatIcon />
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
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar sx={{ mr: 2, backgroundColor: "primary.main" }}>
              <Support />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                FranchiseHub Assistant
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Online now
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={handleClose}>
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
                {messages
                  .filter((msg) => msg.id !== "system-prompt")
                  .map((message) => (
                    <Box
                      key={message.id}
                      sx={{
                        display: "flex",
                        justifyContent:
                          message.sender === "user" ? "flex-end" : "flex-start",
                        mb: 2,
                      }}
                    >
                      <Paper
                        sx={{
                          p: 1.5,
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
                          overflowWrap: "break-word",
                        }}
                      >
                        <Box className="markdown-container">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {message.text}
                          </ReactMarkdown>
                        </Box>
                      </Paper>
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
                      <CircularProgress size={20} />
                    </Paper>
                  </Box>
                )}
                <div ref={chatEndRef} />
              </Box>

              <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
                {showChips && !isLoading ? (
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mb: 1, display: "block" }}
                    >
                      {userInfo?.language === "Hindi"
                        ? "एक विकल्प चुनें:"
                        : userInfo?.language === "Gujarati"
                        ? "એક વિકલ્પ પસંદ કરો:"
                        : "Choose an option:"}
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {currentOptions.map((option) => (
                        <Chip
                          key={option.key}
                          label={option.label}
                          onClick={() => handleChipResponse(option)}
                          color="primary"
                          variant="outlined"
                          sx={{
                            cursor: "pointer",
                            mb: 1,
                            "&:hover": {
                              backgroundColor: "primary.light",
                              color: "primary.main",
                            },
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder={
                        userInfo?.language === "Hindi"
                          ? "फ्रैंचाइज़ी के बारे में पूछें..."
                          : userInfo?.language === "Gujarati"
                          ? "ફ્રેન્ચાઇઝી વિશે પૂછો..."
                          : "Ask about franchises..."
                      }
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && !isLoading && handleSendMessage()
                      }
                      disabled={isLoading}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 25,
                        },
                      }}
                    />
                    <Button
                      variant="contained"
                      onClick={handleSendMessage}
                      disabled={isLoading || !inputMessage.trim()}
                      sx={{ minWidth: "auto", borderRadius: "50%", p: 1.5 }}
                    >
                      <Send />
                    </Button>
                  </Box>
                )}
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Chatbot;
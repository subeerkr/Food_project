import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  Box,
  IconButton,
  Paper,
  TextField,
  Typography,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';

// 1. MOVED OUTSIDE: Initialize this once, not on every render
const GEMINI_API_KEY =
  (typeof process !== 'undefined' && process.env && process.env.VITE_GEMINI_API_KEY) ||
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) ||
  (typeof window !== 'undefined' && window.__GEMINI_API_KEY__) ||
  '';

let genAI = null;
try {
  if (GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  }
} catch (err) {
  console.warn('GoogleGenerativeAI initialization failed:', err);
}

// 2. DEBUG LOGIC: Check available models
async function checkModels() {
  if (!genAI) return;
  try {
    const res = await genAI.listModels();
    const names = res.models.map(m => ({
      name: m.name,
      methods: m.supportedGenerationMethods
    }));
    console.log("AVAILABLE MODELS:", names);
  } catch (err) {
    console.error("Error listing models:", err);
  }
}

checkModels();

// 3. TEST RUN: Verify gemini-2.0-flash
async function runTest() {
  if (!genAI) return;
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent("Hello bhai");
    const response = await result.response;
    console.log("TEST RUN SUCCESS:", response.text());
  } catch (err) {
    console.error("TEST RUN ERROR:", err);
  }
}

runTest();

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm your Swagat Foods assistant. How can I help you today?",
      isBot: true,
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage;
    setInputMessage('');
    
    setMessages((prev) => [...prev, { text: userMessage, isBot: false }]);
    setIsTyping(true);

    try {
      if (!genAI) {
        throw new Error("Gemini AI is not configured. Please check your API key.");
      }

      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      
      const prompt = `You are a helpful assistant for "Swagat Foods", a premium Indian restaurant. 
      Answer the customer's query politely. 
      Customer query: ${userMessage}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      setMessages((prev) => [...prev, { text: text, isBot: true }]);
    } catch (err) {
      console.error("ChatBot Error:", err);
      
      setMessages((prev) => [...prev, { 
        text: "I'm sorry, I'm having trouble connecting right now. Please try again later.", 
        isBot: true 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="chat"
        onClick={handleOpen}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          backgroundColor: 'rgba(255, 111, 0, 0.9)',
          '&:hover': {
            backgroundColor: 'rgba(255, 111, 0, 1)',
            transform: 'scale(1.1) rotate(5deg)',
          },
          transition: 'all 0.3s ease-in-out',
          animation: 'bounce 2s infinite',
          '@keyframes bounce': {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-10px)' },
          },
        }}
      >
        <SmartToyIcon sx={{ fontSize: 30 }} />
      </Fab>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { height: '80vh', maxHeight: '600px' },
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2, backgroundColor: 'rgba(255, 111, 0, 0.1)' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={1}>
              <SmartToyIcon sx={{ color: 'rgba(255, 111, 0, 0.9)' }} />
              <Typography variant="h6">Swagat Foods Assistant</Typography>
            </Box>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 2 }}>
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
              {messages.map((message, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent: message.isBot ? 'flex-start' : 'flex-end',
                    alignItems: 'flex-start',
                    gap: 1,
                  }}
                >
                  {message.isBot && (
                    <SmartToyIcon sx={{ color: 'rgba(255, 111, 0, 0.9)', fontSize: 24, mt: 1 }} />
                  )}
                  <Paper
                    sx={{
                      p: 2,
                      maxWidth: '70%',
                      backgroundColor: message.isBot ? 'rgba(255, 111, 0, 0.1)' : 'primary.main',
                      color: message.isBot ? 'text.primary' : 'white',
                      borderRadius: message.isBot ? '0 8px 8px 8px' : '8px 0 8px 8px',
                    }}
                  >
                    <Typography>{message.text}</Typography>
                  </Paper>
                </Box>
              ))}
              {isTyping && (
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <SmartToyIcon sx={{ color: 'rgba(255, 111, 0, 0.9)', fontSize: 24 }} />
                  <Typography variant="body2" color="text.secondary">Assistant is typing...</Typography>
                </Box>
              )}
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <IconButton
                color="primary"
                onClick={handleSendMessage}
                sx={{
                  backgroundColor: 'rgba(255, 111, 0, 0.9)',
                  color: 'white',
                  '&:hover': { backgroundColor: 'rgba(255, 111, 0, 1)' },
                }}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChatBot;
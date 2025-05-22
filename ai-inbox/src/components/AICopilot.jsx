import {
  Help, History, Lightbulb, Psychology, Send, SentimentDissatisfied, SentimentSatisfied, SentimentVeryDissatisfied, SentimentVerySatisfied, SmartToy
} from '@mui/icons-material';
import {
  Avatar, Badge, Box, Button, Chip, Divider, IconButton, LinearProgress, List,
  ListItem,
  ListItemText, Paper, Tab, Tabs, TextField, Tooltip, Typography
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { aiSuggestions } from '../data/conversations';

const sentimentIcons = {
  positive: <SentimentVerySatisfied color="success" />,
  neutral: <SentimentSatisfied color="info" />,
  negative: <SentimentVeryDissatisfied color="error" />,
  mixed: <SentimentDissatisfied color="warning" />
};

export default function AICopilot({ conversationId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [sentiment, setSentiment] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (conversationId) {
      setIsLoading(true);
      // Simulate loading suggestions
      setTimeout(() => {
        setSuggestions(aiSuggestions[conversationId] || []);
        setMessages([{
          text: `I've analyzed this conversation. The customer seems to be requesting support with a return. How can I help you respond?`,
          sender: 'ai',
          type: 'analysis'
        }]);
        setSentiment('neutral');
        setIsLoading(false);
      }, 1500);
    } else {
      setMessages([{
        text: 'Select a conversation to get AI assistance',
        sender: 'ai',
        type: 'info'
      }]);
      setSuggestions([]);
      setSentiment(null);
    }
  }, [conversationId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (input.trim() === '') return;
    
    const userMessage = { text: input, sender: 'user' };
    setMessages([...messages, userMessage]);
    setInput('');
    setIsLoading(true);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(input);
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1200);
  };

  const generateAIResponse = (query) => {
    // Simulate sentiment analysis
    const sentimentScore = Math.random();
    let newSentiment = 'neutral';
    if (sentimentScore > 0.7) newSentiment = 'positive';
    else if (sentimentScore < 0.3) newSentiment = 'negative';
    
    setSentiment(newSentiment);

    // Generate different response types
    const responseTypes = [
      {
        text: `Based on our policy, here's how you can respond:\n\n"Thank you for reaching out about your return. I can confirm that unopened items can be returned within 60 days for a full refund. Would you like me to process this for you?"`,
        type: 'policy'
      },
      {
        text: '```json\n{\n  "responseType": "refund",\n  "suggestedActions": [\n    "Confirm return eligibility",\n    "Offer refund or exchange",\n    "Provide return instructions"\n  ]\n}\n```',
        type: 'technical'
      },
      {
        text: 'The customer seems frustrated about the duplicate purchase. Consider:\n\n1. Apologizing for the inconvenience\n2. Offering a return with free shipping\n3. Suggesting an alternative product',
        type: 'advice'
      }
    ];

    return {
      ...responseTypes[Math.floor(Math.random() * responseTypes.length)],
      sender: 'ai'
    };
  };

  const handleSuggestionClick = (suggestion) => {
    setMessages([...messages, {
      text: suggestion,
      sender: 'user'
    }]);
    setInput('');
    setIsLoading(true);
    
    setTimeout(() => {
      setMessages(prev => [...prev, {
        text: `Great choice! Here's more detail about that suggestion...`,
        sender: 'ai',
        type: 'followup'
      }]);
      setIsLoading(false);
    }, 1000);
  };

  const renderMessageContent = (message) => {
    if (message.type === 'technical') {
      return (
        <SyntaxHighlighter 
          language="json" 
          style={atomOneDark}
          customStyle={{ 
            margin: 0,
            borderRadius: 4,
            fontSize: '0.8rem',
            background: '#1E1E1E'
          }}
        >
          {message.text}
        </SyntaxHighlighter>
      );
    }
    return message.text;
  };

  return (
    <Paper elevation={0} sx={{ 
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      borderLeft: '1px solid',
      borderColor: 'divider',
      bgcolor: 'background.paper'
    }}>
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
            <SmartToy sx={{ mr: 1, color: 'primary.main' }} /> 
            Fin AI Copilot
            {sentiment && (
              <Tooltip title={`Sentiment: ${sentiment}`}>
                <IconButton size="small" sx={{ ml: 1 }}>
                  {sentimentIcons[sentiment]}
                </IconButton>
              </Tooltip>
            )}
          </Typography>
          <Badge badgeContent="PRO" color="primary" />
        </Box>

        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="fullWidth"
          sx={{ mt: 1 }}
        >
          <Tab icon={<Lightbulb />} label="Suggestions" />
          <Tab icon={<Psychology />} label="Analyze" />
          <Tab icon={<History />} label="History" />
        </Tabs>
      </Box>
      
      <Box sx={{ 
        flexGrow: 1, 
        overflowY: 'auto', 
        p: 2,
        bgcolor: 'background.default'
      }}>
        {isLoading && <LinearProgress />}
        
        <List sx={{ pb: 0 }}>
          {messages.map((msg, index) => (
            <ListItem 
              key={index} 
              sx={{ 
                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                px: 0,
                alignItems: 'flex-start'
              }}
            >
              {msg.sender === 'ai' && (
                <Avatar sx={{ 
                  bgcolor: 'primary.main', 
                  mr: 1, 
                  width: 32, 
                  height: 32,
                  mt: '3px'
                }}>
                  <SmartToy fontSize="small" />
                </Avatar>
              )}
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  bgcolor: msg.sender === 'user' ? 'primary.light' : 'background.paper',
                  color: msg.sender === 'user' ? 'primary.contrastText' : 'text.primary',
                  borderRadius: msg.sender === 'user' 
                    ? '18px 18px 0 18px' 
                    : '18px 18px 18px 0',
                  maxWidth: '90%',
                  overflow: 'hidden'
                }}
              >
                {renderMessageContent(msg)}
              </Paper>
            </ListItem>
          ))}
          <div ref={messagesEndRef} />
        </List>
        
        {suggestions.length > 0 && activeTab === 0 && (
          <>
            <Divider sx={{ my: 2 }}>
              <Chip 
                label="Suggested Replies" 
                size="small" 
                icon={<Lightbulb fontSize="small" />}
              />
            </Divider>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: 1.5
            }}>
              {suggestions.map((suggestion, index) => (
                <Paper
                  key={index}
                  elevation={2}
                  onClick={() => handleSuggestionClick(suggestion)}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: 'action.hover',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <Typography variant="body2">{suggestion}</Typography>
                </Paper>
              ))}
            </Box>
          </>
        )}

        {activeTab === 1 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Conversation Analysis
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 1,
              mb: 2
            }}>
              <Chip icon={<Help />} label="Return Request" color="info" />
              <Chip icon={<SentimentSatisfied />} label="Neutral Sentiment" />
              <Chip label="Priority: Medium" />
            </Box>
            <Typography variant="body2" paragraph>
              This conversation appears to be about a return request for an unopened item purchased as a gift.
            </Typography>
            <Typography variant="body2" paragraph>
              Key points to address:
            </Typography>
            <List dense sx={{ listStyleType: 'disc', pl: 2 }}>
              <ListItem sx={{ display: 'list-item' }}>
                <ListItemText primary="Confirm return eligibility (60-day window)" />
              </ListItem>
              <ListItem sx={{ display: 'list-item' }}>
                <ListItemText primary="Offer refund or exchange options" />
              </ListItem>
              <ListItem sx={{ display: 'list-item' }}>
                <ListItemText primary="Provide clear return instructions" />
              </ListItem>
            </List>
          </Box>
        )}
      </Box>
      
      <Box sx={{ 
        p: 2, 
        borderTop: '1px solid', 
        borderColor: 'divider',
        bgcolor: 'background.paper'
      }}>
        <Box sx={{ display: 'flex' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Ask Fin AI Copilot..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            disabled={!conversationId}
            size="small"
            multiline
            maxRows={3}
          />
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSend}
            sx={{ ml: 1 }}
            disabled={!conversationId || !input.trim()}
          >
            <Send />
          </Button>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Fin AI may produce inaccurate information. Always verify critical details.
        </Typography>
      </Box>
    </Paper>
  );
}
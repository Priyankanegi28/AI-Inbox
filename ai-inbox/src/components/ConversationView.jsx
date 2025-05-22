import {
  ArrowBack,
  AttachFile,
  Call,
  InsertEmoticon,
  MoreVert,
  Search,
  Send,
  Videocam
} from '@mui/icons-material';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  TextField,
  Toolbar,
  Typography
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import MessageItem from './MessageItem';

export default function ConversationView({
  conversation,
  onBack,
  onSendMessage,
  isMobile
}) {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Simulate typing indicator
  useEffect(() => {
    if (conversation) {
      const timer = setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 2000);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [conversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [conversation?.messages]);

  const handleSend = () => {
    if (message.trim() === '') return;
    onSendMessage(conversation.id, message);
    setMessage('');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        borderRight: isMobile ? 'none' : '1px solid',
        borderColor: 'divider'
      }}
    >
      <AppBar
        position="static"
        color="default"
        elevation={1}
        sx={{ bgcolor: 'background.paper' }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton onClick={onBack} sx={{ mr: 2 }}>
              <ArrowBack />
            </IconButton>
          )}
          <Avatar
            src={conversation?.avatar}
            sx={{ mr: 2, bgcolor: 'primary.main' }}
          >
            {conversation?.name?.charAt(0) || '?'}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" fontWeight="medium">
              {conversation?.name || 'Select a conversation'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {conversation?.online ? 'Online' : 'Last seen recently'}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <IconButton size="small">
              <Call fontSize="small" />
            </IconButton>
            <IconButton size="small">
              <Videocam fontSize="small" />
            </IconButton>
            <IconButton size="small">
              <Search fontSize="small" />
            </IconButton>
            <IconButton size="small">
              <MoreVert fontSize="small" />
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          p: 2,
          bgcolor: 'background.default',
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))'
        }}
      >
        {conversation ? (
          <>
            {conversation?.messages?.map((msg) => (
              <MessageItem key={msg.id} message={msg} />
            ))}
            {isTyping && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 2,
                  pl: 6
                }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    mr: 1,
                    bgcolor: 'primary.main'
                  }}
                >
                  {conversation?.name?.charAt(0) || '?'}
                </Avatar>
                <Paper
                  sx={{
                    p: 1.5,
                    borderRadius: '18px 18px 18px 0',
                    position: 'relative'
                  }}
                >
                  <Box sx={{ display: 'flex' }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: 'text.secondary',
                        mx: 0.5,
                        animation: 'pulse 1.5s infinite ease-in-out',
                        '@keyframes pulse': {
                          '0%, 100%': { opacity: 0.3 },
                          '50%': { opacity: 1 }
                        }
                      }}
                    />
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: 'text.secondary',
                        mx: 0.5,
                        animation: 'pulse 1.5s infinite ease-in-out',
                        animationDelay: '0.2s'
                      }}
                    />
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: 'text.secondary',
                        mx: 0.5,
                        animation: 'pulse 1.5s infinite ease-in-out',
                        animationDelay: '0.4s'
                      }}
                    />
                  </Box>
                </Paper>
              </Box>
            )}
            <Box ref={messagesEndRef} />
          </>
        ) : (
          <Box
            sx={{
              display: 'flex',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center'
            }}
          >
            <Box>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No conversation selected
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Select a conversation from the inbox to view messages
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      {conversation && (
        <Box
          sx={{
            p: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper'
          }}
        >
          <Box display="flex" alignItems="flex-end">
            <IconButton size="small" sx={{ mr: 1 }}>
              <AttachFile />
            </IconButton>
            <IconButton size="small" sx={{ mr: 1 }}>
              <InsertEmoticon />
            </IconButton>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              inputRef={inputRef}
              size="small"
              multiline
              maxRows={4}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSend}
              sx={{ ml: 1, minWidth: 40, height: 40 }}
              disabled={!message.trim()}
            >
              <Send />
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}

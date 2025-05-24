import {
  ArrowBack,
  AttachFile,
  Call,
  Close,
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  GTranslate,
  Info,
  InsertEmoticon,
  MoreVert,
  NightsStay,
  Search,
  Send,
  SmartToy,
  Spellcheck,
  ThumbUp,
  Videocam
} from '@mui/icons-material';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Popover,
  Stack, styled, TextField,
  Toolbar,
  Tooltip,
  Typography
} from '@mui/material';
import EmojiPicker from 'emoji-picker-react';
import { useEffect, useRef, useState } from 'react';
import MessageItem from './MessageItem';

const stringToColor = (string) => {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
};

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function ConversationView({
  conversation,
  onBack,
  onSendMessage,
  isMobile,
  onAskFinCopilot,
  copilotTextToCopy,
  clearCopilotText
}) {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [bedtimeMode, setBedtimeMode] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedText, setSelectedText] = useState('');
  const [showCopilotButton, setShowCopilotButton] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });
  const [showFormattingButtons, setShowFormattingButtons] = useState(false);
  const [formattingPosition, setFormattingPosition] = useState({ top: 0, left: 0 });
  const [inputSelection, setInputSelection] = useState({ start: 0, end: 0 });
  const [emojiAnchorEl, setEmojiAnchorEl] = useState(null);
  const [files, setFiles] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const conversationRef = useRef(null);
  const fileInputRef = useRef(null);
  const open = Boolean(anchorEl);
  const openEmojiPicker = Boolean(emojiAnchorEl);

  const avatarColor = conversation ? stringToColor(conversation.name) : 'primary.main';

  useEffect(() => {
    if (copilotTextToCopy && inputRef.current) {
      setMessage(copilotTextToCopy);
      inputRef.current.focus();
      clearCopilotText();
    }
  }, [copilotTextToCopy, clearCopilotText]);

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (selection.toString().trim() && conversationRef.current?.contains(selection.anchorNode)) {
        setSelectedText(selection.toString().trim());
        
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        setButtonPosition({
          top: rect.top - 40,
          left: rect.left + rect.width / 2
        });
        setShowCopilotButton(true);
      } else {
        setShowCopilotButton(false);
        setSelectedText('');
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, [conversation]);

  const handleInputSelection = () => {
    const input = inputRef.current;
    if (input) {
      const { selectionStart, selectionEnd } = input;
      if (selectionStart !== selectionEnd) {
        const selectedText = message.substring(selectionStart, selectionEnd);
        if (selectedText.trim()) {
          const rect = input.getBoundingClientRect();
          const lineHeight = parseInt(window.getComputedStyle(input).lineHeight);
          const linesBefore = message.substr(0, selectionStart).split('\n').length - 1;
          
          setInputSelection({ start: selectionStart, end: selectionEnd });
          setFormattingPosition({
            top: rect.top + (linesBefore * lineHeight) - 40,
            left: rect.left + 20
          });
          setShowFormattingButtons(true);
          return;
        }
      }
    }
    setShowFormattingButtons(false);
  };

  const applyFormatting = (format) => {
    if (inputSelection.start === inputSelection.end) return;
    
    const { start, end } = inputSelection;
    const selectedText = message.substring(start, end);
    let formattedText = '';
    
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'underline':
        formattedText = `__${selectedText}__`;
        break;
      case 'fixGrammar':
        formattedText = `[grammarfix]${selectedText}[/grammarfix]`;
        break;
      case 'translate':
        formattedText = `[translate]${selectedText}[/translate]`;
        break;
      case 'formal':
        formattedText = `[formal]${selectedText}[/formal]`;
        break;
      case 'friendly':
        formattedText = `[friendly]${selectedText}[/friendly]`;
        break;
      default:
        formattedText = selectedText;
    }
    
    const newMessage = message.substring(0, start) + formattedText + message.substring(end);
    setMessage(newMessage);
    setShowFormattingButtons(false);
    
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.setSelectionRange(start + 2, start + 2 + selectedText.length);
      }
    }, 0);
  };

  const handleAskCopilot = () => {
    if (selectedText && onAskFinCopilot) {
      onAskFinCopilot(selectedText);
      setShowCopilotButton(false);
      window.getSelection().empty();
    }
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCall = () => {
    handleMenuClose();
    console.log('Call initiated');
  };

  const handleVideoCall = () => {
    handleMenuClose();
    console.log('Video call initiated');
  };

  const handleSearch = () => {
    handleMenuClose();
    console.log('Search in conversation');
  };

  const handleInfo = () => {
    handleMenuClose();
    console.log('Conversation info');
  };

  const handleEmojiClick = (emojiData) => {
    setMessage(prev => prev + emojiData.emoji);
    setEmojiAnchorEl(null);
    inputRef.current.focus();
  };

  const handleOpenEmojiPicker = (event) => {
    setEmojiAnchorEl(event.currentTarget);
  };

  const handleCloseEmojiPicker = () => {
    setEmojiAnchorEl(null);
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(prev => [...prev, ...selectedFiles]);
    
    // Add file names to message
    const fileNames = selectedFiles.map(file => file.name).join(', ');
    setMessage(prev => prev + (prev ? '\n' : '') + `[Attached: ${fileNames}]`);
  };

  const handleAttachFileClick = () => {
    fileInputRef.current.click();
  };

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
    if (message.trim() === '' && files.length === 0) return;
    
    const messageToSend = {
      text: message,
      files: [...files]
    };
    
    onSendMessage(conversation.id, messageToSend);
    setMessage('');
    setFiles([]);
    setShowFormattingButtons(false);
    
    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const toggleBedtimeMode = () => {
    setBedtimeMode(!bedtimeMode);
  };

  const handleClose = () => {
    if (onBack) onBack();
  };

  return (
    <Box
      ref={conversationRef}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        borderRight: isMobile ? 'none' : '1px solid',
        borderColor: 'divider',
        backgroundColor: bedtimeMode ? 'rgba(0, 0, 0, 0.9)' : 'inherit',
        color: bedtimeMode ? 'rgba(255, 255, 255, 0.8)' : 'inherit',
        position: 'relative'
      }}
    >
      {/* Hidden file input */}
      <VisuallyHiddenInput 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
      />

      {showCopilotButton && (
        <Button
          variant="contained"
          startIcon={<SmartToy />}
          onClick={handleAskCopilot}
          sx={{
            position: 'fixed',
            top: `${buttonPosition.top}px`,
            left: `${buttonPosition.left}px`,
            transform: 'translateX(-50%)',
            zIndex: 9999,
            bgcolor: 'primary.main',
            color: 'white',
            '&:hover': {
              bgcolor: 'primary.dark'
            },
            boxShadow: 3,
            minWidth: '160px'
          }}
        >
          Ask Fin Copilot
        </Button>
      )}

      {showFormattingButtons && (
        <Paper
          elevation={3}
          sx={{
            position: 'fixed',
            top: `${formattingPosition.top}px`,
            left: `${formattingPosition.left}px`,
            zIndex: 9999,
            display: 'flex',
            p: 0.5,
            bgcolor: bedtimeMode ? 'rgba(50, 50, 50, 0.9)' : 'background.paper'
          }}
        >
          <Tooltip title="Bold">
            <IconButton size="small" onClick={() => applyFormatting('bold')}>
              <FormatBold fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Italic">
            <IconButton size="small" onClick={() => applyFormatting('italic')}>
              <FormatItalic fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Underline">
            <IconButton size="small" onClick={() => applyFormatting('underline')}>
              <FormatUnderlined fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Fix Grammar">
            <IconButton size="small" onClick={() => applyFormatting('fixGrammar')}>
              <Spellcheck fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Translate">
            <IconButton size="small" onClick={() => applyFormatting('translate')}>
              <GTranslate fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="More Formal">
            <IconButton size="small" onClick={() => applyFormatting('formal')}>
              <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>Formal</Typography>
            </IconButton>
          </Tooltip>
          <Tooltip title="More Friendly">
            <IconButton size="small" onClick={() => applyFormatting('friendly')}>
              <ThumbUp fontSize="small" />
            </IconButton>
          </Tooltip>
        </Paper>
      )}

      <AppBar
        position="static"
        color="default"
        elevation={1}
        sx={{ 
          bgcolor: bedtimeMode ? 'rgba(0, 0, 0, 0.8)' : 'background.paper',
          color: bedtimeMode ? 'rgba(255, 255, 255, 0.8)' : 'inherit'
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton onClick={onBack} sx={{ mr: 2 }}>
              <ArrowBack />
            </IconButton>
          )}
          <Avatar
            src={conversation?.avatar}
            sx={{ 
              mr: 2, 
              bgcolor: avatarColor,
              color: '#fff'
            }}
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
          <Stack direction="row" spacing={1} sx={{ bgcolor: 'action.hover', borderRadius: 1, p: 0.5 }}>
            <Tooltip title="More options">
              <IconButton 
                size="small" 
                onClick={handleMenuClick}
                aria-controls={open ? 'more-options-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                sx={{ color: bedtimeMode ? 'primary.main' : 'common.black' }}
              >
                <MoreVert fontSize="small" />
              </IconButton>
            </Tooltip>
            
            <Menu
              id="more-options-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              MenuListProps={{
                'aria-labelledby': 'more-options-button',
              }}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              PaperProps={{
                sx: {
                  bgcolor: bedtimeMode ? 'rgba(0, 0, 0, 0.8)' : 'background.paper',
                  color: bedtimeMode ? 'rgba(255, 255, 255, 0.8)' : 'inherit',
                  '& .MuiMenuItem-root': {
                    minWidth: 180,
                  },
                }
              }}
            >
              <MenuItem onClick={handleCall}>
                <ListItemIcon>
                  <Call fontSize="small" sx={{ color: bedtimeMode ? 'primary.main' : 'inherit' }} />
                </ListItemIcon>
                <ListItemText>Voice Call</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleVideoCall}>
                <ListItemIcon>
                  <Videocam fontSize="small" sx={{ color: bedtimeMode ? 'primary.main' : 'inherit' }} />
                </ListItemIcon>
                <ListItemText>Video Call</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleSearch}>
                <ListItemIcon>
                  <Search fontSize="small" sx={{ color: bedtimeMode ? 'primary.main' : 'inherit' }} />
                </ListItemIcon>
                <ListItemText>Search</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleInfo}>
                <ListItemIcon>
                  <Info fontSize="small" sx={{ color: bedtimeMode ? 'primary.main' : 'inherit' }} />
                </ListItemIcon>
                <ListItemText>Conversation Info</ListItemText>
              </MenuItem>
            </Menu>

            <Tooltip title={bedtimeMode ? "Disable bedtime mode" : "Enable bedtime mode"}>
              <IconButton 
                size="small" 
                onClick={toggleBedtimeMode}
                sx={{ 
                  color: bedtimeMode ? 'primary.main' : 'common.black',
                  '&:hover': {
                    color: bedtimeMode ? 'primary.light' : 'common.black'
                  }
                }}
              >
                <NightsStay fontSize="small" />
              </IconButton>
            </Tooltip>

            <Button
              size="small"
              onClick={handleClose}
              startIcon={<Close fontSize="small" sx={{ color: bedtimeMode ? 'primary.main' : 'inherit' }} />}
              sx={{ 
                color: bedtimeMode ? 'primary.main' : 'common.black',
                textTransform: 'none',
                minWidth: 'auto',
                px: 1,
                '&:hover': {
                  color: bedtimeMode ? 'primary.light' : 'common.black'
                }
              }}
            >
              Close
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          p: 2,
          bgcolor: bedtimeMode ? 'rgba(0, 0, 0, 0.7)' : 'background.default',
          backgroundImage: bedtimeMode 
            ? 'none' 
            : 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))'
        }}
      >
        {conversation ? (
          <>
            {conversation?.messages?.map((msg) => (
              <MessageItem 
                key={msg.id} 
                message={msg} 
                bedtimeMode={bedtimeMode} 
              />
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
                    bgcolor: avatarColor,
                    color: '#fff'
                  }}
                >
                  {conversation?.name?.charAt(0) || '?'}
                </Avatar>
                <Paper
                  sx={{
                    p: 1.5,
                    borderRadius: '18px 18px 18px 0',
                    position: 'relative',
                    bgcolor: bedtimeMode ? 'rgba(50, 50, 50, 0.7)' : 'background.paper'
                  }}
                >
                  <Box sx={{ display: 'flex' }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: bedtimeMode ? 'rgba(255, 255, 255, 0.6)' : 'text.secondary',
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
                        bgcolor: bedtimeMode ? 'rgba(255, 255, 255, 0.6)' : 'text.secondary',
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
                        bgcolor: bedtimeMode ? 'rgba(255, 255, 255, 0.6)' : 'text.secondary',
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
            borderColor: bedtimeMode ? 'rgba(255, 255, 255, 0.1)' : 'divider',
            bgcolor: bedtimeMode ? 'rgba(0, 0, 0, 0.8)' : 'background.paper'
          }}
        >
          {/* Display attached files */}
          {files.length > 0 && (
            <Box sx={{ mb: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {files.map((file, index) => (
                <Chip
                  key={index}
                  label={file.name}
                  onDelete={() => {
                    setFiles(files.filter((_, i) => i !== index));
                  }}
                  sx={{
                    maxWidth: 200,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                />
              ))}
            </Box>
          )}

          <Box display="flex" alignItems="flex-end">
            <Tooltip title="Attach file">
              <IconButton 
                size="small" 
                sx={{ mr: 1 }}
                color={bedtimeMode ? "inherit" : "default"}
                onClick={handleAttachFileClick}
              >
                <AttachFile />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Insert emoji">
              <IconButton 
                size="small" 
                sx={{ mr: 1 }}
                color={bedtimeMode ? "inherit" : "default"}
                onClick={handleOpenEmojiPicker}
              >
                <InsertEmoticon />
              </IconButton>
            </Tooltip>

            <Popover
              open={openEmojiPicker}
              anchorEl={emojiAnchorEl}
              onClose={handleCloseEmojiPicker}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              sx={{
                '& .EmojiPickerReact': {
                  backgroundColor: bedtimeMode ? '#424242' : '#fff',
                  boxShadow: 'none'
                }
              }}
            >
              <EmojiPicker 
                onEmojiClick={handleEmojiClick}
                width={300}
                height={400}
                skinTonesDisabled
                searchDisabled={isMobile}
                previewConfig={{ showPreview: false }}
                theme={bedtimeMode ? 'dark' : 'light'}
              />
            </Popover>

            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onSelect={handleInputSelection}
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: bedtimeMode ? 'rgba(255, 255, 255, 0.8)' : 'inherit',
                  '& fieldset': {
                    borderColor: bedtimeMode ? 'rgba(255, 255, 255, 0.2)' : 'inherit',
                  },
                  '&:hover fieldset': {
                    borderColor: bedtimeMode ? 'rgba(255, 255, 255, 0.4)' : 'inherit',
                  },
                },
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSend}
              sx={{ 
                ml: 1, 
                minWidth: 40, 
                height: 40,
                bgcolor: bedtimeMode ? 'rgba(25, 118, 210, 0.8)' : 'primary.main'
              }}
              disabled={!message.trim() && files.length === 0}
            >
              <Send />
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}
import { Brightness4, Brightness7, ViewList, ViewModule } from '@mui/icons-material';
import {
  Badge, Box, Button, ButtonGroup, createTheme, CssBaseline, IconButton,
  ThemeProvider, Tooltip, useMediaQuery, useTheme
} from '@mui/material';
import { useMemo, useState } from 'react';
import AICopilot from './components/AICopilot';
import ConversationView from './components/ConversationView';
import InboxList from './components/InboxList';
import { conversations as initialConversations } from './data/conversations';

export default function App() {
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [conversations, setConversations] = useState(
    initialConversations.map(conv => ({
      ...conv,
      archived: false,
      deleted: false,
      read: false,
      unread: true,
      starred: false
    }))
  );
  const [darkMode, setDarkMode] = useState(false);
  const [activeInbox, setActiveInbox] = useState('all');
  const [viewMode, setViewMode] = useState('list');
  const [copilotQuery, setCopilotQuery] = useState('');
  const [copilotTextToCopy, setCopilotTextToCopy] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const themeConfig = useMemo(
    () => createTheme({
      palette: {
        mode: darkMode ? 'dark' : 'light',
        primary: {
          main: '#1976d2',
        },
        secondary: {
          main: '#9c27b0',
        },
        background: {
          default: darkMode ? '#121212' : '#f5f5f5',
          paper: darkMode ? '#1e1e1e' : '#ffffff',
        }
      },
      typography: {
        fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
      },
    }),
    [darkMode]
  );

  const selectedConversation = useMemo(
    () => conversations.find(conv => conv.id === selectedConversationId),
    [conversations, selectedConversationId]
  );

  const filteredConversations = useMemo(() => {
    return conversations.filter(conv => {
      if (activeInbox === 'all') return !conv.archived && !conv.deleted;
      if (activeInbox === 'archived') return conv.archived && !conv.deleted;
      if (activeInbox === 'deleted') return conv.deleted;
      return true;
    });
  }, [conversations, activeInbox]);

  const unreadCount = useMemo(() => {
    return filteredConversations.reduce((count, conv) => count + (conv.unread ? 1 : 0), 0);
  }, [filteredConversations]);

  const handleSelectConversation = (id) => {
    setSelectedConversationId(id);
    setConversations(prev =>
      prev.map(conv =>
        conv.id === id ? { ...conv, unread: false, read: true } : conv
      )
    );
  };

  const handleSendMessage = (conversationId, { text, files = [] }) => {
    const newMessage = {
      id: Date.now().toString(),
      sender: 'You',
      text,
      files: files.map(file => ({
        name: file.name,
        type: file.type,
        size: file.size
      })),
      timestamp: new Date(),
      isUser: true
    };

    setConversations(prev =>
      prev.map(conv =>
        conv.id === conversationId
          ? {
              ...conv,
              messages: [...conv.messages, newMessage],
              preview: text.length > 20 ? `${text.substring(0, 20)}...` : text,
              lastUpdated: new Date()
            }
          : conv
      )
    );
  };

  const handleToggleStar = (conversationId) => {
    setConversations(prev =>
      prev.map(conv =>
        conv.id === conversationId 
          ? { ...conv, starred: !conv.starred } 
          : conv
      )
    );
  };

  const handleArchive = (conversationId) => {
    setConversations(prev =>
      prev.map(conv =>
        conv.id === conversationId
          ? { ...conv, archived: true, deleted: false }
          : conv
      )
    );
    if (selectedConversationId === conversationId) {
      setSelectedConversationId(null);
    }
  };

  const handleDelete = (conversationId) => {
    setConversations(prev =>
      prev.map(conv =>
        conv.id === conversationId
          ? { ...conv, deleted: true, archived: false }
          : conv
      )
    );
    if (selectedConversationId === conversationId) {
      setSelectedConversationId(null);
    }
  };

  const handleRestore = (conversationId) => {
    setConversations(prev =>
      prev.map(conv =>
        conv.id === conversationId
          ? { ...conv, archived: false, deleted: false }
          : conv
      )
    );
  };

  const handleAskFinCopilot = (selectedText) => {
    setCopilotQuery(selectedText);
  };

  const handleCopyToChat = (text) => {
    setCopilotTextToCopy(text);
  };

  const clearCopilotText = () => {
    setCopilotTextToCopy('');
  };

  const sortedConversations = useMemo(() => {
    return [...filteredConversations].sort((a, b) => {
      if (a.starred !== b.starred) return a.starred ? -1 : 1;
      return new Date(b.lastUpdated || b.messages[b.messages.length-1].timestamp) - 
             new Date(a.lastUpdated || a.messages[a.messages.length-1].timestamp);
    });
  }, [filteredConversations]);

  return (
    <ThemeProvider theme={themeConfig}>
      <CssBaseline />
      <Box sx={{ 
        display: 'flex', 
        height: '100vh',
        bgcolor: 'background.default'
      }}>
        <Box sx={{ 
          width: isMobile ? '100%' : 360,
          display: isMobile && selectedConversationId ? 'none' : 'block',
          borderRight: '1px solid',
          borderColor: 'divider',
          position: 'relative'
        }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 1,
            bgcolor: 'background.paper',
            borderBottom: '1px solid',
            borderColor: 'divider'
          }}>
            <ButtonGroup size="small" variant="outlined">
              <Button 
                onClick={() => setActiveInbox('all')}
                variant={activeInbox === 'all' ? 'contained' : 'outlined'}
              >
                <Badge badgeContent={unreadCount} color="primary" sx={{ mr: 1 }}>
                  All
                </Badge>
              </Button>
              <Button 
                onClick={() => setActiveInbox('archived')}
                variant={activeInbox === 'archived' ? 'contained' : 'outlined'}
              >
                Archived
              </Button>
              <Button 
                onClick={() => setActiveInbox('deleted')}
                variant={activeInbox === 'deleted' ? 'contained' : 'outlined'}
              >
                Deleted
              </Button>
            </ButtonGroup>
            
            <Tooltip title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}>
              <IconButton onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Tooltip>
          </Box>
          
          <InboxList
            conversations={sortedConversations}
            selectedId={selectedConversationId}
            onSelect={handleSelectConversation}
            onToggleStar={handleToggleStar}
            onArchive={activeInbox === 'all' ? handleArchive : undefined}
            onDelete={activeInbox === 'all' ? handleDelete : undefined}
            onRestore={activeInbox !== 'all' ? handleRestore : undefined}
            activeInbox={activeInbox}
            viewMode={viewMode}
          />

          <Box sx={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            zIndex: 1,
            bgcolor: 'background.paper',
            borderRadius: 1,
            boxShadow: 2
          }}>
            <ButtonGroup variant="text" color="inherit">
              <Tooltip title="List view">
                <IconButton 
                  onClick={() => setViewMode('list')}
                  sx={{ 
                    color: viewMode === 'list' ? 'primary.main' : 'text.secondary',
                    '&:hover': {
                      bgcolor: 'action.hover'
                    }
                  }}
                >
                  <ViewList />
                </IconButton>
              </Tooltip>
              <Tooltip title="Grid view">
                <IconButton 
                  onClick={() => setViewMode('grid')}
                  sx={{ 
                    color: viewMode === 'grid' ? 'primary.main' : 'text.secondary',
                    '&:hover': {
                      bgcolor: 'action.hover'
                    }
                  }}
                >
                  <ViewModule />
                </IconButton>
              </Tooltip>
            </ButtonGroup>
          </Box>
        </Box>

        {(!isMobile || selectedConversationId) && (
          <Box sx={{ 
            flexGrow: 1,
            maxWidth: isMobile ? '100%' : 'calc(100% - 720px)'
          }}>
            <ConversationView
              conversation={selectedConversation}
              onBack={() => setSelectedConversationId(null)}
              onSendMessage={handleSendMessage}
              isMobile={isMobile}
              onAskFinCopilot={handleAskFinCopilot}
              copilotTextToCopy={copilotTextToCopy}
              clearCopilotText={clearCopilotText}
            />
          </Box>
        )}

        {(!isMobile || !selectedConversationId) && (
          <Box sx={{ 
            width: isMobile ? '100%' : 360,
            display: isMobile && selectedConversationId ? 'none' : 'block'
          }}>
            <AICopilot 
              conversationId={selectedConversationId}
              initialQuery={copilotQuery}
              onCopyToChat={handleCopyToChat}
            />
          </Box>
        )}
      </Box>
    </ThemeProvider>
  );
}
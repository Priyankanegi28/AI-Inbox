import { KeyboardArrowDown } from '@mui/icons-material';
import { Box, Button, Menu, MenuItem, Typography } from '@mui/material';
import { useState } from 'react';
import InboxItem from './InboxItem';

export default function InboxList({
  conversations,
  selectedId,
  onSelect,
  onToggleStar,
  onArchive,
  onDelete,
  onRestore,
  activeInbox,
  viewMode
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [sortBy, setSortBy] = useState('waiting');
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSortChange = (type) => {
    setSortBy(type);
    handleClose(); // Close menu when an item is selected
  };

  const sortedConversations = [...conversations].sort((a, b) => {
    if (sortBy === 'waiting') {
      return new Date(a.messages[a.messages.length-1].timestamp) - 
             new Date(b.messages[b.messages.length-1].timestamp);
    } else {
      return new Date(b.messages[b.messages.length-1].timestamp) - 
             new Date(a.messages[a.messages.length-1].timestamp);
    }
  });

  return (
    <Box sx={{ 
      overflowY: 'auto', 
      height: 'calc(100vh - 112px)',
      pb: 4
    }}>
      <Box sx={{ 
        p: 2,
        position: 'sticky',
        top: 0,
        zIndex: 1,
        backgroundColor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box>
          <Typography variant="h6" fontWeight="bold">
            {activeInbox === 'all' ? 'Your Inbox' : 
             activeInbox === 'archived' ? 'Archived' : 'Deleted'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {conversations.length} {conversations.length === 1 ? 'conversation' : 'conversations'}
          </Typography>
        </Box>
        
        <Button
          onClick={handleClick}
          endIcon={<KeyboardArrowDown />}
          sx={{
            color: 'text.primary',
            textTransform: 'none',
            fontSize: '0.875rem',
            '&:hover': {
              backgroundColor: 'transparent'
            }
          }}
        >
          {sortBy === 'waiting' ? 'Waiting Longest' : 'Newest First'}
        </Button>
        
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose} // Auto-close when clicking outside
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem 
            onClick={() => handleSortChange('waiting')}
            selected={sortBy === 'waiting'}
          >
            Waiting Longest
          </MenuItem>
          <MenuItem 
            onClick={() => handleSortChange('newest')}
            selected={sortBy === 'newest'}
          >
            Newest First
          </MenuItem>
          
        </Menu>
      </Box>

      {viewMode === 'list' ? (
        sortedConversations.map((conversation) => (
          <InboxItem
            key={conversation.id}
            conversation={conversation}
            isSelected={selectedId === conversation.id}
            onClick={() => onSelect(conversation.id)}
            onToggleStar={onToggleStar}
            onArchive={onArchive}
            onDelete={onDelete}
            onRestore={onRestore}
            activeInbox={activeInbox}
            viewMode={viewMode}
          />
        ))
      ) : (
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: 2,
          p: 2
        }}>
          {sortedConversations.map((conversation) => (
            <InboxItem
              key={conversation.id}
              conversation={conversation}
              isSelected={selectedId === conversation.id}
              onClick={() => onSelect(conversation.id)}
              onToggleStar={onToggleStar}
              onArchive={onArchive}
              onDelete={onDelete}
              onRestore={onRestore}
              activeInbox={activeInbox}
              viewMode={viewMode}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
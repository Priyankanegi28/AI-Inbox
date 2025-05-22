// InboxItem.jsx
import {
  Archive,
  Delete,
  LabelImportantOutlined, Restore, Star,
  StarBorder
} from '@mui/icons-material';
import {
  Badge, Box, Chip, IconButton,
  Stack, Tooltip, Typography
} from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import { useInView } from 'react-intersection-observer';

const priorityColors = {
  high: 'error',
  medium: 'warning',
  low: 'success'
};

export default function InboxItem({ 
  conversation, 
  isSelected, 
  onClick,
  onToggleStar,
  onArchive,
  onDelete,
  onRestore,
  activeInbox,
  setActiveInbox
}) {
  const [ref, inView] = useInView({ triggerOnce: true });
  const [hovered, setHovered] = useState(false);
  const lastMessage = conversation.messages[conversation.messages.length - 1];
  
  const handleArchiveClick = (e, id) => {
    e.stopPropagation();
    onArchive(id);
    setActiveInbox('archived');
  };

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    onDelete(id);
    setActiveInbox('deleted');
  };

  const handleRestoreClick = (e, id) => {
    e.stopPropagation();
    onRestore(id);
    setActiveInbox('all');
  };

  return (
    <Box
      ref={ref}
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
        backgroundColor: isSelected ? 'action.selected' : 'background.paper',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: 'action.hover',
          boxShadow: 1
        }
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
        <IconButton 
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onToggleStar(conversation.id);
          }}
        >
          {conversation.starred ? (
            <Star color="warning" fontSize="small" />
          ) : (
            <StarBorder fontSize="small" />
          )}
        </IconButton>
      </Box>

      <Box sx={{ 
        flexGrow: 1, 
        minWidth: 0,
        opacity: inView ? 1 : 0,
        transition: 'opacity 0.3s ease'
      }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography 
            variant="subtitle2" 
            noWrap
            fontWeight={!conversation.read ? 'bold' : 'normal'}
            color={!conversation.read ? 'text.primary' : 'text.secondary'}
          >
            {conversation.name}
            {conversation.priority && (
              <LabelImportantOutlined 
                fontSize="inherit" 
                color={priorityColors[conversation.priority]}
                sx={{ ml: 0.5, verticalAlign: 'middle' }}
              />
            )}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatDistanceToNow(lastMessage.timestamp, { addSuffix: true })}
          </Typography>
        </Box>

        <Typography 
          variant="body2" 
          noWrap
          color={!conversation.read ? 'text.primary' : 'text.secondary'}
        >
          {conversation.preview}
        </Typography>

        <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
          {conversation.labels?.map(label => (
            <Chip 
              key={label} 
              label={label} 
              size="small" 
              variant="outlined"
            />
          ))}
        </Stack>
      </Box>

      <Box sx={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        ml: 1,
        opacity: hovered || isSelected ? 1 : 0.7,
        transition: 'opacity 0.2s ease'
      }}>
        <Box display="flex" alignItems="center">
          {conversation.unread && (
            <Badge 
              badgeContent=" " 
              color="primary"
              variant="dot"
              sx={{ mr: 1 }}
            />
          )}
          <Chip 
            label={conversation.status} 
            size="small"
            variant="outlined"
          />
        </Box>

        {(hovered || isSelected) && (
          <Box sx={{ mt: 1, display: 'flex' }}>
            {activeInbox === 'all' ? (
              <>
                <Tooltip title="Archive">
                  <IconButton size="small" onClick={(e) => handleArchiveClick(e, conversation.id)}>
                    <Archive fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton size="small" onClick={(e) => handleDeleteClick(e, conversation.id)}>
                    <Delete fontSize="small" />
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <Tooltip title="Restore to Inbox">
                <IconButton size="small" onClick={(e) => handleRestoreClick(e, conversation.id)}>
                  <Restore fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}
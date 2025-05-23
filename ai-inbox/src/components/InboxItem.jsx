import {
  Archive,
  Delete,
  LabelImportantOutlined,
  Restore
} from '@mui/icons-material';
import {
  Avatar,
  Badge,
  Box,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography
} from '@mui/material';
import { differenceInMinutes } from 'date-fns';
import { useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';

const priorityColors = {
  high: 'error',
  medium: 'warning',
  low: 'success'
};

// Helper function to generate a color from a string
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

export default function InboxItem({ 
  conversation, 
  isSelected, 
  onClick,
  onArchive,
  onDelete,
  onRestore,
  activeInbox,
  viewMode = 'list'
}) {
  const [ref, inView] = useInView({ triggerOnce: true });
  const [hovered, setHovered] = useState(false);
  const lastMessage = conversation.messages[conversation.messages.length - 1];
  
  // Generate a consistent color for each conversation
  const avatarColor = useMemo(() => {
    return stringToColor(conversation.name || conversation.id);
  }, [conversation.name, conversation.id]);

  const handleActionClick = (e, handler) => {
    e.stopPropagation();
    if (handler) handler(conversation.id);
  };

  // Calculate time since last message
  const minutesAgo = differenceInMinutes(new Date(), new Date(lastMessage.timestamp));
  let timeDisplay;
  
  if (minutesAgo < 1) {
    timeDisplay = 'Just now';
  } else if (minutesAgo < 60) {
    timeDisplay = `${minutesAgo}m `;
  } else {
    const hoursAgo = Math.floor(minutesAgo / 60);
    timeDisplay = `${hoursAgo}h `;
  }

  return (
    <Box
      ref={ref}
      sx={{
        display: 'flex',
        flexDirection: viewMode === 'grid' ? 'column' : 'row',
        alignItems: viewMode === 'grid' ? 'flex-start' : 'center',
        p: viewMode === 'grid' ? 2 : 1.5,
        borderBottom: 'none',
        backgroundColor: isSelected ? 'action.selected' : 'background.paper',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        borderRadius: viewMode === 'grid' ? 1 : 0,
        '&:hover': {
          backgroundColor: 'action.hover',
          boxShadow: viewMode === 'grid' ? 2 : 'none'
        },
        ...(viewMode === 'grid' && {
          height: '100%',
          border: '1px solid',
          borderColor: 'divider'
        })
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mr: viewMode === 'list' ? 1 : 0,
        mb: viewMode === 'grid' ? 1 : 0
      }}>
        <Avatar 
          sx={{ 
            bgcolor: avatarColor, 
            width: 32, 
            height: 32,
            fontSize: '0.875rem',
            color: '#fff' // Ensure text is readable on the background
          }}
        >
          {conversation.name.charAt(0).toUpperCase()}
        </Avatar>
      </Box>

      <Box sx={{ 
        flexGrow: 1, 
        minWidth: 0,
        opacity: inView ? 1 : 0,
        transition: 'opacity 0.3s ease'
      }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography 
            variant={viewMode === 'grid' ? 'subtitle1' : 'subtitle2'}
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
          {viewMode === 'list' && (
            <Typography variant="caption" color="text.secondary">
              {timeDisplay}
            </Typography>
          )}
        </Box>

        <Typography 
          variant="body2" 
          noWrap={viewMode === 'list'}
          color={!conversation.read ? 'text.primary' : 'text.secondary'}
          sx={{ 
            mt: viewMode === 'grid' ? 0.5 : 0,
            mb: viewMode === 'grid' ? 1 : 0
          }}
        >
          {conversation.preview}
        </Typography>

        {viewMode === 'grid' && (
          <Typography variant="caption" color="text.secondary">
            {timeDisplay}
          </Typography>
        )}

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
        {conversation.unread && (
          <Badge 
            badgeContent=" " 
            color="primary"
            variant="dot"
            sx={{ mr: 1 }}
          />
        )}

        {(hovered || isSelected) && (
          <Box sx={{ mt: 1, display: 'flex' }}>
            {activeInbox === 'all' ? (
              <>
                {onArchive && (
                  <Tooltip title="Archive">
                    <IconButton size="small" onClick={(e) => handleActionClick(e, onArchive)}>
                      <Archive fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
                {onDelete && (
                  <Tooltip title="Delete">
                    <IconButton size="small" onClick={(e) => handleActionClick(e, onDelete)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </>
            ) : (
              onRestore && (
                <Tooltip title="Restore to Inbox">
                  <IconButton size="small" onClick={(e) => handleActionClick(e, onRestore)}>
                    <Restore fontSize="small" />
                  </IconButton>
                </Tooltip>
              )
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}
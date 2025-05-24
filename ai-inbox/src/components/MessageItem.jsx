import {
  Description, Image, InsertDriveFile, MailOutline, PictureAsPdf, Star,
  StarBorder
} from '@mui/icons-material';
import {
  Avatar,
  Box, Chip,
  IconButton, Paper, Tooltip, Typography
} from '@mui/material';
import { formatDistanceToNowStrict } from 'date-fns';

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

const abbreviateTime = (str) => {
  return str
    .replace(' seconds', 's')
    .replace(' second', 's')
    .replace(' minutes', 'm')
    .replace(' minute', 'm')
    .replace(' hours', 'h')
    .replace(' hour', 'h')
    .replace(' days', 'd')
    .replace(' day', 'd')
    .replace(' months', 'mo')
    .replace(' month', 'mo')
    .replace(' years', 'y')
    .replace(' year', 'y');
};

const getFileIcon = (type) => {
  if (type.startsWith('image/')) return <Image fontSize="small" />;
  if (type === 'application/pdf') return <PictureAsPdf fontSize="small" />;
  if (type.startsWith('text/') || type === 'application/msword' || type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') 
    return <Description fontSize="small" />;
  return <InsertDriveFile fontSize="small" />;
};

export default function MessageItem({ message, onToggleStar }) {
  const avatarColor = stringToColor(message.sender);
  const relativeTimeRaw = formatDistanceToNowStrict(new Date(message.timestamp));
  const relativeTime = abbreviateTime(relativeTimeRaw);
  const isStarred = message.starred || false;

  const handleToggleStar = (e) => {
    e.stopPropagation();
    if (onToggleStar) onToggleStar(message.id);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: message.isUser ? 'flex-end' : 'flex-start',
        mb: 2,
        position: 'relative',
        '&:hover .star-button': {
          visibility: 'visible'
        }
      }}
    >
      {!message.isUser && (
        <Avatar
          sx={{
            bgcolor: avatarColor,
            mr: 1,
            color: '#fff',
            width: 36,
            height: 36
          }}
        >
          {message.sender.charAt(0)}
        </Avatar>
      )}
      <Box sx={{ maxWidth: '80%', minWidth: '40%' }}>
        {!message.isUser && (
          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
            {message.sender}
          </Typography>
        )}
        <Paper
          elevation={1}
          sx={{
            p: 2,
            bgcolor: message.isUser ? 'primary.main' : 'background.paper',
            color: message.isUser ? 'primary.contrastText' : 'text.primary',
            borderRadius: message.isUser
              ? '18px 18px 0 18px'
              : '18px 18px 18px 0',
            position: 'relative'
          }}
        >
          <Typography sx={{ wordBreak: 'break-word' }}>{message.text}</Typography>
          
          {message.files?.length > 0 && (
            <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
              {message.files.map((file, index) => (
                <Chip
                  key={index}
                  icon={getFileIcon(file.type)}
                  label={`${file.name} (${(file.size / 1024).toFixed(1)} KB)`}
                  sx={{
                    maxWidth: '100%',
                    justifyContent: 'flex-start',
                    bgcolor: message.isUser ? 'primary.dark' : 'action.hover',
                    color: message.isUser ? 'primary.contrastText' : 'text.primary'
                  }}
                  onClick={() => {
                    // Handle file download/view in a real app
                    console.log('View file:', file.name);
                  }}
                />
              ))}
            </Box>
          )}
        </Paper>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: message.isUser ? 'flex-end' : 'flex-start',
            mt: 0.5,
            gap: 0.5,
            px: 1
          }}
        >
          <MailOutline sx={{ fontSize: 14, color: 'text.secondary' }} />
          <Typography variant="caption" color="text.secondary">
            {relativeTime}
          </Typography>
          
          <Tooltip title={isStarred ? "Unstar message" : "Star message"}>
            <IconButton 
              size="small" 
              onClick={handleToggleStar}
              className="star-button"
              sx={{ 
                visibility: isStarred ? 'visible' : 'hidden',
                ml: 0.5,
                color: isStarred ? 'warning.main' : 'text.secondary'
              }}
            >
              {isStarred ? <Star fontSize="small" /> : <StarBorder fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
}
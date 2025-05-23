import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { Avatar, Box, Paper, Typography } from '@mui/material';
import { formatDistanceToNowStrict } from 'date-fns';

// Generate consistent color from a string
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

// Convert "minutes" to "min", "hours" to "hr", etc.
const abbreviateTime = (str) => {
  return str
    .replace(' seconds', ' sec')
    .replace(' second', ' sec')
    .replace(' minutes', ' min')
    .replace(' minute', ' min')
    .replace(' hours', ' hr')
    .replace(' hour', ' hr')
    .replace(' days', ' day')
    .replace(' day', ' day')
    .replace(' months', ' mo')
    .replace(' month', ' mo')
    .replace(' years', ' yr')
    .replace(' year', ' yr');
};

export default function MessageItem({ message }) {
  const avatarColor = stringToColor(message.sender);
  const relativeTimeRaw = formatDistanceToNowStrict(new Date(message.timestamp));
  const relativeTime = abbreviateTime(relativeTimeRaw);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: message.isUser ? 'flex-end' : 'flex-start',
        mb: 2,
      }}
    >
      {!message.isUser && (
        <Avatar
          sx={{
            bgcolor: avatarColor,
            mr: 1,
            color: '#fff',
          }}
        >
          {message.sender.charAt(0)}
        </Avatar>
      )}
      <Box sx={{ maxWidth: '70%' }}>
        {!message.isUser && (
          <Typography variant="caption" color="text.secondary">
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
          }}
        >
          <Typography>{message.text}</Typography>
        </Paper>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: message.isUser ? 'flex-end' : 'flex-start',
            mt: 0.5,
            gap: 0.5,
          }}
        >
          <MailOutlineIcon sx={{ fontSize: 14 }} />
          {relativeTime}
        </Typography>
      </Box>
    </Box>
  );
}

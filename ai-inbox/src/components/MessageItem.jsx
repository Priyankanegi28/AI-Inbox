import { Avatar, Box, Paper, Typography } from '@mui/material';
import { format } from 'date-fns';

export default function MessageItem({ message }) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: message.isUser ? 'flex-end' : 'flex-start',
        mb: 2
      }}
    >
      {!message.isUser && (
        <Avatar sx={{ bgcolor: 'primary.main', mr: 1 }}>
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
              : '18px 18px 18px 0'
          }}
        >
          <Typography>{message.text}</Typography>
        </Paper>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: message.isUser ? 'right' : 'left' }}>
          {format(message.timestamp, 'h:mm a')}
        </Typography>
      </Box>
    </Box>
  );
}
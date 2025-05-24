import { Box, Button, ButtonGroup, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';

const InboxButton = styled(Button)(({ theme, ownerState }) => {
  const isDark = theme.palette.mode === 'dark';
  const isActive = ownerState.active;
  
  return {
    color: isActive 
      ? isDark ? '#000000' : '#ffffff'
      : isDark ? '#ffffff' : '#000000',
      
    borderColor: isDark ? '#ffffff' : '#000000',
    
    backgroundColor: isActive 
      ? isDark ? '#ffffff' : '#000000'
      : 'transparent',
    
    '&:hover': {
      backgroundColor: isActive
        ? isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)'
        : isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
      borderColor: isDark ? '#ffffff' : '#000000',
    },
    
    '&.MuiButton-contained': {
      boxShadow: 'none',
      '&:hover': {
        boxShadow: 'none',
      }
    },
    
    '&.MuiButton-root': {
      minWidth: '80px',
    }
  };
});

export default function InboxSelector({ activeInbox, onChange }) {
  const theme = useTheme();
  const inboxes = [
    { id: 'all', label: 'All' },
    { id: 'archived', label: 'Archived' },
    { id: 'deleted', label: 'Deleted' }
  ];

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
      <ButtonGroup variant="outlined" size="small">
        {inboxes.map((inbox) => (
          <InboxButton
            key={inbox.id}
            onClick={() => onChange(inbox.id)}
            variant={activeInbox === inbox.id ? 'contained' : 'outlined'}
            ownerState={{ active: activeInbox === inbox.id }}
          >
            {inbox.label}
          </InboxButton>
        ))}
      </ButtonGroup>
    </Box>
  );
}
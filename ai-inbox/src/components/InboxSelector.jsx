// InboxSelector.jsx
import { Box, Button, ButtonGroup } from '@mui/material';

export default function InboxSelector({ activeInbox, onChange }) {
  const inboxes = [
    { id: 'all', label: 'All' },
    { id: 'archived', label: 'Archived' },
    { id: 'deleted', label: 'Deleted' }
  ];

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
      <ButtonGroup variant="outlined" size="small">
        {inboxes.map((inbox) => (
          <Button
            key={inbox.id}
            onClick={() => onChange(inbox.id)}
            variant={activeInbox === inbox.id ? 'contained' : 'outlined'}
          >
            {inbox.label}
          </Button>
        ))}
      </ButtonGroup>
    </Box>
  );
}
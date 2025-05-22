import { Box, Typography } from '@mui/material';
import InboxItem from './InboxItem';

export default function InboxList({
  conversations,
  selectedId,
  onSelect,
  onToggleStar,
  onArchive,
  onDelete,
  onRestore,
  activeInbox
}) {
  return (
    <Box sx={{ overflowY: 'auto', height: 'calc(100vh - 64px)' }}>
      <Box sx={{ 
        p: 2,
        position: 'sticky',
        top: 0,
        zIndex: 1,
        backgroundColor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        <Typography variant="h6" fontWeight="bold">
          {activeInbox === 'all' ? 'Your Inbox' : 
           activeInbox === 'archived' ? 'Archived' : 'Deleted'}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {conversations.length} {conversations.length === 1 ? 'conversation' : 'conversations'}
        </Typography>
      </Box>

      {conversations.map((conversation) => (
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
        />
      ))}
    </Box>
  );
}
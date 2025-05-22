// InboxList.jsx
import { Box, Typography } from '@mui/material';
import InboxItem from './InboxItem';

export default function InboxList({
  conversations,
  selectedId,
  onSelect,
  onToggleStar,
  onArchive,
  onDelete,
  activeInbox,
  setActiveInbox
}) {
  return (
    <Box sx={{ overflowY: 'auto', height: 'calc(100vh - 64px)' }}>
      {/* Add the "Your Inbox" heading */}
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
          Your Inbox
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {conversations.length} {conversations.length === 1 ? 'conversation' : 'conversations'}
        </Typography>
      </Box>

      {/* Conversation list */}
      {conversations.map((conversation) => (
        <InboxItem
          key={conversation.id}
          conversation={conversation}
          isSelected={selectedId === conversation.id}
          onClick={() => onSelect(conversation.id)}
          onToggleStar={onToggleStar}
          onArchive={onArchive}
          onDelete={onDelete}
          activeInbox={activeInbox}
          setActiveInbox={setActiveInbox}
        />
      ))}
    </Box>
  );
}
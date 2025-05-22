export const conversations = [
  {
    id: '1',
    name: 'Labs - Github',
    preview: 'May I have a question...',
    status: 'Also',
    unread: true,
    messages: [
      {
        id: '101',
        sender: 'Labs - Github',
        text: 'May I have a question about the API documentation?',
        timestamp: new Date('2023-05-15T10:30:00'),
        isUser: false
      }
    ]
  },
  {
    id: '2',
    name: 'I was - Mike',
    preview: 'Hi there, I have a du...',
    status: 'Soon',
    unread: false,
    messages: [
      {
        id: '201',
        sender: 'I was - Mike',
        text: 'Hi there, I have a duplicate purchase I need help with',
        timestamp: new Date('2023-05-16T11:45:00'),
        isUser: false
      }
    ]
  },
  {
    id: '3',
    name: 'Luis Easton',
    preview: 'Return request',
    status: 'Today',
    unread: true,
    messages: [
      {
        id: '301',
        sender: 'Luis Easton',
        text: 'I bought a product from your store in November as a Christmas gift for a member of my family. However, it turns out they have something very similar already. I was hoping you\'d be able to return me, as it is un-opened.',
        timestamp: new Date('2023-05-17T09:15:00'),
        isUser: false
      },
      {
        id: '302',
        sender: 'You',
        text: 'Let me just look into this for you, Luis.',
        timestamp: new Date('2023-05-17T09:20:00'),
        isUser: true
      }
    ]
  }
  // Add more conversations as needed
];

export const aiSuggestions = {
  '1': [
    "The API documentation can be found at developers.example.com/docs",
    "For authentication, you'll need an API key first"
  ],
  '3': [
    "Our return policy allows unopened items within 60 days",
    "Would you like store credit or a refund to your original payment method?"
  ]
};
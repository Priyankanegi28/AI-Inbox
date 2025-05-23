export const conversations = [
  {
    id: '1',
    name: 'Labs - Github',
    preview: 'May I have a question...',
    status: 'Active',  // Changed from "Also"
    unread: true,
    messages: [
      {
        id: '101',
        sender: 'Labs - Github',
        text: 'May I have a question about the API documentation?',
        timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
        isUser: false
      }
    ]
  },
  {
    id: '2',
    name: 'I was - Mike',
    preview: 'Hi there, I have a du...',
    status: 'Pending',  // Changed from "Soon"
    unread: false,
    messages: [
      {
        id: '201',
        sender: 'I was - Mike',
        text: 'Hi there, I have a duplicate purchase I need help with',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        isUser: false
      }
    ]
  },
  {
    id: '3',
    name: 'Luis Easton',
    preview: 'Return request',
    status: 'New',  // Changed from "Today"
    unread: true,
    messages: [
      {
        id: '301',
        sender: 'Luis Easton',
        text: 'I bought a product from your store in November as a Christmas gift...',
        timestamp: new Date(Date.now() - 20 * 60 * 1000), // 20 minutes ago
        isUser: false
      },
      {
        id: '302',
        sender: 'You',
        text: 'Let me just look into this for you, Luis.',
        timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        isUser: true
      }
    ]
  }
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
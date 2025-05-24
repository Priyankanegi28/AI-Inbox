export const conversations = [
  {
    id: '1',
    name: 'GitHub Support',
    preview: 'Question about API rate limits...',
    status: 'Active',
    unread: true,
    avatar: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
    messages: [
      {
        id: '101',
        sender: 'GitHub Support',
        text: 'Hello! I noticed you were working with our API. Do you have any questions about the rate limits or authentication process?',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        isUser: false
      },
      {
        id: '102',
        sender: 'You',
        text: "Yes, I'm getting 403 errors when making too many requests. How can I handle this properly?",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        isUser: true
      }
    ]
  },
  {
    id: '2',
    name: 'Mike Johnson (Customer)',
    preview: 'Duplicate order #45892...',
    status: 'Pending',
    unread: false,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    messages: [
      {
        id: '201',
        sender: 'Mike Johnson',
        text: "Hi there! I accidentally placed two identical orders (#45892 and #45893). Can you help cancel one and refund the amount?",
        timestamp: new Date(Date.now() - 120 * 60 * 1000),
        isUser: false
      },
      {
        id: '202',
        sender: 'You',
        text: "I've checked your orders. Would you like us to cancel #45893 and process the refund to your original payment method?",
        timestamp: new Date(Date.now() - 90 * 60 * 1000),
        isUser: true
      }
    ]
  },
  {
    id: '3',
    name: 'Luis Easton (Returns)',
    preview: 'Return request for order #45721...',
    status: 'New',
    unread: true,
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    messages: [
      {
        id: '301',
        sender: 'Luis Easton',
        text: "Hello, I purchased a winter jacket (order #45721) in November as a Christmas gift, but it wasn't needed. The item is unopened with tags. How can I return it?",
        timestamp: new Date(Date.now() - 20 * 60 * 1000),
        isUser: false
      },
      {
        id: '302',
        sender: 'You',
        text: "Thank you for reaching out, Luis. Let me check the return options for your order.",
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        isUser: true
      }
    ]
  },
  {
    id: '4',
    name: 'Sarah Williams (Billing)',
    preview: 'Invoice discrepancy...',
    status: 'Active',
    unread: false,
    avatar: 'https://randomuser.me/api/portraits/women/63.jpg',
    messages: [
      {
        id: '401',
        sender: 'Sarah Williams',
        text: "Hi, I noticed a discrepancy in my recent invoice (#INV-78945). I was charged for 5 licenses but only received 4. Can you look into this?",
        timestamp: new Date(Date.now() - 180 * 60 * 1000),
        isUser: false
      },
      {
        id: '402',
        sender: 'You',
        text: "I've reviewed your invoice and can confirm the error. We'll issue a credit for the difference immediately.",
        timestamp: new Date(Date.now() - 150 * 60 * 1000),
        isUser: true
      }
    ]
  },
  {
    id: '5',
    name: 'Tech Support',
    preview: 'Trouble with integration...',
    status: 'New',
    unread: true,
    avatar: 'https://cdn-icons-png.flaticon.com/512/2165/2165004.png',
    messages: [
      {
        id: '501',
        sender: 'Tech Support',
        text: "Our team noticed your integration is failing with error code 502. Would you like assistance troubleshooting this issue?",
        timestamp: new Date(Date.now() - 25 * 60 * 1000),
        isUser: false
      }
    ]
  }
];

export const aiSuggestions = {
  '1': [
    "GitHub's standard API rate limit for authenticated users is 5000 requests per hour. If you exceed this limit, you'll start receiving 403 responses. Consider breaking down your requests or waiting for the limit to reset before trying again.",
    "You can monitor your current rate limit status by inspecting the 'X-RateLimit-Remaining' response header from GitHub’s API. This helps you plan your requests and avoid hitting the limit unexpectedly.",
    "If you're encountering 403 errors due to rate limits, consider implementing an exponential backoff strategy. This technique increases wait time between retries, reducing the chance of hitting the limit repeatedly and giving time for your rate limit to reset.",
    "Would you like me to provide sample code demonstrating how to handle GitHub API rate limits in your preferred programming language (e.g., JavaScript, Python)? This will make it easier to integrate proper rate-limit handling into your application."
  ],
  '2': [
    "I can initiate the cancellation of order #45893 right away and process the refund to the original payment method. Please confirm that this is the order you'd like to cancel so we can proceed without delay.",
    "Refunds are typically processed within 3-5 business days, but this can vary depending on your payment provider. You’ll receive an email confirmation as soon as the refund is processed on our end.",
    "As an alternative to a refund, we can offer you store credit of the same value. Store credit can be used for any future purchases and may be processed faster. Would you like to opt for this option?",
    "As a token of apology for the duplicate order, we're happy to offer you a 10% discount on your next purchase. This is our way of saying thank you for your patience and understanding."
  ],
  '3': [
    "Our return policy allows for the return of unopened items within 60 days of the purchase date. Since your order was placed for the holidays and the item is still sealed, you should qualify for a full refund.",
    "Would you like me to email you a pre-paid return shipping label? The cost of the return shipping will be deducted from the refund. This option is convenient and ensures the return is processed smoothly.",
    "If you prefer, we can also process an exchange for a different item instead of a refund. Please let me know which option you’d like so we can proceed accordingly.",
    "For added convenience, we can schedule a UPS pickup at your address for the return. This saves you a trip to the shipping center. Would you like me to arrange that for you?"
  ],
  '4': [
    "I've processed a credit of $49.99, which will appear on your next billing statement. This adjustment resolves the discrepancy with your invoice (#INV-78945). If you need a confirmation email, just let me know!",
    "If you prefer, I can immediately provide the missing license key that was not delivered as part of the original order. This will ensure you have full access to all your purchased features.",
    "As a gesture of goodwill for the inconvenience, we’d like to offer you one month of complimentary service. Would you like me to apply this credit to your account now?",
    "If you’re unsure how to activate the new license, I can walk you through the activation steps. It’s a simple process, and I’ll ensure you’re up and running without any further issues."
  ],
  '5': [
    "A 502 error typically indicates a gateway timeout, which means our servers did not receive a timely response from your endpoint. Have you checked whether your API endpoint is accessible and responsive?",
    "We recommend verifying that your authentication tokens and API credentials are valid and up to date. Expired tokens are a common cause of integration errors like the one you’re encountering.",
    "Would you like me to connect you with our senior integration specialist? They can provide a deeper technical dive into the issue and help you resolve it efficiently.",
    "I can also provide you with a detailed troubleshooting guide specific to error 502. This guide walks through common causes and recommended fixes to help you get your integration back online quickly."
  ]
};

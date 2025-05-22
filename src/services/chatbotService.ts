
export type ChatMessage = {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
};

// Sample responses for different user queries
const botResponses: Record<string, string[]> = {
  greeting: [
    "Hello! How can I help you with DiscussX today?",
    "Hi there! I'm your DiscussX assistant. What do you need help with?",
    "Welcome to DiscussX! How can I assist you?"
  ],
  features: [
    "DiscussX offers thread discussions, post creation, comments, and a modern UI inspired by X (Twitter).",
    "You can create posts, reply to discussions, like content, and interact with other users on DiscussX."
  ],
  account: [
    "You can create an account by clicking on the Sign Up button. You'll need to provide an email, username, and password.",
    "To manage your account, go to your profile by clicking on your avatar in the top right corner."
  ],
  post: [
    "To create a new post, click on the 'New Post' button on the home page and type your message.",
    "Posts can include text and will appear in the main timeline. Others can reply to your posts."
  ],
  unknown: [
    "I'm not sure I understand. Could you rephrase your question?",
    "I don't have information about that yet. Can I help with something else related to DiscussX?",
    "That's beyond my knowledge currently. Can I assist with using DiscussX features instead?"
  ]
};

// Helper to get a random response from an array
const getRandomResponse = (responses: string[]): string => {
  const index = Math.floor(Math.random() * responses.length);
  return responses[index];
};

// Helper to find the most appropriate category based on user input
const categorizeInput = (input: string): string => {
  input = input.toLowerCase();
  
  if (input.match(/hello|hi|hey|greetings/)) {
    return 'greeting';
  } 
  else if (input.match(/feature|do|can|function|work|use/)) {
    return 'features';
  }
  else if (input.match(/account|profile|sign|login|register|password|email/)) {
    return 'account';
  }
  else if (input.match(/post|write|create|publish|message|content|thread/)) {
    return 'post';
  }
  else {
    return 'unknown';
  }
};

export const generateBotResponse = async (userMessage: string): Promise<ChatMessage> => {
  // Simulate network delay for a more realistic experience
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const category = categorizeInput(userMessage);
  const responseText = getRandomResponse(botResponses[category] || botResponses.unknown);
  
  return {
    id: `bot-${Date.now()}`,
    text: responseText,
    isBot: true,
    timestamp: new Date()
  };
};

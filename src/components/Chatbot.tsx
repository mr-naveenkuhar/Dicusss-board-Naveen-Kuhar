
import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage, generateBotResponse } from '@/services/chatbotService';
import { useAuth } from '@/contexts/AuthContext';

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // Auto-scroll to most recent messages
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Add initial bot greeting when component mounts
  useEffect(() => {
    const initialMessage: ChatMessage = {
      id: 'welcome',
      text: "Hello! I'm your DiscussX assistant. How can I help you today?",
      isBot: true,
      timestamp: new Date()
    };
    setMessages([initialMessage]);
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;
    
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      text: inputMessage,
      isBot: false,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    
    try {
      const botResponse = await generateBotResponse(userMessage.text);
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error generating bot response:', error);
      
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        text: "Sorry, I'm having trouble responding right now. Please try again later.",
        isBot: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full border border-gray-700 rounded-lg overflow-hidden">
      <div className="bg-secondary p-3 border-b border-gray-700">
        <h2 className="font-semibold">DiscussX Assistant</h2>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="flex flex-col space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id}
              className={`flex items-start gap-2 ${
                message.isBot ? 'justify-start' : 'justify-end'
              }`}
            >
              {message.isBot && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt="DiscussX Bot" />
                  <AvatarFallback>DX</AvatarFallback>
                </Avatar>
              )}
              
              <div 
                className={`max-w-[75%] rounded-lg px-3 py-2 ${
                  message.isBot 
                    ? 'bg-secondary text-secondary-foreground' 
                    : 'bg-xBlue text-white ml-auto'
                }`}
              >
                <p>{message.text}</p>
              </div>
              
              {!message.isBot && user && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.profileImage} alt={user.displayName} />
                  <AvatarFallback>{user.displayName.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex items-start gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" alt="DiscussX Bot" />
                <AvatarFallback>DX</AvatarFallback>
              </Avatar>
              <div className="bg-secondary text-secondary-foreground rounded-lg px-3 py-2">
                <p>Typing<span className="animate-pulse">...</span></p>
              </div>
            </div>
          )}
          
          <div ref={endOfMessagesRef} />
        </div>
      </ScrollArea>
      
      <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-700 flex gap-2">
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask me anything..."
          className="flex-1"
        />
        <Button 
          type="submit" 
          size="icon" 
          disabled={!inputMessage.trim() || isTyping}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default Chatbot;

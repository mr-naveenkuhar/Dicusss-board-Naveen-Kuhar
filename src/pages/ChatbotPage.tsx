import React from 'react';
import Chatbot from '@/components/Chatbot';
import MainNavigation from '@/components/MainNavigation';

const ChatbotPage: React.FC = () => {
  return (
    <div>
      <MainNavigation />
      <div className="container mt-4">
        <h1 className="mb-4">Chatbot Assistant</h1>
        <div className="card">
          <div className="card-body">
            <Chatbot />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;

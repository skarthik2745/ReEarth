import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader } from 'lucide-react';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function AIChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m EcoBot, your AI assistant for environmental sustainability. Ask me anything about climate change, renewable energy, carbon footprint, or eco-friendly practices!',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            {
              role: 'system',
              content: 'You are EcoBot, an AI assistant specialized in environmental sustainability, climate change, renewable energy, carbon footprint, conservation, and eco-friendly practices. Provide helpful, accurate, and actionable advice. Keep responses concise but informative. Always encourage sustainable actions.'
            },
            ...messages.slice(-5).map(msg => ({
              role: msg.sender === 'user' ? 'user' : 'assistant',
              content: msg.text
            })),
            {
              role: 'user',
              content: inputMessage
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (response.ok) {
        const data = await response.json();
        const botResponse = data.choices?.[0]?.message?.content || 'Sorry, I couldn\'t process that request.';
        
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: botResponse,
          sender: 'bot',
          timestamp: new Date()
        };

        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error('API request failed');
      }
    } catch (error) {
      console.error('Chat Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I\'m having trouble connecting right now. Please try again later.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="arcade-h1 mb-4">ECOBOT AI ASSISTANT</h1>
        <p className="arcade-text arcade-text-yellow">YOUR PERSONAL SUSTAINABILITY ADVISOR</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[600px] mb-32">
        {/* Left Side - AI Robot Image */}
        <div className="arcade-dialog p-8 flex items-center justify-center">
          <div className="text-center">
            <img 
              src="/re-earth-ai-bot.jpeg" 
              alt="AI Robot Assistant" 
              className="w-full max-w-md mx-auto rounded-lg border-4 border-cyan-400 shadow-lg"
              onError={(e) => {
                // Fallback if image doesn't exist
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling!.classList.remove('hidden');
              }}
            />
            <div className="hidden">
              <div className="w-64 h-64 mx-auto bg-gradient-to-br from-cyan-400 to-green-400 rounded-full flex items-center justify-center border-4 border-white">
                <Bot className="w-32 h-32 text-black" />
              </div>
            </div>
            <div className="mt-6">
              <h2 className="arcade-h2 mb-2">ECOBOT</h2>
              <p className="arcade-text arcade-text-cyan text-xs">AI-POWERED ENVIRONMENTAL ASSISTANT</p>
              <div className="mt-4 space-y-2">
                <div className="arcade-card arcade-card-green p-2">
                  <span className="arcade-text text-xs">🌱 SUSTAINABILITY EXPERT</span>
                </div>
                <div className="arcade-card arcade-card-cyan p-2">
                  <span className="arcade-text text-xs">♻️ ECO-FRIENDLY SOLUTIONS</span>
                </div>
                <div className="arcade-card arcade-card-yellow p-2">
                  <span className="arcade-text text-xs">🌍 CLIMATE ACTION GUIDE</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Chat Area */}
        <div className="arcade-dialog p-6 flex flex-col">
          <h2 className="arcade-h2 mb-4 text-center">CHAT WITH ECOBOT</h2>
          
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${
                  message.sender === 'user' 
                    ? 'arcade-card arcade-card-cyan' 
                    : 'arcade-card arcade-card-green'
                } p-3`}>
                  <div className="flex items-start gap-2">
                    {message.sender === 'bot' && <Bot className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />}
                    {message.sender === 'user' && <User className="w-4 h-4 text-cyan-400 mt-1 flex-shrink-0" />}
                    <div>
                      <p className="arcade-text text-xs leading-relaxed">{message.text}</p>
                      <span className="arcade-text arcade-text-yellow text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="arcade-card arcade-card-green p-3">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-green-400" />
                    <Loader className="w-4 h-4 animate-spin text-green-400" />
                    <span className="arcade-text text-xs">EcoBot is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t-2 border-cyan-400 pt-4">
            <div className="flex gap-2">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about sustainability, climate change, renewable energy..."
                className="flex-1 arcade-input resize-none"
                rows={2}
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="arcade-btn arcade-btn-primary px-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                onClick={() => setInputMessage('How can I reduce my carbon footprint?')}
                className="arcade-card p-2 text-xs hover:arcade-card-cyan cursor-pointer"
                disabled={isLoading}
              >
                Carbon Footprint
              </button>
              <button
                onClick={() => setInputMessage('What are the best renewable energy sources?')}
                className="arcade-card p-2 text-xs hover:arcade-card-cyan cursor-pointer"
                disabled={isLoading}
              >
                Renewable Energy
              </button>
              <button
                onClick={() => setInputMessage('Give me tips for sustainable living')}
                className="arcade-card p-2 text-xs hover:arcade-card-cyan cursor-pointer"
                disabled={isLoading}
              >
                Sustainable Living
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
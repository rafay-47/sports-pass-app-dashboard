import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Card, CardContent } from './ui/card';
import { 
  Send, 
  Bot, 
  User, 
  Lock, 
  MessageCircle, 
  Sparkles,
  Clock,
  HelpCircle,
} from 'lucide-react';
import { type User as UserType } from '../types';

interface ChatBotScreenProps {
  user: UserType | null;
  onSignup: () => void;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'info';
}

const QUICK_QUESTIONS = [
  "How do I book a trainer?",
  "What are membership benefits?", 
  "How to cancel membership?",
  "Facility locations?",
  "Check-in process?",
  "Event registration help"
];

const BOT_RESPONSES = {
  "how do i book a trainer": "To book a trainer:\n1. Go to Main screen\n2. Select your sport\n3. Click 'Personal Trainer' service\n4. Choose from available trainers based on your membership tier\n5. Select time slot and confirm booking",
  "what are membership benefits": "Membership benefits include:\n• Access to premium facilities\n• Discounted services (10-30% off)\n• Monthly check-ins (30 per month)\n• Exclusive events access\n• Priority booking\n• Trainer services access",
  "how to cancel membership": "To cancel membership:\n1. Go to Profile → Membership Management\n2. Select the membership to cancel\n3. Follow cancellation process\n4. Confirm cancellation\n\nNote: Refunds available within 7 days of purchase.",
  "facility locations": "Find facilities:\n1. Go to Location tab\n2. Use filters (male/female/mixed)\n3. Choose List or Map view\n4. Filter by price range\n5. Use QR code to check-in at facilities",
  "check-in process": "QR Check-in process:\n1. Tap QR scanner button (center of bottom nav)\n2. Scan facility QR code\n3. Automatic check-in if you have valid membership\n4. 30 check-ins allowed per month\n5. Check-ins tracked in membership details",
  "event registration help": "Event registration:\n1. Go to Events tab\n2. Browse available events\n3. Check eligibility (membership required)\n4. Click 'Register' on desired event\n5. Complete payment process\n\nNote: Some events have participant limits!"
};

export default function ChatBotScreen({ user, onSignup }: ChatBotScreenProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: user ? 
        `Hi ${user.name}! 👋 I'm your Sports Club assistant. How can I help you today?` :
        "Welcome to Sports Club Pakistan! 🏆 I'm here to help, but you'll need to sign up first to access personalized assistance.",
      sender: 'bot',
      timestamp: new Date(),
      type: 'info'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!user) {
    return (
      <div className="h-full bg-[#252525] text-white flex flex-col items-center justify-center p-6 rounded-[19px] relative overflow-hidden">
        <div className="absolute top-[100px] right-8 w-20 h-20 bg-[#A148FF]/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-[150px] left-6 w-16 h-16 bg-[#FFB948]/20 rounded-full animate-pulse"></div>
        
        <div className="text-center max-w-sm">
          <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-12 h-12 text-[#FFB948]" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-4">AI Assistant Access Restricted</h2>
          <p className="text-white/70 text-base mb-6 leading-relaxed">
            Get instant help with memberships, bookings, and facility information. Sign up to chat with our AI assistant for personalized support.
          </p>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 text-white/60 text-sm">
              <Bot className="w-5 h-5 text-[#A148FF]" />
              <span>24/7 instant support</span>
            </div>
            <div className="flex items-center gap-3 text-white/60 text-sm">
              <MessageCircle className="w-5 h-5 text-[#FFB948]" />
              <span>Personalized assistance</span>
            </div>
            <div className="flex items-center gap-3 text-white/60 text-sm">
              <Sparkles className="w-5 h-5 text-green-400" />
              <span>Smart recommendations</span>
            </div>
          </div>
          
          <Button
            onClick={onSignup}
            className="w-full bg-gradient-to-r from-[#A148FF] to-[#FFB948] hover:from-[#A148FF]/90 hover:to-[#FFB948]/90 text-white font-bold py-3 text-base"
          >
            Sign Up to Chat with AI
          </Button>
          
          <div className="mt-4 text-xs text-white/50">
            Get instant answers to all your questions
          </div>
        </div>
      </div>
    );
  }

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const response = getBotResponse(inputValue);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const getBotResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    // Check for exact matches first
    for (const [key, response] of Object.entries(BOT_RESPONSES)) {
      if (lowerInput.includes(key)) {
        return response;
      }
    }

    // General responses for common topics
    if (lowerInput.includes('membership') || lowerInput.includes('member')) {
      return "I can help with membership questions! You can:\n• View membership plans\n• Check benefits and pricing\n• Manage your current memberships\n• Get help with upgrades\n\nWhat specific membership question do you have?";
    }
    
    if (lowerInput.includes('trainer') || lowerInput.includes('coach')) {
      return "About trainers:\n• Personal trainers available for all sports\n• Fixed rates by membership tier\n• Book through your membership services\n• Rates: Basic Rs 5K, Standard Rs 10K, Premium Rs 15K/hour\n\nWould you like help booking a trainer?";
    }
    
    if (lowerInput.includes('event') || lowerInput.includes('tournament')) {
      return "Events & Tournaments:\n• Check Events tab for upcoming competitions\n• Registration requires active membership\n• Filter by sport, difficulty, and category\n• Win prizes and certificates!\n\nLooking for a specific event type?";
    }
    
    if (lowerInput.includes('location') || lowerInput.includes('facility')) {
      return "Facility Information:\n• Use Location tab to find nearby facilities\n• Filter by gender preferences and price\n• Map and list views available\n• QR code check-in system\n\nNeed help finding a specific facility?";
    }
    
    if (lowerInput.includes('payment') || lowerInput.includes('price')) {
      return "Payment Options:\n• EasyPaisa, JazzCash, SadaPay\n• Bank transfer and MasterCard\n• Secure payment processing\n• Instant membership activation\n\nHaving payment issues?";
    }

    if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
      return `Hello ${user.name}! 👋 Great to see you again. I'm here to help with any questions about:\n• Memberships & Services\n• Trainer bookings\n• Events & Tournaments\n• Facility locations\n• Check-in process\n\nWhat would you like to know?`;
    }

    // Default response
    return "I'm here to help! I can assist you with:\n\n🏋️ Membership information\n🏆 Trainer bookings\n📅 Event registration\n📍 Facility locations\n📱 Check-in process\n💳 Payment questions\n\nPlease ask me anything about these topics, or try one of the quick questions below!";
  };

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
  };

  return (
    <div className="h-full bg-[#252525] text-white flex flex-col rounded-[19px] overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#A148FF] to-[#FFB948] rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">AI Assistant</h1>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white/60 text-sm">Online & Ready to Help</span>
            </div>
          </div>
        </div>

        {/* Quick Questions */}
        <div className="space-y-2">
          <div className="text-white/80 text-sm font-medium">Quick Questions:</div>
          <ScrollArea className="w-full">
            <div className="flex gap-2 pb-2">
              {QUICK_QUESTIONS.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickQuestion(question)}
                  className="whitespace-nowrap border-white/20 text-white hover:bg-white/10 text-xs flex-shrink-0"
                >
                  <HelpCircle className="w-3 h-3 mr-1" />
                  {question}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.sender === 'user' 
                    ? 'bg-[#A148FF]' 
                    : 'bg-gradient-to-br from-[#FFB948] to-[#A148FF]'
                }`}>
                  {message.sender === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>

                {/* Message Content */}
                <div className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <Card className={`${
                    message.sender === 'user'
                      ? 'bg-[#A148FF] border-[#A148FF]/30'
                      : message.type === 'info'
                      ? 'bg-gradient-to-r from-[#A148FF]/20 to-[#FFB948]/20 border-white/20'
                      : 'bg-white/10 border-white/20'
                  } max-w-full`}>
                    <CardContent className="p-3">
                      <div className={`text-sm leading-relaxed whitespace-pre-line ${
                        message.sender === 'user' ? 'text-white' : 'text-white'
                      }`}>
                        {message.content}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className={`flex items-center gap-2 mt-1 text-xs text-white/50 ${
                    message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}>
                    <Clock className="w-3 h-3" />
                    <span>{message.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex gap-3 max-w-[85%]">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-[#FFB948] to-[#A148FF]">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <Card className="bg-white/10 border-white/20">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                      <span className="text-white/60 text-sm">AI is typing...</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="flex-shrink-0 p-4 border-t border-white/10">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me anything about sports club..."
            className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/40"
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            disabled={isTyping}
          />
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping}
            className="bg-gradient-to-r from-[#A148FF] to-[#FFB948] hover:from-[#A148FF]/90 hover:to-[#FFB948]/90"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="text-center mt-2 text-xs text-white/50">
          AI Assistant • Powered by Sports Club AI
        </div>
      </div>
    </div>
  );
}
import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Minimize2 } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      text: "Hi there! I'm your BusGo AI Assistant. How can I help you with your journey today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const generateAIResponse = (userMsg: string) => {
    const lowerMsg = userMsg.toLowerCase();
    
    // Smart Mock Responses based on keywords
    if (lowerMsg.includes('book') || lowerMsg.includes('ticket')) {
      return "To book a ticket, simply enter your source and destination cities on the Home page, select your travel date, and click Search! You'll be able to choose your preferred bus and seats.";
    } else if (lowerMsg.includes('cancel') || lowerMsg.includes('refund')) {
      return "You can cancel your booking anytime before the departure by going to the 'My Bookings' section in your profile. Refunds are processed automatically based on our cancellation policy.";
    } else if (lowerMsg.includes('luggage') || lowerMsg.includes('baggage')) {
      return "Passengers are allowed one main luggage bag (up to 15kg) and one small cabin bag. Extra luggage may incur additional charges depending on the operator.";
    } else if (lowerMsg.includes('payment') || lowerMsg.includes('pay')) {
      return "We accept all major Credit/Debit Cards, UPI (PhonePe, GPay, etc.), and Net Banking. Our payment gateway is 100% secure!";
    } else if (lowerMsg.includes('discount') || lowerMsg.includes('coupon') || lowerMsg.includes('offer')) {
      return "We occasionally offer discounts! Try using the code 'BUSGO20' or 'FLAT100' during checkout to see if they are active.";
    } else if (lowerMsg.includes('hello') || lowerMsg.includes('hi ') || lowerMsg === 'hi') {
      return "Hello! How can I assist you with your travel plans today?";
    } else {
      return "I'm sorry, I couldn't quite understand that. Could you please rephrase? You can ask me about booking tickets, cancellations, luggage rules, or payment methods!";
    }
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const newUserMsg: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setIsTyping(true);
    
    if (isMinimized) setIsMinimized(false);

    // Simulate AI thinking delay
    setTimeout(() => {
      const aiResponseText = generateAIResponse(newUserMsg.text);
      const newAIMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newAIMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickReply = (text: string) => {
    setInput(text);
    // Use timeout to allow state to update before sending
    setTimeout(() => {
      const form = document.getElementById('ai-chat-form') as HTMLFormElement;
      if (form) form.requestSubmit();
    }, 10);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-2xl hover:bg-primary-dark hover:scale-110 transition-all duration-300 z-50 flex items-center justify-center group"
      >
        <MessageSquare className="w-6 h-6" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:ml-3 transition-all duration-300 font-bold text-sm">
          Chat with AI
        </span>
        <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500 border-2 border-white"></span>
        </span>
      </button>
    );
  }

  return (
    <div className={`fixed right-6 bottom-6 w-80 md:w-96 bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden border border-gray-200 transition-all duration-300 ${isMinimized ? 'h-16' : 'h-[500px]'}`}>
      {/* Header */}
      <div className="bg-primary p-4 flex justify-between items-center text-white shrink-0 cursor-pointer" onClick={() => setIsMinimized(!isMinimized)}>
        <div className="flex items-center space-x-2">
          <div className="bg-white/20 p-2 rounded-full">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm">BusGo Assistant</h3>
            <p className="text-xs text-blue-100 flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span> Online
            </p>
          </div>
        </div>
        <div className="flex space-x-1">
          <button onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }} className="p-1 hover:bg-white/20 rounded transition">
            <Minimize2 className="w-4 h-4" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} className="p-1 hover:bg-white/20 rounded transition">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col space-y-4">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${msg.sender === 'user' ? 'bg-gray-200 ml-2' : 'bg-primary/10 mr-2'}`}>
                    {msg.sender === 'user' ? <User className="w-4 h-4 text-gray-600" /> : <Bot className="w-4 h-4 text-primary" />}
                  </div>
                  <div className={`p-3 rounded-2xl text-sm ${msg.sender === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm'}`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex flex-row max-w-[85%]">
                  <div className="shrink-0 h-8 w-8 rounded-full bg-primary/10 mr-2 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length < 3 && !isTyping && (
            <div className="px-4 py-2 bg-white flex space-x-2 overflow-x-auto scrollbar-hide border-t border-gray-100">
              <button onClick={() => handleQuickReply('How to book a ticket?')} className="shrink-0 bg-blue-50 text-primary text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-100 hover:bg-blue-100 transition">How to book?</button>
              <button onClick={() => handleQuickReply('Cancellation policy')} className="shrink-0 bg-blue-50 text-primary text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-100 hover:bg-blue-100 transition">Cancellation policy</button>
            </div>
          )}

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-200">
            <form id="ai-chat-form" onSubmit={handleSend} className="flex items-center space-x-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..." 
                className="flex-1 bg-gray-100 border-transparent focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary rounded-full px-4 py-2 outline-none text-sm transition"
              />
              <button 
                type="submit" 
                disabled={!input.trim() || isTyping}
                className="p-2 bg-primary text-white rounded-full hover:bg-primary-dark transition disabled:bg-gray-300 disabled:cursor-not-allowed shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default AIAssistant;

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MessageCircle, 
  X, 
  Send, 
  User, 
  HeadphonesIcon,
  Clock,
  Star,
  Crown
} from "lucide-react";

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  agentName?: string;
  agentAvatar?: string;
}

interface LiveChatProps {
  isVIP?: boolean;
  customerName?: string;
  customerEmail?: string;
}

const LiveChat = ({ isVIP = false, customerName, customerEmail }: LiveChatProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatStatus, setChatStatus] = useState<'connecting' | 'connected' | 'waiting'>('connecting');
  const [agentInfo, setAgentInfo] = useState<{
    name: string;
    avatar: string;
    status: 'online' | 'busy' | 'offline';
    responseTime: string;
  } | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simulate connection process
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setChatStatus('connected');
        setAgentInfo({
          name: isVIP ? 'Sarah Johnson' : 'Mike Chen',
          avatar: isVIP ? '/agents/sarah.jpg' : '/agents/mike.jpg',
          status: 'online',
          responseTime: isVIP ? '< 1 min' : '2-3 min'
        });
        
        // Add welcome message
        addAgentMessage(
          isVIP 
            ? `Welcome ${customerName || 'VIP Customer'}! I'm Sarah, your dedicated VIP support agent. How can I assist you today?`
            : `Hello! I'm Mike from SkyShip support. How can I help you today?`
        );
      }, 2000);
    }
  }, [isOpen, isVIP, customerName]);

  const addAgentMessage = (text: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: 'agent',
      timestamp: new Date(),
      agentName: agentInfo?.name,
      agentAvatar: agentInfo?.avatar
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");

    // Simulate agent typing
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      
      // Simulate agent response based on message content
      const response = generateAgentResponse(inputMessage);
      addAgentMessage(response);
    }, 1000 + Math.random() * 2000); // Random delay 1-3 seconds
  };

  const generateAgentResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('tracking') || lowerMessage.includes('shipment')) {
      return isVIP 
        ? "I'll check your shipment status immediately. As a VIP customer, I can provide real-time updates and expedite any issues."
        : "I can help you track your shipment. Please provide your tracking number and I'll look it up for you.";
    }
    
    if (lowerMessage.includes('quote') || lowerMessage.includes('price')) {
      return isVIP 
        ? "I'll prepare a personalized quote for you with VIP pricing and priority service options."
        : "I can help you get a quote. Please let me know your shipping requirements and I'll calculate the cost.";
    }
    
    if (lowerMessage.includes('urgent') || lowerMessage.includes('emergency')) {
      return isVIP 
        ? "I understand this is urgent. I'm escalating this to our VIP emergency response team immediately."
        : "I understand this is urgent. Let me connect you with our emergency support team.";
    }
    
    if (lowerMessage.includes('complaint') || lowerMessage.includes('issue')) {
      return isVIP 
        ? "I apologize for any inconvenience. As a VIP customer, I'm personally handling this and will ensure it's resolved immediately."
        : "I apologize for any inconvenience. Let me help resolve this issue for you.";
    }
    
    return isVIP 
      ? "Thank you for your message. I'm here to provide you with the best VIP service experience."
      : "Thank you for your message. I'm here to help you with any questions or concerns.";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    if (isOpen) {
      setIsOpen(false);
      setIsMinimized(false);
    } else {
      setIsOpen(true);
    }
  };

  const minimizeChat = () => {
    setIsMinimized(!isMinimized);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={toggleChat}
          className={`rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 ${
            isVIP 
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          <MessageCircle className="w-6 h-6" />
          {isVIP && (
            <Crown className="w-4 h-4 ml-2 text-yellow-300" />
          )}
        </Button>
        {isVIP && (
          <Badge className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs">
            VIP
          </Badge>
        )}
      </div>
    );
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Card className="w-80 shadow-xl">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  agentInfo?.status === 'online' ? 'bg-green-500' : 
                  agentInfo?.status === 'busy' ? 'bg-yellow-500' : 'bg-gray-500'
                }`} />
                <span className="text-sm font-medium">
                  {isVIP ? 'VIP Support' : 'Live Chat'}
                </span>
                {isVIP && <Crown className="w-4 h-4 text-yellow-500" />}
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={minimizeChat}
                  className="h-6 w-6 p-0"
                >
                  <MessageCircle className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleChat}
                  className="h-6 w-6 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className="w-96 h-[500px] shadow-xl flex flex-col">
        <CardHeader className="pb-2 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                agentInfo?.status === 'online' ? 'bg-green-500' : 
                agentInfo?.status === 'busy' ? 'bg-yellow-500' : 'bg-gray-500'
              }`} />
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  {isVIP ? 'VIP Support' : 'Live Chat'}
                  {isVIP && <Crown className="w-4 h-4 text-yellow-500" />}
                </div>
                {agentInfo && (
                  <p className="text-xs text-gray-600">
                    {agentInfo.name} • {agentInfo.responseTime} response
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={minimizeChat}
                className="h-6 w-6 p-0"
              >
                <MessageCircle className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleChat}
                className="h-6 w-6 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 p-0 flex flex-col">
          {/* Chat Status */}
          {chatStatus === 'connecting' && (
            <div className="p-4 text-center text-sm text-gray-600">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
              Connecting to {isVIP ? 'VIP Support' : 'Support Agent'}...
            </div>
          )}

          {chatStatus === 'waiting' && (
            <div className="p-4 text-center text-sm text-gray-600">
              <Clock className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
              Waiting for next available agent...
            </div>
          )}

          {/* Messages */}
          {chatStatus === 'connected' && (
            <>
              <div 
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-3 max-h-80"
              >
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.sender === 'agent' && (
                      <Avatar className="w-8 h-8 mr-2">
                        <AvatarImage src={message.agentAvatar} />
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {message.agentName?.charAt(0) || 'A'}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                      <div className={`rounded-lg px-3 py-2 ${
                        message.sender === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm">{message.text}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    {message.sender === 'user' && (
                      <Avatar className="w-8 h-8 ml-2">
                        <AvatarFallback className="bg-gray-100 text-gray-600">
                          <User className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <Avatar className="w-8 h-8 mr-2">
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {agentInfo?.name?.charAt(0) || 'A'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-100 rounded-lg px-3 py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t p-3">
                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1"
                    disabled={isTyping}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    size="sm"
                    className={isVIP ? 'bg-purple-600 hover:bg-purple-700' : ''}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* VIP Benefits Notice */}
                {isVIP && (
                  <div className="mt-2 text-xs text-purple-600 flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    VIP Priority Support - Response within 1 minute
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveChat;

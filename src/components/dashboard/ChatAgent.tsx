import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Paperclip } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface ChatMessage {
  id: string;
  user_id: string;
  agent_id: string | null;
  message: string;
  sender_type: 'user' | 'agent';
  created_at: string;
}

const ChatAgent: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      fetchMessages();
      // Set up real-time subscription
      const subscription = supabase
        .channel('chat_messages')
        .on('postgres_changes', 
          { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'chat_messages',
            filter: `user_id=eq.${user.id}`
          }, 
          (payload) => {
            setMessages(prev => [...prev, payload.new as ChatMessage]);
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);

      // If no messages, send welcome message
      if (!data || data.length === 0) {
        await sendWelcomeMessage();
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendWelcomeMessage = async () => {
    if (!user) return;

    const welcomeMessage = {
      user_id: user.id,
      agent_id: 'system',
      message: `Hello ${user.user_metadata?.full_name || 'there'}! 👋 I'm your personal creative agent at Movico Studio. I'm here to help you bring your brand's vision to life through AI-generated content.\n\nI can assist you with:\n• Creating compelling ad concepts\n• Developing brand storytelling strategies\n• Optimizing your content for different platforms\n• Providing creative direction and feedback\n\nWhat would you like to create today?`,
      sender_type: 'agent' as const,
    };

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert(welcomeMessage)
        .select()
        .single();

      if (error) throw error;
      setMessages([data]);
    } catch (error) {
      console.error('Error sending welcome message:', error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || sending) return;

    setSending(true);
    const messageText = newMessage.trim();
    setNewMessage('');

    try {
      // Send user message
      const { data: userMessage, error: userError } = await supabase
        .from('chat_messages')
        .insert({
          user_id: user.id,
          message: messageText,
          sender_type: 'user',
        })
        .select()
        .single();

      if (userError) throw userError;

      // Simulate agent response (in a real app, this would be handled by your backend)
      setTimeout(async () => {
        const agentResponse = generateAgentResponse(messageText);
        
        try {
          await supabase
            .from('chat_messages')
            .insert({
              user_id: user.id,
              agent_id: 'system',
              message: agentResponse,
              sender_type: 'agent',
            });
        } catch (error) {
          console.error('Error sending agent response:', error);
        }
      }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds

    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const generateAgentResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('video') || message.includes('ad')) {
      return "Great! I'd love to help you create a compelling video ad. To get started, could you tell me more about:\n\n• Your target audience\n• The key message you want to convey\n• The tone/style you're aiming for (professional, playful, emotional, etc.)\n• Any specific products or services to highlight\n\nAlso, if you have any brand assets or guidelines uploaded in your Brand Manager, I can reference those to ensure consistency with your brand identity.";
    }
    
    if (message.includes('brand') || message.includes('logo') || message.includes('guideline')) {
      return "I see you're interested in brand-related content! I can help you create content that perfectly aligns with your brand identity.\n\nHave you uploaded your brand assets and guidelines in the Brand Manager section? This helps me understand your:\n• Brand colors and visual style\n• Voice and tone preferences\n• Target audience\n• Key messaging\n\nWith this information, I can create more targeted and effective content for your brand.";
    }
    
    if (message.includes('help') || message.includes('how') || message.includes('what')) {
      return "I'm here to help you create amazing content! Here are some ways I can assist:\n\n🎥 **Video Ads**: Create engaging video advertisements for social media, websites, or campaigns\n📸 **Static Ads**: Design eye-catching static advertisements and graphics\n📝 **Content Strategy**: Develop content plans and creative concepts\n🎯 **Audience Targeting**: Help optimize content for specific demographics\n🎨 **Creative Direction**: Provide feedback and suggestions for your ideas\n\nWhat type of content are you most interested in creating?";
    }
    
    if (message.includes('price') || message.includes('cost') || message.includes('pricing')) {
      return "Our pricing is designed to be flexible and accessible for creators of all sizes. We offer:\n\n• **Per-project pricing** for individual ads and videos\n• **Package deals** for multiple content pieces\n• **Subscription plans** for ongoing content needs\n\nThe exact cost depends on factors like:\n- Content complexity and length\n- Turnaround time requirements\n- Number of revisions needed\n- Additional services (strategy, optimization, etc.)\n\nWould you like me to provide a quote for a specific project? Just describe what you have in mind!";
    }
    
    // Default responses
    const defaultResponses = [
      "That's an interesting point! Could you tell me more about what you're looking to create? I'm here to help bring your creative vision to life.",
      "I'd love to help you with that! To provide the best assistance, could you share more details about your project goals and target audience?",
      "Great question! Let me help you explore the possibilities. What type of content are you most interested in creating - video ads, static graphics, or something else?",
      "I'm excited to work on this with you! To get started, it would be helpful to know more about your brand and what message you want to convey.",
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-12 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Creative Agent</h2>
            <p className="text-sm text-green-600">● Online</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${
              message.sender_type === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              message.sender_type === 'user' 
                ? 'bg-gray-200' 
                : 'bg-black'
            }`}>
              {message.sender_type === 'user' ? (
                <User className="w-4 h-4 text-gray-600" />
              ) : (
                <Bot className="w-4 h-4 text-white" />
              )}
            </div>
            <div className={`max-w-[70%] ${
              message.sender_type === 'user' ? 'text-right' : ''
            }`}>
              <div className={`rounded-2xl px-4 py-2 ${
                message.sender_type === 'user'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <p className="whitespace-pre-wrap">{message.message}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {formatTime(message.created_at)}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200">
        <form onSubmit={sendMessage} className="flex items-center gap-3">
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="bg-black text-white p-2 rounded-full hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatAgent;
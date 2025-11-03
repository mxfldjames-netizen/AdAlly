import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader, MessageCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ChatSession {
  id: string;
  visitor_name: string | null;
  visitor_email: string | null;
  user_id: string | null;
  is_registered: boolean;
  status: string;
  created_at: string;
}

interface ChatMessage {
  id: string;
  message: string;
  sender_type: string;
  sender_name: string;
  sender_email: string | null;
  created_at: string;
}

const ChatAdmin: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSession = async (session: ChatSession) => {
    setSelectedSession(session);
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', session.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedSession) return;

    setSending(true);
    try {
      const { user } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          session_id: selectedSession.id,
          sender_type: 'agent',
          sender_name: 'Support Agent',
          sender_email: user.data?.user?.email,
          message: messageText,
        })
        .select()
        .single();

      if (error) throw error;

      setMessages([...messages, data]);
      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (!selectedSession) return;

    const channel = supabase
      .channel(`chat:${selectedSession.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `session_id=eq.${selectedSession.id}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as ChatMessage]);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [selectedSession]);

  return (
    <div className="space-y-6 pt-4">
      <div>
        <h1 className="text-2xl font-bold text-black dark:text-white mb-2">Chat Management</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage live conversations with visitors and users</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 h-[600px] flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="font-semibold text-gray-900 dark:text-white">Conversations</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {sessions.length} active
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader className="w-6 h-6 animate-spin text-gray-400" />
                </div>
              ) : sessions.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-8 px-4">
                  <MessageCircle className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No conversations yet</p>
                </div>
              ) : (
                sessions.map((session) => (
                  <button
                    key={session.id}
                    onClick={() => handleSelectSession(session)}
                    className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${
                      selectedSession?.id === session.id
                        ? 'bg-black dark:bg-white text-white dark:text-black'
                        : 'bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <p className="font-medium text-sm truncate">
                      {session.visitor_name || 'Visitor'}
                    </p>
                    <p className="text-xs opacity-70 truncate">
                      {session.visitor_email}
                    </p>
                    <p className="text-xs opacity-60 mt-1">
                      {new Date(session.created_at).toLocaleDateString()}
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedSession ? (
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 h-[600px] flex flex-col">
              <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {selectedSession.visitor_name || 'Visitor'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedSession.visitor_email}
                </p>
                <span
                  className={`inline-block mt-2 text-xs font-medium px-2 py-1 rounded ${
                    selectedSession.status === 'active'
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100'
                  }`}
                >
                  {selectedSession.status}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender_type === 'agent' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.sender_type === 'agent'
                          ? 'bg-black dark:bg-gray-700 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                      }`}
                    >
                      <p className="text-xs font-semibold mb-1">{msg.sender_name}</p>
                      <p className="text-sm">{msg.message}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(msg.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-800">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent"
                    disabled={sending}
                  />
                  <button
                    type="submit"
                    disabled={sending || !messageText.trim()}
                    className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 font-medium"
                  >
                    {sending ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 h-[600px] flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">Select a conversation to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatAdmin;

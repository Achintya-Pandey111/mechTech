import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../services/api.js';
import { mockConversations } from '../../services/mockData.js';
import { Send, User, MessageCircle, Shield } from 'lucide-react';

export const MessagesView = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState(mockConversations);
  const [activeConvId, setActiveConvId] = useState(mockConversations[0]?.id);
  const [messages, setMessages] = useState(mockConversations[0]?.messages || []);
  const [inputContent, setInputContent] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await api.getConversations();
        if (data?.conversations && data.conversations.length > 0) {
          setConversations(data.conversations);
          setActiveConvId(data.conversations[0].id);
        }
      } catch (err) {
        // Keeps mock conversations
      }
    };
    fetchConversations();
  }, []);

  useEffect(() => {
    const active = conversations.find((c) => c.id === activeConvId);
    if (active) {
      setMessages(active.messages || []);
    }
  }, [activeConvId, conversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputContent.trim()) return;

    const content = inputContent.trim();
    setInputContent('');

    const newMsg = {
      id: `m-${Date.now()}`,
      senderId: user?.id,
      content,
      createdAt: new Date().toISOString(),
      sender: { id: user?.id, name: user?.name },
    };

    try {
      await api.sendMessage(activeConvId, content);
    } catch (err) {
      // preview optimistic update
    }

    setMessages((prev) => [...prev, newMsg]);

    // Update conversation snippet
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConvId
          ? {
              ...c,
              messages: [...(c.messages || []), newMsg],
            }
          : c
      )
    );
  };

  const currentConv = conversations.find((c) => c.id === activeConvId);
  const otherParticipant =
    user?.role === 'STUDENT'
      ? currentConv?.alumni?.user
      : currentConv?.student?.user;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '320px 1fr',
        gap: '20px',
        height: 'calc(100vh - 120px)',
      }}
    >
      {/* Conversations List */}
      <div
        className="card"
        style={{
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#fff', marginBottom: '14px' }}>
          Conversations
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
          {conversations.map((conv) => {
            const isStudent = user?.role === 'STUDENT';
            const participant = isStudent ? conv.alumni?.user : conv.student?.user;
            const lastMsg = conv.messages && conv.messages[conv.messages.length - 1];
            const isSelected = conv.id === activeConvId;

            return (
              <div
                key={conv.id}
                onClick={() => setActiveConvId(conv.id)}
                style={{
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  background: isSelected ? 'var(--primary-glow)' : 'var(--bg-input)',
                  border: isSelected ? '1px solid var(--primary)' : '1px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '13px',
                    }}
                  >
                    {participant?.name?.charAt(0) || 'U'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>
                      {participant?.name}
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        color: 'var(--text-dim)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {lastMsg ? lastMsg.content : 'No messages yet'}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Chat Thread */}
      <div
        className="card"
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          padding: 0,
          overflow: 'hidden',
        }}
      >
        {/* Chat Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--bg-surface)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #a855f7, #6366f1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 'bold',
            }}
          >
            {otherParticipant?.name?.charAt(0) || 'C'}
          </div>
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#fff', lineHeight: 1.2 }}>
              {otherParticipant?.name || 'Direct Conversation'}
            </h4>
            <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
              1-on-1 Mentorship & Career Guidance
            </span>
          </div>
        </div>

        {/* Message Stream */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          {messages.map((m) => {
            const isMe = m.senderId === user?.id;
            return (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isMe ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '70%',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-lg)',
                    background: isMe ? 'var(--primary)' : 'var(--bg-input)',
                    color: isMe ? '#ffffff' : 'var(--text-main)',
                    fontSize: '13.5px',
                    lineHeight: '1.5',
                    boxShadow: isMe ? '0 2px 8px rgba(99, 102, 241, 0.3)' : 'none',
                    border: isMe ? 'none' : '1px solid var(--border-subtle)',
                  }}
                >
                  {m.content}
                </div>
                <span
                  style={{
                    fontSize: '10px',
                    color: 'var(--text-dim)',
                    marginTop: '4px',
                    padding: '0 4px',
                  }}
                >
                  {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Form */}
        <form
          onSubmit={handleSendMessage}
          style={{
            padding: '14px 20px',
            borderTop: '1px solid var(--border-subtle)',
            background: 'var(--bg-surface)',
            display: 'flex',
            gap: '10px',
          }}
        >
          <input
            type="text"
            className="input-field"
            placeholder="Type your message..."
            value={inputContent}
            onChange={(e) => setInputContent(e.target.value)}
            style={{ fontSize: '13.5px' }}
          />
          <button type="submit" className="btn btn-primary">
            <Send size={15} /> Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessagesView;

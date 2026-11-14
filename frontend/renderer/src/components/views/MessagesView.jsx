import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../services/api.js';
import { mockConversations } from '../../services/mockData.js';
import { Send, User, MessageCircle, Shield } from 'lucide-react';

export const MessagesView = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState(mockConversations);
  const [activeConvId, setActiveConvId] = useState(mockConversations[0]?.id);
  const [messages, setMessages] = useState(mockConversations[0]?.messages || []);
  const [inputMessage, setInputMessage] = useState('');

  const activeConv = conversations.find((c) => c.id === activeConvId);
  const otherParticipant =
    user?.role === 'STUDENT' ? activeConv?.alumni?.user : activeConv?.student?.user;

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await api.getConversations();
        if (data?.conversations && data.conversations.length > 0) {
          setConversations(data.conversations);
          if (!activeConvId) {
            setActiveConvId(data.conversations[0].id);
          }
        }
      } catch (err) {
        // Keeps mock conversations
      }
    };
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activeConv) {
      setMessages(activeConv.messages || []);
    }
  }, [activeConvId, conversations]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeConvId) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      senderId: user?.id,
      content: inputMessage,
      createdAt: new Date().toISOString(),
      sender: { name: user?.name, role: user?.role },
    };

    try {
      await api.sendMessage(activeConvId, inputMessage);
    } catch (err) {
      console.warn('Message sent in offline simulated mode');
    }

    setMessages([...messages, newMsg]);

    setConversations(
      conversations.map((c) => {
        if (c.id === activeConvId) {
          return {
            ...c,
            messages: [...(c.messages || []), newMsg],
          };
        }
        return c;
      })
    );

    setInputMessage('');
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '320px 1fr',
        gap: '20px',
        height: 'calc(100vh - 124px)',
      }}
    >
      {/* Conversation List */}
      <div
        className="card"
        style={{
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '14px' }}>
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
                  background: isSelected ? 'var(--primary-light)' : 'var(--bg-input)',
                  border: isSelected ? '1px solid #DFD2C4' : '1px solid transparent',
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
                      background: 'linear-gradient(135deg, #6D4333, #8D5B46)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '13px',
                      flexShrink: 0,
                    }}
                  >
                    {participant?.name?.charAt(0) || 'U'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--text-main)' }}>
                        {participant?.name}
                      </span>
                      {lastMsg && (
                        <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>
                          {new Date(lastMsg.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                    </div>
                    {lastMsg && (
                      <p
                        style={{
                          fontSize: '12px',
                          color: 'var(--text-muted)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          marginTop: '2px',
                        }}
                      >
                        {lastMsg.content}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Area */}
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
              background: 'linear-gradient(135deg, #6D4333, #8D5B46)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
            }}
          >
            {otherParticipant?.name?.charAt(0) || 'C'}
          </div>
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)' }}>
              {otherParticipant?.name}
            </h4>
            <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
              {otherParticipant?.role === 'ALUMNI' ? 'Verified Alumnus Mentorship Chat' : 'Student Chat'}
            </span>
          </div>
        </div>

        {/* Messages Stream */}
        <div
          style={{
            flex: 1,
            padding: '20px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {messages.map((m) => {
            const isMe = m.senderId === user?.id || m.sender?.name === user?.name;
            return (
              <div
                key={m.id}
                style={{
                  alignSelf: isMe ? 'flex-end' : 'flex-start',
                  maxWidth: '75%',
                }}
              >
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: isMe ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                    background: isMe ? 'var(--primary)' : 'var(--bg-input)',
                    color: isMe ? '#FFFFFF' : 'var(--text-main)',
                    border: isMe ? 'none' : '1px solid var(--border-subtle)',
                    fontSize: '13.5px',
                    lineHeight: '1.5',
                  }}
                >
                  {m.content}
                </div>
                <div
                  style={{
                    fontSize: '10px',
                    color: 'var(--text-dim)',
                    marginTop: '3px',
                    textAlign: isMe ? 'right' : 'left',
                  }}
                >
                  {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Message Input Box */}
        <form
          onSubmit={handleSendMessage}
          style={{
            padding: '14px 16px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            gap: '10px',
          }}
        >
          <input
            type="text"
            className="input-field"
            placeholder="Type your message to alumni..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '0 18px' }}>
            <Send size={15} /> Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessagesView;

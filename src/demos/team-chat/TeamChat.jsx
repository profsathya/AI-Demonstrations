import { useState, useRef, useEffect } from 'react'
import './TeamChat.css'

// Simulated data
const CHANNELS = [
  { id: 1, name: 'general', description: 'Team-wide announcements and discussions', unread: 3, type: 'public' },
  { id: 2, name: 'random', description: 'Non-work chat, fun stuff', unread: 0, type: 'public' },
  { id: 3, name: 'project-alpha', description: 'Alpha project coordination', unread: 12, type: 'public' },
  { id: 4, name: 'design', description: 'Design team discussions', unread: 0, type: 'public' },
  { id: 5, name: 'engineering', description: 'Engineering discussions', unread: 5, type: 'public' },
]

const DM_USERS = [
  { id: 1, name: 'Sarah Chen', avatar: '👩‍💻', status: 'online', unread: 2 },
  { id: 2, name: 'Mike Johnson', avatar: '👨‍🔬', status: 'away', unread: 0 },
  { id: 3, name: 'Emma Wilson', avatar: '👩‍🎨', status: 'online', unread: 0 },
  { id: 4, name: 'Alex Rivera', avatar: '🧑‍💼', status: 'offline', unread: 1 },
]

const SAMPLE_MESSAGES = [
  { id: 1, user: 'Sarah Chen', avatar: '👩‍💻', message: 'Hey team! The new feature is ready for review.', time: '9:15 AM', reactions: [{ emoji: '🎉', count: 3 }, { emoji: '👍', count: 2 }] },
  { id: 2, user: 'Mike Johnson', avatar: '👨‍🔬', message: 'Great work! I\'ll take a look this afternoon.', time: '9:18 AM', reactions: [] },
  { id: 3, user: 'You', avatar: '🧑', message: 'Awesome! Let me know if you need any context.', time: '9:20 AM', reactions: [{ emoji: '👍', count: 1 }] },
  { id: 4, user: 'Emma Wilson', avatar: '👩‍🎨', message: 'I\'ve updated the designs based on yesterday\'s feedback. Here\'s the link: design.figma.com/project-alpha', time: '9:45 AM', reactions: [{ emoji: '❤️', count: 2 }] },
  { id: 5, user: 'Sarah Chen', avatar: '👩‍💻', message: 'Perfect! The new navigation looks much cleaner. 🙌', time: '9:52 AM', reactions: [] },
]

export default function TeamChat() {
  const [view, setView] = useState('home') // home, channel, dm, settings, about
  const [currentChannel, setCurrentChannel] = useState(null)
  const [currentDM, setCurrentDM] = useState(null)
  const [messages, setMessages] = useState(SAMPLE_MESSAGES)
  const [newMessage, setNewMessage] = useState('')
  const [showSidebar, setShowSidebar] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    if (newMessage.trim()) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        user: 'You',
        avatar: '🧑',
        message: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        reactions: []
      }])
      setNewMessage('')
    }
  }

  const addReaction = (messageId, emoji) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const existing = msg.reactions.find(r => r.emoji === emoji)
        if (existing) {
          return {
            ...msg,
            reactions: msg.reactions.map(r =>
              r.emoji === emoji ? { ...r, count: r.count + 1 } : r
            )
          }
        } else {
          return { ...msg, reactions: [...msg.reactions, { emoji, count: 1 }] }
        }
      }
      return msg
    }))
  }

  if (view === 'about') {
    return (
      <div className="team-chat">
        <header className="tc-header">
          <button className="back-btn" onClick={() => setView('home')}>Back</button>
          <h1>About TeamChat</h1>
        </header>

        <div className="about-content">
          <section className="about-section">
            <h2>What is TeamChat?</h2>
            <p>
              TeamChat is an MVP for a team messaging platform designed as a simpler
              alternative to Slack for smaller teams and organizations.
            </p>
          </section>

          <section className="about-section">
            <h2>Design Decisions for MVP</h2>
            <ul>
              <li><strong>Channel-based Organization:</strong> Public channels for topics, DMs for private</li>
              <li><strong>Real-time Simulation:</strong> Messages appear instantly (would use WebSockets)</li>
              <li><strong>Reactions:</strong> Quick emoji reactions to messages</li>
              <li><strong>Presence Indicators:</strong> Online/away/offline status</li>
              <li><strong>Unread Counts:</strong> Badge indicators for new messages</li>
              <li><strong>Mobile-first Design:</strong> Responsive sidebar and touch-friendly</li>
            </ul>
          </section>

          <section className="about-section">
            <h2>Production Requirements</h2>
            <ul>
              <li>WebSocket connections for real-time messaging</li>
              <li>End-to-end encryption for security</li>
              <li>File sharing and image uploads</li>
              <li>Message threading and replies</li>
              <li>Search across all messages</li>
              <li>User mentions (@user) and notifications</li>
              <li>Message editing and deletion</li>
              <li>Integration APIs (GitHub, Jira, etc.)</li>
              <li>Voice/video calling</li>
              <li>Custom emoji and GIFs</li>
            </ul>
          </section>

          <section className="about-section">
            <h2>Why Build This?</h2>
            <ul>
              <li>Slack is feature-heavy and expensive for small teams</li>
              <li>Many teams just need simple, fast messaging</li>
              <li>Privacy-focused alternative (self-hostable)</li>
              <li>Better mobile experience</li>
            </ul>
          </section>
        </div>
      </div>
    )
  }

  if (view === 'channel' || view === 'dm') {
    const title = currentChannel ? `#${currentChannel.name}` : currentDM?.name

    return (
      <div className="team-chat">
        <header className="tc-header chat-header">
          <button className="back-btn" onClick={() => { setView('home'); setCurrentChannel(null); setCurrentDM(null); }}>←</button>
          <div className="header-info">
            <span className="header-title">{title}</span>
            {currentChannel && <span className="header-desc">{currentChannel.description}</span>}
            {currentDM && (
              <span className={`status-dot ${currentDM.status}`} />
            )}
          </div>
          <button className="info-btn">ℹ️</button>
        </header>

        <div className="messages-container">
          {messages.map(msg => (
            <div key={msg.id} className={`message ${msg.user === 'You' ? 'own' : ''}`}>
              <span className="msg-avatar">{msg.avatar}</span>
              <div className="msg-content">
                <div className="msg-header">
                  <span className="msg-user">{msg.user}</span>
                  <span className="msg-time">{msg.time}</span>
                </div>
                <p className="msg-text">{msg.message}</p>
                {msg.reactions.length > 0 && (
                  <div className="msg-reactions">
                    {msg.reactions.map((r, i) => (
                      <button key={i} className="reaction" onClick={() => addReaction(msg.id, r.emoji)}>
                        {r.emoji} {r.count}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button className="react-btn" onClick={() => addReaction(msg.id, '👍')}>+</button>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="message-input">
          <input
            type="text"
            placeholder={`Message ${title}`}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button className="send-btn" onClick={sendMessage} disabled={!newMessage.trim()}>
            ➤
          </button>
        </div>
      </div>
    )
  }

  // Home view
  return (
    <div className="team-chat">
      <header className="tc-header home-header">
        <h1>TeamChat</h1>
        <div className="header-actions">
          <button className="icon-btn" onClick={() => setView('about')}>ℹ️</button>
        </div>
      </header>

      <div className="home-content">
        <div className="workspace-info">
          <span className="workspace-icon">🏢</span>
          <div className="workspace-details">
            <span className="workspace-name">Acme Inc</span>
            <span className="workspace-status">12 members online</span>
          </div>
        </div>

        <div className="section">
          <div className="section-header">
            <h3>Channels</h3>
            <button className="add-btn">+</button>
          </div>
          <div className="channel-list">
            {CHANNELS.map(channel => (
              <button
                key={channel.id}
                className="channel-item"
                onClick={() => { setCurrentChannel(channel); setView('channel'); }}
              >
                <span className="channel-icon">#</span>
                <span className="channel-name">{channel.name}</span>
                {channel.unread > 0 && (
                  <span className="unread-badge">{channel.unread}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="section">
          <div className="section-header">
            <h3>Direct Messages</h3>
            <button className="add-btn">+</button>
          </div>
          <div className="dm-list">
            {DM_USERS.map(user => (
              <button
                key={user.id}
                className="dm-item"
                onClick={() => { setCurrentDM(user); setView('dm'); }}
              >
                <span className="dm-avatar">{user.avatar}</span>
                <span className={`dm-status ${user.status}`} />
                <span className="dm-name">{user.name}</span>
                {user.unread > 0 && (
                  <span className="unread-badge">{user.unread}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="quick-actions">
          <button className="quick-action">
            <span>🔍</span>
            <span>Search</span>
          </button>
          <button className="quick-action">
            <span>📎</span>
            <span>Files</span>
          </button>
          <button className="quick-action">
            <span>⭐</span>
            <span>Saved</span>
          </button>
        </div>
      </div>
    </div>
  )
}

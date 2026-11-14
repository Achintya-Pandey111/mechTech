import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import {
  GraduationCap,
  Bell,
  LogOut,
  LogIn,
  User,
  Shield,
  Briefcase,
  CheckCircle,
  Sparkles,
} from 'lucide-react';

export const Navbar = () => {
  const {
    user,
    logout,
    openAuthModal,
    unreadNotificationsCount,
    switchRoleDemo,
    isOfflineMode,
    setActiveTab,
  } = useAuth();

  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: 'Mentorship Accepted', desc: 'Priya Sharma accepted your request!', time: '10m ago' },
    { id: 2, title: 'New Opportunity', desc: 'Google posted Software Engineer Intern', time: '1h ago' },
  ];

  return (
    <header
      style={{
        height: '68px',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'rgba(10, 14, 23, 0.85)',
        backdropFilter: 'blur(16px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
      }}
    >
      {/* Brand */}
      <div
        style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        onClick={() => setActiveTab('feed')}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)',
          }}
        >
          <GraduationCap size={24} color="#ffffff" />
        </div>
        <div>
          <span style={{ fontSize: '18px', fontWeight: '700', letterSpacing: '-0.3px', color: '#fff' }}>
            Alumni<span style={{ color: '#818cf8' }}>Connect</span>
          </span>
          <span
            style={{
              display: 'block',
              fontSize: '11px',
              color: 'var(--text-dim)',
              lineHeight: 1,
            }}
          >
            Engineering Network
          </span>
        </div>
      </div>

      {/* Center Demo Role Switcher Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--bg-input)',
          padding: '4px 8px',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <span style={{ fontSize: '11px', color: 'var(--text-dim)', padding: '0 4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Sparkles size={12} color="#818cf8" /> Preview Role:
        </span>
        <button
          className="btn btn-sm"
          style={{
            padding: '3px 10px',
            fontSize: '12px',
            background: user?.role === 'STUDENT' ? 'var(--primary)' : 'transparent',
            color: user?.role === 'STUDENT' ? '#fff' : 'var(--text-muted)',
            borderRadius: 'var(--radius-full)',
          }}
          onClick={() => switchRoleDemo('STUDENT')}
        >
          Student
        </button>
        <button
          className="btn btn-sm"
          style={{
            padding: '3px 10px',
            fontSize: '12px',
            background: user?.role === 'ALUMNI' ? '#a855f7' : 'transparent',
            color: user?.role === 'ALUMNI' ? '#fff' : 'var(--text-muted)',
            borderRadius: 'var(--radius-full)',
          }}
          onClick={() => switchRoleDemo('ALUMNI')}
        >
          Alumni
        </button>
        <button
          className="btn btn-sm"
          style={{
            padding: '3px 10px',
            fontSize: '12px',
            background: user?.role === 'ADMIN' ? '#ef4444' : 'transparent',
            color: user?.role === 'ADMIN' ? '#fff' : 'var(--text-muted)',
            borderRadius: 'var(--radius-full)',
          }}
          onClick={() => switchRoleDemo('ADMIN')}
        >
          Admin
        </button>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            className="btn btn-secondary"
            style={{ padding: '8px', borderRadius: '50%', position: 'relative' }}
            onClick={() => setShowNotifications(!showNotifications)}
            title="Notifications"
          >
            <Bell size={18} />
            {unreadNotificationsCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: '#ef4444',
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 6px rgba(239, 68, 68, 0.6)',
                }}
              >
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div
              style={{
                position: 'absolute',
                top: '48px',
                right: 0,
                width: '300px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-md)',
                padding: '12px',
                zIndex: 100,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '10px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid var(--border-subtle)',
                }}
              >
                <span style={{ fontSize: '13px', fontWeight: '600' }}>Notifications</span>
                <span
                  style={{ fontSize: '11px', color: 'var(--primary)', cursor: 'pointer' }}
                  onClick={() => setShowNotifications(false)}
                >
                  Close
                </span>
              </div>
              {notifications.map((n) => (
                <div
                  key={n.id}
                  style={{
                    padding: '8px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-input)',
                    marginBottom: '6px',
                  }}
                >
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#fff' }}>{n.title}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{n.desc}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '2px' }}>{n.time}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Badge or Login */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
              }}
              onClick={() => setActiveTab('profile')}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '600',
                  fontSize: '14px',
                  color: 'white',
                }}
              >
                {user.name?.charAt(0) || 'U'}
              </div>
              <div style={{ lineHeight: 1.2 }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>{user.name}</div>
                <span className={`badge badge-${user.role.toLowerCase()}`}>{user.role}</span>
              </div>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={logout}
              title="Logout"
              style={{ padding: '6px 10px' }}
            >
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <button className="btn btn-primary btn-sm" onClick={() => openAuthModal('login')}>
            <LogIn size={15} /> Sign In
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;

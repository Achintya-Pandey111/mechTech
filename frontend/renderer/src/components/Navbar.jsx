import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import {
  GraduationCap,
  Bell,
  LogOut,
  LogIn,
} from 'lucide-react';

export const Navbar = () => {
  const {
    user,
    logout,
    openAuthModal,
    unreadNotificationsCount,
    setActiveTab,
  } = useAuth();

  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: 'Mentorship Request', desc: 'New mentorship inquiries in your department', time: '10m ago' },
    { id: 2, title: 'Campus Opportunities', desc: 'Check latest job postings and internships', time: '1h ago' },
  ];

  return (
    <header
      style={{
        height: '68px',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'rgba(251, 248, 244, 0.95)',
        backdropFilter: 'blur(12px)',
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
            background: 'linear-gradient(135deg, #6D4333 0%, #8D5B46 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(109, 67, 51, 0.22)',
          }}
        >
          <GraduationCap size={22} color="#FFFFFF" />
        </div>
        <div>
          <span style={{ fontSize: '18px', fontWeight: '700', letterSpacing: '-0.3px', color: 'var(--text-main)' }}>
            Alumni<span style={{ color: 'var(--accent-chocolate)' }}>Connect</span>
          </span>
          <span
            style={{
              display: 'block',
              fontSize: '11px',
              color: 'var(--text-dim)',
              lineHeight: 1,
            }}
          >
            Engineering & Alumni Network
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Notifications (only if logged in) */}
        {user && (
          <div style={{ position: 'relative' }}>
            <button
              className="btn btn-secondary"
              style={{ padding: '8px', borderRadius: '50%', position: 'relative' }}
              onClick={() => setShowNotifications(!showNotifications)}
              title="Notifications"
            >
              <Bell size={18} color="var(--text-main)" />
              {unreadNotificationsCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-2px',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: 'var(--danger)',
                    color: 'white',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 1px 4px rgba(154, 52, 18, 0.4)',
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
                  <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)' }}>Notifications</span>
                  <span
                    style={{ fontSize: '11px', color: 'var(--primary)', cursor: 'pointer', fontWeight: '500' }}
                    onClick={() => setShowNotifications(false)}
                  >
                    Close
                  </span>
                </div>
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    style={{
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-input)',
                      marginBottom: '6px',
                    }}
                  >
                    <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-main)' }}>{n.title}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{n.desc}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '2px' }}>{n.time}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

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
                  background: 'linear-gradient(135deg, #6D4333, #8D5B46)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '600',
                  fontSize: '14px',
                  color: 'white',
                  boxShadow: '0 1px 4px rgba(109, 67, 51, 0.2)',
                }}
              >
                {user.name?.charAt(0) || 'U'}
              </div>
              <div style={{ lineHeight: 1.2 }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)' }}>{user.name}</div>
                <span className={`badge badge-${user.role.toLowerCase()}`}>{user.role}</span>
              </div>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={logout}
              title="Logout"
              style={{ padding: '6px 10px' }}
            >
              <LogOut size={15} color="var(--text-muted)" />
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

import { useAuth } from '../context/AuthContext.jsx';
import {
  MessageSquareQuote,
  Users,
  Compass,
  MessageCircle,
  Briefcase,
  Calendar,
  UserCircle,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export const Sidebar = () => {
  const { activeTab, setActiveTab, user, openAuthModal } = useAuth();

  const navItems = [
    { id: 'feed', label: 'Community Feed', icon: MessageSquareQuote },
    { id: 'directory', label: 'Alumni Directory', icon: Users },
    { id: 'mentorship', label: 'Mentorship Hub', icon: Compass },
    { id: 'messages', label: 'Direct Messages', icon: MessageCircle },
    { id: 'opportunities', label: 'Career & Jobs', icon: Briefcase },
    { id: 'events', label: 'Events & Meets', icon: Calendar },
    { id: 'profile', label: 'My Profile', icon: UserCircle },
  ];

  if (user?.role === 'ADMIN') {
    navItems.push({ id: 'admin', label: 'Admin Dashboard', icon: ShieldCheck });
  }

  return (
    <aside
      style={{
        width: '260px',
        borderRight: '1px solid var(--border-subtle)',
        background: '#FAF6F0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px 16px',
        flexShrink: 0,
      }}
    >
      <div>
        <div
          style={{
            fontSize: '11px',
            fontWeight: '700',
            color: 'var(--text-dim)',
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            padding: '0 12px 14px',
          }}
        >
          Platform Menu
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: isActive ? 'var(--primary-light)' : 'transparent',
                  border: isActive ? '1px solid #DFD2C4' : '1px solid transparent',
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                  fontSize: '13.5px',
                  fontWeight: isActive ? '600' : '500',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon size={18} color={isActive ? 'var(--primary)' : 'var(--text-dim)'} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight size={14} color="var(--primary)" />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Status Card */}
      {user ? (
        <div
          className="card"
          style={{
            padding: '14px',
            background: '#FFFFFF',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 1px 4px rgba(60, 40, 25, 0.04)',
          }}
        >
          <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginBottom: '3px', fontWeight: '500' }}>
            Signed in as
          </div>
          <div style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--text-main)' }}>{user.name}</div>
          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
            {user.role === 'STUDENT'
              ? 'Student Account'
              : user.role === 'ALUMNI'
              ? 'Alumni Member'
              : 'System Administrator'}
          </div>
          {user.department?.name && (
            <div
              style={{
                fontSize: '11px',
                color: 'var(--accent-chocolate)',
                marginTop: '6px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              title={user.department.name}
            >
              {user.department.name}
            </div>
          )}
        </div>
      ) : (
        <div
          className="card"
          style={{
            padding: '14px',
            background: '#FFFFFF',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 1px 4px rgba(60, 40, 25, 0.04)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '3px' }}>
            Welcome to AlumniConnect
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '10px' }}>
            Sign in to access mentorship and your college network.
          </div>
          <button
            className="btn btn-primary btn-sm"
            style={{ width: '100%' }}
            onClick={() => openAuthModal('login')}
          >
            Sign In
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;

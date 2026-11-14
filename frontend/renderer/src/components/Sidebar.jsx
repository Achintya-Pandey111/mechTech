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
  const { activeTab, setActiveTab, user } = useAuth();

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
        background: 'rgba(10, 14, 23, 0.95)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '20px 16px',
        flexShrink: 0,
      }}
    >
      <div>
        <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.8px', padding: '0 12px 12px' }}>
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
                  background: isActive ? 'var(--primary-glow)' : 'transparent',
                  border: isActive ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid transparent',
                  color: isActive ? '#818cf8' : 'var(--text-muted)',
                  fontSize: '13.5px',
                  fontWeight: isActive ? '600' : '500',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon size={18} color={isActive ? '#818cf8' : 'var(--text-dim)'} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight size={14} color="#818cf8" />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Status Card */}
      {user && (
        <div
          className="card"
          style={{
            padding: '12px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginBottom: '4px' }}>
            Signed in as
          </div>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>{user.name}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {user.role === 'STUDENT'
              ? user.student?.department?.name || 'Student Account'
              : user.alumni?.jobTitle
              ? `${user.alumni.jobTitle} @ ${user.alumni.currentCompany || 'Company'}`
              : `${user.role} Account`}
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;

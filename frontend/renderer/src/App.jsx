import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import AuthPage from './components/AuthPage.jsx';

import FeedView from './components/views/FeedView.jsx';
import DirectoryView from './components/views/DirectoryView.jsx';
import MentorshipView from './components/views/MentorshipView.jsx';
import MessagesView from './components/views/MessagesView.jsx';
import OpportunitiesView from './components/views/OpportunitiesView.jsx';
import EventsView from './components/views/EventsView.jsx';
import ProfileView from './components/views/ProfileView.jsx';
import AdminView from './components/views/AdminView.jsx';
import { GraduationCap } from 'lucide-react';

function MainApp() {
  const { user, loading, activeTab } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          width: '100vw',
          background: 'var(--bg-main)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6D4333, #8D5B46)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(109, 67, 51, 0.25)',
          }}
        >
          <GraduationCap size={26} color="#FFFFFF" />
        </div>
        <div style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: '500' }}>
          Loading AlumniConnect...
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'feed':
        return <FeedView />;
      case 'directory':
        return <DirectoryView />;
      case 'mentorship':
        return <MentorshipView />;
      case 'messages':
        return <MessagesView />;
      case 'opportunities':
        return <OpportunitiesView />;
      case 'events':
        return <EventsView />;
      case 'profile':
        return <ProfileView />;
      case 'admin':
        return <AdminView />;
      default:
        return <FeedView />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <main className="content-body">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;

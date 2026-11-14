import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import AuthModal from './components/AuthModal.jsx';

import FeedView from './components/views/FeedView.jsx';
import DirectoryView from './components/views/DirectoryView.jsx';
import MentorshipView from './components/views/MentorshipView.jsx';
import MessagesView from './components/views/MessagesView.jsx';
import OpportunitiesView from './components/views/OpportunitiesView.jsx';
import EventsView from './components/views/EventsView.jsx';
import ProfileView from './components/views/ProfileView.jsx';
import AdminView from './components/views/AdminView.jsx';

function MainApp() {
  const { activeTab } = useAuth();

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
      <AuthModal />
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

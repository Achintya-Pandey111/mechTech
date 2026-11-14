import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../services/api.js';
import {
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  MessageCircle,
  User,
  GraduationCap,
} from 'lucide-react';

export const MentorshipView = () => {
  const { user, setActiveTab } = useAuth();
  const [mentorships, setMentorships] = useState([
    {
      id: 'm-demo-1',
      studentId: 'stu-1',
      alumniId: 'alm-demo',
      status: 'ACCEPTED',
      note: 'Looking for advice on preparing for backend systems engineering interviews.',
      createdAt: '2026-11-10T10:00:00Z',
      student: { user: { name: 'Alex Rivera', role: 'STUDENT' } },
      alumni: { user: { name: 'Priya Sharma', role: 'ALUMNI' }, currentCompany: 'Google', jobTitle: 'Senior Software Engineer' },
    },
    {
      id: 'm-demo-2',
      studentId: 'stu-2',
      alumniId: 'alm-demo',
      status: 'PENDING',
      note: 'Would love your thoughts on cloud computing architectures and postgraduate studies.',
      createdAt: '2026-11-13T14:30:00Z',
      student: { user: { name: 'Marcus Vance', role: 'STUDENT' } },
      alumni: { user: { name: 'David Chen', role: 'ALUMNI' }, currentCompany: 'Microsoft', jobTitle: 'Staff Architect' },
    },
  ]);

  const isAlumni = user?.role === 'ALUMNI';

  useEffect(() => {
    const fetchMentorships = async () => {
      try {
        const data = await api.getMentorships();
        if (data?.mentorships && data.mentorships.length > 0) {
          setMentorships(data.mentorships);
        }
      } catch (err) {
        // Keeps mock data
      }
    };
    fetchMentorships();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.updateMentorshipStatus(id, status);
    } catch (err) {
      // Local fallback
    }
    setMentorships(
      mentorships.map((m) => (m.id === id ? { ...m, status } : m))
    );
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACCEPTED':
        return (
          <span className="badge badge-student" style={{ gap: '4px' }}>
            <CheckCircle size={12} /> Accepted
          </span>
        );
      case 'REJECTED':
        return (
          <span className="badge badge-admin" style={{ gap: '4px' }}>
            <XCircle size={12} /> Declined
          </span>
        );
      default:
        return (
          <span className="badge badge-alumni" style={{ gap: '4px' }}>
            <Clock size={12} /> Pending Review
          </span>
        );
    }
  };

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '6px' }}>
          Mentorship Hub
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
          {isAlumni
            ? 'Review incoming mentorship requests from students eager to learn from your career experience.'
            : 'Track your mentorship requests with alumni and connect directly once accepted.'}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {mentorships.map((m) => {
          const otherPerson = isAlumni ? m.student?.user : m.alumni?.user;
          const otherCompany = m.alumni?.currentCompany;
          const otherTitle = m.alumni?.jobTitle;

          return (
            <div key={m.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #6D4333, #8D5B46)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '15px',
                      color: '#FFFFFF',
                      boxShadow: '0 2px 6px rgba(109, 67, 51, 0.2)',
                    }}
                  >
                    {otherPerson?.name?.charAt(0) || 'M'}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-main)' }}>
                      {otherPerson?.name}
                    </h4>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {isAlumni
                        ? 'Undergraduate Mentee'
                        : `${otherTitle || 'Alumnus'} ${otherCompany ? `@ ${otherCompany}` : ''}`}
                    </div>
                  </div>
                </div>
                {getStatusBadge(m.status)}
              </div>

              {m.note && (
                <div
                  style={{
                    padding: '12px 14px',
                    background: 'var(--bg-input)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '13.5px',
                    color: 'var(--text-main)',
                    marginBottom: '16px',
                    lineHeight: '1.5',
                  }}
                >
                  <span style={{ fontWeight: '600', color: 'var(--text-muted)', display: 'block', fontSize: '11.5px', marginBottom: '4px' }}>
                    Request Note:
                  </span>
                  "{m.note}"
                </div>
              )}

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--border-subtle)',
                }}
              >
                <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                  Submitted {new Date(m.createdAt).toLocaleDateString()}
                </span>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {isAlumni && m.status === 'PENDING' && (
                    <>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleUpdateStatus(m.id, 'REJECTED')}
                      >
                        Decline
                      </button>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleUpdateStatus(m.id, 'ACCEPTED')}
                      >
                        Accept Mentorship
                      </button>
                    </>
                  )}

                  {m.status === 'ACCEPTED' && (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => setActiveTab('messages')}
                    >
                      <MessageCircle size={14} /> Open Direct Messages
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MentorshipView;

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../services/api.js';
import { Compass, CheckCircle2, XCircle, Clock, MessageSquare, ArrowRight } from 'lucide-react';

export const MentorshipView = () => {
  const { user, setActiveTab } = useAuth();
  const [mentorships, setMentorships] = useState([
    {
      id: 'm-1',
      studentId: 's-demo-1',
      alumniId: 'alm-1',
      status: 'ACCEPTED',
      message: 'Hi Priya! I would love guidance on preparing for fullstack roles and scalable backend systems.',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      student: { user: { name: 'Alex Rivera', email: 'alex@college.edu' } },
      alumni: {
        currentCompany: 'Google',
        jobTitle: 'Senior Software Engineer',
        user: { name: 'Priya Sharma', email: 'priya@alumni.edu' }
      }
    },
    {
      id: 'm-2',
      studentId: 's-demo-1',
      alumniId: 'alm-2',
      status: 'PENDING',
      message: 'Looking for advice on transitioning into Technical Product Management.',
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      student: { user: { name: 'Alex Rivera', email: 'alex@college.edu' } },
      alumni: {
        currentCompany: 'Microsoft',
        jobTitle: 'Product Manager',
        user: { name: 'David Chen', email: 'david@alumni.edu' }
      }
    }
  ]);

  useEffect(() => {
    const fetchMentorships = async () => {
      try {
        const data = await api.getMyMentorships();
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
      await api.respondToMentorship(id, status);
    } catch (err) {
      // preview update
    }

    setMentorships(
      mentorships.map((m) => (m.id === id ? { ...m, status } : m))
    );
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACCEPTED':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 8px', borderRadius: 'var(--radius-full)', background: 'var(--success-bg)', color: 'var(--success)', fontSize: '11px', fontWeight: '600' }}>
            <CheckCircle2 size={12} /> Accepted
          </span>
        );
      case 'REJECTED':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 8px', borderRadius: 'var(--radius-full)', background: 'var(--danger-bg)', color: 'var(--danger)', fontSize: '11px', fontWeight: '600' }}>
            <XCircle size={12} /> Rejected
          </span>
        );
      case 'COMPLETED':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 8px', borderRadius: 'var(--radius-full)', background: 'var(--info-bg)', color: 'var(--info)', fontSize: '11px', fontWeight: '600' }}>
            Completed
          </span>
        );
      default:
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 8px', borderRadius: 'var(--radius-full)', background: 'var(--warning-bg)', color: 'var(--warning)', fontSize: '11px', fontWeight: '600' }}>
            <Clock size={12} /> Pending Review
          </span>
        );
    }
  };

  const isAlumni = user?.role === 'ALUMNI';

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#fff', marginBottom: '6px' }}>
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
                      background: 'linear-gradient(135deg, #6366f1, #3b82f6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '15px',
                      color: '#fff',
                    }}
                  >
                    {otherPerson?.name?.charAt(0) || 'M'}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#fff' }}>
                      {otherPerson?.name}
                    </h4>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {isAlumni
                        ? 'College Student'
                        : `${otherTitle || 'Alumnus'} @ ${otherCompany || 'Tech'}`}
                    </div>
                  </div>
                </div>
                {getStatusBadge(m.status)}
              </div>

              {/* Message Note */}
              {m.message && (
                <div
                  style={{
                    padding: '12px',
                    background: 'var(--bg-input)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '13px',
                    color: 'var(--text-main)',
                    lineHeight: '1.5',
                    marginBottom: '14px',
                    borderLeft: '3px solid var(--primary)',
                  }}
                >
                  "{m.message}"
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                {isAlumni && m.status === 'PENDING' && (
                  <>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleUpdateStatus(m.id, 'REJECTED')}
                    >
                      Decline
                    </button>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleUpdateStatus(m.id, 'ACCEPTED')}
                    >
                      Accept Request
                    </button>
                  </>
                )}

                {m.status === 'ACCEPTED' && (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setActiveTab('messages')}
                  >
                    <MessageSquare size={14} /> Open Conversation <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MentorshipView;

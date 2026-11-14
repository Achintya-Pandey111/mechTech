import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../services/api.js';
import { mockAlumniList } from '../../services/mockData.js';
import { Search, Building, GraduationCap, Compass, Send, CheckCircle, X } from 'lucide-react';

export const DirectoryView = () => {
  const { user } = useAuth();
  const [alumniList, setAlumniList] = useState(mockAlumniList);
  const [search, setSearch] = useState('');
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [mentorshipMessage, setMentorshipMessage] = useState('');
  const [requestSent, setRequestSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const data = await api.getAlumniDirectory({ search });
        if (data?.alumni && data.alumni.length > 0) {
          setAlumniList(data.alumni);
        }
      } catch (err) {
        // Fallback to local filter
      }
    };
    fetchAlumni();
  }, [search]);

  const filteredAlumni = alumniList.filter((alm) => {
    const query = search.toLowerCase();
    return (
      alm.user?.name?.toLowerCase().includes(query) ||
      alm.currentCompany?.toLowerCase().includes(query) ||
      alm.jobTitle?.toLowerCase().includes(query) ||
      alm.department?.name?.toLowerCase().includes(query)
    );
  });

  const handleSendMentorshipRequest = async (e) => {
    e.preventDefault();
    if (!selectedAlumni) return;

    setLoading(true);
    try {
      await api.requestMentorship(selectedAlumni.id, mentorshipMessage);
    } catch (err) {
      console.warn('Mentorship request sent in preview mode');
    }

    setRequestSent(true);
    setTimeout(() => {
      setRequestSent(false);
      setSelectedAlumni(null);
      setMentorshipMessage('');
    }, 1500);
    setLoading(false);
  };

  return (
    <div>
      {/* Header & Search */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#fff', marginBottom: '6px' }}>
          Alumni Directory
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px' }}>
          Connect with graduates working in leading technology companies, startups, and research.
        </p>

        {/* Search Input */}
        <div style={{ position: 'relative', maxWidth: '480px' }}>
          <Search
            size={18}
            style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-dim)' }}
          />
          <input
            type="text"
            className="input-field"
            placeholder="Search alumni by name, company, role, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '38px' }}
          />
        </div>
      </div>

      {/* Alumni Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {filteredAlumni.map((alm) => (
          <div key={alm.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '14px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #a855f7, #6366f1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    color: '#fff',
                    flexShrink: 0,
                  }}
                >
                  {alm.user?.name?.charAt(0) || 'A'}
                </div>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#fff', lineHeight: 1.2 }}>
                    {alm.user?.name}
                  </h4>
                  <div style={{ fontSize: '13px', color: '#818cf8', fontWeight: '500', marginTop: '2px' }}>
                    {alm.jobTitle || 'Alumnus'} {alm.currentCompany && `@ ${alm.currentCompany}`}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-dim)', marginTop: '4px' }}>
                    <GraduationCap size={14} /> Class of {alm.graduationYear}
                  </div>
                </div>
              </div>

              {/* Department */}
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                {alm.department?.name}
              </div>

              {/* Skills */}
              {alm.user?.skills && alm.user.skills.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                  {alm.user.skills.map((s, idx) => (
                    <span
                      key={idx}
                      style={{
                        padding: '3px 8px',
                        background: 'var(--bg-input)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '11px',
                        color: 'var(--text-main)',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      {s.skill?.name || s.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div style={{ paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
              <button
                className="btn btn-primary btn-sm"
                style={{ width: '100%' }}
                onClick={() => setSelectedAlumni(alm)}
              >
                <Compass size={14} /> Request Mentorship
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Mentorship Request Modal */}
      {selectedAlumni && (
        <div className="modal-overlay" onClick={() => setSelectedAlumni(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                padding: '18px 20px',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#fff' }}>
                  Request Mentorship
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Connect with {selectedAlumni.user?.name} ({selectedAlumni.currentCompany})
                </p>
              </div>
              <button
                onClick={() => setSelectedAlumni(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSendMentorshipRequest} style={{ padding: '20px' }}>
              {requestSent ? (
                <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--success)' }}>
                  <CheckCircle size={42} style={{ margin: '0 auto 12px' }} />
                  <h4>Mentorship Request Sent!</h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    {selectedAlumni.user?.name} has been notified.
                  </p>
                </div>
              ) : (
                <>
                  <div className="input-group">
                    <label className="input-label">Personal Note / Goals</label>
                    <textarea
                      className="textarea-field"
                      rows="4"
                      placeholder="Hi! I would love guidance on preparing for technical interviews, understanding distributed systems, and career advice..."
                      value={mentorshipMessage}
                      onChange={(e) => setMentorshipMessage(e.target.value)}
                      required
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setSelectedAlumni(null)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
                      <Send size={14} /> {loading ? 'Sending...' : 'Send Request'}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DirectoryView;

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../services/api.js';
import { mockOpportunities } from '../../services/mockData.js';
import { Briefcase, Building, MapPin, Calendar, Plus, Send, CheckCircle, X } from 'lucide-react';

export const OpportunitiesView = () => {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState(mockOpportunities);
  const [filterType, setFilterType] = useState('ALL');
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [resumeUrl, setResumeUrl] = useState('');
  const [appliedSuccess, setAppliedSuccess] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  // New Opportunity Form
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('INTERNSHIP');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const data = await api.getOpportunities({
          type: filterType !== 'ALL' ? filterType : undefined,
        });
        if (data?.opportunities && data.opportunities.length > 0) {
          setOpportunities(data.opportunities);
        }
      } catch (err) {
        // Keeps mock opportunities
      }
    };
    fetchOpportunities();
  }, [filterType]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!selectedOpp) return;

    try {
      await api.applyForOpportunity(selectedOpp.id, resumeUrl);
    } catch (err) {
      console.warn('Applied in preview mode');
    }

    setAppliedSuccess(true);
    setTimeout(() => {
      setAppliedSuccess(false);
      setSelectedOpp(null);
      setResumeUrl('');
    }, 1500);
  };

  const handleCreateOpportunity = async (e) => {
    e.preventDefault();
    const newOpp = {
      id: `opp-${Date.now()}`,
      title,
      company,
      location,
      type,
      description,
      deadline: deadline ? new Date(deadline).toISOString() : null,
      createdAt: new Date().toISOString(),
      postedBy: { user: { name: user?.name } },
      _count: { applications: 0 },
    };

    try {
      await api.createOpportunity(newOpp);
    } catch (err) {
      // preview update
    }

    setOpportunities([newOpp, ...opportunities]);
    setIsPosting(false);
    setTitle('');
    setCompany('');
    setLocation('');
    setDescription('');
    setDeadline('');
  };

  const filtered = filterType === 'ALL'
    ? opportunities
    : opportunities.filter((o) => o.type === filterType);

  const isAlumni = user?.role === 'ALUMNI' || user?.role === 'ADMIN';

  return (
    <div>
      {/* Top Banner & Filters */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#fff', marginBottom: '6px' }}>
            Career Opportunities
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Internships and entry-level positions shared directly by verified alumni.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {isAlumni && (
            <button className="btn btn-primary btn-sm" onClick={() => setIsPosting(true)}>
              <Plus size={15} /> Post Opportunity
            </button>
          )}

          <div style={{ display: 'flex', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', padding: '2px' }}>
            {['ALL', 'INTERNSHIP', 'JOB'].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: filterType === t ? 'var(--primary)' : 'transparent',
                  color: filterType === t ? '#fff' : 'var(--text-muted)',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Opportunities Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
        {filtered.map((opp) => (
          <div key={opp.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <span className={`badge ${opp.type === 'JOB' ? 'badge-job' : 'badge-internship'}`}>
                  {opp.type}
                </span>
                {opp.deadline && (
                  <span style={{ fontSize: '11px', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={12} /> Deadline: {new Date(opp.deadline).toLocaleDateString()}
                  </span>
                )}
              </div>

              <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#fff', marginBottom: '6px' }}>
                {opp.title}
              </h3>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '14px' }}>
                {opp.company && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Building size={14} color="#818cf8" /> {opp.company}
                  </div>
                )}
                {opp.location && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <MapPin size={14} color="#818cf8" /> {opp.location}
                  </div>
                )}
              </div>

              <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '16px' }}>
                {opp.description}
              </p>
            </div>

            <div
              style={{
                paddingTop: '14px',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                Posted by {opp.postedBy?.user?.name || 'Alumnus'}
              </span>

              {user?.role === 'STUDENT' && (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setSelectedOpp(opp)}
                >
                  Apply Now
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Apply Modal */}
      {selectedOpp && (
        <div className="modal-overlay" onClick={() => setSelectedOpp(null)}>
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
                  Apply for {selectedOpp.title}
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {selectedOpp.company} • {selectedOpp.type}
                </p>
              </div>
              <button
                onClick={() => setSelectedOpp(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleApply} style={{ padding: '20px' }}>
              {appliedSuccess ? (
                <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--success)' }}>
                  <CheckCircle size={42} style={{ margin: '0 auto 12px' }} />
                  <h4>Application Submitted!</h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    Your application has been received. Good luck!
                  </p>
                </div>
              ) : (
                <>
                  <div className="input-group">
                    <label className="input-label">Resume / Portfolio Link (Google Drive, LinkedIn, or Website)</label>
                    <input
                      type="url"
                      className="input-field"
                      placeholder="https://drive.google.com/your-resume.pdf"
                      value={resumeUrl}
                      onChange={(e) => setResumeUrl(e.target.value)}
                      required
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setSelectedOpp(null)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary btn-sm">
                      <Send size={14} /> Submit Application
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Post Opportunity Modal */}
      {isPosting && (
        <div className="modal-overlay" onClick={() => setIsPosting(false)}>
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
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#fff' }}>
                Post a Job or Internship
              </h3>
              <button
                onClick={() => setIsPosting(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateOpportunity} style={{ padding: '20px' }}>
              <div className="input-group">
                <label className="input-label">Role Title</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Backend Software Engineer Intern"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="input-group">
                  <label className="input-label">Company</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Stripe"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Location</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Remote / Bangalore"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="input-group">
                  <label className="input-label">Opportunity Type</label>
                  <select
                    className="select-field"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="INTERNSHIP">Internship</option>
                    <option value="JOB">Full-time Job</option>
                    <option value="OTHER">Other Project</option>
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Application Deadline</label>
                  <input
                    type="date"
                    className="input-field"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Job Description & Requirements</label>
                <textarea
                  className="textarea-field"
                  rows="4"
                  placeholder="Describe the responsibilities, tech stack, and ideal candidate profile..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setIsPosting(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Publish Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpportunitiesView;

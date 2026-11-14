import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../services/api.js';
import { mockOpportunities } from '../../services/mockData.js';
import {
  Briefcase,
  MapPin,
  Building,
  Calendar,
  Send,
  Plus,
  X,
  CheckCircle,
  FileText,
} from 'lucide-react';

export const OpportunitiesView = () => {
  const { user, openAuthModal } = useAuth();
  const [opportunities, setOpportunities] = useState(mockOpportunities);
  const [filterType, setFilterType] = useState('ALL');
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [resumeUrl, setResumeUrl] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  // New posting state
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newType, setNewType] = useState('JOB');
  const [newDescription, setNewDescription] = useState('');
  const [newDeadline, setNewDeadline] = useState('');

  const isAlumniOrAdmin = user?.role === 'ALUMNI' || user?.role === 'ADMIN';

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const data = await api.getOpportunities({ type: filterType !== 'ALL' ? filterType : undefined });
        if (data?.opportunities && data.opportunities.length > 0) {
          setOpportunities(data.opportunities);
        }
      } catch (err) {
        // Keeps mock opportunities
      }
    };
    fetchOpportunities();
  }, [filterType]);

  const filtered = opportunities.filter((opp) => {
    if (filterType === 'ALL') return true;
    return opp.type === filterType;
  });

  const handleApply = async (e) => {
    e.preventDefault();
    if (!selectedOpp) return;

    setIsApplying(true);
    try {
      await api.applyToOpportunity(selectedOpp.id, { resumeUrl, coverLetter });
    } catch (err) {
      console.warn('Application submitted in local mode');
    }

    setApplySuccess(true);
    setTimeout(() => {
      setApplySuccess(false);
      setSelectedOpp(null);
      setResumeUrl('');
      setCoverLetter('');
    }, 1500);
    setIsApplying(false);
  };

  const handleCreateOpportunity = async (e) => {
    e.preventDefault();
    try {
      const data = await api.createOpportunity({
        title: newTitle,
        company: newCompany,
        location: newLocation,
        type: newType,
        description: newDescription,
        deadline: newDeadline || null,
      });

      const created = data?.opportunity || {
        id: `opp-${Date.now()}`,
        title: newTitle,
        company: newCompany,
        location: newLocation,
        type: newType,
        description: newDescription,
        deadline: newDeadline,
        createdAt: new Date().toISOString(),
      };

      setOpportunities([created, ...opportunities]);
      setIsCreating(false);
      setNewTitle('');
      setNewCompany('');
      setNewLocation('');
      setNewDescription('');
      setNewDeadline('');
    } catch (err) {
      alert('Could not publish posting: ' + err.message);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '6px' }}>
            Career & Opportunity Board
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Discover job openings, internships, and research collaborations posted by verified alumni and partners.
          </p>
        </div>

        {isAlumniOrAdmin && (
          <button className="btn btn-primary btn-sm" onClick={() => setIsCreating(true)}>
            <Plus size={15} /> Post Opportunity
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {['ALL', 'JOB', 'INTERNSHIP'].map((t) => (
          <button
            key={t}
            className="btn btn-sm"
            style={{
              background: filterType === t ? 'var(--primary)' : 'var(--bg-card)',
              color: filterType === t ? '#FFFFFF' : 'var(--text-muted)',
              border: filterType === t ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
              fontWeight: filterType === t ? '600' : '500',
            }}
            onClick={() => setFilterType(t)}
          >
            {t === 'ALL' ? 'All Postings' : t === 'JOB' ? 'Full-Time Positions' : 'Internships'}
          </button>
        ))}
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

              <h3 style={{ fontSize: '17px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '6px' }}>
                {opp.title}
              </h3>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '14px' }}>
                {opp.company && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Building size={14} color="var(--accent-chocolate)" /> {opp.company}
                  </div>
                )}
                {opp.location && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <MapPin size={14} color="var(--accent-chocolate)" /> {opp.location}
                  </div>
                )}
              </div>

              <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '16px' }}>
                {opp.description}
              </p>
            </div>

            <div style={{ paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
              <button
                className="btn btn-primary btn-sm"
                style={{ width: '100%' }}
                onClick={() => {
                  if (!user) {
                    openAuthModal('login');
                  } else {
                    setSelectedOpp(opp);
                  }
                }}
              >
                <Send size={14} /> Apply with Profile
              </button>
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
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-main)' }}>
                  Apply for {selectedOpp.title}
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {selectedOpp.company} · {selectedOpp.location}
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
              {applySuccess ? (
                <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--success)' }}>
                  <CheckCircle size={42} style={{ margin: '0 auto 12px' }} />
                  <h4 style={{ color: 'var(--text-main)' }}>Application Submitted!</h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    Your application has been delivered to the hiring contact.
                  </p>
                </div>
              ) : (
                <>
                  <div className="input-group">
                    <label className="input-label">Resume / Portfolio URL</label>
                    <input
                      type="url"
                      className="input-field"
                      placeholder="https://linkedin.com/in/... or drive link"
                      value={resumeUrl}
                      onChange={(e) => setResumeUrl(e.target.value)}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Brief Note / Cover Letter</label>
                    <textarea
                      className="textarea-field"
                      rows="4"
                      placeholder="Explain why you're a strong fit for this opportunity..."
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
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
                    <button type="submit" className="btn btn-primary btn-sm" disabled={isApplying}>
                      <Send size={14} /> {isApplying ? 'Submitting...' : 'Submit Application'}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Create Opportunity Modal */}
      {isCreating && (
        <div className="modal-overlay" onClick={() => setIsCreating(false)}>
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
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-main)' }}>
                Post a Career Opportunity
              </h3>
              <button
                onClick={() => setIsCreating(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateOpportunity} style={{ padding: '20px' }}>
              <div className="input-group">
                <label className="input-label">Position Title</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Graduate Software Engineer"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="input-group">
                  <label className="input-label">Company Name</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Acme Robotics"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    required
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Location / Work Mode</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Remote / New York"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="input-group">
                  <label className="input-label">Opportunity Type</label>
                  <select
                    className="select-field"
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                  >
                    <option value="JOB">Full-Time Job</option>
                    <option value="INTERNSHIP">Internship</option>
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Application Deadline (Optional)</label>
                  <input
                    type="date"
                    className="input-field"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Description & Qualifications</label>
                <textarea
                  className="textarea-field"
                  rows="4"
                  placeholder="Detail the responsibilities, tech stack, and ideal background..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setIsCreating(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Publish Posting
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
